import { BaseClient } from "../client.js";
import { RequestOptions } from "../types/common.js";
import { NewsletterListResponse } from "../types/newsletter.js";

export class NewsletterModule extends BaseClient {
  /**
   * List all subscribed newsletters
   */
  async list(options?: RequestOptions): Promise<NewsletterListResponse> {
    return this.get<NewsletterListResponse>("/newsletter/list", options);
  }
}
