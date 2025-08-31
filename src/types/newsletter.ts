// Newsletter endpoints types

export interface Newsletter {
  ID: string;
  Name: string;
  Description: string;
  ThreadJID: string;
  InviteCode: string;
  CreationTime: number;
  Handle: string;
  State: string;
  ViewerMetadata: {
    View: string;
    Mute: string;
  };
}

export interface NewsletterListResponse {
  Newsletters: Newsletter[];
}
