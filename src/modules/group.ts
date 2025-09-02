import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  GroupListResponse,
  GroupInviteLinkResponse,
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
  GroupLeaveRequest,
  GroupLeaveResponse,
  GroupTopicRequest,
  GroupTopicResponse,
  GroupAnnounceRequest,
  GroupAnnounceResponse,
  GroupJoinRequest,
  GroupJoinResponse,
  GroupInviteInfoRequest,
  GroupInviteInfoResponse,
  GroupUpdateParticipantsRequest,
  GroupUpdateParticipantsResponse,
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
    reset: boolean = false,
    options?: RequestOptions
  ): Promise<GroupInviteLinkResponse> {
    const params = `groupJID=${encodeURIComponent(groupJID)}&reset=${reset}`;
    return this.get<GroupInviteLinkResponse>(
      `/group/invitelink?${params}`,
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
    const params = `groupJID=${encodeURIComponent(groupJID)}`;
    return this.get<GroupInfo>(`/group/info?${params}`, options);
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
    const request: GroupCreateRequest = {
      Name: name,
      Participants: participants,
    };
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
    const request: GroupLockedRequest = { GroupJID: groupJID, Locked: locked };
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
    const request: GroupEphemeralRequest = {
      GroupJID: groupJID,
      Duration: duration,
    };
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
    const request: GroupPhotoRemoveRequest = { GroupJID: groupJID };
    return this.post<GroupPhotoRemoveResponse>(
      "/group/photo/remove",
      request,
      options
    );
  }

  /**
   * Leave a group
   */
  async leave(
    groupJID: string,
    options?: RequestOptions
  ): Promise<GroupLeaveResponse> {
    const request: GroupLeaveRequest = { GroupJID: groupJID };
    return this.post<GroupLeaveResponse>("/group/leave", request, options);
  }

  /**
   * Set group topic/description
   */
  async setTopic(
    groupJID: string,
    topic: string,
    options?: RequestOptions
  ): Promise<GroupTopicResponse> {
    const request: GroupTopicRequest = { GroupJID: groupJID, Topic: topic };
    return this.post<GroupTopicResponse>("/group/topic", request, options);
  }

  /**
   * Set group announcement setting (only admins can send messages)
   */
  async setAnnounce(
    groupJID: string,
    announce: boolean,
    options?: RequestOptions
  ): Promise<GroupAnnounceResponse> {
    const request: GroupAnnounceRequest = {
      GroupJID: groupJID,
      Announce: announce,
    };
    return this.post<GroupAnnounceResponse>(
      "/group/announce",
      request,
      options
    );
  }

  /**
   * Join a group using invite link
   */
  async join(
    inviteCode: string,
    options?: RequestOptions
  ): Promise<GroupJoinResponse> {
    const request: GroupJoinRequest = { Code: inviteCode };
    return this.post<GroupJoinResponse>("/group/join", request, options);
  }

  /**
   * Get group invite information
   */
  async getInviteInfo(
    inviteCode: string,
    options?: RequestOptions
  ): Promise<GroupInviteInfoResponse> {
    const request: GroupInviteInfoRequest = { Code: inviteCode };
    return this.post<GroupInviteInfoResponse>(
      "/group/inviteinfo",
      request,
      options
    );
  }

  /**
   * Update group participants (add/remove/promote/demote)
   */
  async updateParticipants(
    groupJID: string,
    action: "add" | "remove" | "promote" | "demote",
    participants: string[],
    options?: RequestOptions
  ): Promise<GroupUpdateParticipantsResponse> {
    const request: GroupUpdateParticipantsRequest = {
      GroupJID: groupJID,
      Action: action,
      Participants: participants,
    };
    return this.post<GroupUpdateParticipantsResponse>(
      "/group/updateparticipants",
      request,
      options
    );
  }
}
