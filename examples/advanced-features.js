// Advanced features example for WuzAPI client
// This example demonstrates new functionality including:
// - Phone pairing (alternative to QR)
// - Interactive messages (buttons, lists, polls)
// - Message editing and deletion
// - Advanced group management
// - Newsletter functionality

import WuzapiClient from "wuzapi";

const client = new WuzapiClient({
  apiUrl: "http://localhost:8080",
  token: "your-user-token-here",
});

// Phone pairing example (alternative to QR code)
async function phoneLoginExample() {
  console.log("\n📞 Phone Pairing Login Example");
  console.log("===============================");

  try {
    // Connect first
    await client.session.connect({
      Subscribe: ["Message"],
      Immediate: false,
    });

    const status = await client.session.getStatus();
    if (status.LoggedIn) {
      console.log("✅ Already logged in");
      return;
    }

    // Replace with your actual phone number
    const phoneNumber = "5491155554444"; // Format: country code + number
    console.log(`📱 Requesting pairing code for ${phoneNumber}...`);
    console.log("💡 You will receive an SMS or call with a verification code");

    // In a real application, you would prompt the user for the verification code
    // For this example, we'll simulate it
    const verificationCode = await promptForVerificationCode();

    // Pair the phone - this generates the verification code
    const result = await client.session.pairPhone(phoneNumber);
    console.log("✅ Pairing request sent:", result.Details);
    console.log("📱 Check your phone for verification code");
    console.log("💡 Note: Enter the code in WhatsApp when prompted");

    // Wait for login confirmation
    await waitForLogin();

    // Request message history after successful login
    await client.session.requestHistory();
    console.log("📚 Message history sync requested");
  } catch (error) {
    console.error("❌ Phone pairing failed:", error.message);
  }
}

// Interactive messages examples
async function interactiveMessagesExample() {
  console.log("\n🎛️ Interactive Messages Example");
  console.log("================================");

  const testPhone = "5491155554444"; // Replace with test number

  try {
    // 1. Send interactive buttons
    console.log("📤 Sending interactive buttons...");
    await client.chat.sendButtons({
      Phone: testPhone,
      Body: "Welcome! Choose an option:",
      Footer: "Powered by WuzAPI",
      Buttons: [
        {
          ButtonId: "help",
          ButtonText: { DisplayText: "🆘 Get Help" },
          Type: 1,
        },
        {
          ButtonId: "info",
          ButtonText: { DisplayText: "ℹ️ Information" },
          Type: 1,
        },
        {
          ButtonId: "contact",
          ButtonText: { DisplayText: "📞 Contact Us" },
          Type: 1,
        },
      ],
    });

    // 2. Send list message
    console.log("📤 Sending list message...");
    await client.chat.sendList(
      testPhone, // Phone
      "View Services", // Button text
      "Please select from our services:", // Description
      "Service Menu", // Top text/title
      [
        {
          // Sections
          Title: "Support",
          Rows: [
            {
              Title: "Technical Support",
              Desc: "Get help with technical issues",
              RowId: "tech_support",
            },
            {
              Title: "Billing Support",
              Desc: "Questions about billing",
              RowId: "billing_support",
            },
          ],
        },
        {
          Title: "Information",
          Rows: [
            {
              Title: "Product Info",
              Desc: "Learn about our products",
              RowId: "product_info",
            },
            {
              Title: "Company Info",
              Desc: "About our company",
              RowId: "company_info",
            },
          ],
        },
      ]
    );

    console.log("✅ Interactive messages sent successfully");
  } catch (error) {
    console.error("❌ Interactive messages failed:", error.message);
  }
}

// Message management examples
async function messageManagementExample() {
  console.log("\n✏️ Message Management Example");
  console.log("==============================");

  const testPhone = "5491155554444";

  try {
    // Send a message first
    console.log("📤 Sending original message...");
    const response = await client.chat.sendText({
      Phone: testPhone,
      Body: "This is the original message",
    });

    const messageId = response.Id;
    console.log(`📋 Message ID: ${messageId}`);

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Edit the message
    console.log("✏️ Editing message...");
    await client.chat.editMessage({
      Phone: testPhone,
      MessageId: messageId,
      NewText: "This message has been edited! ✏️",
    });

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Delete the message
    console.log("🗑️ Deleting message...");
    await client.chat.deleteMessage({
      Phone: testPhone,
      Id: messageId,
      Remote: true, // Delete for everyone
    });

    console.log("✅ Message management completed");
  } catch (error) {
    console.error("❌ Message management failed:", error.message);
  }
}

// Advanced group management examples
async function advancedGroupExample() {
  console.log("\n👥 Advanced Group Management Example");
  console.log("====================================");

  try {
    // Create a new group
    console.log("👥 Creating new group...");
    const group = await client.group.create("WuzAPI Test Group", [
      "5491155553934",
      "5491155553935",
    ]);

    const groupJID = group.JID;
    console.log(`✅ Group created: ${groupJID}`);

    // Set group description/topic
    console.log("📝 Setting group topic...");
    await client.group.setTopic(
      groupJID,
      "Welcome to our test group! 🎉\n\nRules:\n1. Be respectful\n2. Stay on topic\n3. Have fun!"
    );

    // Set group to announcement mode (only admins can send messages)
    console.log("📢 Setting announcement mode...");
    await client.group.setAnnounce(groupJID, true);

    // Add more participants
    console.log("👥 Adding participants...");
    await client.group.updateParticipants(groupJID, "add", [
      "5491155553936",
      "5491155553937",
    ]);

    // Promote someone to admin
    console.log("👑 Promoting participant to admin...");
    await client.group.updateParticipants(groupJID, "promote", [
      "5491155553936",
    ]);

    // Get group invite link
    console.log("🔗 Getting invite link...");
    const inviteLink = await client.group.getInviteLink(groupJID);
    console.log(`🔗 Invite link: ${inviteLink.InviteLink}`);

    // Set disappearing messages
    console.log("⏰ Setting disappearing messages...");
    await client.group.setEphemeral(groupJID, "7d"); // Messages disappear after 7 days

    console.log("✅ Advanced group management completed");

    // Optional: Leave the group after testing
    /*
    console.log("👋 Leaving group...");
    await client.group.leave(groupJID);
    */
  } catch (error) {
    console.error("❌ Advanced group management failed:", error.message);
  }
}

// Admin operations example
async function adminOperationsExample() {
  console.log("\n👨‍💼 Admin Operations Example");
  console.log("=============================");

  try {
    // List all users
    console.log("👥 Listing all users...");
    const users = await client.admin.listUsers();
    console.log(`📊 Total users: ${users.length}`);

    // Get specific user details
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`🔍 Getting details for user ID: ${firstUser.id}`);
      const userDetails = await client.admin.getUser(firstUser.id);
      console.log(`📋 User: ${userDetails.name} (${userDetails.jid})`);
    }

    // Add a new user (uncomment to test)
    /*
    console.log("➕ Adding new user...");
    const newUser = await client.admin.addUser({
      name: "Test User",
      token: "test-user-token-" + Date.now(),
      webhook: "https://example.com/webhook",
      events: "Message,ReadReceipt",
      expiration: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    });
    console.log(`✅ User created with ID: ${newUser.id}`);
    */
  } catch (error) {
    console.error("❌ Admin operations failed:", error.message);
    if (error.code === 401) {
      console.log("💡 Note: Admin operations require admin token");
    }
  }
}

// Newsletter example (Business accounts only)
async function newsletterExample() {
  console.log("\n📰 Newsletter Example");
  console.log("=====================");

  try {
    console.log("📋 Listing subscribed newsletters...");
    const newsletters = await client.newsletter.list();

    if (newsletters.Newsletters.length === 0) {
      console.log("📭 No newsletters found");
      console.log(
        "💡 Note: Newsletter features require WhatsApp Business account"
      );
      return;
    }

    console.log(`📊 Found ${newsletters.Newsletters.length} newsletters:`);
    newsletters.Newsletters.forEach((newsletter, index) => {
      console.log(`${index + 1}. ${newsletter.Name}`);
      console.log(`   📝 Description: ${newsletter.Description}`);
      console.log(`   🏷️ Handle: @${newsletter.Handle}`);
      console.log(`   📊 State: ${newsletter.State}`);
      console.log(`   🔗 Thread: ${newsletter.ThreadJID}`);
    });
  } catch (error) {
    console.error("❌ Newsletter operations failed:", error.message);
    console.log(
      "💡 Note: Newsletter features require WhatsApp Business account"
    );
  }
}

// Webhook management example
async function webhookManagementExample() {
  console.log("\n🔗 Webhook Management Example");
  console.log("==============================");

  try {
    // Get current webhook configuration
    console.log("📋 Getting current webhook...");
    const currentWebhook = await client.webhook.getWebhook();
    console.log(`🔗 Current webhook: ${currentWebhook.webhook}`);
    console.log(`📋 Subscribed events: ${currentWebhook.subscribe.join(", ")}`);

    // Update webhook URL
    console.log("🔄 Updating webhook URL...");
    const newWebhookUrl = "https://my-new-server.com/webhook";
    await client.webhook.updateWebhook(newWebhookUrl);
    console.log(`✅ Webhook updated to: ${newWebhookUrl}`);

    // Optional: Delete webhook
    /*
    console.log("🗑️ Deleting webhook...");
    await client.webhook.deleteWebhook();
    console.log("✅ Webhook deleted");
    */
  } catch (error) {
    console.error("❌ Webhook management failed:", error.message);
  }
}

// Helper functions
async function promptForVerificationCode() {
  // In a real application, you would use readline or a UI to get user input
  // For this example, we'll return a placeholder
  console.log("📱 Please enter the verification code you received:");
  console.log("💡 For this example, returning placeholder code");
  return "123456"; // Replace with actual user input
}

async function waitForLogin() {
  console.log("⏳ Waiting for login confirmation...");
  let attempts = 0;
  while (attempts < 30) {
    // Wait up to 5 minutes
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
    const status = await client.session.getStatus();
    if (status.LoggedIn) {
      console.log("✅ Login confirmed!");
      return;
    }
    attempts++;
    console.log(`⏳ Still waiting... (attempt ${attempts}/30)`);
  }
  throw new Error("Login timeout - please try again");
}

// Main execution
async function runAdvancedExamples() {
  console.log("🚀 WuzAPI Advanced Features Examples");
  console.log("====================================");

  try {
    // Test connectivity
    const isConnected = await client.ping();
    if (!isConnected) {
      console.error("❌ Cannot connect to WuzAPI server");
      return;
    }
    console.log("✅ Connected to WuzAPI server");

    // Choose which examples to run (uncomment as needed)

    // Phone pairing (alternative to QR)
    // await phoneLoginExample();

    // Interactive messages
    // await interactiveMessagesExample();

    // Message management
    // await messageManagementExample();

    // Advanced group management
    // await advancedGroupExample();

    // Admin operations
    // await adminOperationsExample();

    // Newsletter functionality
    // await newsletterExample();

    // Webhook management
    await webhookManagementExample();

    console.log("\n🎉 Advanced examples completed!");
    console.log("💡 Uncomment the examples you want to test");
  } catch (error) {
    console.error("❌ Advanced examples failed:", error.message);
  }
}

// Export for use in other modules
export {
  phoneLoginExample,
  interactiveMessagesExample,
  messageManagementExample,
  advancedGroupExample,
  adminOperationsExample,
  newsletterExample,
  webhookManagementExample,
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAdvancedExamples();
}
