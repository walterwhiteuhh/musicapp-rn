import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';
import { soundCloudTrackFixtures } from '@/data/music/fixtures';

describe('SoundCloud fixture links', () => {
  it('uses valid SoundCloud URLs for recommendation previews', () => {
    for (const track of electronicRecommendationFixtures) {
      expect(track.externalUrl).toMatch(/^https:\/\/(m\.)?soundcloud\.com\/.+/);
    }
  });

  it('uses valid SoundCloud URLs for search fixtures', () => {
    for (const track of soundCloudTrackFixtures) {
      expect(track.externalUrl).toMatch(/^https:\/\/(m\.)?soundcloud\.com\/.+/);
    }
  });
});
