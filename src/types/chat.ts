import { ContextInfo } from "./common.js";

// Chat endpoints types

export interface SendMessageResponse {
  Details: string;
  Id: string;
  Timestamp: string;
}

export interface SendTextRequest {
  Phone: string;
  Body: string;
  Id?: string;
  ContextInfo?: ContextInfo;
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
  ContextInfo?: ContextInfo;
}

export interface SendAudioRequest {
  Phone: string;
  Audio: string; // base64 encoded
  ContextInfo?: ContextInfo;
}

export interface SendImageRequest {
  Phone: string;
  Image: string; // base64 encoded
  Caption?: string;
  ContextInfo?: ContextInfo;
}

export interface SendDocumentRequest {
  Phone: string;
  Document: string; // base64 encoded
  FileName: string;
  ContextInfo?: ContextInfo;
}

export interface SendVideoRequest {
  Phone: string;
  Video: string; // base64 encoded
  Caption?: string;
  JpegThumbnail?: string;
  ContextInfo?: ContextInfo;
}

export interface SendStickerRequest {
  Phone: string;
  Sticker: string; // base64 encoded
  PngThumbnail?: string;
  ContextInfo?: ContextInfo;
}

export interface SendLocationRequest {
  Phone: string;
  Latitude: number;
  Longitude: number;
  Name?: string;
  ContextInfo?: ContextInfo;
}

export interface SendContactRequest {
  Phone: string;
  Name: string;
  Vcard: string;
  ContextInfo?: ContextInfo;
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
  MediaKey: string;
  Mimetype: string;
  FileSHA256: string;
  FileLength: number;
  FileEncSHA256?: string;
}

export interface DownloadMediaResponse {
  [key: string]: unknown; // Base64 encoded media data
}
