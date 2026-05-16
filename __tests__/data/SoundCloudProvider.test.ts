import { MusicProviderError } from '@/domain/music/MusicProviderError';
import { SoundCloudProvider, mapSoundCloudTrack } from '@/data/music/SoundCloudProvider';

describe('SoundCloudProvider', () => {
  it('maps SoundCloud tracks into the public Track model', () => {
    expect(
      mapSoundCloudTrack({
        id: 123,
        title: 'Signal',
        duration: 180000,
        artwork_url: 'https://images.example/signal.jpg',
        user: {
          username: 'Waveform',
        },
      }),
    ).toEqual({
      id: '123',
      title: 'Signal',
      artistName: 'Waveform',
      artworkUrl: 'https://images.example/signal.jpg',
      durationMs: 180000,
      source: 'soundcloud',
    });
  });

  it('uses bearer auth when a token provider is configured', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    const provider = new SoundCloudProvider({
      baseUrl: 'https://api.soundcloud.com',
      getAccessToken: async () => 'token-123',
      fetchImpl,
    });

    await provider.searchTracks('ambient');

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.soundcloud.com/tracks?q=ambient&limit=25',
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token-123',
        },
      },
    );
  });

  it('normalizes unauthorized responses', async () => {
    const provider = new SoundCloudProvider({
      baseUrl: 'https://api.soundcloud.com',
      fetchImpl: jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      }),
    });

    await expect(provider.searchTracks('ambient')).rejects.toMatchObject<Partial<MusicProviderError>>({
      kind: 'unauthorized',
      status: 401,
    });
  });

  it('rejects unexpected payloads', async () => {
    const provider = new SoundCloudProvider({
      baseUrl: 'https://api.soundcloud.com',
      fetchImpl: jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ collection: [] }),
      }),
    });

    await expect(provider.searchTracks('ambient')).rejects.toMatchObject<Partial<MusicProviderError>>({
      kind: 'invalid-response',
    });
  });
});
