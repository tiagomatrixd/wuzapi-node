// Main client
export { WuzapiClient } from "./wuzapi-client.js";

// Error classes
export { WuzapiError } from "./client.js";

// All types
export * from "./types/index.js";

// Individual modules (for advanced usage)
export { AdminModule } from "./modules/admin.js";
export { SessionModule } from "./modules/session.js";
export { UserModule } from "./modules/user.js";
export { ChatModule } from "./modules/chat.js";
export { GroupModule } from "./modules/group.js";
export { WebhookModule } from "./modules/webhook.js";

// Default export
export { WuzapiClient as default } from "./wuzapi-client.js";
