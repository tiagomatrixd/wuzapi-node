import { BaseClient } from "../client.js";
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
  async listUsers(): Promise<User[]> {
    return this.get<User[]>("/admin/users");
  }

  /**
   * Add a new user
   */
  async addUser(user: CreateUserRequest): Promise<CreateUserResponse> {
    return this.post<CreateUserResponse>("/admin/users", user);
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(id: number): Promise<DeleteUserResponse> {
    return this.delete<DeleteUserResponse>(`/admin/users/${id}`);
  }
}
