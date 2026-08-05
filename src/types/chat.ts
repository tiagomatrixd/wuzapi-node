import { SimpleContextInfo } from "./common.js";

// Chat endpoints types

/**
 * Identifiers WhatsApp returns after a file is uploaded.
 *
 * Uploading is the expensive half of sending media. WhatsApp keeps the
 * encrypted blob on its own servers for roughly 30 days, and a message only
 * needs these identifiers to point at it — not the bytes. Keep this object and
 * pass it back as `MediaRef` on a later send to skip the upload entirely.
 *
 * Binary fields are base64 strings. Treat the whole object as opaque: store it
 * and hand it back unchanged.
 *
 * Refs do expire. WhatsApp's retention is observed behaviour, not a contract —
 * when a send with a ref fails, discard it and send the file normally again.
 */
export interface MediaRef {
  URL: string;
  DirectPath: string;
  MediaKey: string;
  FileEncSHA256: string;
  FileSHA256: string;
  FileLength: number;
  Mimetype?: string;
  JPEGThumbnail?: string;
}

export interface SendMessageResponse {
  Details: string;
  Id: string;
  Timestamp: string;
  /**
   * Present when the send uploaded media. Cache it to skip the upload next
   * time the same file is sent. Absent for text messages and for sends that
   * already reused a ref.
   */
  MediaRef?: MediaRef;
}

export interface SendTextRequest {
  Phone: string;
  Body: string;
  Id?: string;
  ContextInfo?: SimpleContextInfo;
}

export interface TemplateButton {
  DisplayText: string;
  Type: "quickreply" | "url" | "call";
  Url?: string;
  PhoneNumber?: string;
}

export interface SendTemplateRequest {
  Phone: string;
  Content: string;
  Footer?: string;
  Buttons: TemplateButton[];
  ContextInfo?: SimpleContextInfo;
}

export interface SendAudioRequest {
  Phone: string;
  Audio?: string; // base64 data URI; optional when MediaRef is supplied
  PPT?: boolean; // base64 encoded
  MimeType?: string;
  ContextInfo?: SimpleContextInfo;
  /**
   * Reuse a previously uploaded file instead of uploading again. When set and
   * complete, the `Audio` field is ignored and may be omitted.
   */
  MediaRef?: MediaRef;
}

export interface SendImageRequest {
  Phone: string;
  Image?: string; // base64 data URI; optional when MediaRef is supplied
  Caption?: string;
  ContextInfo?: SimpleContextInfo;
  /**
   * Reuse a previously uploaded file instead of uploading again. When set and
   * complete, the `Image` field is ignored and may be omitted.
   */
  MediaRef?: MediaRef;
}

export interface SendDocumentRequest {
  Phone: string;
  /**
   * File path (streamed from disk), a Buffer, or a readable stream.
   *
   * Prefer a path or a stream for large files: a Buffer means the whole file
   * sits in memory, and multipart encoding copies it again.
   *
   * Optional when MediaRef is supplied: nothing is read or uploaded then.
   */
  Document?: Buffer | string | NodeJS.ReadableStream;
  FileName: string;
  MimeType?: string;
  Caption?: string;
  ContextInfo?: SimpleContextInfo;
  /**
   * Overrides the client's uploadTimeout for this request (ms).
   */
  TimeoutMs?: number;
  /**
   * Reuse a previously uploaded file instead of uploading again. When set and
   * complete, `Document` is ignored and never read from disk — which is what
   * makes re-sending a large file cost nothing.
   */
  MediaRef?: MediaRef;
}

export interface SendVideoRequest {
  Phone: string;
  Video?: string; // base64 data URI; optional when MediaRef is supplied
  Caption?: string;
  JPEGThumbnail?: string;
  ContextInfo?: SimpleContextInfo;
  GifPlayback?: boolean;
  /**
   * Reuse a previously uploaded file instead of uploading again. When set and
   * complete, the `Video` field is ignored and may be omitted.
   */
  MediaRef?: MediaRef;
}

export interface SendStickerRequest {
  Phone: string;
  Sticker: string; // base64 encoded
  PngThumbnail?: string;
  ContextInfo?: SimpleContextInfo;
}

export interface SendLocationRequest {
  Phone: string;
  Latitude: number;
  Longitude: number;
  Name?: string;
  ContextInfo?: SimpleContextInfo;
}

export interface SendContactRequest {
  Phone: string;
  Name: string;
  Vcard: string;
  ContextInfo?: SimpleContextInfo;
}

export interface ChatPresenceRequest {
  Phone: string;
  State: "composing" | "paused";
  Media?: string;
}

export interface MarkReadRequest {
  Id: string[];
  Chat: string;
  Sender?: string;
}

export interface ReactRequest {
  Phone: string;
  Body: string;
  Id: string;
}

export interface DownloadMediaRequest {
  Url: string;
  DirectPath: string;
  MediaKey: string;
  Mimetype: string;
  FileEncSHA256: string;
  FileSHA256: string;
  FileLength: number;
}

export interface DownloadMediaResponse {
  [key: string]: unknown; // Base64 encoded media data
}

export interface DeleteMessageRequest {
  Phone: string;
  Id: string;
  Sender: string;
}

export interface DeleteMessageResponse {
  Details: string;
}

export interface ChatButton {
  ButtonId: string;
  ButtonText: {
    DisplayText: string;
  };
  Type: number;
}

export interface SendButtonsRequest {
  Phone: string;
  Body: string;
  Footer?: string;
  Buttons: ChatButton[];
  ContextInfo?: SimpleContextInfo;
}

export interface ListItem {
  Title: string;
  Desc?: string;
  RowId: string;
}

export interface ListRow {
    title: string;
    description: string;
    header?: string;
    id: string;
}

export interface ListSection {
    title: string;
    rows: ListRow[];
}

export interface ListMenuStructure {
    title: string;
    sections: ListSection[];
}

export interface SendListRequest {
  Phone: string;
  ButtonText: string;
  Desc: string;
  TopText: string;
  Sections?: ListSection[];
  List?: ListItem[]; // For compatibility
  FooterText?: string;
  Id?: string;
}

export interface ChatPollOption {
  Name: string;
}

export interface SendPollRequest {
  Group: string;
  Header: string;
  Options: string[];
  Id?: string;
}

export interface EditMessageRequest {
  Id: string;
  Phone: string;
  Body: string;
}

export interface InteractiveButton {
  displayText: string;
  buttonID: string;
}

export interface InteractiveMenu {
  title: string;
  buttons: InteractiveButton[];
}

export interface AdditionalNodeAttrs {
  [key: string]: any;
}

export interface AdditionalNodeContent {
  tag: string;
  attrs: AdditionalNodeAttrs;
  content?: AdditionalNodeContent[];
}

export interface AdditionalNode {
  tag: string;
  attrs: AdditionalNodeAttrs;
  content: AdditionalNodeContent[];
}

export interface SendInteractiveRequest {
    phone: string;
    message: string;
    title?: string;
    footer?: string;
    buttons?: InteractiveButton[];
    menus?: InteractiveMenu[];
    listMenu?: ListMenuStructure;
    additionalNodes?: AdditionalNode[];
}
