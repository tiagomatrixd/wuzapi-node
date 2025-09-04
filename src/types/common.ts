// Common types used across all API modules

export interface WuzapiConfig {
  apiUrl: string;
  token?: string;
}

export interface RequestOptions {
  token?: string;
}

export interface WuzapiResponse<T = unknown> {
  code: number;
  data: T;
  success: boolean;
  error?: string;
}

export interface SimpleContextInfo {
  StanzaID: string;
  Participant: string;
}

export interface ProxyConfig {
  enabled: boolean;
  proxyURL: string;
}

export interface S3Config {
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
}

export interface S3ConfigResponse {
  access_key: string;
  bucket: string;
  enabled: boolean;
  endpoint: string;
  media_delivery?: "base64" | "s3" | "both";
  path_style?: boolean;
  public_url?: string;
  region?: string;
  retention_days?: number;
}
