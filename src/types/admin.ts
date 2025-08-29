import { ProxyConfig, S3Config } from "./common.js";

// Admin endpoints types

export interface User {
  id: number;
  name: string;
  token: string;
  webhook: string;
  jid: string;
  qrcode: string;
  connected: boolean;
  expiration: number;
  events: string;
}

export interface CreateUserRequest {
  name: string;
  token: string;
  webhook?: string;
  events: string;
  expiration?: number;
  proxyConfig?: ProxyConfig;
  s3Config?: S3Config;
}

export interface CreateUserResponse {
  id: number;
}

export interface DeleteUserResponse {
  Details: string;
}
