// User endpoints types

export interface UserInfoRequest {
  Phone: string[];
}

export interface VerifiedName {
  Certificate: {
    details: string;
    signature: string;
  };
  Details: {
    issuer: string;
    serial: number;
    verifiedName: string;
  };
}

export interface UserInfo {
  Devices: string[];
  PictureID: string;
  Status: string;
  VerifiedName: VerifiedName | null;
}

export interface UserInfoResponse {
  Users: Record<string, UserInfo>;
}

export interface UserCheckRequest {
  Phone: string[];
}

export interface UserCheck {
  IsInWhatsapp: boolean;
  JID: string;
  Query: string;
  VerifiedName: string;
}

export interface UserCheckResponse {
  Users: UserCheck[];
}

export interface UserAvatarRequest {
  Phone: string;
  Preview: boolean;
}

export interface UserAvatarResponse {
  URL: string;
  ID: string;
  Type: string;
  DirectPath: string;
}

export interface Contact {
  BusinessName: string;
  FirstName: string;
  Found: boolean;
  FullName: string;
  PushName: string;
}

export interface ContactsResponse {
  [jid: string]: Contact;
}
