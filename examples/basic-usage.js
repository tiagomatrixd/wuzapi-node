// Basic usage example for WuzAPI client
// This example shows how to set up and use the WuzAPI client
// with both traditional (global token) and flexible (per-request token) approaches

import WuzapiClient from "wuzapi";

// Method 1: Traditional usage with global token
const clientWithGlobalToken = new WuzapiClient({
  apiUrl: "http://localhost:8080", // Your WuzAPI server URL
  token: "your-user-token-here", // Your user authentication token
});

// Method 2: Flexible usage - no global token (or admin token as default)
const clientFlexible = new WuzapiClient({
  apiUrl: "http://localhost:8080", // Your WuzAPI server URL
  // token is optional - can be provided per request
});

// For this example, we'll use the traditional approach
const client = clientWithGlobalToken;

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

// Example with flexible token usage
async function flexibleTokenExample() {
  try {
    console.log("\n🔧 Flexible Token Usage Example");
    console.log("=================================");

    // Use the flexible client
    const userToken = "user-specific-token-here";
    const adminToken = "admin-token-here";

    // Test connectivity with user token
    const isConnected = await clientFlexible.ping({ token: userToken });
    if (!isConnected) {
      console.error("❌ Cannot connect to WuzAPI server");
      return;
    }
    console.log("✅ Connected to WuzAPI server with user token");

    // Connect to WhatsApp with user token
    console.log("🔄 Connecting to WhatsApp with user token...");
    await clientFlexible.session.connect(
      {
        Subscribe: ["Message", "ReadReceipt"],
        Immediate: false,
      },
      { token: userToken }
    );

    // Check status with user token
    const status = await clientFlexible.session.getStatus({ token: userToken });
    console.log("📱 WhatsApp Status:", {
      connected: status.Connected,
      loggedIn: status.LoggedIn,
    });

    // Send message with user token
    if (status.LoggedIn) {
      console.log("📤 Sending message with user token...");
      // Uncomment and update phone number when ready
      /*
      const response = await clientFlexible.chat.sendText(
        {
          Phone: '5491155554444',
          Body: 'Hello from flexible token usage! 🚀'
        },
        { token: userToken }
      );
      console.log('✅ Message sent:', response.Id);
      */
    }

    // Admin operations with admin token
    console.log("👨‍💼 Performing admin operations with admin token...");
    try {
      const users = await clientFlexible.admin.listUsers({ token: adminToken });
      console.log(`👥 Found ${users.length} users in system`);
    } catch (error) {
      console.log("⚠️ Admin operations require valid admin token");
    }

    console.log("✅ Flexible token example completed");
  } catch (error) {
    console.error("❌ Error in flexible token example:", error.message);
    if (error.code === 401) {
      console.error("🔑 Authentication error - check your tokens");
    }
  }
}

// Run the examples
console.log("Running WuzAPI Basic Usage Examples");
console.log("==================================\n");

// Uncomment the example you want to run:

// Traditional usage
basicExample();

// Flexible token usage
// flexibleTokenExample();
