import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import {
  User,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
} from "../types/admin.js";

export class AdminModule extends BaseClient {
  /**
   * List all users
   */
  async listUsers(options?: RequestOptions): Promise<User[]> {
    return this.get<User[]>("/admin/users", options);
  }

  /**
   * Add a new user
   */
  async addUser(
    user: CreateUserRequest,
    options?: RequestOptions
  ): Promise<CreateUserResponse> {
    return this.post<CreateUserResponse>("/admin/users", user, options);
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(
    id: string,
    options?: RequestOptions
  ): Promise<DeleteUserResponse> {
    return this.delete<DeleteUserResponse>(`/admin/users/${id}`, options);
  }

  /**
   * Delete a user completely (full deletion) by ID
   */
  async deleteUserComplete(
    id: string,
    options?: RequestOptions
  ): Promise<DeleteUserResponse> {
    return this.delete<DeleteUserResponse>(`/admin/users/${id}/full`, options);
  }
}
