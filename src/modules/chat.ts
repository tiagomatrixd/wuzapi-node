import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
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
  DeleteMessageRequest,
  DeleteMessageResponse,
  SendButtonsRequest,
  SendListRequest,
  SendPollRequest,
  EditMessageRequest,
  ListSection,
  SendInteractiveRequest,
} from "../types/chat.js";
import { readFileSync } from "fs";
import FormData from "form-data";

export class ChatModule extends BaseClient {
  /**
   * Send a text message
   */
  async sendText(
    request: SendTextRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/text", request, options);
  }

  /**
   * Send a template message with buttons
   */
  async sendTemplate(
    request: SendTemplateRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/template",
      request,
      options
    );
  }

  /**
   * Send an audio message
   */
  async sendAudio(
    request: SendAudioRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/audio", request, options);
  }

  /**
   * Send an image message
   */
  async sendImage(
    request: SendImageRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/image", request, options);
  }

  /**
   * Send a document message
   */
  async sendDocument(
    request: SendDocumentRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    const form = new FormData();

    form.append('Phone', request.Phone);
    form.append('FileName', request.FileName);

    let fileBuffer: Buffer;
    if (typeof request.Document === 'string') {
      fileBuffer = readFileSync(request.Document);
    } else {
      fileBuffer = request.Document;
    }

    form.append('Document', fileBuffer, {
      filename: request.FileName,
      contentType: request.MimeType || 'application/octet-stream'
    });

    if (request.Caption) {
      form.append('Caption', request.Caption);
    }

    if (request.MimeType) {
      form.append('MimeType', request.MimeType);
    }

    // For ContextInfo, if needed, but since it's multipart, perhaps serialize
    // Assuming ContextInfo is optional and can be appended as JSON string if needed

    const token = options?.token || this.config.token;
    if (!token) {
      throw new Error("No authentication token provided.");
    }
    const headers: Record<string, string> = {
      ...form.getHeaders(),
      Token: token,
    };

    const response = await this.axios.post<SendMessageResponse>(
      "/chat/send/document",
      form,
      { headers }
    );

    return response.data;
  }

  /**
   * Send a video message
   */
  async sendVideo(
    request: SendVideoRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/send/video", request, options);
  }

  /**
   * Send a sticker message
   */
  async sendSticker(
    request: SendStickerRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/sticker",
      request,
      options
    );
  }

  /**
   * Send a location message
   */
  async sendLocation(
    request: SendLocationRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/location",
      request,
      options
    );
  }

  /**
   * Send a contact message
   */
  async sendContact(
    request: SendContactRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/contact",
      request,
      options
    );
  }

  /**
   * Send chat presence indication (typing indicator)
   */
  async sendPresence(
    request: ChatPresenceRequest,
    options?: RequestOptions
  ): Promise<void> {
    await this.post<void>("/chat/presence", request, options);
  }

  /**
   * Mark messages as read
   */
  async markRead(
    request: MarkReadRequest,
    options?: RequestOptions
  ): Promise<void> {
    await this.post<void>("/chat/markread", request, options);
  }

  /**
   * React to a message
   */
  async react(
    request: ReactRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/chat/react", request, options);
  }

  /**
   * Download an image from a message
   */
  async downloadImage(
    request: DownloadMediaRequest,
    options?: RequestOptions
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>(
      "/chat/downloadimage",
      request,
      options
    );
  }

  /**
   * Download a video from a message
   */
  async downloadVideo(
    request: DownloadMediaRequest,
    options?: RequestOptions
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>(
      "/chat/downloadvideo",
      request,
      options
    );
  }

  /**
   * Download an audio from a message
   */
  async downloadAudio(
    request: DownloadMediaRequest,
    options?: RequestOptions
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>(
      "/chat/downloadaudio",
      request,
      options
    );
  }

  /**
   * Download a document from a message
   */
  async downloadDocument(
    request: DownloadMediaRequest,
    options?: RequestOptions
  ): Promise<DownloadMediaResponse> {
    return this.post<DownloadMediaResponse>(
      "/chat/downloaddocument",
      request,
      options
    );
  }

  /**
   * Delete a message to everyone
   */
  async deleteMessage(
   request: DeleteMessageRequest,
    options?: RequestOptions
  ): Promise<DeleteMessageResponse> {
    
    return this.post<DeleteMessageResponse>("/chat/delete", request, options);
  }

  /**
   * Send interactive buttons message
   */
  async sendButtons(
    request: SendButtonsRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/buttons",
      request,
      options
    );
  }

  /**
   * Send list message
   */
  async sendList(
    phone: string,
    buttonText: string,
    description: string,
    topText: string,
    sections?: ListSection[],
    footerText?: string,
    id?: string,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    const request: SendListRequest = {
      Phone: phone,
      ButtonText: buttonText,
      Desc: description,
      TopText: topText,
      Sections: sections,
      FooterText: footerText,
      Id: id,
    };
    return this.post<SendMessageResponse>("/chat/send/list", request, options);
  }

  /**
   * Send poll message
   */
  async sendPoll(
    groupJID: string,
    header: string,
    options: string[],
    id?: string,
    requestOptions?: RequestOptions
  ): Promise<SendMessageResponse> {
    const request: SendPollRequest = {
      Group: groupJID,
      Header: header,
      Options: options,
      Id: id,
    };
    return this.post<SendMessageResponse>(
      "/chat/send/poll",
      request,
      requestOptions
    );
  }

  /**
   * Edit a message
   */
  async editMessage(
    messageId: string,
    phone: string,
    newBody: string,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    const request: EditMessageRequest = {
      Id: messageId,
      Phone: phone,
      Body: newBody,
    };
    return this.post<SendMessageResponse>("/chat/send/edit", request, options);
  }

  /**
   * Send interactive message with custom buttons and native flow support
   */
  async sendInteractive(
    request: SendInteractiveRequest,
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>(
      "/chat/send/interactive",
      request,
      options
    );
  }

  /**
   * Send interactive message with multiple menus
   */
  async sendMultiMenuInteractive(
    phone: string,
    message: string,
    title: string,
    menus: { title: string; buttons: { displayText: string; buttonID: string }[] }[],
    footer?: string,
    additionalNodes?: any[],
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    const request: SendInteractiveRequest = {
      phone,
      message,
      title,
      footer,
      menus,
      additionalNodes,
    };
    return this.sendInteractive(request, options);
  }
}
