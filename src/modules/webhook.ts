import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  SetWebhookRequest,
  SetWebhookResponse,
  GetWebhookResponse,
} from "../types/webhook.js";

export class WebhookModule extends BaseClient {
  /**
   * Set webhook URL and events to subscribe to
   */
  async setWebhook(
    webhookURL: string,
    options?: RequestOptions
  ): Promise<SetWebhookResponse> {
    const request: SetWebhookRequest = { webhookURL };
    return this.post<SetWebhookResponse>("/webhook", request, options);
  }

  /**
   * Get current webhook configuration
   */
  async getWebhook(options?: RequestOptions): Promise<GetWebhookResponse> {
    return this.get<GetWebhookResponse>("/webhook", options);
  }
}
