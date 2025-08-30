import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  GroupListResponse,
  GroupInviteLinkRequest,
  GroupInviteLinkResponse,
  GroupInfoRequest,
  GroupInfo,
  GroupPhotoRequest,
  GroupPhotoResponse,
  GroupNameRequest,
  GroupNameResponse,
  GroupCreateRequest,
  GroupCreateResponse,
  GroupLockedRequest,
  GroupLockedResponse,
  GroupEphemeralRequest,
  GroupEphemeralResponse,
  GroupPhotoRemoveRequest,
  GroupPhotoRemoveResponse,
} from "../types/group.js";

export class GroupModule extends BaseClient {
  /**
   * List all subscribed groups
   */
  async list(options?: RequestOptions): Promise<GroupListResponse> {
    return this.get<GroupListResponse>("/group/list", options);
  }

  /**
   * Get group invite link
   */
  async getInviteLink(
    groupJID: string,
    options?: RequestOptions
  ): Promise<GroupInviteLinkResponse> {
    const request: GroupInviteLinkRequest = { GroupJID: groupJID };
    return this.post<GroupInviteLinkResponse>(
      "/group/invitelink",
      request,
      options
    );
  }

  /**
   * Get group information
   */
  async getInfo(
    groupJID: string,
    options?: RequestOptions
  ): Promise<GroupInfo> {
    const request: GroupInfoRequest = { GroupJID: groupJID };
    return this.post<GroupInfo>("/group/info", request, options);
  }

  /**
   * Change group photo (JPEG only)
   */
  async setPhoto(
    groupJID: string,
    image: string,
    options?: RequestOptions
  ): Promise<GroupPhotoResponse> {
    const request: GroupPhotoRequest = { GroupJID: groupJID, Image: image };
    return this.post<GroupPhotoResponse>("/group/photo", request, options);
  }

  /**
   * Change group name
   */
  async setName(
    groupJID: string,
    name: string,
    options?: RequestOptions
  ): Promise<GroupNameResponse> {
    const request: GroupNameRequest = { GroupJID: groupJID, Name: name };
    return this.post<GroupNameResponse>("/group/name", request, options);
  }

  /**
   * Create a new group
   */
  async create(
    name: string,
    participants: string[],
    options?: RequestOptions
  ): Promise<GroupCreateResponse> {
    const request: GroupCreateRequest = { name, participants };
    return this.post<GroupCreateResponse>("/group/create", request, options);
  }

  /**
   * Set group locked status
   */
  async setLocked(
    groupJID: string,
    locked: boolean,
    options?: RequestOptions
  ): Promise<GroupLockedResponse> {
    const request: GroupLockedRequest = { groupjid: groupJID, locked };
    return this.post<GroupLockedResponse>("/group/locked", request, options);
  }

  /**
   * Set disappearing messages timer
   */
  async setEphemeral(
    groupJID: string,
    duration: "24h" | "7d" | "90d" | "off",
    options?: RequestOptions
  ): Promise<GroupEphemeralResponse> {
    const request: GroupEphemeralRequest = { groupjid: groupJID, duration };
    return this.post<GroupEphemeralResponse>(
      "/group/ephemeral",
      request,
      options
    );
  }

  /**
   * Remove group photo
   */
  async removePhoto(
    groupJID: string,
    options?: RequestOptions
  ): Promise<GroupPhotoRemoveResponse> {
    const request: GroupPhotoRemoveRequest = { groupjid: groupJID };
    return this.post<GroupPhotoRemoveResponse>(
      "/group/photo/remove",
      request,
      options
    );
  }
}
