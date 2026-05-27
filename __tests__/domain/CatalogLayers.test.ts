import {
  assertSourceRecordIsRaw,
  createCurationTag,
  createInitialDiscoveryDepth,
  findInterpretiveSourceKeys,
  type SourceTrack,
} from '@/domain/catalog';

describe('CatalogLayers', () => {
  it('keeps raw source tracks free of curation fields', () => {
    const rawTrack: SourceTrack = {
      schemaVersion: 1,
      sourceRef: {
        source: 'soundcloud',
        sourceId: 'soundcloud-track-1',
        sourceUrl: 'https://soundcloud.com/example/track',
        importedAt: '2026-05-26T00:00:00.000Z',
      },
      title: 'Imported title',
      sourceArtistIds: ['soundcloud-artist-1'],
      durationMs: 320000,
    };

    expect(() => assertSourceRecordIsRaw(rawTrack as unknown as Record<string, unknown>)).not.toThrow();
  });

  it('rejects source records that mix raw facts with interpretations', () => {
    const mixedRecord = {
      sourceRef: {
        source: 'soundcloud',
        sourceId: 'soundcloud-track-1',
        sourceUrl: 'https://soundcloud.com/example/track',
        importedAt: '2026-05-26T00:00:00.000Z',
      },
      title: 'Imported title',
      lineage: 'early trance',
      function: 'peak',
    };

    expect(findInterpretiveSourceKeys(mixedRecord)).toEqual(['function', 'lineage']);
    expect(() => assertSourceRecordIsRaw(mixedRecord)).toThrow('function, lineage');
  });

  it('stores interpretation as versioned curation tags', () => {
    const tag = createCurationTag({
      id: 'tag-1',
      target: {
        type: 'work',
        id: 'work-the-age-of-love',
      },
      tagType: 'lineage',
      value: 'early trance / European rave',
      confidence: 1.2,
      curator: 'human',
      version: 1,
      createdAt: '2026-05-26T00:00:00.000Z',
    });

    expect(tag).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
        confidence: 1,
        value: 'early trance / European rave',
      }),
    );
  });

  it('starts known-artist friendly and shifts toward depth as interactions grow', () => {
    expect(createInitialDiscoveryDepth(0)).toEqual({
      recognitionBias: 75,
      independentBias: 25,
      historicalBias: 40,
      functionalBias: 50,
    });
    expect(createInitialDiscoveryDepth(100)).toEqual({
      recognitionBias: 40,
      independentBias: 60,
      historicalBias: 60,
      functionalBias: 80,
    });
  });
});
