import axios, { AxiosInstance, AxiosResponse } from "axios";
import http from "http";
import https from "https";
import {
  WuzapiConfig,
  WuzapiResponse,
  RequestOptions,
} from "./types/common.js";
import { logger } from "./utils/logger.js";

/** Default timeout for regular API calls. */
export const DEFAULT_TIMEOUT_MS = 60_000;

/** Default timeout for uploads, which are much slower than API calls. */
export const DEFAULT_UPLOAD_TIMEOUT_MS = 300_000;

const DEFAULT_MAX_SOCKETS = 25;

/**
 * Connection pools shared by every client instance.
 *
 * These are deliberately module-level rather than per-instance. Callers
 * commonly construct a client per message or per request (one token each),
 * and per-instance pools would multiply sockets and their buffers without
 * bound. Sharing them keeps the socket count flat no matter how many
 * short-lived client objects exist.
 */
let sharedHttpAgent: http.Agent | undefined;
let sharedHttpsAgent: https.Agent | undefined;

function getAgents(maxSockets: number): {
  httpAgent: http.Agent;
  httpsAgent: https.Agent;
} {
  if (!sharedHttpAgent || !sharedHttpsAgent) {
    const opts = {
      keepAlive: true,
      maxSockets,
      maxFreeSockets: Math.max(2, Math.floor(maxSockets / 5)),
      timeout: 65_000,
    };
    sharedHttpAgent = new http.Agent(opts);
    sharedHttpsAgent = new https.Agent(opts);
  }
  return { httpAgent: sharedHttpAgent, httpsAgent: sharedHttpsAgent };
}

/**
 * Destroys the shared connection pools. Useful on graceful shutdown, or in
 * tests, so lingering keep-alive sockets do not hold the process open.
 */
export function closeSharedAgents(): void {
  sharedHttpAgent?.destroy();
  sharedHttpsAgent?.destroy();
  sharedHttpAgent = undefined;
  sharedHttpsAgent = undefined;
}

export class WuzapiError extends Error {
  public code: number;
  public details?: unknown;

  constructor(code: number, message: string, details?: unknown) {
    super(message);
    this.name = "WuzapiError";
    this.code = code;
    this.details = details;
  }
}

export class BaseClient {
  protected axios: AxiosInstance;
  protected config: WuzapiConfig;
  protected defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(config: WuzapiConfig) {
    this.config = config;

    const { httpAgent, httpsAgent } = getAgents(
      config.maxSockets ?? DEFAULT_MAX_SOCKETS
    );

    this.axios = axios.create({
      baseURL: config.apiUrl,
      // A request with no timeout never fails — it just holds its socket and
      // closure forever if the server goes silent. That is a memory leak with
      // no error to trace it back to.
      timeout: config.timeout ?? DEFAULT_TIMEOUT_MS,
      httpAgent,
      httpsAgent,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const data = error.response.data;
          throw new WuzapiError(
            data.code || error.response.status,
            data.message || error.message,
            data
          );
        } else if (error.request) {
          // Request was made but no response received. Separate the timeout
          // case: reporting it as a generic network error hides the fact that
          // the server accepted the connection and then went silent, which is
          // the failure that actually needs investigating.
          if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
            throw new WuzapiError(
              408,
              `Request timed out after ${error.config?.timeout ?? "?"}ms: ${
                error.config?.url ?? "unknown endpoint"
              }`,
              { code: error.code }
            );
          }
          throw new WuzapiError(0, "Network error: No response from server");
        } else {
          // Something else happened
          throw new WuzapiError(0, error.message);
        }
      }
    );
  }

  /**
   * Resolve the token from request options or instance config
   * Throws an error if no token is available
   */
  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const token = options?.token || this.config.token;
    if (!token) {
      throw new WuzapiError(
        401,
        "No authentication token provided. Either set a token in the client config or provide one in the request options."
      );
    }
    if (options?.token) {
      return {
        ...this.defaultHeaders,
        Token: options.token,
      };
    }
    return {
      ...this.defaultHeaders,
      Token: token,
    };
  }

  protected async request<T>(
    method: "GET" | "POST" | "DELETE" | "PUT",
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const headers = this.buildHeaders(options);
    if (this.config.debug) {
      logger.request(`[${method}] ${endpoint}`, { headers, data });
    }

    const response = await this.axios.request<WuzapiResponse<T>>({
      method,
      url: endpoint,
      data,
      headers,
    });

    if (this.config.debug) {
      logger.response(`[${method}] ${endpoint}`, {
        status: response.status,
        data: response.data,
      });
    }

    if (!response.data.success) {
      throw new WuzapiError(
        response.data.code,
        "API request failed",
        response.data
      );
    }

    if (response.data.code <= 200 && response.data.code >= 300) {
      throw new WuzapiError(
        response.data.code,
        response.data.error || "API request failed",
        response.data
      );
    }

    return response.data.data;
  }

  protected async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, options);
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options);
  }

  protected async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }
}
