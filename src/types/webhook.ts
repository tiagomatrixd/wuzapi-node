// Webhook endpoints types

export interface SetWebhookRequest {
  webhook: string;
  events: string[];
}

export interface SetWebhookResponse {
  WebhookURL: string;
  Events: string[];
}

export interface GetWebhookResponse {
  subscribe: string[];
  webhook: string;
}

export interface UpdateWebhookRequest {
  webhook?: string;
  events?: string[];
  Active?: boolean;
}

export interface UpdateWebhookResponse {
  WebhookURL: string;
  Events: string[];
  active: boolean;
}

export interface DeleteWebhookResponse {
  Details: string;
}

// Webhook payload types (what your webhook endpoint receives)

export interface S3MediaInfo {
  url: string;
  key: string;
  bucket: string;
  size: number;
  mimeType: string;
  fileName: string;
}

export interface WebhookPayload<T = unknown> {
  event: T;
  s3?: S3MediaInfo;
  base64?: string;
  mimeType?: string;
  fileName?: string;
}

// Specific webhook payload types for different media delivery modes

// S3 only delivery
export interface S3OnlyWebhookPayload<T = unknown> {
  event: T;
  s3: S3MediaInfo;
}

// Base64 only delivery
export interface Base64OnlyWebhookPayload<T = unknown> {
  event: T;
  base64: string;
  mimeType: string;
  fileName: string;
}

// Both S3 and Base64 delivery
export interface BothMediaWebhookPayload<T = unknown> {
  event: T;
  s3: S3MediaInfo;
  base64: string;
  mimeType: string;
  fileName: string;
}

// Union type for all possible webhook payloads
export type AnyWebhookPayload<T = unknown> =
  | WebhookPayload<T>
  | S3OnlyWebhookPayload<T>
  | Base64OnlyWebhookPayload<T>
  | BothMediaWebhookPayload<T>;

// Helper type guards
export function hasS3Media(
  payload: WebhookPayload
): payload is S3OnlyWebhookPayload | BothMediaWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(payload as any).s3;
}

export function hasBase64Media(
  payload: WebhookPayload
): payload is Base64OnlyWebhookPayload | BothMediaWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(payload as any).base64;
}

export function hasBothMedia(
  payload: WebhookPayload
): payload is BothMediaWebhookPayload {
  return hasS3Media(payload) && hasBase64Media(payload);
}
