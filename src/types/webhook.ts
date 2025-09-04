// Webhook endpoints types

// Webhook event types (events that can be subscribed to via webhooks)
export enum WebhookEventType {
  MESSAGE = "Message",
  UNDECRYPTABLE_MESSAGE = "UndecryptableMessage",
  RECEIPT = "Receipt",
  READ_RECEIPT = "ReadReceipt",
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
  ALL = "All",
}

// Helper to get all webhook event values as string array
export const WEBHOOK_EVENTS = Object.values(WebhookEventType);

// Type for webhook event names
export type WebhookEvent = keyof typeof WebhookEventType;

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
  state?: string; // Optional state field (e.g., "Read" or "Delivered" for ReadReceipt events)
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

// Shared message and media interfaces for reusability across webhook events
//
// Note: Webhook events may have different structures than the corresponding
// WhatsApp events in events.ts. Webhook events use flat structures with
// string-based JIDs and ISO timestamp strings, while internal events use
// structured JID objects and Date objects.

// Common context info structures
export interface MessageContextInfo {
  deviceListMetadata?: DeviceListMetadata;
  deviceListMetadataVersion?: number;
  messageSecret?: string; // Encryption secret
  limitSharingV2?: {
    initiatedByMe: boolean;
    trigger: number;
  };
}

export interface DeviceListMetadata {
  senderKeyHash?: string;
  senderTimestamp?: number;
  recipientKeyHash?: string;
  recipientTimestamp?: number;
  senderAccountType?: number;
  receiverAccountType?: number;
}

export interface ContextInfo {
  disappearingMode?: {
    initiator: number;
    initiatedByMe?: boolean;
    trigger?: number;
  };
  ephemeralSettingTimestamp?: number;
  expiration?: number;
  forwardingScore?: number;
  isForwarded?: boolean;
  pairedMediaType?: number;
  statusSourceType?: number;
  featureEligibilities?: {
    canBeReshared?: boolean;
  };
}

// Common message types that are reused across different webhook events
export interface ExtendedTextMessage {
  text: string;
  contextInfo?: ContextInfo;
  inviteLinkGroupTypeV2?: number;
  previewType?: number;
}

export interface ImageMessage {
  URL: string; // Full WhatsApp media URL
  JPEGThumbnail?: string; // Base64 encoded JPEG thumbnail
  contextInfo?: ContextInfo;
  directPath: string; // Direct path to media
  fileEncSHA256: string; // Encrypted file SHA256 hash
  fileLength: number; // File size in bytes
  fileSHA256: string; // File SHA256 hash
  height: number;
  imageSourceType: number;
  mediaKey: string; // Media encryption key
  mediaKeyTimestamp: number; // Unix timestamp
  midQualityFileSHA256: string; // Mid quality file hash
  mimetype: string; // MIME type (e.g., "image/jpeg")
  scanLengths: number[]; // Progressive scan lengths
  scansSidecar: string; // Progressive scan sidecar data
  firstScanLength?: number; // First scan length
  firstScanSidecar?: string; // First scan sidecar
  width: number;
}

export interface VideoMessage {
  URL: string; // Full WhatsApp media URL
  JPEGThumbnail?: string; // Base64 encoded JPEG thumbnail
  accessibilityLabel?: string;
  caption?: string;
  contextInfo?: ContextInfo;
  directPath: string; // Direct path to media
  externalShareFullVideoDurationInSeconds?: number;
  fileEncSHA256: string; // Encrypted file SHA256 hash
  fileLength: number; // File size in bytes
  fileSHA256: string; // File SHA256 hash
  height: number;
  mediaKey: string; // Media encryption key
  mediaKeyTimestamp: number; // Unix timestamp
  mimetype: string; // MIME type (e.g., "video/mp4")
  seconds: number; // Video duration in seconds
  streamingSidecar?: string; // Streaming sidecar data for video streaming
  thumbnailDirectPath?: string; // Thumbnail direct path (alternative to JPEGThumbnail)
  thumbnailEncSHA256?: string; // Thumbnail encrypted SHA256
  thumbnailSHA256?: string; // Thumbnail SHA256
  videoSourceType: number;
  width: number;
}

export interface AudioMessage {
  URL?: string;
  contextInfo?: ContextInfo;
  directPath?: string;
  fileEncSHA256?: string;
  fileLength?: number;
  fileSHA256?: string;
  mediaKey?: string;
  mediaKeyTimestamp?: number;
  mimetype?: string;
  seconds?: number;
  ptt?: boolean; // Push to talk (voice message) - Note: payload uses uppercase "PTT"
  streamingSidecar?: string; // Streaming sidecar data for audio streaming
  waveform?: string; // Base64 encoded waveform for voice messages
}

export interface DocumentMessage {
  URL: string; // Full WhatsApp media URL
  contactVcard: boolean; // Whether this is a contact vCard
  contextInfo?: ContextInfo;
  directPath: string; // Direct path to media
  fileEncSHA256: string; // Encrypted file SHA256 hash
  fileLength: number; // File size in bytes
  fileName: string; // Original file name
  fileSHA256: string; // File SHA256 hash
  mediaKey: string; // Media encryption key
  mediaKeyTimestamp: number; // Unix timestamp
  mimetype: string; // MIME type (e.g., "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf")
  pageCount?: number; // Number of pages in the document (for documents like PDFs, Word docs, etc.)
  title: string; // Document title (usually filename without extension)
}

export interface ContactMessage {
  contextInfo?: ContextInfo;
  displayName: string; // Display name of the contact
  vcard: string; // vCard data in standard vCard format
}

export interface PollCreationMessageV3 {
  contextInfo?: ContextInfo;
  name: string; // Poll question/title
  options: Array<{
    optionHash: string; // Hash for the option
    optionName: string; // Display text for the option
  }>;
  pollContentType: number; // Type of poll content
  selectableOptionsCount: number; // Number of options that can be selected (0 = single choice, >0 = multiple choice)
}

export interface LocationMessage {
  JPEGThumbnail?: string; // Base64 encoded JPEG thumbnail of the location (map image)
  contextInfo?: ContextInfo;
  degreesLatitude: number; // Latitude coordinate
  degreesLongitude: number; // Longitude coordinate
}

export interface EditedMessage {
  message?: unknown; // The edited message content
  timestampMS?: string; // Edit timestamp
  editedMessageID?: string; // ID of original message being edited
}

// Message key structure
export interface MessageKey {
  ID: string;
  fromMe: boolean;
  participant?: string; // JID in string format
  remoteJID: string; // JID in string format
}

// User receipt structure
export interface UserReceipt {
  userJID?: string;
  receiptTimestamp?: number;
  readTimestamp?: number;
  playedTimestamp?: number;
}

// Reaction structure
export interface Reaction {
  key?: MessageKey;
  text?: string;
  senderTimestampMS?: number;
}

// Generic message wrapper
export interface GenericMessage {
  messageContextInfo?: MessageContextInfo;
  extendedTextMessage?: ExtendedTextMessage;
  imageMessage?: ImageMessage;
  videoMessage?: VideoMessage;
  audioMessage?: AudioMessage;
  editedMessage?: EditedMessage;
  documentMessage?: DocumentMessage;
  contactMessage?: ContactMessage;
  pollCreationMessageV3?: PollCreationMessageV3;
  locationMessage?: LocationMessage;
  protocolMessage?: {
    type?: number;
    historySyncNotification?: HistorySyncNotification;
    initialSecurityNotificationSettingSync?: {
      securityNotificationEnabled: boolean;
    };
  };
  deviceSentMessage?: {
    destinationJID: string;
    message: GenericMessage;
  };
}

// Message types enum for easier handling of different message types
export enum MessageType {
  EXTENDED_TEXT = "extendedTextMessage",
  IMAGE = "imageMessage",
  VIDEO = "videoMessage",
  AUDIO = "audioMessage",
  DOCUMENT = "documentMessage",
  CONTACT = "contactMessage",
  POLL_CREATION = "pollCreationMessageV3",
  LOCATION = "locationMessage",
  EDITED = "editedMessage",
  PROTOCOL = "protocolMessage",
  DEVICE_SENT = "deviceSentMessage",
  UNKNOWN = "unknown",
}
// History sync notification structure
export interface HistorySyncNotification {
  chunkOrder?: number;
  directPath: string;
  encHandle: string;
  fileEncSHA256: string;
  fileLength: number;
  fileSHA256: string;
  mediaKey: string;
  progress?: number;
  syncType: number;
}

// Verified business name structure
export interface VerifiedName {
  Certificate: {
    details: string; // Base64 encoded certificate details
    signature: string; // Base64 encoded signature
  };
  Details: {
    issuer: string; // Certificate issuer (e.g., "smb:wa")
    serial: number; // Certificate serial number
    verifiedName: string; // The verified business name
  };
}

// Specific webhook event data interfaces

// QR webhook event data (based on observed webhook payload)
// Note: For QR events, the event field is actually just the string "code"
// We represent this as an empty interface since the real data is at payload level
export interface QRWebhookEvent {
  // The event field contains just the string "code"
  // The actual QR code data is in qrCodeBase64 at the payload level
}

// Connected webhook event data (based on observed webhook payload)
// Note: For Connected events, the event field is an empty object {}
export interface ConnectedWebhookEvent {
  // The event field contains an empty object {}
  // No additional data is provided for Connected events
}

// ReadReceipt webhook event data (based on observed webhook payload)
// Maps to Receipt event type but with webhook-specific structure
export interface ReadReceiptWebhookEvent {
  AddressingMode: string;
  BroadcastListOwner: string;
  Chat: string; // JID in string format (e.g., "554198387899-1431900789@g.us")
  IsFromMe: boolean;
  IsGroup: boolean;
  MessageIDs: string[];
  MessageSender: string;
  RecipientAlt: string;
  Sender: string; // JID in string format (e.g., "554198387899@s.whatsapp.net")
  SenderAlt: string;
  Timestamp: string; // ISO string timestamp
  Type: string; // Receipt type (e.g., "read")
}

// HistorySync webhook event data (based on observed webhook payload)
// Contains different types of historical data - can be pastParticipants, statusV3Messages, conversations, etc.
export interface HistorySyncWebhookEvent {
  Data: {
    // Variant 1: Past participants data (groups and stickers)
    pastParticipants?: Array<{
      groupJID: string; // JID in string format (e.g., "120363388053770128@g.us")
      pastParticipants: Array<{
        leaveReason: number; // 0 = left voluntarily, 1 = kicked/removed
        leaveTS: number; // Unix timestamp
        userJID: string; // JID in string format
      }>;
    }>;
    recentStickers?: Array<{
      URL: string; // Full WhatsApp media URL
      directPath: string; // Direct path to media
      fileEncSHA256: string; // Encrypted file SHA256 hash
      fileLength: number; // File size in bytes
      fileSHA256: string; // File SHA256 hash
      height: number;
      isLottie: boolean; // Whether it's an animated Lottie sticker
      lastStickerSentTS: number; // Unix timestamp of last usage
      mediaKey: string; // Media encryption key
      mimetype: string; // MIME type (e.g., "image/webp")
      weight: number; // Usage weight/frequency
      width: number;
    }>;

    // Variant 2: Status messages data (stories/status updates)
    statusV3Messages?: Array<{
      key: MessageKey;
      message: GenericMessage;
      messageTimestamp: number; // Unix timestamp
      participant: string; // JID in string format
      reportingTokenInfo?: {
        reportingTag: string;
      };
    }>;

    // Variant 3: Conversation histories data
    conversations?: Array<{
      ID: string; // JID in string format (chat identifier)
      messages: Array<{
        message: {
          key: MessageKey;
          message: GenericMessage;
          messageTimestamp: number; // Unix timestamp
          messageC2STimestamp?: number; // Client to server timestamp
          ephemeralStartTimestamp?: number; // Ephemeral message start timestamp
          originalSelfAuthorUserJIDString?: string; // Original author for messages sent by self
          status?: number; // Message status (3=delivered, 4=read, 5=played)
          userReceipt?: UserReceipt[];
          reactions?: Reaction[];
          reportingTokenInfo?: {
            reportingTag: string;
          };
        };
        msgOrderID: number; // Message order ID
      }>;
    }>;
    phoneNumberToLidMappings?: Array<{
      lidJID: string; // LID JID (e.g., "165434221441206@lid")
      pnJID: string; // Phone number JID (e.g., "554199392033@s.whatsapp.net")
    }>;

    // Common fields for all variants
    chunkOrder?: number; // Chunk order for paginated sync
    progress?: number; // Sync progress
    syncType: number; // Sync operation type
  };
}

// Message webhook event data (based on observed webhook payload)
// Complex structure similar to MessageEvent in events.ts but with webhook-specific format
export interface MessageWebhookEvent {
  Info: {
    AddressingMode: string;
    BroadcastListOwner: string;
    Category: string;
    Chat: string; // JID in string format
    DeviceSentMeta: {
      DestinationJID: string;
      Phash: string;
    } | null;
    Edit: string;
    ID: string;
    IsFromMe: boolean;
    IsGroup: boolean;
    MediaType: string;
    MsgBotInfo: {
      EditSenderTimestampMS: string; // ISO timestamp
      EditTargetID: string;
      EditType: string;
    };
    MsgMetaInfo: {
      DeprecatedLIDSession: unknown | null;
      TargetID: string;
      TargetSender: string;
      ThreadMessageID: string;
      ThreadMessageSenderJID: string;
    };
    Multicast: boolean;
    PushName: string;
    RecipientAlt: string;
    Sender: string; // JID in string format
    SenderAlt: string;
    ServerID: number;
    Timestamp: string; // ISO string timestamp
    Type: string; // Message type (e.g., "text")
    VerifiedName: VerifiedName | null;
  };
  IsDocumentWithCaption: boolean;
  IsEdit: boolean;
  IsEphemeral: boolean;
  IsLottieSticker: boolean;
  IsViewOnce: boolean;
  IsViewOnceV2: boolean;
  IsViewOnceV2Extension: boolean;
  Message: GenericMessage; // Using shared message structure
  NewsletterMeta: unknown | null;
  RawMessage: GenericMessage; // Using shared message structure
  RetryCount: number;
  SourceWebMsg: unknown | null;
  UnavailableRequestID: string;
}

// Typed webhook payloads for specific events
export type QRWebhookPayload = AnyWebhookPayload<QRWebhookEvent> & {
  qrCodeBase64: string; // QR code as base64 data URL
};
export type ConnectedWebhookPayload = AnyWebhookPayload<ConnectedWebhookEvent>;
export type ReadReceiptWebhookPayload =
  AnyWebhookPayload<ReadReceiptWebhookEvent>;
export type HistorySyncWebhookPayload =
  AnyWebhookPayload<HistorySyncWebhookEvent>;
export type MessageWebhookPayload = AnyWebhookPayload<MessageWebhookEvent>;

// Webhook event mapping types for type-safe handling
export interface WebhookEventMap {
  QR: QRWebhookEvent;
  Connected: ConnectedWebhookEvent;
  ReadReceipt: ReadReceiptWebhookEvent;
  HistorySync: HistorySyncWebhookEvent;
  Message: MessageWebhookEvent;
  // Add more webhook event mappings here as they are discovered
}

// Type-safe webhook handler function type
export type WebhookEventHandler<T extends keyof WebhookEventMap> = (
  payload: AnyWebhookPayload<WebhookEventMap[T]>
) => void | Promise<void>;

// Union type for all specific webhook payloads
export type SpecificWebhookPayload =
  | QRWebhookPayload
  | ConnectedWebhookPayload
  | ReadReceiptWebhookPayload
  | HistorySyncWebhookPayload
  | MessageWebhookPayload;

// Type guard to check if payload is a specific webhook event type
export function isWebhookEventType<T extends keyof WebhookEventMap>(
  payload: WebhookPayloadBase,
  eventType: T
): payload is AnyWebhookPayload<WebhookEventMap[T]> {
  return payload.type === eventType;
}

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

/**
 * Utility function to discover the type of a GenericMessage
 * @param message - The GenericMessage to analyze
 * @returns MessageType enum value indicating the message type
 *
 * @example
 * ```typescript
 * import { discoverMessageType, MessageType } from "wuzapi";
 *
 * const messageType = discoverMessageType(webhookPayload.event.Message);
 *
 * switch (messageType) {
 *   case MessageType.IMAGE:
 *     console.log("Received an image message");
 *     break;
 *   case MessageType.EXTENDED_TEXT:
 *     console.log("Received a text message");
 *     break;
 *   // ... handle other types
 * }
 * ```
 */
export function discoverMessageType(message: GenericMessage): MessageType {
  if (!message) return MessageType.UNKNOWN;

  // Check for each message type in order of most common to least common
  if (message.extendedTextMessage) return MessageType.EXTENDED_TEXT;
  if (message.imageMessage) return MessageType.IMAGE;
  if (message.videoMessage) return MessageType.VIDEO;
  if (message.audioMessage) return MessageType.AUDIO;
  if (message.documentMessage) return MessageType.DOCUMENT;
  if (message.contactMessage) return MessageType.CONTACT;
  if (message.locationMessage) return MessageType.LOCATION;
  if (message.pollCreationMessageV3) return MessageType.POLL_CREATION;
  if (message.editedMessage) return MessageType.EDITED;
  if (message.protocolMessage) return MessageType.PROTOCOL;
  if (message.deviceSentMessage) return MessageType.DEVICE_SENT;

  return MessageType.UNKNOWN;
}
