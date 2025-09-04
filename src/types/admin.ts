// Admin endpoints types
import { S3ConfigResponse } from "./common.js";
import { WebhookEvent } from "./webhook.js";

export interface User {
  connected: boolean;
  events: WebhookEvent | string;
  expiration: number;
  id: string;
  jid: string;
  loggedIn: boolean;
  name: string;
  proxy_config: {
    enabled: boolean;
    proxy_url: string;
  };
  proxy_url: string;
  qrcode: string;
  s3_config: S3ConfigResponse;
  token: string;
  webhook: string;
}

export interface CreateUserRequest {
  name: string;
  token: string;
  webhook?: string;
  events?: string;
  proxyConfig?: {
    enabled: boolean;
    proxyURL: string;
  };
  s3Config?: {
    enabled: boolean;
    endpoint: string;
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    pathStyle: boolean;
    publicURL?: string;
    mediaDelivery: "base64" | "s3" | "both";
    retentionDays: number;
  };
}

export interface CreateUserResponse {
  id: string;
  name: string;
  token: string;
  webhook?: string;
  events?: string;
  proxy_config?: {
    enabled: boolean;
    proxy_url: string;
  };
  s3_config?: {
    enabled: boolean;
    endpoint: string;
    region: string;
    bucket: string;
    access_key: string;
    path_style: boolean;
    public_url: string;
    media_delivery: string;
    retention_days: number;
  };
}

export interface DeleteUserResponse {
  Details: string;
}
