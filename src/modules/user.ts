import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  UserInfoRequest,
  UserInfoResponse,
  UserCheckRequest,
  UserCheckResponse,
  UserAvatarRequest,
  UserAvatarResponse,
  ContactsResponse,
  UserPresenceRequest,
  UserPresenceResponse,
} from "../types/user.js";

export class UserModule extends BaseClient {
  /**
   * Get user details for specified phone numbers
   */
  async getInfo(
    phones: string[],
    options?: RequestOptions
  ): Promise<UserInfoResponse> {
    const request: UserInfoRequest = { Phone: phones };
    return this.post<UserInfoResponse>("/user/info", request, options);
  }

  /**
   * Check if phone numbers are registered WhatsApp users
   */
  async check(
    phones: string[],
    options?: RequestOptions
  ): Promise<UserCheckResponse> {
    const request: UserCheckRequest = { Phone: phones };
    return this.post<UserCheckResponse>("/user/check", request, options);
  }

  /**
   * Get user avatar/profile picture
   */
  async getAvatar(
    phone: string,
    preview: boolean = true,
    options?: RequestOptions
  ): Promise<UserAvatarResponse> {
    const request: UserAvatarRequest = { Phone: phone, Preview: preview };
    return this.post<UserAvatarResponse>("/user/avatar", request, options);
  }

  /**
   * Get all contacts
   */
  async getContacts(options?: RequestOptions): Promise<ContactsResponse> {
    return this.get<ContactsResponse>("/user/contacts", options);
  }

  /**
   * Send user presence (available/unavailable status)
   */
  async sendPresence(
    presenceType: "available" | "unavailable",
    options?: RequestOptions
  ): Promise<UserPresenceResponse> {
    const request: UserPresenceRequest = { type: presenceType };
    return this.post<UserPresenceResponse>("/user/presence", request, options);
  }
}
