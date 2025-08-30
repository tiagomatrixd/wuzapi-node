# WuzAPI Client

A comprehensive TypeScript client library for the [WuzAPI WhatsApp API](https://github.com/asternic/wuzapi). This library provides a simple and intuitive interface to interact with WhatsApp through the WuzAPI service.

## Features

- 🔥 **Full TypeScript Support** - Complete type definitions for all API endpoints
- 🏗️ **Modular Architecture** - Organized by functionality (admin, session, chat, user, group, webhook)
- 🚀 **Promise-based** - Modern async/await support
- 🛡️ **Error Handling** - Comprehensive error handling with detailed error types
- 📦 **Tree Shakable** - Import only what you need
- 🔧 **Easy Configuration** - Simple setup with minimal configuration
- 📖 **Well Documented** - Extensive documentation and examples

## Installation

```bash
npm install wuzapi
```

or

```bash
yarn add wuzapi
```

## Quick Start

```typescript
import WuzapiClient from "wuzapi";

const client = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-user-token",
});

// Connect to WhatsApp
await client.session.connect({
  Subscribe: ["Message", "ReadReceipt"],
  Immediate: false,
});

// Send a text message
await client.chat.sendText({
  Phone: "5491155554444",
  Body: "Hello from WuzAPI!",
});

// Get session status
const status = await client.session.getStatus();
console.log("Connected:", status.Connected);
console.log("Logged In:", status.LoggedIn);
```

## Configuration

The client requires a configuration object with the following properties:

```typescript
interface WuzapiConfig {
  apiUrl: string; // The WuzAPI server URL
  token: string; // Your user authentication token
}
```

## API Modules

The client is organized into logical modules:

### Session Module

Manage WhatsApp connection and session state.

```typescript
// Connect to WhatsApp
await client.session.connect({
  Subscribe: ["Message", "ReadReceipt", "HistorySync"],
  Immediate: false,
});

// Get connection status
const status = await client.session.getStatus();

// Get QR code for initial setup
const qr = await client.session.getQRCode();

// Disconnect (keeps session)
await client.session.disconnect();

// Logout (destroys session)
await client.session.logout();

// Configure S3 storage
await client.session.configureS3({
  enabled: true,
  endpoint: "https://s3.amazonaws.com",
  region: "us-east-1",
  bucket: "my-bucket",
  accessKey: "AKIAIOSFODNN7EXAMPLE",
  secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  pathStyle: false,
  mediaDelivery: "both",
  retentionDays: 30,
});
```

### Chat Module

Send messages and manage chat interactions.

```typescript
// Send text message
await client.chat.sendText({
  Phone: "5491155554444",
  Body: "Hello World!",
  Id: "optional-message-id",
});

// Reply to a message
await client.chat.sendText({
  Phone: "5491155554444",
  Body: "This is a reply",
  ContextInfo: {
    StanzaId: "original-message-id",
    Participant: "5491155553935@s.whatsapp.net",
  },
});

// Send image
await client.chat.sendImage({
  Phone: "5491155554444",
  Image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  Caption: "Check this out!",
});

// Send template message with buttons
await client.chat.sendTemplate({
  Phone: "5491155554444",
  Content: "Choose an option:",
  Footer: "Powered by WuzAPI",
  Buttons: [
    { DisplayText: "Yes", Type: "quickreply" },
    { DisplayText: "No", Type: "quickreply" },
    { DisplayText: "Visit Site", Type: "url", Url: "https://example.com" },
    { DisplayText: "Call Us", Type: "call", PhoneNumber: "1155554444" },
  ],
});

// Send location
await client.chat.sendLocation({
  Phone: "5491155554444",
  Latitude: 48.85837,
  Longitude: 2.294481,
  Name: "Eiffel Tower, Paris",
});

// Send contact
await client.chat.sendContact({
  Phone: "5491155554444",
  Name: "John Doe",
  Vcard:
    "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nTEL:+1234567890\nEND:VCARD",
});

// Mark messages as read
await client.chat.markRead({
  Id: ["message-id-1", "message-id-2"],
  Chat: "5491155553934@s.whatsapp.net",
});

// React to message
await client.chat.react({
  Phone: "5491155554444",
  Body: "❤️",
  Id: "message-id-to-react-to",
});

// Download media
const media = await client.chat.downloadImage({
  Url: "https://mmg.whatsapp.net/d/f/...",
  MediaKey: "media-key...",
  Mimetype: "image/jpeg",
  FileSHA256: "file-hash...",
  FileLength: 2039,
});
```

### User Module

Get information about WhatsApp users.

```typescript
// Check if numbers are WhatsApp users
const check = await client.user.check(["5491155554444", "5491155554445"]);

// Get user information
const info = await client.user.getInfo(["5491155554444"]);

// Get user avatar
const avatar = await client.user.getAvatar("5491155554444", true); // true for preview

// Get all contacts
const contacts = await client.user.getContacts();
```

### Group Module

Manage WhatsApp groups.

```typescript
// List all groups
const groups = await client.group.list();

// Create a group
const newGroup = await client.group.create("My New Group", [
  "5491155553934",
  "5491155553935",
]);

// Get group info
const groupInfo = await client.group.getInfo("120362023605733675@g.us");

// Set group name
await client.group.setName("120362023605733675@g.us", "New Group Name");

// Set group photo (JPEG only)
await client.group.setPhoto(
  "120362023605733675@g.us",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
);

// Get invite link
const invite = await client.group.getInviteLink("120362023605733675@g.us");

// Set group locked (only admins can modify info)
await client.group.setLocked("120362023605733675@g.us", true);

// Set disappearing messages
await client.group.setEphemeral("120362023605733675@g.us", "24h"); // '24h', '7d', '90d', or 'off'

// Remove group photo
await client.group.removePhoto("120362023605733675@g.us");
```

### Admin Module

Manage users (requires admin token).

```typescript
// Create admin client
const adminClient = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-admin-token",
});

// List all users
const users = await adminClient.admin.listUsers();

// Add new user
const newUser = await adminClient.admin.addUser({
  name: "John Doe",
  token: "user-token-123",
  webhook: "https://example.com/webhook",
  events: "Message,ReadReceipt",
  proxyConfig: {
    enabled: true,
    proxyURL: "socks5://user:pass@proxy:port",
  },
  s3Config: {
    enabled: true,
    endpoint: "https://s3.amazonaws.com",
    region: "us-east-1",
    bucket: "user-media-bucket",
    accessKey: "AKIA...",
    secretKey: "secret...",
    pathStyle: false,
    mediaDelivery: "both",
    retentionDays: 30,
  },
});

// Delete user
await adminClient.admin.deleteUser(2);
```

### Webhook Module

Configure webhook settings and handle incoming WhatsApp events.

```typescript
// Set webhook URL
await client.webhook.setWebhook("https://my-server.com/webhook");

// Get current webhook configuration
const webhookConfig = await client.webhook.getWebhook();
console.log("Webhook URL:", webhookConfig.webhook);
console.log("Subscribed events:", webhookConfig.subscribe);
```

## Webhook Event Handling

WuzAPI sends real-time events to your webhook endpoint. Here's how to handle different types of events:

## Webhook Payload Structure

When S3 is enabled, webhook payloads will include S3 information based on the `media_delivery` setting configured in your WuzAPI instance.

### Standard Event Payload

```json
{
  "event": {
    "Info": {
      "ID": "3EB06F9067F80BAB89FF",
      "Type": "text",
      "PushName": "John Doe",
      "Timestamp": "2024-12-25T10:30:00Z",
      "Source": {
        "Chat": "5491155553934@s.whatsapp.net",
        "Sender": "5491155553934@s.whatsapp.net",
        "IsFromMe": false,
        "IsGroup": false
      }
    },
    "Message": {
      "conversation": "Hello, this is a test message!"
    },
    "IsEphemeral": false,
    "IsViewOnce": false,
    "IsDocumentWithCaption": false,
    "IsEdit": false
  }
}
```

### S3 Only (`media_delivery: "s3"`)

```json
{
  "event": {
    "Info": {
      "ID": "3EB06F9067F80BAB89FF",
      "Type": "image",
      "PushName": "John Doe",
      "Timestamp": "2024-12-25T10:30:00Z",
      "Source": {
        "Chat": "5491155553934@s.whatsapp.net",
        "Sender": "5491155553934@s.whatsapp.net",
        "IsFromMe": false,
        "IsGroup": false
      }
    },
    "Message": {
      "imageMessage": {
        "caption": "Check out this photo!",
        "mimetype": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "fileLength": 245632
      }
    },
    "IsEphemeral": false,
    "IsViewOnce": false
  },
  "s3": {
    "url": "https://my-bucket.s3.us-east-1.amazonaws.com/users/abc123/inbox/5491155553934/2024/12/25/images/3EB06F9067F80BAB89FF.jpg",
    "key": "users/abc123/inbox/5491155553934/2024/12/25/images/3EB06F9067F80BAB89FF.jpg",
    "bucket": "my-bucket",
    "size": 245632,
    "mimeType": "image/jpeg",
    "fileName": "3EB06F9067F80BAB89FF.jpg"
  }
}
```

### Both S3 and Base64 (`media_delivery: "both"`)

```json
{
  "event": {
    "Info": { "..." },
    "Message": {
      "imageMessage": {
        "caption": "Check out this photo!",
        "mimetype": "image/jpeg",
        "width": 1920,
        "height": 1080
      }
    }
  },
  "base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  "mimeType": "image/jpeg",
  "fileName": "3EB06F9067F80BAB89FF.jpg",
  "s3": {
    "url": "https://my-bucket.s3.us-east-1.amazonaws.com/users/abc123/inbox/5491155553934/2024/12/25/images/3EB06F9067F80BAB89FF.jpg",
    "key": "users/abc123/inbox/5491155553934/2024/12/25/images/3EB06F9067F80BAB89FF.jpg",
    "bucket": "my-bucket",
    "size": 245632,
    "mimeType": "image/jpeg",
    "fileName": "3EB06F9067F80BAB89FF.jpg"
  }
}
```

### Base64 Only (`media_delivery: "base64"`)

```json
{
  "event": { "..." },
  "base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  "mimeType": "image/jpeg",
  "fileName": "3EB06F9067F80BAB89FF.jpg"
}
```

### Basic Webhook Setup

```typescript
import express from "express";
import WuzapiClient, {
  EventType,
  hasS3Media,
  hasBase64Media,
  WebhookPayload,
} from "wuzapi";

const app = express();
app.use(express.json());

const client = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-token",
});

// Webhook endpoint with S3 media support
app.post("/webhook", async (req, res) => {
  try {
    const webhookPayload: WebhookPayload = req.body;

    // Handle S3 media information if present
    if (hasS3Media(webhookPayload)) {
      console.log("☁️ S3 Media:", {
        url: webhookPayload.s3.url,
        bucket: webhookPayload.s3.bucket,
        size: webhookPayload.s3.size,
        type: webhookPayload.s3.mimeType,
      });
    }

    if (hasBase64Media(webhookPayload)) {
      console.log("📦 Base64 media included");
      // Process base64 media: webhookPayload.base64
    }

    // Extract the actual event data
    const event = webhookPayload.event || webhookPayload;
    const eventType = detectEventType(event);

    // Handle different event types using EventType enum
    switch (eventType) {
      case EventType.MESSAGE:
        await handleMessage(event);
        break;
      case EventType.RECEIPT:
        await handleReceipt(event);
        break;
      case EventType.PRESENCE:
        await handlePresence(event);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to detect event type
function detectEventType(event: any): EventType | string {
  if (event.Message && event.Info) return EventType.MESSAGE;
  if (event.MessageIDs && event.Type) return EventType.RECEIPT;
  if (event.From && typeof event.Unavailable !== "undefined")
    return EventType.PRESENCE;
  if (event.State && event.MessageSource) return EventType.CHAT_PRESENCE;
  if (event.Codes) return EventType.QR;
  // Add more detection logic as needed
  return "Unknown";
}

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});
```

### Message Events

Handle incoming messages of all types using the comprehensive Message types:

```typescript
import { getMessageContent } from "wuzapi";

async function handleMessage(event) {
  const { Info, Message, IsEphemeral, IsViewOnce } = event;
  const from = Info.RemoteJid.replace("@s.whatsapp.net", "");
  const isGroup = Info.RemoteJid.includes("@g.us");

  console.log(`New message from ${from}${isGroup ? " (group)" : ""}`);

  if (IsEphemeral) console.log("⏱️ Ephemeral message");
  if (IsViewOnce) console.log("👁️ View once message");

  // Use the utility function to get structured message content
  const messageContent = getMessageContent(Message);

  if (!messageContent) {
    console.log("❓ Unknown message type");
    return;
  }

  // Handle different message types with full type safety
  switch (messageContent.type) {
    case "text":
      console.log(`💬 Text: ${messageContent.content}`);

      // Auto-reply to specific messages
      if (messageContent.content.toLowerCase().includes("hello")) {
        await client.chat.sendText({
          Phone: from,
          Body: "👋 Hello! Thanks for your message.",
        });
      }
      break;

    case "extendedText":
      console.log(`📝 Extended text: ${messageContent.content.text}`);
      if (messageContent.content.canonicalUrl) {
        console.log(`🔗 Link preview: ${messageContent.content.canonicalUrl}`);
        console.log(`📰 Title: ${messageContent.content.title}`);
      }
      break;

    case "image":
      const imageMsg = messageContent.content;
      console.log(`🖼️ Image: ${imageMsg.caption || "No caption"}`);
      console.log(`📏 Dimensions: ${imageMsg.width}x${imageMsg.height}`);

      // Download the image with proper types
      if (imageMsg.url && imageMsg.mediaKey) {
        try {
          const media = await client.chat.downloadImage({
            Url: imageMsg.url,
            MediaKey: Array.from(imageMsg.mediaKey),
            Mimetype: imageMsg.mimetype,
            FileSHA256: Array.from(imageMsg.fileSha256),
            FileLength: imageMsg.fileLength,
          });
          console.log("✅ Image downloaded successfully");
        } catch (error) {
          console.log("❌ Failed to download image:", error.message);
        }
      }
      break;

    case "video":
      const videoMsg = messageContent.content;
      console.log(`🎥 Video: ${videoMsg.caption || "No caption"}`);
      console.log(`⏱️ Duration: ${videoMsg.seconds}s`);
      if (videoMsg.gifPlayback) {
        console.log("🎬 GIF playback enabled");
      }
      break;

    case "audio":
      const audioMsg = messageContent.content;
      console.log(`🎵 Audio: ${audioMsg.seconds}s`);
      if (audioMsg.ptt) {
        console.log("🎤 Voice note (Push-to-talk)");
      }
      break;

    case "document":
      const docMsg = messageContent.content;
      console.log(`📄 Document: ${docMsg.fileName || docMsg.title}`);
      console.log(`📊 Size: ${docMsg.fileLength} bytes`);
      console.log(`📋 Type: ${docMsg.mimetype}`);
      break;

    case "location":
      const locMsg = messageContent.content;
      console.log(
        `📍 Location: ${locMsg.degreesLatitude}, ${locMsg.degreesLongitude}`
      );
      if (locMsg.name) console.log(`🏷️ Name: ${locMsg.name}`);
      if (locMsg.isLiveLocation) console.log("📡 Live location sharing");
      break;

    case "contact":
      console.log(`👤 Contact: ${messageContent.content.displayName}`);
      break;

    case "sticker":
      const stickerMsg = messageContent.content;
      console.log(`😀 Sticker`);
      if (stickerMsg.isAnimated) console.log("🎬 Animated");
      if (stickerMsg.isLottie) console.log("🎨 Lottie");
      break;

    case "buttons":
      const btnMsg = messageContent.content;
      console.log(`🔘 Interactive buttons: ${btnMsg.contentText}`);
      console.log(`🔢 ${btnMsg.buttons?.length || 0} buttons`);
      break;

    case "list":
      const listMsg = messageContent.content;
      console.log(`📋 List: ${listMsg.title}`);
      console.log(`📝 ${listMsg.sections?.length || 0} sections`);
      break;

    case "buttonsResponse":
      const btnResponse = messageContent.content;
      console.log(`✅ Button clicked: ${btnResponse.selectedDisplayText}`);
      console.log(`🆔 Button ID: ${btnResponse.selectedButtonId}`);

      // Handle button responses
      switch (btnResponse.selectedButtonId) {
        case "help":
          await client.chat.sendText({
            Phone: from,
            Body: "🆘 How can I help you?",
          });
          break;
        case "info":
          await client.chat.sendText({
            Phone: from,
            Body: "ℹ️ Here's some information...",
          });
          break;
      }
      break;

    case "listResponse":
      const listResponse = messageContent.content;
      console.log(`✅ List selection: ${listResponse.title}`);
      if (listResponse.singleSelectReply) {
        console.log(
          `🆔 Selected: ${listResponse.singleSelectReply.selectedRowId}`
        );
      }
      break;

    case "poll":
      const pollMsg = messageContent.content;
      console.log(`📊 Poll: ${pollMsg.name}`);
      console.log(`🔢 Options: ${pollMsg.options?.length || 0}`);
      break;

    case "reaction":
      const reactionMsg = messageContent.content;
      console.log(`😊 Reaction: ${reactionMsg.text}`);
      console.log(`📝 To message: ${reactionMsg.key?.id}`);
      break;

    case "groupInvite":
      const inviteMsg = messageContent.content;
      console.log(`👥 Group invite: ${inviteMsg.groupName}`);
      console.log(`🔗 Code: ${inviteMsg.inviteCode}`);
      break;

    default:
      console.log(`❓ Unhandled message type: ${messageContent.type}`);
  }
}
```

### Read Receipts and Delivery Confirmations

Handle message delivery and read confirmations:

```typescript
async function handleReceipt(event) {
  const { MessageSource, MessageIDs, Type, Timestamp } = event;
  const from = MessageSource.Chat.User;

  console.log(
    `Receipt from ${from}: ${Type} for ${MessageIDs.length} message(s)`
  );

  switch (Type) {
    case "delivery":
      console.log(`✅ Messages delivered to ${from}`);
      // Update your database to mark messages as delivered
      break;

    case "read":
      console.log(`👀 Messages read by ${from}`);
      // Update your database to mark messages as read
      break;

    case "played":
      console.log(`▶️ Voice/video messages played by ${from}`);
      // Update your database to mark media as played
      break;
  }
}
```

### Presence and Typing Indicators

Handle user online/offline status and typing indicators:

```typescript
// User online/offline status
async function handlePresence(event) {
  const { From, Unavailable, LastSeen } = event;
  const user = From.User;

  if (Unavailable) {
    console.log(`🔴 ${user} went offline (last seen: ${LastSeen})`);
  } else {
    console.log(`🟢 ${user} is online`);
  }
}

// Typing indicators
async function handleChatPresence(event) {
  const { MessageSource, State, Media } = event;
  const from = MessageSource.Sender.User;
  const isGroup = MessageSource.IsGroup;

  if (State === "composing") {
    if (Media === "text") {
      console.log(`⌨️ ${from} is typing${isGroup ? " in group" : ""}...`);
    } else {
      console.log(
        `📎 ${from} is sending ${Media}${isGroup ? " in group" : ""}...`
      );
    }
  } else if (State === "paused") {
    console.log(`⏸️ ${from} stopped typing`);
  }
}
```

### Group Events

Handle group-related events:

```typescript
// Group info updates
async function handleGroupInfo(event) {
  const { JID, GroupName, Participants, Sender } = event;
  console.log(`👥 Group info updated for ${GroupName} (${JID.User})`);
  console.log(`👤 Updated by: ${Sender.User}`);
  console.log(`👥 Participants: ${Participants.length}`);
}

// When you're added to a group
async function handleJoinedGroup(event) {
  const { Reason, Type, Participants } = event;
  console.log(`🎉 Joined group! Reason: ${Reason}, Type: ${Type}`);
  console.log(`👥 Group has ${Participants.length} participants`);

  // Send welcome message
  // Note: You'll need the group JID from the event context
}
```

### Connection Events

Handle connection status changes:

```typescript
async function handleConnected(event) {
  console.log("🟢 Connected to WhatsApp!");
  // Your bot is now ready to send messages
}

async function handleDisconnected(event) {
  console.log("🔴 Disconnected from WhatsApp");
  // Attempt to reconnect or notify administrators
}

async function handleLoggedOut(event) {
  const { Reason, OnConnect } = event;
  console.log(`🚪 Logged out from WhatsApp. Reason: ${Reason}`);

  if (OnConnect) {
    console.log("⚠️ Logout occurred during connection");
  }

  // You may need to scan QR code again
}
```

### QR Code Events

Handle QR code generation for initial setup:

```typescript
async function handleQR(event) {
  const { Codes } = event;
  console.log("📱 New QR codes received:");

  Codes.forEach((code, index) => {
    console.log(`📷 QR Code ${index + 1}: ${code}`);
    // Display QR code to user or save to file
  });
}
```

### Profile and Contact Updates

Handle profile picture and contact information changes:

```typescript
// Profile picture changes
async function handlePicture(event) {
  const { JID, Author, Remove, Timestamp } = event;
  const target = JID.User;
  const changer = Author.User;

  if (Remove) {
    console.log(`🗑️ ${changer} removed profile picture for ${target}`);
  } else {
    console.log(`🖼️ ${changer} updated profile picture for ${target}`);
  }
}

// Contact info updates
async function handleContact(event) {
  const { JID, Found, FullName, PushName, BusinessName } = event;
  console.log(`👤 Contact info: ${FullName || PushName} (${JID.User})`);

  if (BusinessName) {
    console.log(`🏢 Business: ${BusinessName}`);
  }

  console.log(`✅ Found in WhatsApp: ${Found}`);
}

// Name changes
async function handlePushName(event) {
  const { JID, OldPushName, NewPushName } = event;
  console.log(
    `📝 ${JID.User} changed name from "${OldPushName}" to "${NewPushName}"`
  );
}
```

### Error Handling

Handle various error events:

```typescript
// Undecryptable messages
async function handleUndecryptableMessage(event) {
  const { Info, IsUnavailable, UnavailableType, DecryptFailMode } = event;
  console.log(`❌ Failed to decrypt message from ${Info.Source.Sender.User}`);
  console.log(
    `📊 Unavailable: ${IsUnavailable}, Type: ${UnavailableType}, Mode: ${DecryptFailMode}`
  );

  // Log for debugging or request message retry
}

// Stream errors
async function handleStreamError(event) {
  const { Code } = event;
  console.log(`🚨 Stream error: ${Code}`);

  // Handle specific error codes
  switch (Code) {
    case "conflict":
      console.log("Another client connected with same credentials");
      break;
    case "stream:error":
      console.log("General stream error occurred");
      break;
    default:
      console.log("Unknown stream error");
  }
}
```

### Complete Webhook Server Example

Here's a complete webhook server that handles all event types:

```typescript
import express from "express";
import WuzapiClient, {
  Message,
  Receipt,
  Presence,
  EventGroupInfo,
} from "wuzapi";

const app = express();
app.use(express.json());

const client = new WuzapiClient({
  apiUrl: process.env.WUZAPI_URL || "http://localhost:8080",
  token: process.env.WUZAPI_TOKEN || "your-token",
});

// Event router
const eventHandlers = {
  Message: handleMessage,
  Receipt: handleReceipt,
  Presence: handlePresence,
  ChatPresence: handleChatPresence,
  GroupInfo: handleGroupInfo,
  JoinedGroup: handleJoinedGroup,
  Connected: handleConnected,
  Disconnected: handleDisconnected,
  LoggedOut: handleLoggedOut,
  QR: handleQR,
  Picture: handlePicture,
  Contact: handleContact,
  PushName: handlePushName,
  UndecryptableMessage: handleUndecryptableMessage,
  StreamError: handleStreamError,
};

app.post("/webhook", async (req, res) => {
  try {
    const eventData = req.body;

    // Log all events for debugging
    console.log("📨 Webhook received:", JSON.stringify(eventData, null, 2));

    // Route to appropriate handler based on event structure
    for (const [eventType, handler] of Object.entries(eventHandlers)) {
      if (isEventType(eventData, eventType)) {
        await handler(eventData);
        break;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to identify event types
function isEventType(event, type) {
  switch (type) {
    case "Message":
      return event.Message && event.Info;
    case "Receipt":
      return event.MessageIDs && event.Type;
    case "Presence":
      return event.From && typeof event.Unavailable !== "undefined";
    case "ChatPresence":
      return event.State && event.MessageSource;
    case "GroupInfo":
      return event.GroupName && event.Participants;
    case "QR":
      return event.Codes;
    // Add more type checks as needed
    default:
      return false;
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Initialize
async function initialize() {
  try {
    // Connect to WhatsApp with all events using EventType enum
    await client.session.connect({
      Subscribe: [
        EventType.MESSAGE,
        EventType.RECEIPT,
        EventType.PRESENCE,
        EventType.CHAT_PRESENCE,
        EventType.GROUP_INFO,
        EventType.CONTACT,
        EventType.PUSH_NAME,
        EventType.PICTURE,
        EventType.QR,
        EventType.CONNECTED,
        EventType.DISCONNECTED,
        EventType.LOGGED_OUT,
        EventType.UNDECRYPTABLE_MESSAGE,
        EventType.STREAM_ERROR,
      ],
      Immediate: false,
    });

    // Set webhook
    const webhookUrl =
      process.env.WEBHOOK_URL || "http://localhost:3000/webhook";
    await client.webhook.setWebhook(webhookUrl);

    app.listen(3000, () => {
      console.log("🚀 Webhook server running on port 3000");
      console.log("🎉 Ready to receive WhatsApp events!");
    });
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

initialize();
```

### Event Types Reference

All webhook events are fully typed. Import the specific event types you need:

```typescript
import {
  // Event type enum for all possible events
  EventType,

  // Core message types
  Message,
  MessageEvent,
  MessageContent,
  getMessageContent,

  // Specific message types
  ImageMessage,
  VideoMessage,
  AudioMessage,
  DocumentMessage,
  LocationMessage,
  ContactMessage,
  StickerMessage,
  ButtonsMessage,
  ListMessage,
  PollCreationMessage,
  ReactionMessage,

  // Webhook payload types
  WebhookPayload,
  S3MediaInfo,
  S3OnlyWebhookPayload,
  Base64OnlyWebhookPayload,
  BothMediaWebhookPayload,
  hasS3Media,
  hasBase64Media,
  hasBothMedia,

  // Event types
  Receipt,
  Presence,
  ChatPresence,
  EventGroupInfo,
  EventContact,
  QR,
  Picture,
  PushName,
  Connected,
  Disconnected,
  LoggedOut,
  UndecryptableMessage,
  StreamError,
  WhatsAppEvent,
} from "wuzapi";

// Type-safe event handling with EventType enum
async function handleTypedWebhook(webhookPayload: WebhookPayload) {
  const event = webhookPayload.event;

  // Type-safe event detection using EventType enum
  const eventType = detectEventType(event);

  switch (eventType) {
    case EventType.MESSAGE:
      const messageEvent = event as MessageEvent;
      const messageContent = getMessageContent(messageEvent.Message);

      if (messageContent?.type === "image") {
        // TypeScript knows this is an ImageMessage
        const imageMsg: ImageMessage = messageContent.content;
        console.log(`Image dimensions: ${imageMsg.width}x${imageMsg.height}`);

        // Handle S3 media if available
        if (hasS3Media(webhookPayload)) {
          console.log(`S3 URL: ${webhookPayload.s3.url}`);
          // Download from S3 or process as needed
        }

        // Handle Base64 media if available
        if (hasBase64Media(webhookPayload)) {
          console.log("Processing base64 image data");
          // Process base64 data: webhookPayload.base64
        }
      }
      break;

    case EventType.RECEIPT:
      const receiptEvent = event as Receipt;
      console.log(`Receipt type: ${receiptEvent.Type}`);
      break;

    case EventType.PRESENCE:
      const presenceEvent = event as Presence;
      console.log(`User ${presenceEvent.From.User} presence update`);
      break;

    default:
      console.log(`Unhandled event: ${eventType}`);
  }
}

// Complete webhook server with S3 support
app.post("/webhook", async (req, res) => {
  try {
    const payload: WebhookPayload = req.body;
    await handleTypedWebhook(payload);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to handle all message types generically
function processMessageContent(content: MessageContent) {
  switch (content.type) {
    case "text":
      // content.content is string
      return content.content.toUpperCase();

    case "image":
      // content.content is ImageMessage
      return `Image: ${content.content.caption || "No caption"}`;

    case "video":
      // content.content is VideoMessage
      return `Video (${content.content.seconds}s): ${
        content.content.caption || "No caption"
      }`;

    // TypeScript ensures you handle all possible types
    default:
      return `Unknown message type: ${content.type}`;
  }
}
```

### Advanced Message Type Handling

For complex message processing, you can work directly with the typed message structures:

```typescript
import {
  Message,
  ExtendedTextMessage,
  ButtonsMessage,
  ContextInfo,
} from "wuzapi";

// Check for extended text with link preview
function hasLinkPreview(message: Message): boolean {
  return !!message.extendedTextMessage?.canonicalUrl;
}

// Extract context info from any message
function getMessageContext(message: Message): ContextInfo | undefined {
  // Check various message types for context info
  return (
    message.extendedTextMessage?.contextInfo ||
    message.imageMessage?.contextInfo ||
    message.videoMessage?.contextInfo ||
    message.audioMessage?.contextInfo
  );
}

// Process interactive messages
function handleInteractiveMessage(message: Message) {
  if (message.buttonsMessage) {
    const btns = message.buttonsMessage;
    console.log(`Interactive message: ${btns.contentText}`);

    btns.buttons?.forEach((button) => {
      if (button.type === ButtonType.RESPONSE) {
        console.log(`Response button: ${button.buttonText?.displayText}`);
      } else if (button.type === ButtonType.NATIVE_FLOW) {
        console.log(`Native flow: ${button.nativeFlowInfo?.name}`);
      }
    });
  }

  if (message.listMessage) {
    const list = message.listMessage;
    console.log(`List: ${list.title}`);

    list.sections?.forEach((section) => {
      console.log(`Section: ${section.title}`);
      section.rows?.forEach((row) => {
        console.log(`- ${row.title}: ${row.description}`);
      });
    });
  }
}
```

## Error Handling

The library provides comprehensive error handling with detailed error information:

```typescript
import { WuzapiError } from "wuzapi";

try {
  await client.chat.sendText({
    Phone: "invalid-number",
    Body: "This will fail",
  });
} catch (error) {
  if (error instanceof WuzapiError) {
    console.error("WuzAPI Error:", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Error Types

- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Invalid tokens, permission denied
- **API Errors**: Invalid parameters, service unavailable
- **Validation Errors**: Missing required fields, invalid data formats

## TypeScript Support

The library is built with TypeScript and provides complete type definitions:

```typescript
import {
  WuzapiClient,
  SendTextRequest,
  SendMessageResponse,
  GroupInfo,
  User,
} from "wuzapi";

// All API requests and responses are fully typed
const request: SendTextRequest = {
  Phone: "5491155554444",
  Body: "Typed message",
};

const response: SendMessageResponse = await client.chat.sendText(request);
```

## Legacy Aliases

For convenience, the library provides some legacy aliases:

```typescript
// These are equivalent:
await client.user.check(["5491155554444"]);
await client.users.check(["5491155554444"]); // Alias

await client.chat.sendText({ Phone: "123", Body: "Hi" });
await client.message.sendText({ Phone: "123", Body: "Hi" }); // Alias
```

## Advanced Usage

### Custom Axios Configuration

You can extend the base client for custom axios configuration:

```typescript
import { BaseClient } from "wuzapi";

class CustomClient extends BaseClient {
  constructor(config: WuzapiConfig) {
    super(config);

    // Add custom interceptors
    this.axios.interceptors.request.use((config) => {
      console.log("Making request:", config.url);
      return config;
    });
  }
}
```

### Ping Test

Test connectivity to the API:

```typescript
const isConnected = await client.ping();
if (isConnected) {
  console.log("API is reachable");
} else {
  console.log("API is not reachable");
}
```

## Examples

For complete working examples, check the `examples/` directory:

- **`basic-usage.js`** - Basic client setup and usage
- **`chatbot-example.js`** - Simple chatbot with command handling
- **`webhook-events-example.js`** - Comprehensive webhook event handling

### Complete Chat Bot Example

```typescript
import WuzapiClient from "wuzapi";

const client = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-token",
});

async function startBot() {
  // Connect to WhatsApp
  await client.session.connect({
    Subscribe: ["Message"],
    Immediate: false,
  });

  // Wait for connection
  let connected = false;
  while (!connected) {
    const status = await client.session.getStatus();
    if (!status.LoggedIn) {
      const qr = await client.session.getQRCode();
      console.log("Scan this QR code:", qr.QRCode);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      connected = true;
      console.log("Bot connected and ready!");
    }
  }

  // Set webhook for receiving messages
  await client.webhook.setWebhook("https://your-server.com/webhook");
}

// Handle incoming messages in your webhook endpoint
function handleIncomingMessage(message: any) {
  const phone = message.Info.RemoteJid.replace("@s.whatsapp.net", "");
  const text = message.Message?.conversation || "";

  if (text.toLowerCase() === "hello") {
    client.chat.sendText({
      Phone: phone,
      Body: "Hello! How can I help you today?",
    });
  }
}

startBot().catch(console.error);
```

### Group Management Example

```typescript
async function manageGroup() {
  // Create a new group
  const group = await client.group.create("Project Team", [
    "5491155553934",
    "5491155553935",
  ]);

  console.log("Created group:", group.JID);

  // Set group photo
  await client.group.setPhoto(group.JID, "data:image/jpeg;base64,...");

  // Configure group settings
  await client.group.setLocked(group.JID, true); // Only admins can modify
  await client.group.setEphemeral(group.JID, "7d"); // Messages disappear after 7 days

  // Get and share invite link
  const invite = await client.group.getInviteLink(group.JID);
  console.log("Invite link:", invite.InviteLink);
}
```

## API Reference

For detailed API documentation, refer to the [WuzAPI documentation](https://github.com/asternic/wuzapi/blob/main/API.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/gusnips/wuzapi-node.git
cd wuzapi

# Install dependencies
npm install

# Run linter
npm run lint

# Build the project
npm run build

# Run development server
npm run dev
```

### Code Style

This project uses ESLint and TypeScript. Please ensure your code passes all checks:

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://github.com/asternic/wuzapi)
- 🐛 [Issue Tracker](https://github.com/gusnips/wuzapi-node/issues)
- 💬 [Discussions](https://github.com/gusnips/wuzapi-node/discussions)

## Changelog

### 1.0.0

- Initial release
- Full TypeScript support
- Complete API coverage
- Modular architecture
- Comprehensive error handling
- S3 storage integration support
- Admin user management
- Group management features
- Webhook configuration

---

Made with ❤️ for the WhatsApp automation community.
