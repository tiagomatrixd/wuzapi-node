// Group endpoints types

export interface GroupParticipant {
  IsAdmin: boolean;
  IsSuperAdmin: boolean;
  JID: string;
}

export interface GroupInfo {
  AnnounceVersionID: string;
  DisappearingTimer: number;
  GroupCreated: string;
  IsAnnounce: boolean;
  IsEphemeral: boolean;
  IsLocked: boolean;
  JID: string;
  Name: string;
  NameSetAt: string;
  NameSetBy: string;
  OwnerJID: string;
  ParticipantVersionID: string;
  Participants: GroupParticipant[];
  Topic: string;
  TopicID: string;
  TopicSetAt: string;
  TopicSetBy: string;
}

export interface GroupListResponse {
  Groups: GroupInfo[];
}

export interface GroupInviteLinkRequest {
  GroupJID: string;
}

export interface GroupInviteLinkResponse {
  InviteLink: string;
}

export interface GroupInfoRequest {
  GroupJID: string;
}

export interface GroupPhotoRequest {
  GroupJID: string;
  Image: string; // base64 encoded JPEG
}

export interface GroupPhotoResponse {
  Details: string;
  PictureID: string;
}

export interface GroupNameRequest {
  GroupJID: string;
  Name: string;
}

export interface GroupNameResponse {
  Details: string;
}

export interface GroupCreateRequest {
  Name: string;
  Participants: string[];
}

export type GroupCreateResponse = GroupInfo;

export interface GroupLockedRequest {
  GroupJID: string;
  Locked: boolean;
}

export interface GroupLockedResponse {
  Details: string;
}

export interface GroupEphemeralRequest {
  GroupJID: string;
  Duration: "24h" | "7d" | "90d" | "off";
}

export interface GroupEphemeralResponse {
  Details: string;
}

export interface GroupPhotoRemoveRequest {
  GroupJID: string;
}

export interface GroupPhotoRemoveResponse {
  Details: string;
}

export interface GroupLeaveRequest {
  GroupJID: string;
}

export interface GroupLeaveResponse {
  Details: string;
}

export interface GroupTopicRequest {
  GroupJID: string;
  Topic: string;
}

export interface GroupTopicResponse {
  Details: string;
}

export interface GroupAnnounceRequest {
  GroupJID: string;
  Announce: boolean;
}

export interface GroupAnnounceResponse {
  Details: string;
}

export interface GroupJoinRequest {
  Code: string;
}

export interface GroupJoinResponse {
  GroupJID: string;
  Details: string;
}

export interface GroupInviteInfoRequest {
  Code: string;
}

export interface GroupInviteInfoResponse {
  GroupJID: string;
  Name: string;
  Description: string;
  Subject: string;
  Owner: string;
  Creation: string;
  ParticipantsCount: number;
}

export interface GroupUpdateParticipantsRequest {
  GroupJID: string;
  Action: "add" | "remove" | "promote" | "demote";
  Participants: string[];
}

export interface ParticipantUpdate {
  JID: string;
  Status: string;
  Code: number;
}

export interface GroupUpdateParticipantsResponse {
  Updates: ParticipantUpdate[];
}
