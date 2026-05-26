import {
  createProfileTagsRequest,
  parseProfileTagSummary,
  type ProfileTagSummary,
} from '@/domain/profileTags';
import type { ProfileTagsProvider } from '@/domain/profileTags';
import type { TasteProfile } from '@/domain/taste';

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

type HttpProfileTagsProviderOptions = {
  endpoint: string;
  fetchImpl?: FetchLike;
};

export class HttpProfileTagsProvider implements ProfileTagsProvider {
  private readonly endpoint: string;
  private readonly fetchImpl: FetchLike;

  constructor({ endpoint, fetchImpl = fetch }: HttpProfileTagsProviderOptions) {
    this.endpoint = endpoint;
    this.fetchImpl = fetchImpl;
  }

  async generateTags(profile: TasteProfile): Promise<ProfileTagSummary> {
    const response = await this.fetchImpl(this.endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createProfileTagsRequest(profile)),
    });

    if (!response.ok) {
      throw new Error(`Profile tag request failed with status ${response.status}.`);
    }

    return parseProfileTagSummary(await response.json());
  }
}
