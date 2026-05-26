import { soundCloudTrackFixtures } from '@/data/music/fixtures';
import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';

describe('fixture source links', () => {
  it('uses valid source URLs for recommendation previews', () => {
    for (const track of electronicRecommendationFixtures) {
      expect(track.externalUrl).toMatch(/^https:\/\/(www\.youtube\.com|m\.soundcloud\.com|soundcloud\.com)\/.+/);

      for (const sourceLink of track.sourceLinks ?? []) {
        expect(sourceLink.url).toMatch(
          /^https:\/\/(www\.youtube\.com|m\.soundcloud\.com|soundcloud\.com|en\.wikipedia\.org)\/.+/,
        );
      }
    }
  });

  it('uses valid SoundCloud URLs for search fixtures', () => {
    for (const track of soundCloudTrackFixtures) {
      expect(track.externalUrl).toMatch(/^https:\/\/(m\.)?soundcloud\.com\/.+/);
    }
  });
});
