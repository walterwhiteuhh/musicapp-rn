import { MusicProviderError } from '@/domain/music/MusicProviderError';
import type { MusicProvider } from '@/domain/music/MusicProvider';
import type { Track } from '@/domain/music/Track';

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
type AccessTokenProvider = () => Promise<string | null>;

type SoundCloudProviderOptions = {
  baseUrl: string;
  getAccessToken?: AccessTokenProvider;
  fetchImpl?: FetchLike;
  limit?: number;
};

export class SoundCloudProvider implements MusicProvider {
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly getAccessToken: AccessTokenProvider;
  private readonly limit: number;

  constructor({
    baseUrl,
    getAccessToken = async () => null,
    fetchImpl = fetch,
    limit = 25,
  }: SoundCloudProviderOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fetchImpl = fetchImpl;
    this.getAccessToken = getAccessToken;
    this.limit = limit;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const url = new URL(`${this.baseUrl}/tracks`);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', String(this.limit));

    const accessToken = await this.getAccessToken();
    const headers: HeadersInit = {
      Accept: 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let response: Response;

    try {
      response = await this.fetchImpl(url.toString(), { headers });
    } catch {
      throw new MusicProviderError('network', 'SoundCloud search request failed.');
    }

    if (response.status === 401 || response.status === 403) {
      throw new MusicProviderError(
        'unauthorized',
        'SoundCloud credentials were rejected.',
        response.status,
      );
    }

    if (response.status === 429) {
      throw new MusicProviderError('rate-limited', 'SoundCloud rate limit reached.', response.status);
    }

    if (!response.ok) {
      throw new MusicProviderError('network', 'SoundCloud returned an error.', response.status);
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      throw new MusicProviderError('invalid-response', 'SoundCloud returned an unexpected payload.');
    }

    return payload.map(mapSoundCloudTrack).filter((track): track is Track => track !== null);
  }
}

export function mapSoundCloudTrack(rawTrack: unknown): Track | null {
  if (!isRecord(rawTrack)) {
    return null;
  }

  const id = rawTrack.id;
  const title = rawTrack.title;
  const duration = rawTrack.duration;

  if ((typeof id !== 'string' && typeof id !== 'number') || typeof title !== 'string') {
    return null;
  }

  return {
    id: String(id),
    title,
    artistName: getArtistName(rawTrack.user),
    artworkUrl: typeof rawTrack.artwork_url === 'string' ? rawTrack.artwork_url : null,
    durationMs: typeof duration === 'number' ? duration : 0,
    source: 'soundcloud',
    externalUrl: typeof rawTrack.permalink_url === 'string' ? rawTrack.permalink_url : undefined,
  };
}

function getArtistName(user: unknown): string {
  if (!isRecord(user) || typeof user.username !== 'string' || !user.username.trim()) {
    return 'Unknown artist';
  }

  return user.username;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
