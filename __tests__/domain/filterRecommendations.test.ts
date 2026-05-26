import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';
import { filterRecommendations } from '@/domain/recommendations/filterRecommendations';
import type { TasteProfile } from '@/domain/taste/TasteProfile';

describe('filterRecommendations', () => {
  it('filters tracks by completed taste profile genre or mood', () => {
    const profile: TasteProfile = {
      genres: ['Ambient'],
      moods: ['Atmospheric'],
      artists: ['Jon Hopkins'],
      completedAt: '2026-05-26T10:00:00.000Z',
    };

    expect(filterRecommendations(electronicRecommendationFixtures, profile)).toEqual([
      expect.objectContaining({
        title: 'Signal Drift',
      }),
    ]);
  });

  it('falls back to all tracks when there is no useful match', () => {
    const profile: TasteProfile = {
      genres: ['Noise'],
      moods: ['Raw'],
      artists: ['Unknown'],
      completedAt: '2026-05-26T10:00:00.000Z',
    };

    expect(filterRecommendations(electronicRecommendationFixtures, profile)).toHaveLength(
      electronicRecommendationFixtures.length,
    );
  });
});
