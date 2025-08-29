import axios, { AxiosInstance, AxiosResponse } from "axios";
import { WuzapiConfig, WuzapiResponse } from "./types/common.js";

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

  constructor(config: WuzapiConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: config.token,
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
          // Request was made but no response received
          throw new WuzapiError(0, "Network error: No response from server");
        } else {
          // Something else happened
          throw new WuzapiError(0, error.message);
        }
      }
    );
  }

  protected async request<T>(
    method: "GET" | "POST" | "DELETE",
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const response = await this.axios.request<WuzapiResponse<T>>({
      method,
      url: endpoint,
      data,
    });

    if (!response.data.success) {
      throw new WuzapiError(
        response.data.code,
        "API request failed",
        response.data
      );
    }

    return response.data.data;
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }
}
