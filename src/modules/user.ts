import { BaseClient } from "../client.js";
import {
  UserInfoRequest,
  UserInfoResponse,
  UserCheckRequest,
  UserCheckResponse,
  UserAvatarRequest,
  UserAvatarResponse,
  ContactsResponse,
} from "../types/user.js";

export class UserModule extends BaseClient {
  /**
   * Get user details for specified phone numbers
   */
  async getInfo(phones: string[]): Promise<UserInfoResponse> {
    const request: UserInfoRequest = { Phone: phones };
    return this.post<UserInfoResponse>("/user/info", request);
  }

  /**
   * Check if phone numbers are registered WhatsApp users
   */
  async check(phones: string[]): Promise<UserCheckResponse> {
    const request: UserCheckRequest = { Phone: phones };
    return this.post<UserCheckResponse>("/user/check", request);
  }

  /**
   * Get user avatar/profile picture
   */
  async getAvatar(
    phone: string,
    preview: boolean = true
  ): Promise<UserAvatarResponse> {
    const request: UserAvatarRequest = { Phone: phone, Preview: preview };
    return this.post<UserAvatarResponse>("/user/avatar", request);
  }

  /**
   * Get all contacts
   */
  async getContacts(): Promise<ContactsResponse> {
    return this.get<ContactsResponse>("/user/contacts");
  }
}
