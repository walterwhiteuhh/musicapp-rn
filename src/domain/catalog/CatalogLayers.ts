export type SourceName = 'soundcloud' | 'bandcamp' | 'spotify' | 'youtube' | 'manual';

export type SourceRef = {
  source: SourceName;
  sourceId: string;
  sourceUrl: string;
  importedAt: string;
  rawPayload?: unknown;
};

export type SourceArtist = {
  schemaVersion: 1;
  sourceRef: SourceRef;
  displayName: string;
  imageUrl?: string | null;
};

export type SourceTrack = {
  schemaVersion: 1;
  sourceRef: SourceRef;
  title: string;
  sourceArtistIds: string[];
  durationMs?: number;
  releaseDate?: string | null;
  artworkUrl?: string | null;
};

export type SourceSet = {
  schemaVersion: 1;
  sourceRef: SourceRef;
  title: string;
  sourceArtistIds: string[];
  eventName?: string | null;
  seriesTitle?: string | null;
  episodeNumber?: string | null;
  durationMs?: number;
  recordedAt?: string | null;
};

export type CanonicalEntityRef = {
  source: SourceName;
  sourceId: string;
};

export type CanonicalArtist = {
  schemaVersion: 1;
  id: string;
  canonicalName: string;
  aliases: string[];
  sourceArtistRefs: CanonicalEntityRef[];
};

export type CanonicalWork = {
  schemaVersion: 1;
  id: string;
  canonicalTitle: string;
  originalArtistIds: string[];
  originalReleaseYear?: number;
  sourceTrackRefs: CanonicalEntityRef[];
};

export type CanonicalRecording = {
  schemaVersion: 1;
  id: string;
  canonicalWorkId: string;
  versionTitle?: string | null;
  remixArtistIds: string[];
  sourceTrackRefs: CanonicalEntityRef[];
};

export type CanonicalSet = {
  schemaVersion: 1;
  id: string;
  setArtistIds: string[];
  title: string;
  sourceSetRefs: CanonicalEntityRef[];
};

export type CurationTargetType =
  | 'artist'
  | 'work'
  | 'recording'
  | 'set'
  | 'setMoment'
  | 'trackView';

export type CurationTarget = {
  type: CurationTargetType;
  id: string;
};

export type CurationTagType =
  | 'lineage'
  | 'function'
  | 'texture'
  | 'scene'
  | 'era'
  | 'accessibility'
  | 'role'
  | 'gatewayFor'
  | 'reusePotential';

export type CuratorKind = 'human' | 'model' | 'imported';

export type CurationTag = {
  schemaVersion: 1;
  id: string;
  target: CurationTarget;
  tagType: CurationTagType;
  value: string;
  confidence: number;
  curator: CuratorKind;
  version: number;
  createdAt: string;
};

export type RecognitionLevel = 'mainstream' | 'known-scene' | 'specialist' | 'deep-cut';

export type ArtistReference = {
  schemaVersion: 1;
  canonicalArtistId: string;
  name: string;
  recognitionLevel: RecognitionLevel;
  lineages: string[];
  sceneContexts: string[];
  gatewayFor: string[];
  accessibility: number;
  independence: number;
  historicalWeight: number;
  currentRelevance: number;
};

export type UserSignalType =
  | 'view'
  | 'openSource'
  | 'save'
  | 'skip'
  | 'moreLikeThis'
  | 'complete'
  | 'search';

export type UserSignal = {
  schemaVersion: 1;
  id: string;
  userId: string;
  type: UserSignalType;
  target: CurationTarget;
  createdAt: string;
  context?: string;
};

export type DiscoveryDepth = {
  recognitionBias: number;
  independentBias: number;
  historicalBias: number;
  functionalBias: number;
};

export type UserTasteVector = {
  schemaVersion: 1;
  userId: string;
  generatedAt: string;
  lineageWeights: Record<string, number>;
  functionWeights: Record<string, number>;
  artistAnchorWeights: Record<string, number>;
  discoveryDepth: DiscoveryDepth;
  confidence: number;
  sourceEventRange: {
    from: string | null;
    to: string | null;
  };
};

export type RecommendationRecord = {
  schemaVersion: 1;
  userId: string;
  target: CurationTarget;
  generatedAt: string;
  reasonCodes: string[];
  modelVersion: string;
  score: number;
};

export const interpretiveSourceKeys = [
  'accessibility',
  'contexts',
  'culturalRole',
  'dimensions',
  'function',
  'genre',
  'gatewayFor',
  'historicalWeight',
  'independence',
  'lineage',
  'lineages',
  'recognitionLevel',
  'relatedArtists',
  'role',
  'scene',
  'texture',
] as const;

export function findInterpretiveSourceKeys(record: Record<string, unknown>): string[] {
  return interpretiveSourceKeys.filter((key) => Object.prototype.hasOwnProperty.call(record, key));
}

export function assertSourceRecordIsRaw(record: Record<string, unknown>): void {
  const interpretiveKeys = findInterpretiveSourceKeys(record);

  if (interpretiveKeys.length > 0) {
    throw new Error(`Source records must not contain curation keys: ${interpretiveKeys.join(', ')}`);
  }
}

export function createCurationTag(input: Omit<CurationTag, 'schemaVersion'>): CurationTag {
  return {
    schemaVersion: 1,
    ...input,
    confidence: clamp01(input.confidence),
  };
}

export function createInitialDiscoveryDepth(interactionCount: number): DiscoveryDepth {
  const normalizedCount = Math.max(0, Math.floor(interactionCount));
  const behaviorProgress = Math.min(1, normalizedCount / 100);

  return {
    recognitionBias: Math.round((75 - behaviorProgress * 35) * 100) / 100,
    independentBias: Math.round((25 + behaviorProgress * 35) * 100) / 100,
    historicalBias: Math.round((40 + behaviorProgress * 20) * 100) / 100,
    functionalBias: Math.round((50 + behaviorProgress * 30) * 100) / 100,
  };
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}
