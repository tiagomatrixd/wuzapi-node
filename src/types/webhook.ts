// Webhook endpoints types

export interface SetWebhookRequest {
  webhookURL: string;
}

export interface SetWebhookResponse {
  webhook: string;
}

export interface GetWebhookResponse {
  subscribe: string[];
  webhook: string;
}
