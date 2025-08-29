import { BaseClient } from "../client.js";
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
  async list(): Promise<GroupListResponse> {
    return this.get<GroupListResponse>("/group/list");
  }

  /**
   * Get group invite link
   */
  async getInviteLink(groupJID: string): Promise<GroupInviteLinkResponse> {
    const request: GroupInviteLinkRequest = { GroupJID: groupJID };
    return this.post<GroupInviteLinkResponse>("/group/invitelink", request);
  }

  /**
   * Get group information
   */
  async getInfo(groupJID: string): Promise<GroupInfo> {
    const request: GroupInfoRequest = { GroupJID: groupJID };
    return this.post<GroupInfo>("/group/info", request);
  }

  /**
   * Change group photo (JPEG only)
   */
  async setPhoto(groupJID: string, image: string): Promise<GroupPhotoResponse> {
    const request: GroupPhotoRequest = { GroupJID: groupJID, Image: image };
    return this.post<GroupPhotoResponse>("/group/photo", request);
  }

  /**
   * Change group name
   */
  async setName(groupJID: string, name: string): Promise<GroupNameResponse> {
    const request: GroupNameRequest = { GroupJID: groupJID, Name: name };
    return this.post<GroupNameResponse>("/group/name", request);
  }

  /**
   * Create a new group
   */
  async create(
    name: string,
    participants: string[]
  ): Promise<GroupCreateResponse> {
    const request: GroupCreateRequest = { name, participants };
    return this.post<GroupCreateResponse>("/group/create", request);
  }

  /**
   * Set group locked status
   */
  async setLocked(
    groupJID: string,
    locked: boolean
  ): Promise<GroupLockedResponse> {
    const request: GroupLockedRequest = { groupjid: groupJID, locked };
    return this.post<GroupLockedResponse>("/group/locked", request);
  }

  /**
   * Set disappearing messages timer
   */
  async setEphemeral(
    groupJID: string,
    duration: "24h" | "7d" | "90d" | "off"
  ): Promise<GroupEphemeralResponse> {
    const request: GroupEphemeralRequest = { groupjid: groupJID, duration };
    return this.post<GroupEphemeralResponse>("/group/ephemeral", request);
  }

  /**
   * Remove group photo
   */
  async removePhoto(groupJID: string): Promise<GroupPhotoRemoveResponse> {
    const request: GroupPhotoRemoveRequest = { groupjid: groupJID };
    return this.post<GroupPhotoRemoveResponse>("/group/photo/remove", request);
  }
}
