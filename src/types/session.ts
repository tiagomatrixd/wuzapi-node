import { S3Config } from "./common.js";

// Session endpoints types

export interface ConnectRequest {
  Subscribe: string[];
  Immediate?: boolean;
}

export interface ConnectResponse {
  details: string;
  events: string;
  jid: string;
  webhook: string;
}

export interface DisconnectResponse {
  Details: string;
}

export interface LogoutResponse {
  Details: string;
}

export interface StatusResponse {
  Connected: boolean;
  LoggedIn: boolean;
}

export interface QRCodeResponse {
  QRCode: string;
}

export interface S3ConfigResponse extends S3Config {
  accessKey: string; // Will be masked in response
}

export interface S3TestResponse {
  Details: string;
  Bucket: string;
  Region: string;
}

export interface PairPhoneRequest {
  Phone: string;
  Code: string;
}

export interface PairPhoneResponse {
  Details: string;
}

export interface HistoryResponse {
  Details: string;
}

export interface ProxyRequest {
  Proxy: string;
}

export interface ProxyResponse {
  Details: string;
}
