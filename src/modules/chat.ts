import { BaseClient } from "../client.js";
import {
  SendMessageResponse,
  SendTextRequest,
  SendTemplateRequest,
  SendAudioRequest,
  SendImageRequest,
  SendDocumentRequest,
  SendVideoRequest,
  SendStickerRequest,
  SendLocationRequest,
  SendContactRequest,
  ChatPresenceRequest,
  MarkReadRequest,
  ReactRequest,
  DownloadMediaRequest,
  DownloadMediaResponse,
} from "../types/chat.js";

export class ChatModule extends BaseClient {
  /**
   * Send a text message
   */
  async sendText(request: SendTextRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/text", request);
  }

  /**
   * Send a template message with buttons
   */
  async sendTemplate(
    request: SendTemplateRequest
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/template", request);
  }

  /**
   * Send an audio message
   */
  async sendAudio(request: SendAudioRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/audio", request);
  }

  /**
   * Send an image message
   */
  async sendImage(request: SendImageRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/image", request);
  }

  /**
   * Send a document message
   */
  async sendDocument(
    request: SendDocumentRequest
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/document", request);
  }

  /**
   * Send a video message
   */
  async sendVideo(request: SendVideoRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/video", request);
  }

  /**
   * Send a sticker message
   */
  async sendSticker(request: SendStickerRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/sticker", request);
  }

  /**
   * Send a location message
   */
  async sendLocation(
    request: SendLocationRequest
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/location", request);
  }

  /**
   * Send a contact message
   */
  async sendContact(request: SendContactRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/contact", request);
  }

  /**
   * Send chat presence indication (typing indicator)
   */
  async sendPresence(request: ChatPresenceRequest): Promise<void> {
    await this.post<void>("/chat/presence", request);
  }

  /**
   * Mark messages as read
   */
  async markRead(request: MarkReadRequest): Promise<void> {
    await this.post<void>("/chat/markread", request);
  }

  /**
   * React to a message
   */
  async react(request: ReactRequest): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/react", request);
  }

  /**
   * Download an image from a message
   */
  async downloadImage(
    request: DownloadMediaRequest
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>("/chat/downloadimage", request);
  }

  /**
   * Download a video from a message
   */
  async downloadVideo(
    request: DownloadMediaRequest
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>("/chat/downloadvideo", request);
  }

  /**
   * Download an audio from a message
   */
  async downloadAudio(
    request: DownloadMediaRequest
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>("/chat/downloadaudio", request);
  }

  /**
   * Download a document from a message
   */
  async downloadDocument(
    request: DownloadMediaRequest
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>("/chat/downloaddocument", request);
  }
}
