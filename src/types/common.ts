// Common types used across all API modules

export interface WuzapiConfig {
  apiUrl: string;
  token?: string;
  debug?: boolean;

  /**
   * Timeout (ms) for regular requests. Defaults to 60000.
   *
   * Without a timeout axios waits forever. If the WuzAPI server stops
   * responding, every pending call keeps its promise, closures and socket
   * alive — the caller slowly accumulates dead requests until it runs out of
   * memory, with no error ever surfacing.
   *
   * Set to 0 to disable (not recommended).
   */
  timeout?: number;

  /**
   * Timeout (ms) for file uploads, which are far slower than API calls.
   * Defaults to 300000 (5 min).
   */
  uploadTimeout?: number;

  /**
   * Max concurrent sockets per host for the shared connection pool.
   * Defaults to 25.
   */
  maxSockets?: number;
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
  StanzaID?: string;
  Participant?: string;
  mentionedJID?: string[];
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
