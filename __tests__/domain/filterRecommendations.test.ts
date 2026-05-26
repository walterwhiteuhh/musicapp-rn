import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
import { filterRecommendations } from '@/domain/recommendations/filterRecommendations';
import type { TasteProfile } from '@/domain/taste/TasteProfile';

const baseProfile: TasteProfile = {
  schemaVersion: 1,
  genres: ['Melodic Techno', 'Progressive House'],
  contexts: ['Headphones'],
  dimensions: {
    energy: 25,
    density: 35,
    texture: 40,
    space: 85,
    rhythm: 35,
  },
  suggestedArtists: ['Ben Boehmer', 'NTO'],
  selectedArtists: ['Ben Boehmer'],
  lineageWeights: {
    'melodic techno / progressive': 1,
  },
  artistAnchorWeights: {
    'Ben Boehmer': 1,
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

describe('filterRecommendations', () => {
  it('scores tracks by completed profile genre, context, and dimensions', () => {
    expect(filterRecommendations(electronicRecommendationFixtures, baseProfile)[0]).toEqual(
      expect.objectContaining({
        title: 'Live above Cappadocia',
      }),
    );
  });

  it('weights selected and related artists as early profile anchors', () => {
    const [firstTrack] = filterRecommendations(electronicRecommendationFixtures, {
      ...baseProfile,
      genres: ['House'],
      contexts: ['Home'],
      selectedArtists: ['Paul Kalkbrenner'],
      dimensions: {
        energy: 58,
        density: 36,
        texture: 32,
        space: 58,
        rhythm: 28,
      },
    });

    expect(firstTrack).toEqual(
      expect.objectContaining({
        artistName: 'Paul Kalkbrenner',
      }),
    );
  });

  it('keeps source-rich festival and live-set metadata on recommendations', () => {
    const [firstTrack] = filterRecommendations(electronicRecommendationFixtures, baseProfile);

    expect(firstTrack.sourceLinks?.[0]).toEqual(
      expect.objectContaining({
        kind: 'live-set',
        context: 'Cercle / Cappadocia',
      }),
    );
    expect(firstTrack.culturalContext).toContain('Long-form melodic live performance');
  });

  it('falls back to all tracks when there is no useful match', () => {
    expect(
      filterRecommendations(electronicRecommendationFixtures, {
        ...baseProfile,
        genres: ['Noise'],
        contexts: [],
        dimensions: {
          energy: 100,
          density: 100,
          texture: 100,
          space: 0,
          rhythm: 100,
        },
      }),
    ).toHaveLength(electronicRecommendationFixtures.length);
  });
});
