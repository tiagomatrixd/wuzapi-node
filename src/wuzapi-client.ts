import { WuzapiConfig, RequestOptions } from "./types/common.js";
import { AdminModule } from "./modules/admin.js";
import { SessionModule } from "./modules/session.js";
import { UserModule } from "./modules/user.js";
import { ChatModule } from "./modules/chat.js";
import { GroupModule } from "./modules/group.js";
import { WebhookModule } from "./modules/webhook.js";

export class WuzapiClient {
  public readonly admin: AdminModule;
  public readonly session: SessionModule;
  public readonly user: UserModule;
  public readonly chat: ChatModule;
  public readonly group: GroupModule;
  public readonly webhook: WebhookModule;

  // Legacy aliases for convenience
  public readonly users: UserModule;
  public readonly message: ChatModule;

  constructor(config: WuzapiConfig) {
    // Initialize all modules with the same config
    this.admin = new AdminModule(config);
    this.session = new SessionModule(config);
    this.user = new UserModule(config);
    this.chat = new ChatModule(config);
    this.group = new GroupModule(config);
    this.webhook = new WebhookModule(config);

    // Legacy aliases
    this.users = this.user;
    this.message = this.chat;
  }

  /**
   * Test connection to the API
   */
  async ping(options?: RequestOptions): Promise<boolean> {
    try {
      await this.session.getStatus(options);
      return true;
    } catch {
      return false;
    }
  }
}
