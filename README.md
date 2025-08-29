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

Configure webhook settings.

```typescript
// Set webhook URL
await client.webhook.setWebhook("https://my-server.com/webhook");

// Get current webhook configuration
const webhookConfig = await client.webhook.getWebhook();
console.log("Webhook URL:", webhookConfig.webhook);
console.log("Subscribed events:", webhookConfig.subscribe);
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
git clone https://github.com/your-username/wuzapi.git
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
- 🐛 [Issue Tracker](https://github.com/your-username/wuzapi/issues)
- 💬 [Discussions](https://github.com/your-username/wuzapi/discussions)

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
