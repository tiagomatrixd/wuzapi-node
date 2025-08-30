// Common types used across all API modules

export interface WuzapiConfig {
  apiUrl: string;
  token: string;
}

export interface WuzapiResponse<T = unknown> {
  code: number;
  data: T;
  success: boolean;
}

export interface SimpleContextInfo {
  StanzaId: string;
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
