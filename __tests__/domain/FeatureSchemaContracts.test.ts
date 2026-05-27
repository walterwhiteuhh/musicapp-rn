import {
  createEmptyHybridFeatureVector,
  normalizeCategoricalTags,
  type CategoricalNormalizationProfile,
  type WeightedCategoryTag,
} from '@/domain/features';
import { clampMoodVector, mapEmojiToMoodVector, type EmojiMoodMappingEntry } from '@/domain/mood';

describe('Feature schema contracts', () => {
  it('creates an empty hybrid vector with fixed v1 defaults', () => {
    const vector = createEmptyHybridFeatureVector({
      entityId: 'entity-1',
      entityType: 'track',
      sourcePlatform: 'soundcloud',
      sourceKind: 'radio-show',
      sourceUrl: 'https://soundcloud.com/example',
      timestampIngested: '2026-05-26T12:00:00.000Z',
    });

    expect(vector.schemaVersion).toBe(1);
    expect(vector.numeric).toEqual({});
    expect(vector.categorical).toEqual([]);
    expect(vector.context.isRadioShow).toBeNull();
  });

  it('normalizes categorical tags with idf-like weighting', () => {
    const tags: WeightedCategoryTag[] = [
      {
        namespace: 'style',
        tag: 'Hard Techno',
        rawWeight: 1,
        normalizedWeight: null,
        provenance: 'rule',
      },
      {
        namespace: 'style',
        tag: 'Trance Revival',
        rawWeight: 0.65,
        normalizedWeight: null,
        provenance: 'rule',
      },
    ];
    const profile: CategoricalNormalizationProfile = {
      schemaVersion: 1,
      totalEntities: 1000,
      alpha: 1,
      stats: [
        { namespace: 'style', tag: 'Hard Techno', documentFrequency: 300 },
        { namespace: 'style', tag: 'Trance Revival', documentFrequency: 120 },
      ],
      updatedAt: '2026-05-26T12:00:00.000Z',
    };

    const normalized = normalizeCategoricalTags(tags, profile);

    expect(normalized[0].normalizedWeight).toBeGreaterThan(0);
    expect(normalized[1].normalizedWeight).toBeGreaterThan(normalized[0].normalizedWeight ?? 0);
  });

  it('maps emoji to mood vectors and clamps outputs to [-1, 1]', () => {
    const mapping: EmojiMoodMappingEntry[] = [
      {
        schemaVersion: 1,
        emojiCode: ':fire:',
        vector: { valence: 0.7, arousal: 1.3, dominance: 0.9 },
        defaultWeight: 1,
      },
    ];

    expect(mapEmojiToMoodVector(':fire:', mapping)).toEqual({
      valence: 0.7,
      arousal: 1.3,
      dominance: 0.9,
    });
    expect(mapEmojiToMoodVector(':wave:', mapping)).toBeNull();
    expect(clampMoodVector({ valence: 1.4, arousal: -1.2, dominance: 0.3333 })).toEqual({
      valence: 1,
      arousal: -1,
      dominance: 0.333,
    });
  });
});
