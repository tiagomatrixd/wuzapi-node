import { SimpleContextInfo } from "./common.js";

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
  Audio: string; // base64 encoded
  ContextInfo?: SimpleContextInfo;
}

export interface SendImageRequest {
  Phone: string;
  Image: string; // base64 encoded
  Caption?: string;
  ContextInfo?: SimpleContextInfo;
}

export interface SendDocumentRequest {
  Phone: string;
  Document: string; // base64 encoded
  FileName: string;
  ContextInfo?: SimpleContextInfo;
}

export interface SendVideoRequest {
  Phone: string;
  Video: string; // base64 encoded
  Caption?: string;
  JpegThumbnail?: string;
  ContextInfo?: SimpleContextInfo;
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
  MediaKey: string;
  Mimetype: string;
  FileSHA256: string;
  FileLength: number;
  FileEncSHA256?: string;
}

export interface DownloadMediaResponse {
  [key: string]: unknown; // Base64 encoded media data
}

export interface DeleteMessageRequest {
  Phone: string;
  Id: string;
  Remote?: boolean;
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
  Description?: string;
  RowId: string;
}

export interface ListSection {
  Title: string;
  Rows: ListItem[];
}

export interface SendListRequest {
  Phone: string;
  Body: string;
  Footer?: string;
  Title: string;
  ButtonText: string;
  Sections: ListSection[];
  ContextInfo?: SimpleContextInfo;
}

export interface ChatPollOption {
  Name: string;
}

export interface SendPollRequest {
  Phone: string;
  Name: string;
  Options: ChatPollOption[];
  SelectableCount?: number;
  ContextInfo?: SimpleContextInfo;
}

export interface EditMessageRequest {
  Phone: string;
  MessageId: string;
  NewText: string;
}
