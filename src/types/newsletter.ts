// Newsletter endpoints types

export interface Newsletter {
  id: string;
  state: {
    type: string;
  };
  thread_metadata: {
    creation_time: string;
    description?: {
      id: string;
      text: string;
      update_time: string;
    };
    invite: string;
    name: {
      id: string;
      text: string;
      update_time: string;
    };
    picture?: {
      direct_path: string;
      id: string;
      type: string;
      url: string;
    };
    preview?: {
      direct_path: string;
      id: string;
      type: string;
      url: string;
    };
    settings: {
      reaction_codes: {
        value: string;
      };
    };
    subscribers_count: string;
    verification: string;
  };
  viewer_metadata: {
    mute: string;
    role: string;
  };
}

export interface NewsletterListResponse {
  Newsletter: Newsletter[];
}
