// Webhook endpoints types

// Webhook event types (events that can be subscribed to via webhooks)
export enum WebhookEventType {
  MESSAGE = "Message",
  UNDECRYPTABLE_MESSAGE = "UndecryptableMessage",
  RECEIPT = "Receipt",
  MEDIA_RETRY = "MediaRetry",
  GROUP_INFO = "GroupInfo",
  JOINED_GROUP = "JoinedGroup",
  PICTURE = "Picture",
  BLOCKLIST_CHANGE = "BlocklistChange",
  BLOCKLIST = "Blocklist",
  CONNECTED = "Connected",
  DISCONNECTED = "Disconnected",
  CONNECT_FAILURE = "ConnectFailure",
  KEEP_ALIVE_RESTORED = "KeepAliveRestored",
  KEEP_ALIVE_TIMEOUT = "KeepAliveTimeout",
  LOGGED_OUT = "LoggedOut",
  CLIENT_OUTDATED = "ClientOutdated",
  TEMPORARY_BAN = "TemporaryBan",
  STREAM_ERROR = "StreamError",
  STREAM_REPLACED = "StreamReplaced",
  PAIR_SUCCESS = "PairSuccess",
  PAIR_ERROR = "PairError",
  QR = "QR",
  QR_SCANNED_WITHOUT_MULTIDEVICE = "QRScannedWithoutMultidevice",
  PRIVACY_SETTINGS = "PrivacySettings",
  PUSH_NAME_SETTING = "PushNameSetting",
  USER_ABOUT = "UserAbout",
  APP_STATE = "AppState",
  APP_STATE_SYNC_COMPLETE = "AppStateSyncComplete",
  HISTORY_SYNC = "HistorySync",
  OFFLINE_SYNC_COMPLETED = "OfflineSyncCompleted",
  OFFLINE_SYNC_PREVIEW = "OfflineSyncPreview",
  CALL_OFFER = "CallOffer",
  CALL_ACCEPT = "CallAccept",
  CALL_TERMINATE = "CallTerminate",
  CALL_OFFER_NOTICE = "CallOfferNotice",
  CALL_RELAY_LATENCY = "CallRelayLatency",
  PRESENCE = "Presence",
  CHAT_PRESENCE = "ChatPresence",
  IDENTITY_CHANGE = "IdentityChange",
  CAT_REFRESH_ERROR = "CATRefreshError",
  NEWSLETTER_JOIN = "NewsletterJoin",
  NEWSLETTER_LEAVE = "NewsletterLeave",
  NEWSLETTER_MUTE_CHANGE = "NewsletterMuteChange",
  NEWSLETTER_LIVE_UPDATE = "NewsletterLiveUpdate",
  FB_MESSAGE = "FBMessage",
}

// Helper to get all webhook event values as string array
export const WEBHOOK_EVENTS = Object.values(WebhookEventType);

// Type for webhook event names
export type WebhookEvent = keyof typeof WebhookEventType | "All";

export interface SetWebhookRequest {
  webhook: string;
  events: (WebhookEvent | string)[];
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
  events?: (WebhookEvent | string)[];
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

// Base interface that all webhook payloads extend from
export interface WebhookPayloadBase<T = unknown> {
  event: T;
  type: string;
  token: string;
}

// Standard webhook payload with optional media
export interface WebhookPayload<T = unknown> extends WebhookPayloadBase<T> {
  s3?: S3MediaInfo;
  base64?: string;
  mimeType?: string;
  fileName?: string;
}

// Specific webhook payload types for different media delivery modes

// S3 only delivery
export interface S3OnlyWebhookPayload<T = unknown>
  extends WebhookPayloadBase<T> {
  s3: S3MediaInfo;
}

// Base64 only delivery
export interface Base64OnlyWebhookPayload<T = unknown>
  extends WebhookPayloadBase<T> {
  base64: string;
  mimeType: string;
  fileName: string;
}

// Both S3 and Base64 delivery
export interface BothMediaWebhookPayload<T = unknown>
  extends WebhookPayloadBase<T> {
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
  payload: WebhookPayloadBase
): payload is S3OnlyWebhookPayload | BothMediaWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(payload as any).s3;
}

export function hasBase64Media(
  payload: WebhookPayloadBase
): payload is Base64OnlyWebhookPayload | BothMediaWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(payload as any).base64;
}

export function hasBothMedia(
  payload: WebhookPayloadBase
): payload is BothMediaWebhookPayload {
  return hasS3Media(payload) && hasBase64Media(payload);
}

// Helper type guard to check if payload has token (all webhook payloads should)
export function isValidWebhookPayload(
  payload: unknown
): payload is WebhookPayloadBase {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "event" in payload &&
    "type" in payload &&
    "token" in payload
  );
}
