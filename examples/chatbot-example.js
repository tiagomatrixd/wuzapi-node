// Advanced chatbot example using WuzAPI
// This example shows how to create a simple chatbot with webhooks
// Demonstrates both traditional (global token) and flexible (per-request token) usage

import WuzapiClient from "wuzapi";
import express from "express";

const app = express();
app.use(express.json());

// Configuration
const CONFIG = {
  apiUrl: "http://localhost:8080",
  userToken: "your-user-token-here",
  adminToken: "your-admin-token-here", // Optional: for admin operations
  useFlexibleTokens: false, // Set to true to use flexible token approach
};

// Initialize the client based on chosen approach
const client = CONFIG.useFlexibleTokens
  ? new WuzapiClient({
      apiUrl: CONFIG.apiUrl,
      // No token here - will be provided per request
    })
  : new WuzapiClient({
      apiUrl: CONFIG.apiUrl,
      token: CONFIG.userToken, // Traditional global token
    });

// Helper function to get request options for flexible token usage
const getRequestOptions = () => {
  return CONFIG.useFlexibleTokens ? { token: CONFIG.userToken } : undefined;
};

// Simple command handlers
const commands = {
  "/help": () => `🤖 Available commands:
/help - Show this help
/status - Check bot status
/groups - List my groups
/contacts - Count contacts
/ping - Test connectivity`,

  "/status": async () => {
    const status = await client.session.getStatus(getRequestOptions());
    return `📱 Bot Status:
Connected: ${status.Connected ? "✅" : "❌"}
Logged In: ${status.LoggedIn ? "✅" : "❌"}
Token Mode: ${CONFIG.useFlexibleTokens ? "Flexible" : "Global"}`;
  },

  "/groups": async () => {
    const groups = await client.group.list(getRequestOptions());
    const groupList = groups.Groups.map(
      (g) => `• ${g.Name} (${g.Participants.length} members)`
    )
      .slice(0, 5) // Show only first 5
      .join("\n");
    return `👥 Your Groups (showing first 5):
${groupList}
${
  groups.Groups.length > 5 ? `\n... and ${groups.Groups.length - 5} more` : ""
}`;
  },

  "/contacts": async () => {
    const contacts = await client.user.getContacts(getRequestOptions());
    return `📇 You have ${Object.keys(contacts).length} contacts`;
  },

  "/ping": () => "🏓 Pong! Bot is working.",
};

// Handle incoming webhook messages
app.post("/webhook", async (req, res) => {
  try {
    const { event } = req.body;

    // Only handle text messages
    if (event?.Message?.conversation) {
      const message = event.Message.conversation;
      const from = event.Info.RemoteJid.replace("@s.whatsapp.net", "");
      const isGroup = event.Info.RemoteJid.includes("@g.us");

      console.log(`📨 Message from ${from}: ${message}`);

      // Handle commands
      if (message.startsWith("/")) {
        const command = message.split(" ")[0].toLowerCase();

        if (commands[command]) {
          try {
            const response = await commands[command]();
            await client.chat.sendText(
              {
                Phone: from,
                Body: response,
              },
              getRequestOptions()
            );
          } catch (error) {
            await client.chat.sendText(
              {
                Phone: from,
                Body: `❌ Error executing command: ${error.message}`,
              },
              getRequestOptions()
            );
          }
        } else {
          await client.chat.sendText(
            {
              Phone: from,
              Body: `❓ Unknown command. Type /help for available commands.`,
            },
            getRequestOptions()
          );
        }
      }
      // Auto-reply to specific messages
      else if (message.toLowerCase().includes("hello")) {
        await client.chat.sendText(
          {
            Phone: from,
            Body: `👋 Hello! I'm a WuzAPI bot. Type /help to see what I can do.`,
          },
          getRequestOptions()
        );
      }
      // Group mention handling
      else if (isGroup && message.includes("@bot")) {
        await client.chat.sendText(
          {
            Phone: from,
            Body: `🤖 You mentioned me! Type /help to see available commands.`,
          },
          getRequestOptions()
        );
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize the bot
async function initializeBot() {
  try {
    console.log("🤖 Starting WuzAPI bot...");
    console.log(
      `🔧 Token mode: ${CONFIG.useFlexibleTokens ? "Flexible" : "Global"}`
    );

    // Test connection
    const isConnected = await client.ping(getRequestOptions());
    if (!isConnected) {
      throw new Error("Cannot connect to WuzAPI server");
    }
    console.log("✅ Connected to WuzAPI");

    // Connect to WhatsApp
    await client.session.connect(
      {
        Subscribe: ["Message", "ReadReceipt"],
        Immediate: false,
      },
      getRequestOptions()
    );

    // Check status
    const status = await client.session.getStatus(getRequestOptions());
    console.log("📱 WhatsApp Status:", status);

    if (!status.LoggedIn) {
      console.log("📱 Not logged in. Getting QR code...");
      const qr = await client.session.getQRCode(getRequestOptions());
      console.log("📷 Scan this QR code:", qr.QRCode);

      // Wait for login
      let attempts = 0;
      while (attempts < 30) {
        // Wait up to 5 minutes
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
        const newStatus = await client.session.getStatus(getRequestOptions());
        if (newStatus.LoggedIn) {
          console.log("✅ Successfully logged in!");
          break;
        }
        attempts++;
      }
    }

    // Set webhook
    const webhookUrl = "http://localhost:3000/webhook"; // Update with your webhook URL
    await client.webhook.setWebhook(webhookUrl, getRequestOptions());
    console.log(`🔗 Webhook set to: ${webhookUrl}`);

    // Start Express server
    app.listen(3000, () => {
      console.log("🚀 Bot server running on http://localhost:3000");
      console.log("🤖 Bot is ready to receive messages!");
      console.log(
        "📝 Available commands: /help, /status, /groups, /contacts, /ping"
      );
    });
  } catch (error) {
    console.error("❌ Bot initialization failed:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down bot...");
  try {
    await client.session.disconnect(getRequestOptions());
    console.log("✅ Disconnected from WhatsApp");
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
  process.exit(0);
});

// Start the bot
initializeBot();

export { app, client };
