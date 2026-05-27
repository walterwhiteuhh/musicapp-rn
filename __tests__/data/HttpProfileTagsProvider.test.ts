import { HttpProfileTagsProvider } from '@/data/profileTags';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
import type { TasteProfile } from '@/domain/taste';

const profile: TasteProfile = {
  schemaVersion: 1,
  genres: ['Techno', 'Ambient'],
  contexts: ['Club'],
  dimensions: {
    energy: 70,
    density: 55,
    texture: 60,
    space: 45,
    rhythm: 80,
  },
  suggestedArtists: ['Ben Klock'],
  selectedArtists: ['Ben Klock'],
  lineageWeights: {
    'Berlin hypnotic': 1,
  },
  artistAnchorWeights: {
    'Ben Klock': 1,
  },
  discoveryDepth: createInitialDiscoveryDepth(0),
  calibration: {
    onboardingWeight: 1,
    behaviorWeight: 0,
    confidence: 0,
    interactionCount: 0,
  },
  completedAt: '2026-05-26T10:00:00.000Z',
  updatedAt: '2026-05-26T10:00:00.000Z',
};

describe('HttpProfileTagsProvider', () => {
  it('posts a minimized profile snapshot and parses the summary', async () => {
    const fetchImpl = jest.fn<Promise<Response>, [string, RequestInit?]>(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            schemaVersion: 1,
            primaryEnergy: 'high',
            rhythmBias: 'Direct club rhythm',
            listeningIntent: 'Peak-time discovery',
            discoveryVector: ['hypnotic', 'percussive'],
            profileNotes: ['Energy-led profile'],
            confidence: 0.74,
          }),
          { status: 200 },
        ),
      ),
    );

    const provider = new HttpProfileTagsProvider({
      endpoint: '/api/profile-tags',
      fetchImpl,
    });

    await expect(provider.generateTags(profile)).resolves.toMatchObject({
      primaryEnergy: 'high',
      confidence: 0.74,
    });

    const init = fetchImpl.mock.calls[0]?.[1];
    expect(init).toBeDefined();
    const body = JSON.parse(String(init?.body));
    expect(body).not.toHaveProperty('completedAt');
    expect(body).not.toHaveProperty('suggestedArtists');
    expect(body.selectedArtists).toEqual(['Ben Klock']);
  });

  it('throws when the endpoint fails', async () => {
    const provider = new HttpProfileTagsProvider({
      endpoint: '/api/profile-tags',
      fetchImpl: jest.fn(() => Promise.resolve(new Response('{}', { status: 502 }))),
    });

    await expect(provider.generateTags(profile)).rejects.toThrow('status 502');
  });
});
