import { BaseClient, WuzapiError } from "../client.js";
import { RequestOptions, WuzapiResponse } from "../types/common.js";
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
import { createReadStream, statSync } from "fs";
import FormData from "form-data";
import { DEFAULT_TIMEOUT_MS, DEFAULT_UPLOAD_TIMEOUT_MS } from "../client.js";
import type { MediaRef } from "../types/chat.js";

/**
 * A ref is only usable if every identifier is present. A partial ref is
 * treated as absent so the caller falls back to a normal upload, which always
 * produces a valid message.
 */
export function isCompleteMediaRef(ref?: MediaRef): ref is MediaRef {
  return (
    !!ref &&
    !!ref.URL &&
    !!ref.DirectPath &&
    !!ref.MediaKey &&
    !!ref.FileEncSHA256 &&
    !!ref.FileSHA256 &&
    typeof ref.FileLength === "number" &&
    ref.FileLength > 0
  );
}

/**
 * Unwraps the WuzAPI response envelope.
 *
 * sendDocument builds its request by hand (multipart) instead of going through
 * BaseClient.post, so it has to unwrap the envelope itself. Returning the raw
 * envelope here would make sendDocument the odd one out among the send methods
 * — and would hide MediaRef one level deeper than callers expect.
 */
function unwrap(envelope: WuzapiResponse<SendMessageResponse>): SendMessageResponse {
  if (!envelope?.success) {
    throw new WuzapiError(
      envelope?.code ?? 0,
      envelope?.error || "API request failed",
      envelope
    );
  }
  return envelope.data;
}

/**
 * Closes a stream that will not be consumed, releasing its file descriptor
 * and buffers immediately instead of waiting for GC.
 */
function destroyStream(stream?: NodeJS.ReadableStream): void {
  const destroyable = stream as { destroy?: () => void; destroyed?: boolean };
  if (destroyable?.destroy && !destroyable.destroyed) {
    destroyable.destroy();
  }
}

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
    const token = options?.token || this.config.token;
    if (!token) {
      throw new Error("No authentication token provided.");
    }

    const form = new FormData();
    const contentType = request.MimeType || "application/octet-stream";

    form.append("Phone", request.Phone);
    form.append("FileName", request.FileName);

    // A complete MediaRef means the file is already on WhatsApp's servers, so
    // nothing is read from disk and nothing is uploaded — the request carries
    // only the identifiers. This is what makes re-sending a large document
    // cost the same as sending a text message.
    if (isCompleteMediaRef(request.MediaRef)) {
      form.append("MediaRef", JSON.stringify(request.MediaRef));
      if (request.Caption) form.append("Caption", request.Caption);
      if (request.MimeType) form.append("MimeType", request.MimeType);

      const response = await this.axios.post<WuzapiResponse<SendMessageResponse>>(
        "/chat/send/document",
        form,
        {
          headers: { ...form.getHeaders(), Token: token },
          timeout: request.TimeoutMs ?? this.config.timeout ?? DEFAULT_TIMEOUT_MS,
        }
      );
      return unwrap(response.data);
    }

    if (!request.Document) {
      throw new Error(
        "sendDocument requires either Document or a complete MediaRef."
      );
    }

    // A file path is streamed from disk rather than read into memory.
    //
    // The previous readFileSync meant a 200MB document became a 200MB Buffer,
    // which form-data then copied again while encoding the multipart body —
    // roughly 400MB of peak memory for a single send, all of it Buffer memory
    // that lives outside the V8 heap and so does not trigger GC pressure.
    // Streaming keeps the peak at the stream's own high-water mark.
    let stream: NodeJS.ReadableStream | undefined;

    const document = request.Document;

    if (typeof document === "string") {
      const stats = statSync(document);
      stream = createReadStream(document, {
        highWaterMark: 64 * 1024,
      });
      form.append("Document", stream, {
        filename: request.FileName,
        contentType,
        // Without knownLength, form-data buffers the whole stream just to
        // compute Content-Length — which would undo the streaming entirely.
        knownLength: stats.size,
      });
    } else if (Buffer.isBuffer(document)) {
      form.append("Document", document, {
        filename: request.FileName,
        contentType,
        knownLength: document.length,
      });
    } else {
      // Caller-provided stream: length is unknown, so form-data falls back to
      // chunked encoding.
      stream = document;
      form.append("Document", stream, {
        filename: request.FileName,
        contentType,
      });
    }

    if (request.Caption) {
      form.append("Caption", request.Caption);
    }

    if (request.MimeType) {
      form.append("MimeType", request.MimeType);
    }

    // For ContextInfo, if needed, but since it's multipart, perhaps serialize
    // Assuming ContextInfo is optional and can be appended as JSON string if needed

    const headers: Record<string, string> = {
      ...form.getHeaders(),
      Token: token,
    };

    try {
      const response = await this.axios.post<WuzapiResponse<SendMessageResponse>>(
        "/chat/send/document",
        form,
        {
          headers,
          // Uploads are far slower than API calls and need their own budget,
          // otherwise the instance timeout aborts every large document.
          timeout:
            request.TimeoutMs ??
            this.config.uploadTimeout ??
            DEFAULT_UPLOAD_TIMEOUT_MS,
          // Required for the upload to actually stream.
          //
          // With any other value axios routes the request through
          // follow-redirects, which pushes every written chunk into an
          // in-memory array so it can replay the body if the server redirects.
          // That buffers the entire file regardless of how it was passed in,
          // defeating the streaming above. maxRedirects: 0 makes axios use the
          // plain http/https transport, which pipes straight to the socket.
          maxRedirects: 0,
          // The body is a stream; these stop axios from trying to measure or
          // buffer it in order to enforce a limit.
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      return unwrap(response.data);
    } catch (error) {
      // On failure axios abandons the body mid-flight. An undestroyed read
      // stream keeps its file descriptor and buffers alive until GC — over
      // many failed sends that leaks descriptors.
      destroyStream(stream);
      throw error;
    }
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
