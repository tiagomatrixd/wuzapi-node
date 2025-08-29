// Basic usage example for WuzAPI client
// This example shows how to set up and use the WuzAPI client

import WuzapiClient from "wuzapi";

// Initialize the client
const client = new WuzapiClient({
  apiUrl: "http://localhost:8080", // Your WuzAPI server URL
  token: "your-user-token-here", // Your user authentication token
});

async function basicExample() {
  try {
    console.log("🔄 Connecting to WuzAPI...");

    // Test connectivity
    const isConnected = await client.ping();
    if (!isConnected) {
      console.error("❌ Cannot connect to WuzAPI server");
      return;
    }
    console.log("✅ Connected to WuzAPI server");

    // Connect to WhatsApp
    console.log("🔄 Connecting to WhatsApp...");
    await client.session.connect({
      Subscribe: ["Message", "ReadReceipt"],
      Immediate: false,
    });

    // Check connection status
    const status = await client.session.getStatus();
    console.log("📱 WhatsApp Status:", {
      connected: status.Connected,
      loggedIn: status.LoggedIn,
    });

    // If not logged in, get QR code
    if (status.Connected && !status.LoggedIn) {
      console.log("📱 Getting QR code for WhatsApp login...");
      const qr = await client.session.getQRCode();
      console.log("📷 Scan this QR code with WhatsApp:", qr.QRCode);
      console.log("⏳ Waiting for QR code scan...");
    }

    // Example: Send a text message (uncomment when ready)
    /*
    if (status.LoggedIn) {
      console.log('📤 Sending test message...');
      const response = await client.chat.sendText({
        Phone: '5491155554444', // Replace with actual phone number
        Body: 'Hello from WuzAPI! 🎉'
      });
      console.log('✅ Message sent:', response.Id);
    }
    */

    // Example: Get user contacts
    if (status.LoggedIn) {
      console.log("📇 Getting contacts...");
      const contacts = await client.user.getContacts();
      console.log(`📇 Found ${Object.keys(contacts).length} contacts`);
    }

    // Example: List groups
    if (status.LoggedIn) {
      console.log("👥 Getting groups...");
      const groups = await client.group.list();
      console.log(`👥 Found ${groups.Groups.length} groups`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code) {
      console.error("📊 Error code:", error.code);
    }
    if (error.details) {
      console.error("📋 Error details:", error.details);
    }
  }
}

// Run the example
basicExample();
