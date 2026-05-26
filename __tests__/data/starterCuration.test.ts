import {
  starterArtistReferences,
  starterCanonicalRecordings,
  starterCanonicalWorks,
  starterCurationTags,
} from '@/data/catalog';

describe('starterCuration', () => {
  it('keeps original authorship separate from later artist usage', () => {
    const ageOfLove = starterCanonicalWorks.find((work) => work.id === 'work-the-age-of-love');
    const stellaMix = starterCanonicalRecordings.find((recording) =>
      recording.id.includes('watch-out-for-stella'),
    );

    expect(ageOfLove).toEqual(
      expect.objectContaining({
        canonicalTitle: 'The Age of Love',
        originalArtistIds: ['artist-age-of-love'],
      }),
    );
    expect(stellaMix).toEqual(
      expect.objectContaining({
        canonicalWorkId: 'work-the-age-of-love',
        remixArtistIds: ['artist-jam-and-spoon'],
      }),
    );
  });

  it('places cultural meaning in curation tags, not canonical records', () => {
    expect(starterCurationTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          target: {
            type: 'work',
            id: 'work-the-age-of-love',
          },
          tagType: 'lineage',
          value: 'early trance / European rave',
        }),
      ]),
    );
  });

  it('calibrates artist references by recognition and depth', () => {
    const bicep = starterArtistReferences.find((artist) => artist.name === 'Bicep');
    const benKlock = starterArtistReferences.find((artist) => artist.name === 'Ben Klock');

    expect(bicep).toEqual(
      expect.objectContaining({
        recognitionLevel: 'mainstream',
        lineages: expect.arrayContaining(['UK breaks']),
      }),
    );
    expect(benKlock).toEqual(
      expect.objectContaining({
        recognitionLevel: 'known-scene',
        independence: expect.any(Number),
      }),
    );
    expect((benKlock?.independence ?? 0) > (bicep?.independence ?? 0)).toBe(true);
  });

  it('keeps current hard-techno momentum separate from trance legacy anchors', () => {
    const lilly = starterArtistReferences.find((artist) => artist.name === 'Lilly Palmer');
    const armin = starterArtistReferences.find((artist) => artist.name === 'Armin van Buuren');
    const tiesto = starterArtistReferences.find((artist) => artist.name === 'Tiesto');

    expect(lilly).toEqual(
      expect.objectContaining({
        lineages: expect.arrayContaining(['hard techno / hard dance crossover']),
        currentRelevance: expect.any(Number),
      }),
    );
    expect(armin?.historicalWeight).toBeGreaterThan(lilly?.historicalWeight ?? 0);
    expect(tiesto?.historicalWeight).toBeGreaterThan(lilly?.historicalWeight ?? 0);
  });
});
