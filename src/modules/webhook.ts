import { BaseClient } from "../client.js";
import {
  SetWebhookRequest,
  SetWebhookResponse,
  GetWebhookResponse,
} from "../types/webhook.js";

export class WebhookModule extends BaseClient {
  /**
   * Set webhook URL and events to subscribe to
   */
  async setWebhook(webhookURL: string): Promise<SetWebhookResponse> {
    const request: SetWebhookRequest = { webhookURL };
    return this.post<SetWebhookResponse>("/webhook", request);
  }

  /**
   * Get current webhook configuration
   */
  async getWebhook(): Promise<GetWebhookResponse> {
    return this.get<GetWebhookResponse>("/webhook");
  }
}
