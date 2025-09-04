/**
 * Comprehensive Webhook Types Example
 * 
 * This example demonstrates how to use the comprehensive webhook types and utilities
 * to handle different message types in WhatsApp webhooks with full TypeScript support.
 * 
 * Features demonstrated:
 * - Complete webhook payload type safety
 * - Message type discovery using discoverMessageType()
 * - Handling all supported message types
 * - Type-safe access to message properties
 * - S3 and Base64 media handling
 */

import express from "express";
import WuzapiClient, { 
  discoverMessageType, 
  MessageType,
  WebhookEventType,
  hasS3Media,
  hasBase64Media,
  hasBothMedia,
  isWebhookEventType
} from "wuzapi";

const app = express();
app.use(express.json({ limit: '50mb' })); // Large limit for media payloads

const client = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-token-here",
});

/**
 * Comprehensive webhook handler with full type safety
 */
app.post("/webhook", async (req, res) => {
  try {
    const webhookPayload = req.body;

    // Validate payload structure
    if (!webhookPayload.token || !webhookPayload.type || !webhookPayload.event) {
      return res.status(400).json({ error: "Invalid webhook payload structure" });
    }

    // Type-safe event type validation
    if (!isWebhookEventType(webhookPayload.type)) {
      console.warn(`Unknown webhook event type: ${webhookPayload.type}`);
      return res.status(200).json({ success: true, message: "Unknown event type" });
    }

    // Security: Verify token
    if (webhookPayload.token !== "your-expected-token") {
      return res.status(401).json({ error: "Invalid webhook token" });
    }

    console.log(`\n📨 Received webhook event: ${webhookPayload.type}`);

    // Handle media if present
    if (hasS3Media(webhookPayload)) {
      console.log("📎 S3 Media detected:", {
        url: webhookPayload.s3.url,
        fileName: webhookPayload.s3.fileName,
        mimeType: webhookPayload.s3.mimeType,
        size: webhookPayload.s3.size
      });
    }

    if (hasBase64Media(webhookPayload)) {
      console.log("📎 Base64 Media detected:", {
        mimeType: webhookPayload.mimeType,
        fileName: webhookPayload.fileName,
        size: webhookPayload.base64?.length || 0
      });
    }

    if (hasBothMedia(webhookPayload)) {
      console.log("📎 Both S3 and Base64 media present - using S3 for efficiency");
    }

    const { event } = webhookPayload;

    // Handle different webhook event types
    switch (webhookPayload.type) {
      case WebhookEventType.MESSAGE:
        await handleMessageEvent(event, webhookPayload);
        break;

      case WebhookEventType.READ_RECEIPT:
        await handleReadReceiptEvent(event);
        break;

      case WebhookEventType.QR:
        await handleQREvent(event, webhookPayload);
        break;

      case WebhookEventType.CONNECTED:
        await handleConnectedEvent(event);
        break;

      case WebhookEventType.HISTORY_SYNC:
        await handleHistorySyncEvent(event);
        break;

      default:
        console.log(`📋 Unhandled event type: ${webhookPayload.type}`);
        console.log("Event data:", JSON.stringify(event, null, 2));
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Message webhook events with comprehensive message type support
 */
async function handleMessageEvent(event, webhookPayload) {
  if (!event.Message || !event.Info) {
    console.warn("⚠️ Incomplete message event");
    return;
  }

  const messageInfo = event.Info;
  const from = messageInfo.Sender.replace("@s.whatsapp.net", "");
  const isFromMe = messageInfo.IsFromMe;
  const isGroup = messageInfo.IsGroup;
  const chat = messageInfo.Chat;

  console.log(`💬 Message from: ${from} (${isFromMe ? "me" : "contact"})`);
  console.log(`📍 Chat: ${isGroup ? "Group" : "Private"} - ${chat}`);
  console.log(`⏰ Timestamp: ${messageInfo.Timestamp}`);

  // Discover message type using our utility
  const messageType = discoverMessageType(event.Message);
  console.log(`🔍 Message type discovered: ${messageType}`);

  // Handle different message types with full type safety
  switch (messageType) {
    case MessageType.EXTENDED_TEXT:
      await handleTextMessage(event.Message.extendedTextMessage, from);
      break;

    case MessageType.IMAGE:
      await handleImageMessage(event.Message.imageMessage, from, webhookPayload);
      break;

    case MessageType.VIDEO:
      await handleVideoMessage(event.Message.videoMessage, from, webhookPayload);
      break;

    case MessageType.AUDIO:
      await handleAudioMessage(event.Message.audioMessage, from, webhookPayload);
      break;

    case MessageType.DOCUMENT:
      await handleDocumentMessage(event.Message.documentMessage, from, webhookPayload);
      break;

    case MessageType.CONTACT:
      await handleContactMessage(event.Message.contactMessage, from);
      break;

    case MessageType.LOCATION:
      await handleLocationMessage(event.Message.locationMessage, from);
      break;

    case MessageType.POLL_CREATION:
      await handlePollMessage(event.Message.pollCreationMessageV3, from);
      break;

    case MessageType.EDITED:
      await handleEditedMessage(event.Message.editedMessage, from);
      break;

    case MessageType.PROTOCOL:
      await handleProtocolMessage(event.Message.protocolMessage, from);
      break;

    case MessageType.DEVICE_SENT:
      console.log("📱 Device sent message - analyzing nested message...");
      const nestedMessageType = discoverMessageType(event.Message.deviceSentMessage.message);
      console.log(`🔍 Nested message type: ${nestedMessageType}`);
      // Could recursively handle the nested message here
      break;

    case MessageType.UNKNOWN:
    default:
      console.log("❓ Unknown message type");
      console.log("Raw message:", JSON.stringify(event.Message, null, 2));
  }
}

/**
 * Handle text messages
 */
async function handleTextMessage(textMessage, from) {
  console.log(`📝 Text Message: "${textMessage.text}"`);
  
  // Check for context info (replies, disappearing messages, etc.)
  if (textMessage.contextInfo) {
    console.log("🔗 Context info present:", {
      expiration: textMessage.contextInfo.expiration,
      isForwarded: textMessage.contextInfo.isForwarded
    });
  }

  // Auto-reply example
  const text = textMessage.text.toLowerCase();
  if (text.includes("hello") || text.includes("hi")) {
    await client.chat.sendText({
      Phone: from,
      Body: "Hello! 👋 How can I help you today?",
    });
  } else if (text.includes("help")) {
    await client.chat.sendText({
      Phone: from,
      Body: "I can help you with:\n• Text messages\n• Images & media\n• Location sharing\n• Contacts\n• Polls",
    });
  }
}

/**
 * Handle image messages with media support
 */
async function handleImageMessage(imageMessage, from, webhookPayload) {
  console.log(`🖼️ Image Message:`, {
    mimetype: imageMessage.mimetype,
    size: imageMessage.fileLength,
    dimensions: `${imageMessage.width}x${imageMessage.height}`,
    hasThumb: !!imageMessage.JPEGThumbnail
  });

  // Handle S3 or base64 media
  let mediaUrl = null;
  if (hasS3Media(webhookPayload)) {
    mediaUrl = webhookPayload.s3.url;
    console.log("📎 Image available at S3:", mediaUrl);
  } else if (hasBase64Media(webhookPayload)) {
    console.log("📎 Image available as base64 (length:", webhookPayload.base64?.length, ")");
  }

  // Send a response
  await client.chat.sendText({
    Phone: from,
    Body: "📸 Nice photo! I received your image successfully.",
  });
}

/**
 * Handle video messages
 */
async function handleVideoMessage(videoMessage, from, webhookPayload) {
  console.log(`🎥 Video Message:`, {
    mimetype: videoMessage.mimetype,
    size: videoMessage.fileLength,
    duration: `${videoMessage.seconds}s`,
    dimensions: `${videoMessage.width}x${videoMessage.height}`,
    caption: videoMessage.caption || "No caption"
  });

  await client.chat.sendText({
    Phone: from,
    Body: `🎬 Thanks for the video! Duration: ${videoMessage.seconds} seconds`,
  });
}

/**
 * Handle audio messages (including voice messages)
 */
async function handleAudioMessage(audioMessage, from, webhookPayload) {
  const isVoiceMessage = audioMessage.ptt || audioMessage.PTT;
  console.log(`🎵 ${isVoiceMessage ? "Voice" : "Audio"} Message:`, {
    mimetype: audioMessage.mimetype,
    size: audioMessage.fileLength,
    duration: `${audioMessage.seconds}s`,
    hasWaveform: !!audioMessage.waveform
  });

  await client.chat.sendText({
    Phone: from,
    Body: isVoiceMessage ? "🎤 Voice message received!" : "🎵 Audio message received!",
  });
}

/**
 * Handle document messages
 */
async function handleDocumentMessage(documentMessage, from, webhookPayload) {
  console.log(`📄 Document Message:`, {
    fileName: documentMessage.fileName,
    title: documentMessage.title,
    mimetype: documentMessage.mimetype,
    size: documentMessage.fileLength,
    pages: documentMessage.pageCount || "Unknown"
  });

  await client.chat.sendText({
    Phone: from,
    Body: `📋 Document received: "${documentMessage.fileName}"${documentMessage.pageCount ? ` (${documentMessage.pageCount} pages)` : ""}`,
  });
}

/**
 * Handle contact messages
 */
async function handleContactMessage(contactMessage, from) {
  console.log(`👤 Contact Message:`, {
    displayName: contactMessage.displayName,
    vcard: contactMessage.vcard.substring(0, 100) + "..."
  });

  await client.chat.sendText({
    Phone: from,
    Body: `📇 Contact received: ${contactMessage.displayName}`,
  });
}

/**
 * Handle location messages
 */
async function handleLocationMessage(locationMessage, from) {
  console.log(`📍 Location Message:`, {
    latitude: locationMessage.degreesLatitude,
    longitude: locationMessage.degreesLongitude,
    hasThumb: !!locationMessage.JPEGThumbnail
  });

  // Create Google Maps link
  const mapsLink = `https://maps.google.com/?q=${locationMessage.degreesLatitude},${locationMessage.degreesLongitude}`;
  
  await client.chat.sendText({
    Phone: from,
    Body: `📍 Location received!\n🌍 View on Maps: ${mapsLink}`,
  });
}

/**
 * Handle poll creation messages
 */
async function handlePollMessage(pollMessage, from) {
  console.log(`🗳️ Poll Message:`, {
    question: pollMessage.name,
    optionsCount: pollMessage.options.length,
    multiSelect: pollMessage.selectableOptionsCount > 0
  });

  const options = pollMessage.options.map(opt => `• ${opt.optionName}`).join("\n");
  
  await client.chat.sendText({
    Phone: from,
    Body: `🗳️ Poll created: "${pollMessage.name}"\nOptions:\n${options}`,
  });
}

/**
 * Handle edited messages
 */
async function handleEditedMessage(editedMessage, from) {
  console.log(`✏️ Message Edited:`, {
    editedMessageID: editedMessage.editedMessageID,
    timestamp: editedMessage.timestampMS
  });

  await client.chat.sendText({
    Phone: from,
    Body: "✏️ I noticed you edited a message!",
  });
}

/**
 * Handle protocol messages (system messages)
 */
async function handleProtocolMessage(protocolMessage, from) {
  console.log(`🔧 Protocol Message:`, {
    type: protocolMessage.type,
    hasHistorySync: !!protocolMessage.historySyncNotification
  });

  if (protocolMessage.historySyncNotification) {
    console.log("📚 History sync notification received");
  }
}

/**
 * Handle ReadReceipt events
 */
async function handleReadReceiptEvent(event) {
  console.log(`📖 Read Receipt:`, {
    sender: event.Sender,
    chat: event.Chat,
    type: event.Type,
    messageCount: event.MessageIDs?.length || 0,
    timestamp: event.Timestamp
  });
}

/**
 * Handle QR code events
 */
async function handleQREvent(event, webhookPayload) {
  console.log("📱 QR Code event received");
  
  if (webhookPayload.qrCodeBase64) {
    console.log("📱 QR Code available as base64 data URL");
    // You could save this to a file or display it
    // const qrCode = webhookPayload.qrCodeBase64;
    // fs.writeFileSync('qr.png', qrCode.replace('data:image/png;base64,', ''), 'base64');
  }
}

/**
 * Handle Connected events
 */
async function handleConnectedEvent(event) {
  console.log("✅ WhatsApp connected successfully!");
  
  // Send a welcome message to yourself or admin
  // await client.chat.sendText({
  //   Phone: "your-admin-number",
  //   Body: "🤖 Bot is now connected and ready to receive messages!",
  // });
}

/**
 * Handle HistorySync events
 */
async function handleHistorySyncEvent(event) {
  console.log(`📚 History Sync event:`, {
    syncType: event.Data?.syncType,
    chunkOrder: event.Data?.chunkOrder,
    progress: event.Data?.progress,
    hasConversations: !!event.Data?.conversations,
    hasStatusMessages: !!event.Data?.statusV3Messages,
    hasParticipants: !!event.Data?.pastParticipants,
    hasStickers: !!event.Data?.recentStickers
  });
}

/**
 * Start the webhook server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log("\n🔧 Setup your WuzAPI webhook:");
  console.log(`   webhook.setWebhook("http://localhost:${PORT}/webhook", ["Message", "ReadReceipt", "Connected", "QR"])`);
});

/**
 * Setup WuzAPI connection and webhook (uncomment to auto-setup)
 */
async function setupWuzapi() {
  try {
    // Connect to WhatsApp
    await client.session.connect({
      Subscribe: ["Message", "ReadReceipt", "Connected", "QR", "HistorySync"],
      Immediate: false,
    });

    // Set webhook
    await client.webhook.setWebhook(`http://localhost:${PORT}/webhook`, [
      "Message",
      "ReadReceipt", 
      "Connected",
      "QR",
      "HistorySync"
    ]);

    console.log("✅ WuzAPI setup complete!");
  } catch (error) {
    console.error("❌ Setup error:", error);
  }
}

// Uncomment to auto-setup WuzAPI
// setupWuzapi();

export default app;
