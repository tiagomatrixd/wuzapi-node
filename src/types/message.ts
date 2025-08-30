// WhatsApp Message types based on whatsmeow protobuf definitions
// Reference: https://pkg.go.dev/go.mau.fi/whatsmeow@v0.0.0-20250829123043-72d2ed58e998/proto/waE2E#Message

// Base message context and metadata types
export interface ContextInfo {
  stanzaId?: string;
  participant?: string;
  quotedMessage?: Message;
  remoteJid?: string;
  mentionedJid?: string[];
  conversionSource?: string;
  conversionData?: string;
  conversionDelaySeconds?: number;
  forwardingScore?: number;
  isForwarded?: boolean;
  quotedAd?: AdReplyInfo;
  placeholderKey?: MessageKey;
  expiration?: number;
  ephemeralSettingTimestamp?: number;
  ephemeralSharedSecret?: string;
  externalAdReply?: ExternalAdReplyInfo;
  entryPointConversionSource?: string;
  entryPointConversionApp?: string;
  entryPointConversionDelaySeconds?: number;
  disappearingMode?: DisappearingMode;
  actionLink?: ActionLink;
  groupSubject?: string;
  parentGroupJid?: string;
  trustBannerType?: string;
  trustBannerAction?: number;
  isSampled?: boolean;
  utm?: UTMInfo;
}

export interface MessageKey {
  remoteJid?: string;
  fromMe?: boolean;
  id?: string;
  participant?: string;
}

export interface DisappearingMode {
  initiator?: DisappearingModeInitiator;
  trigger?: DisappearingModeTrigger;
  initiatorDeviceJid?: string;
}

export enum DisappearingModeInitiator {
  CHANGED_IN_CHAT = 0,
  INITIATED_BY_ME = 1,
  INITIATED_BY_OTHER = 2,
}

export enum DisappearingModeTrigger {
  UNKNOWN = 0,
  CHAT_SETTING = 1,
  ACCOUNT_SETTING = 2,
  BULK_CHANGE = 3,
}

export interface AdReplyInfo {
  advertiserName?: string;
  mediaType?: MediaType;
  jpegThumbnail?: Uint8Array;
  caption?: string;
}

export interface ExternalAdReplyInfo {
  title?: string;
  body?: string;
  mediaType?: MediaType;
  thumbnailUrl?: string;
  mediaUrl?: string;
  thumbnail?: Uint8Array;
  sourceType?: string;
  sourceId?: string;
  sourceUrl?: string;
  containsAutoReply?: boolean;
  renderLargerThumbnail?: boolean;
  showAdAttribution?: boolean;
  ctwaClid?: string;
  ref?: string;
}

export interface ActionLink {
  url?: string;
  buttonTitle?: string;
}

export interface UTMInfo {
  utmSource?: string;
  utmCampaign?: string;
}

export enum MediaType {
  UNKNOWN = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  DOCUMENT = 4,
  STICKER = 5,
}

// Interactive elements
export interface InteractiveAnnotation {
  polygonVertices?: Point[];
  location?: Location;
}

export interface Point {
  xDeprecated?: number;
  yDeprecated?: number;
  x?: number;
  y?: number;
}

// Location types
export interface LocationMessage {
  degreesLatitude?: number;
  degreesLongitude?: number;
  name?: string;
  address?: string;
  url?: string;
  isLiveLocation?: boolean;
  accuracyInMeters?: number;
  speedInMps?: number;
  degreesClockwiseFromMagneticNorth?: number;
  comment?: string;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
}

export interface LiveLocationMessage {
  degreesLatitude?: number;
  degreesLongitude?: number;
  accuracyInMeters?: number;
  speedInMps?: number;
  degreesClockwiseFromMagneticNorth?: number;
  caption?: string;
  sequenceNumber?: number;
  timeOffset?: number;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
}

export interface Location {
  degreesLatitude?: number;
  degreesLongitude?: number;
  name?: string;
}

// Media message types
export interface ImageMessage {
  url?: string;
  mimetype?: string;
  caption?: string;
  fileSha256?: Uint8Array;
  fileLength?: number;
  height?: number;
  width?: number;
  mediaKey?: Uint8Array;
  fileEncSha256?: Uint8Array;
  interactiveAnnotations?: InteractiveAnnotation[];
  directPath?: string;
  mediaKeyTimestamp?: number;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
  firstScanSidecar?: Uint8Array;
  firstScanLength?: number;
  experimentGroupId?: number;
  scansSidecar?: Uint8Array;
  scanLengths?: number[];
  midQualityFileSha256?: Uint8Array;
  midQualityFileEncSha256?: Uint8Array;
  viewOnce?: boolean;
  thumbnailDirectPath?: string;
  thumbnailSha256?: Uint8Array;
  thumbnailEncSha256?: Uint8Array;
  staticUrl?: string;
  annotations?: InteractiveAnnotation[];
  originalFileName?: string;
}

export interface VideoMessage {
  url?: string;
  mimetype?: string;
  fileSha256?: Uint8Array;
  fileLength?: number;
  seconds?: number;
  mediaKey?: Uint8Array;
  caption?: string;
  gifPlayback?: boolean;
  height?: number;
  width?: number;
  fileEncSha256?: Uint8Array;
  interactiveAnnotations?: InteractiveAnnotation[];
  directPath?: string;
  mediaKeyTimestamp?: number;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
  streamingSidecar?: Uint8Array;
  gifAttribution?: VideoAttribution;
  viewOnce?: boolean;
  thumbnailDirectPath?: string;
  thumbnailSha256?: Uint8Array;
  thumbnailEncSha256?: Uint8Array;
  staticUrl?: string;
  annotations?: InteractiveAnnotation[];
  accessibilityLabel?: string;
  processedVideos?: ProcessedVideo[];
  externalShareFullVideoDurationInSeconds?: number;
  motionPhotoPresentationOffsetMS?: number;
  metadataUrl?: string;
  videoSourceType?: VideoSourceType;
}

export enum VideoAttribution {
  NONE = 0,
  GIPHY = 1,
  TENOR = 2,
  KLIPY = 3,
}

export enum VideoSourceType {
  USER_VIDEO = 0,
  AI_GENERATED = 1,
}

export interface ProcessedVideo {
  url?: string;
  fileLength?: number;
  fileSha256?: Uint8Array;
  fileEncSha256?: Uint8Array;
}

export interface AudioMessage {
  url?: string;
  mimetype?: string;
  fileSha256?: Uint8Array;
  fileLength?: number;
  seconds?: number;
  ptt?: boolean;
  mediaKey?: Uint8Array;
  fileEncSha256?: Uint8Array;
  directPath?: string;
  mediaKeyTimestamp?: number;
  contextInfo?: ContextInfo;
  streamingSidecar?: Uint8Array;
  waveform?: Uint8Array;
  backgroundArgb?: number;
  viewOnce?: boolean;
}

export interface DocumentMessage {
  url?: string;
  mimetype?: string;
  title?: string;
  fileSha256?: Uint8Array;
  fileLength?: number;
  pageCount?: number;
  mediaKey?: Uint8Array;
  fileName?: string;
  fileEncSha256?: Uint8Array;
  directPath?: string;
  mediaKeyTimestamp?: number;
  contactVcard?: boolean;
  thumbnailDirectPath?: string;
  thumbnailSha256?: Uint8Array;
  thumbnailEncSha256?: Uint8Array;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  caption?: string;
}

export interface StickerMessage {
  url?: string;
  fileSha256?: Uint8Array;
  fileEncSha256?: Uint8Array;
  mediaKey?: Uint8Array;
  mimetype?: string;
  height?: number;
  width?: number;
  directPath?: string;
  fileLength?: number;
  mediaKeyTimestamp?: number;
  firstFrameLength?: number;
  firstFrameSidecar?: Uint8Array;
  isAnimated?: boolean;
  pngThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
  stickerSentTs?: number;
  isAvatar?: boolean;
  isAiSticker?: boolean;
  isLottie?: boolean;
}

// Contact message types
export interface ContactMessage {
  displayName?: string;
  vcard?: string;
  contextInfo?: ContextInfo;
}

export interface ContactsArrayMessage {
  displayName?: string;
  contacts?: ContactMessage[];
  contextInfo?: ContextInfo;
}

// Text and extended text messages
export interface ExtendedTextMessage {
  text?: string;
  matchedText?: string;
  canonicalUrl?: string;
  description?: string;
  title?: string;
  textArgb?: number;
  backgroundArgb?: number;
  font?: ExtendedTextMessageFontType;
  previewType?: ExtendedTextMessagePreviewType;
  jpegThumbnail?: Uint8Array;
  contextInfo?: ContextInfo;
  doNotPlayInline?: boolean;
  thumbnailDirectPath?: string;
  thumbnailSha256?: Uint8Array;
  thumbnailEncSha256?: Uint8Array;
  mediaKey?: Uint8Array;
  mediaKeyTimestamp?: number;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  inviteLinkGroupType?: ExtendedTextMessageInviteLinkGroupType;
  inviteLinkParentGroupSubject?: string;
  inviteLinkParentGroupThumbnailJpeg?: Uint8Array;
  inviteLinkGroupTypeV2?: InviteLinkGroupType;
  viewOnce?: boolean;
}

export enum ExtendedTextMessageFontType {
  SANS_SERIF = 0,
  SERIF = 1,
  NORICAN_REGULAR = 2,
  BRYNDAN_WRITE = 3,
  BEBASNEUE_REGULAR = 4,
  OSWALD_HEAVY = 5,
}

export enum ExtendedTextMessagePreviewType {
  NONE = 0,
  VIDEO = 1,
  PLACEHOLDER = 4,
  IMAGE = 5,
}

export enum ExtendedTextMessageInviteLinkGroupType {
  DEFAULT = 0,
  PARENT = 1,
  SUB = 2,
  DEFAULT_SUB = 3,
}

export enum InviteLinkGroupType {
  DEFAULT = 0,
  PARENT = 1,
  SUB = 2,
  DEFAULT_SUB = 3,
}

// Interactive messages
export interface ButtonsMessage {
  contentText?: string;
  footerText?: string;
  contextInfo?: ContextInfo;
  buttons?: Button[];
  headerType?: ButtonsMessageHeaderType;
  text?: string;
  documentMessage?: DocumentMessage;
  imageMessage?: ImageMessage;
  videoMessage?: VideoMessage;
  locationMessage?: LocationMessage;
}

export interface Button {
  buttonId?: string;
  buttonText?: ButtonText;
  type?: ButtonType;
  nativeFlowInfo?: NativeFlowInfo;
}

export interface ButtonText {
  displayText?: string;
}

export enum ButtonType {
  UNKNOWN = 0,
  RESPONSE = 1,
  NATIVE_FLOW = 2,
}

export interface NativeFlowInfo {
  name?: string;
  paramsJson?: string;
}

export enum ButtonsMessageHeaderType {
  UNKNOWN = 0,
  EMPTY = 1,
  TEXT = 2,
  DOCUMENT = 3,
  IMAGE = 4,
  VIDEO = 5,
  LOCATION = 6,
}

export interface ListMessage {
  title?: string;
  description?: string;
  buttonText?: string;
  listType?: ListMessageListType;
  sections?: Section[];
  productListInfo?: ProductListInfo;
  footerText?: string;
  contextInfo?: ContextInfo;
}

export interface Section {
  title?: string;
  rows?: Row[];
}

export interface Row {
  title?: string;
  description?: string;
  rowId?: string;
}

export interface ProductListInfo {
  productSections?: ProductSection[];
  headerImage?: ImageMessage;
  businessOwnerJid?: string;
}

export interface ProductSection {
  title?: string;
  products?: ProductListItem[];
}

export interface ProductListItem {
  productId?: string;
}

export enum ListMessageListType {
  UNKNOWN = 0,
  SINGLE_SELECT = 1,
  PRODUCT_LIST = 2,
}

// Template and interactive response messages
export interface TemplateMessage {
  contextInfo?: ContextInfo;
  hydratedTemplate?: HydratedFourRowTemplate;
  templateId?: string;
  documentMessage?: DocumentMessage;
  imageMessage?: ImageMessage;
  videoMessage?: VideoMessage;
  locationMessage?: LocationMessage;
}

export interface HydratedFourRowTemplate {
  documentMessage?: DocumentMessage;
  imageMessage?: ImageMessage;
  videoMessage?: VideoMessage;
  locationMessage?: LocationMessage;
  title?: string;
  hydratedContentText?: string;
  hydratedFooterText?: string;
  hydratedButtons?: HydratedTemplateButton[];
  templateId?: string;
  mask?: string;
}

export interface HydratedTemplateButton {
  index?: number;
  quickReplyButton?: HydratedQuickReplyButton;
  urlButton?: HydratedURLButton;
  callButton?: HydratedCallButton;
}

export interface HydratedQuickReplyButton {
  displayText?: string;
  id?: string;
}

export interface HydratedURLButton {
  displayText?: string;
  url?: string;
}

export interface HydratedCallButton {
  displayText?: string;
  phoneNumber?: string;
}

// Response messages
export interface ButtonsResponseMessage {
  selectedButtonId?: string;
  contextInfo?: ContextInfo;
  type?: ButtonsResponseMessageType;
  selectedDisplayText?: string;
}

export enum ButtonsResponseMessageType {
  UNKNOWN = 0,
  DISPLAY_TEXT = 1,
}

export interface ListResponseMessage {
  title?: string;
  listType?: ListResponseMessageListType;
  singleSelectReply?: SingleSelectReply;
  contextInfo?: ContextInfo;
  description?: string;
}

export interface SingleSelectReply {
  selectedRowId?: string;
}

export enum ListResponseMessageListType {
  UNKNOWN = 0,
  SINGLE_SELECT = 1,
}

// Payment and order messages
export interface SendPaymentMessage {
  noteMessage?: Message;
  requestMessageKey?: MessageKey;
  background?: PaymentBackground;
}

export interface PaymentBackground {
  id?: string;
  fileEncSha256?: Uint8Array;
  directPath?: string;
  mediaKey?: Uint8Array;
  type?: PaymentBackgroundType;
  mediaKeyTimestamp?: number;
}

export enum PaymentBackgroundType {
  UNKNOWN = 0,
  DEFAULT = 1,
}

export interface RequestPaymentMessage {
  noteMessage?: Message;
  currencyCodeIso4217?: string;
  amount1000?: number;
  requestFrom?: string;
  expiryTimestamp?: number;
  background?: PaymentBackground;
}

export interface DeclinePaymentRequestMessage {
  key?: MessageKey;
}

export interface CancelPaymentRequestMessage {
  key?: MessageKey;
}

// Group invite message
export interface GroupInviteMessage {
  groupJid?: string;
  inviteCode?: string;
  inviteExpiration?: number;
  groupName?: string;
  jpegThumbnail?: Uint8Array;
  caption?: string;
  contextInfo?: ContextInfo;
}

// Poll message
export interface PollCreationMessage {
  name?: string;
  options?: PollOption[];
  selectableOptionsCount?: number;
  contextInfo?: ContextInfo;
}

export interface PollOption {
  optionName?: string;
}

export interface PollUpdateMessage {
  pollCreationMessageKey?: MessageKey;
  vote?: PollEncValue;
  metadata?: PollUpdateMetadata;
  senderTimestampMs?: number;
}

export interface PollEncValue {
  encPayload?: Uint8Array;
  encIv?: Uint8Array;
}

export interface PollUpdateMetadata {
  // Metadata about the poll update
}

// Chat and conversation messages
export interface Chat {
  displayName?: string;
  id?: string;
}

export interface Call {
  callKey?: Uint8Array;
  conversionSource?: string;
  conversionData?: Uint8Array;
  conversionDelaySeconds?: number;
}

// Main Message union type
export interface Message {
  // Text messages
  conversation?: string;
  extendedTextMessage?: ExtendedTextMessage;

  // Media messages
  imageMessage?: ImageMessage;
  videoMessage?: VideoMessage;
  audioMessage?: AudioMessage;
  documentMessage?: DocumentMessage;
  stickerMessage?: StickerMessage;

  // Location messages
  locationMessage?: LocationMessage;
  liveLocationMessage?: LiveLocationMessage;

  // Contact messages
  contactMessage?: ContactMessage;
  contactsArrayMessage?: ContactsArrayMessage;

  // Interactive messages
  buttonsMessage?: ButtonsMessage;
  listMessage?: ListMessage;
  templateMessage?: TemplateMessage;

  // Response messages
  buttonsResponseMessage?: ButtonsResponseMessage;
  listResponseMessage?: ListResponseMessage;

  // Payment messages
  sendPaymentMessage?: SendPaymentMessage;
  requestPaymentMessage?: RequestPaymentMessage;
  declinePaymentRequestMessage?: DeclinePaymentRequestMessage;
  cancelPaymentRequestMessage?: CancelPaymentRequestMessage;

  // Group messages
  groupInviteMessage?: GroupInviteMessage;

  // Poll messages
  pollCreationMessage?: PollCreationMessage;
  pollUpdateMessage?: PollUpdateMessage;

  // System messages
  protocolMessage?: ProtocolMessage;
  ephemeralMessage?: EphemeralMessage;
  viewOnceMessage?: ViewOnceMessage;
  reactionMessage?: ReactionMessage;
  stickerSyncRmrMessage?: StickerSyncRmrMessage;

  // Call messages
  call?: Call;
  chat?: Chat;

  // MessageContextInfo
  messageContextInfo?: MessageContextInfo;
}

// System and protocol messages
export interface ProtocolMessage {
  key?: MessageKey;
  type?: ProtocolMessageType;
  ephemeralExpiration?: number;
  ephemeralSettingTimestamp?: number;
  historySyncNotification?: HistorySyncNotification;
  appStateSyncKeyShare?: AppStateSyncKeyShare;
  appStateSyncKeyRequest?: AppStateSyncKeyRequest;
  initialSecurityNotificationSettingSync?: InitialSecurityNotificationSettingSync;
  appStateFatalExceptionNotification?: AppStateFatalExceptionNotification;
  disappearingMode?: DisappearingMode;
  editedMessage?: Message;
  timestampMs?: number;
  peerDataOperationRequestMessage?: PeerDataOperationRequestMessage;
  peerDataOperationRequestResponseMessage?: PeerDataOperationRequestResponseMessage;
}

export enum ProtocolMessageType {
  REVOKE = 0,
  EPHEMERAL_SETTING = 3,
  EPHEMERAL_SYNC_RESPONSE = 4,
  HISTORY_SYNC_NOTIFICATION = 5,
  APP_STATE_SYNC_KEY_SHARE = 6,
  APP_STATE_SYNC_KEY_REQUEST = 7,
  MSG_FANOUT_BACKFILL_REQUEST = 8,
  INITIAL_SECURITY_NOTIFICATION_SETTING_SYNC = 9,
  APP_STATE_FATAL_EXCEPTION_NOTIFICATION = 10,
  SHARE_PHONE_NUMBER = 11,
  MESSAGE_EDIT = 14,
  PEER_DATA_OPERATION_REQUEST_MESSAGE = 16,
  PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE = 17,
}

export interface EphemeralMessage {
  message?: Message;
}

export interface ViewOnceMessage {
  message?: Message;
}

export interface ReactionMessage {
  key?: MessageKey;
  text?: string;
  groupingKey?: string;
  senderTimestampMs?: number;
  unread?: boolean;
}

export interface StickerSyncRmrMessage {
  filehash?: string[];
  rmrSource?: string;
  requestTimestamp?: number;
}

export interface MessageContextInfo {
  deviceListMetadata?: DeviceListMetadata;
  deviceListMetadataVersion?: number;
  messageSecret?: Uint8Array;
  paddingBytes?: Uint8Array;
  messageAddOnDurationInSecs?: number;
  botMessageInvoker?: BotMessageInvoker;
  botResponseCorrelationId?: string;
  botPluginType?: BotPluginType;
  botPluginReferenceIndex?: number;
  botPluginSearchProvider?: BotPluginSearchProvider;
  botPluginSearchUrl?: string;
  botPluginMaybeParentPluginType?: BotPluginType;
  botReelPluginThumbnailCdnUrl?: string;
  expiredBotResponseCorrelationId?: string;
}

export interface DeviceListMetadata {
  senderKeyHash?: Uint8Array;
  senderTimestamp?: number;
  senderKeyIndexes?: number[];
  recipientKeyHash?: Uint8Array;
  recipientTimestamp?: number;
  recipientKeyIndexes?: number[];
}

export interface BotMessageInvoker {
  // Bot message invoker details
}

export enum BotPluginType {
  REELS = 0,
  SEARCH = 1,
}

export enum BotPluginSearchProvider {
  BING = 0,
  GOOGLE = 1,
}

// Additional system notification types
export interface HistorySyncNotification {
  fileSha256?: Uint8Array;
  fileLength?: number;
  mediaKey?: Uint8Array;
  fileEncSha256?: Uint8Array;
  directPath?: string;
  syncType?: HistorySyncNotificationHistorySyncType;
  chunkOrder?: number;
  originalMessageId?: string;
  progress?: number;
  oldestMsgInChunkTimestampSec?: number;
  initialHistBootstrapInlinePayload?: Uint8Array;
  peerDataRequestSessionId?: string;
}

export enum HistorySyncNotificationHistorySyncType {
  INITIAL_BOOTSTRAP = 0,
  INITIAL_STATUS_V3 = 1,
  FULL = 2,
  RECENT = 3,
  PUSH_NAME = 4,
  NON_BLOCKING_DATA = 5,
  ON_DEMAND = 6,
}

export interface AppStateSyncKeyShare {
  keys?: AppStateSyncKey[];
}

export interface AppStateSyncKey {
  keyId?: AppStateSyncKeyId;
  keyData?: AppStateSyncKeyData;
}

export interface AppStateSyncKeyId {
  keyId?: Uint8Array;
}

export interface AppStateSyncKeyData {
  keyData?: Uint8Array;
  fingerprint?: AppStateSyncKeyFingerprint;
  timestamp?: number;
}

export interface AppStateSyncKeyFingerprint {
  rawId?: number;
  currentIndex?: number;
  deviceIndexes?: number[];
}

export interface AppStateSyncKeyRequest {
  keyIds?: AppStateSyncKeyId[];
}

export interface InitialSecurityNotificationSettingSync {
  securityNotificationEnabled?: boolean;
}

export interface AppStateFatalExceptionNotification {
  collectionNames?: string[];
  timestamp?: number;
}

export interface PeerDataOperationRequestMessage {
  peerDataOperationRequestType?: PeerDataOperationRequestType;
  requestId?: string;
}

export interface PeerDataOperationRequestResponseMessage {
  peerDataOperationResult?: PeerDataOperationRequestResponseMessagePeerDataOperationResult;
  stanzaId?: string;
}

export enum PeerDataOperationRequestType {
  UPLOAD_STICKER = 0,
  SEND_RECENT_STICKER_BOOTSTRAP = 1,
  GENERATE_LINK_PREVIEW = 2,
}

export enum PeerDataOperationRequestResponseMessagePeerDataOperationResult {
  SUCCESS = 0,
  NOT_AUTHORIZED = 1,
  NOT_FOUND = 2,
  THROTTLED = 3,
  UNKNOWN_ERROR = 4,
}

// Helper type to get the active message type
export type MessageContent =
  | { type: "text"; content: string }
  | { type: "extendedText"; content: ExtendedTextMessage }
  | { type: "image"; content: ImageMessage }
  | { type: "video"; content: VideoMessage }
  | { type: "audio"; content: AudioMessage }
  | { type: "document"; content: DocumentMessage }
  | { type: "sticker"; content: StickerMessage }
  | { type: "location"; content: LocationMessage }
  | { type: "liveLocation"; content: LiveLocationMessage }
  | { type: "contact"; content: ContactMessage }
  | { type: "contactsArray"; content: ContactsArrayMessage }
  | { type: "buttons"; content: ButtonsMessage }
  | { type: "list"; content: ListMessage }
  | { type: "template"; content: TemplateMessage }
  | { type: "buttonsResponse"; content: ButtonsResponseMessage }
  | { type: "listResponse"; content: ListResponseMessage }
  | { type: "groupInvite"; content: GroupInviteMessage }
  | { type: "poll"; content: PollCreationMessage }
  | { type: "pollUpdate"; content: PollUpdateMessage }
  | { type: "reaction"; content: ReactionMessage }
  | { type: "protocol"; content: ProtocolMessage }
  | { type: "ephemeral"; content: EphemeralMessage }
  | { type: "viewOnce"; content: ViewOnceMessage };

// Utility function to extract message content and type
export function getMessageContent(message: Message): MessageContent | null {
  if (message.conversation) {
    return { type: "text", content: message.conversation };
  }
  if (message.extendedTextMessage) {
    return { type: "extendedText", content: message.extendedTextMessage };
  }
  if (message.imageMessage) {
    return { type: "image", content: message.imageMessage };
  }
  if (message.videoMessage) {
    return { type: "video", content: message.videoMessage };
  }
  if (message.audioMessage) {
    return { type: "audio", content: message.audioMessage };
  }
  if (message.documentMessage) {
    return { type: "document", content: message.documentMessage };
  }
  if (message.stickerMessage) {
    return { type: "sticker", content: message.stickerMessage };
  }
  if (message.locationMessage) {
    return { type: "location", content: message.locationMessage };
  }
  if (message.liveLocationMessage) {
    return { type: "liveLocation", content: message.liveLocationMessage };
  }
  if (message.contactMessage) {
    return { type: "contact", content: message.contactMessage };
  }
  if (message.contactsArrayMessage) {
    return { type: "contactsArray", content: message.contactsArrayMessage };
  }
  if (message.buttonsMessage) {
    return { type: "buttons", content: message.buttonsMessage };
  }
  if (message.listMessage) {
    return { type: "list", content: message.listMessage };
  }
  if (message.templateMessage) {
    return { type: "template", content: message.templateMessage };
  }
  if (message.buttonsResponseMessage) {
    return { type: "buttonsResponse", content: message.buttonsResponseMessage };
  }
  if (message.listResponseMessage) {
    return { type: "listResponse", content: message.listResponseMessage };
  }
  if (message.groupInviteMessage) {
    return { type: "groupInvite", content: message.groupInviteMessage };
  }
  if (message.pollCreationMessage) {
    return { type: "poll", content: message.pollCreationMessage };
  }
  if (message.pollUpdateMessage) {
    return { type: "pollUpdate", content: message.pollUpdateMessage };
  }
  if (message.reactionMessage) {
    return { type: "reaction", content: message.reactionMessage };
  }
  if (message.protocolMessage) {
    return { type: "protocol", content: message.protocolMessage };
  }
  if (message.ephemeralMessage) {
    return { type: "ephemeral", content: message.ephemeralMessage };
  }
  if (message.viewOnceMessage) {
    return { type: "viewOnce", content: message.viewOnceMessage };
  }

  return null;
}
