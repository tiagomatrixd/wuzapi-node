import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  SetWebhookRequest,
  SetWebhookResponse,
  GetWebhookResponse,
  UpdateWebhookRequest,
  UpdateWebhookResponse,
  DeleteWebhookResponse,
} from "../types/webhook.js";

export class WebhookModule extends BaseClient {
  /**
   * Set webhook URL and events to subscribe to
   */
  async setWebhook(
    webhookURL: string,
    events: string[] = ["All"],
    options?: RequestOptions
  ): Promise<SetWebhookResponse> {
    const request: SetWebhookRequest = { webhook: webhookURL, events };
    return this.post<SetWebhookResponse>("/webhook", request, options);
  }

  /**
   * Get current webhook configuration
   */
  async getWebhook(options?: RequestOptions): Promise<GetWebhookResponse> {
    return this.get<GetWebhookResponse>("/webhook", options);
  }

  /**
   * Update webhook URL, events, and activation status
   */
  async updateWebhook(
    webhookURL?: string,
    events?: string[],
    active?: boolean,
    options?: RequestOptions
  ): Promise<UpdateWebhookResponse> {
    const request: UpdateWebhookRequest = {
      webhook: webhookURL,
      events,
      Active: active,
    };
    return this.put<UpdateWebhookResponse>("/webhook", request, options);
  }

  /**
   * Delete webhook configuration
   */
  async deleteWebhook(
    options?: RequestOptions
  ): Promise<DeleteWebhookResponse> {
    return this.delete<DeleteWebhookResponse>("/webhook", options);
  }
}
