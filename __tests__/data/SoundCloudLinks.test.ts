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

  it('keeps Lilly Palmer Spannung as a radio-show source', () => {
    expect(electronicRecommendationFixtures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          artistName: 'Lilly Palmer',
          title: 'Spannung Radio Show 054',
          styleTags: expect.arrayContaining([
            expect.objectContaining({ tag: 'Hard Techno', weight: 1 }),
            expect.objectContaining({ tag: 'Trance Revival' }),
            expect.objectContaining({ tag: 'Peak-time Techno' }),
          ]),
          functionTags: expect.arrayContaining([
            expect.objectContaining({ tag: 'radio-show discovery' }),
          ]),
          sourceLinks: expect.arrayContaining([
            expect.objectContaining({
              kind: 'radio-show',
              url: 'https://soundcloud.com/lilly_palmer/lilly-palmer-pres-spannung-radio-show-054',
            }),
          ]),
        }),
      ]),
    );
  });

  it('uses valid SoundCloud URLs for search fixtures', () => {
    for (const track of soundCloudTrackFixtures) {
      expect(track.externalUrl).toMatch(/^https:\/\/(m\.)?soundcloud\.com\/.+/);
    }
  });
});
