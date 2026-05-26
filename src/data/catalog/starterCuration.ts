import type {
  ArtistReference,
  CanonicalArtist,
  CanonicalRecording,
  CanonicalWork,
  CurationTag,
} from '@/domain/catalog';
import { createCurationTag } from '@/domain/catalog';

const createdAt = '2026-05-26T00:00:00.000Z';

export const starterCanonicalArtists: CanonicalArtist[] = [
  {
    schemaVersion: 1,
    id: 'artist-age-of-love',
    canonicalName: 'Age of Love',
    aliases: [],
    sourceArtistRefs: [],
  },
  {
    schemaVersion: 1,
    id: 'artist-jam-and-spoon',
    canonicalName: 'Jam & Spoon',
    aliases: [],
    sourceArtistRefs: [],
  },
  {
    schemaVersion: 1,
    id: 'artist-charlotte-de-witte',
    canonicalName: 'Charlotte de Witte',
    aliases: [],
    sourceArtistRefs: [],
  },
  {
    schemaVersion: 1,
    id: 'artist-ben-klock',
    canonicalName: 'Ben Klock',
    aliases: [],
    sourceArtistRefs: [],
  },
  {
    schemaVersion: 1,
    id: 'artist-bicep',
    canonicalName: 'Bicep',
    aliases: [],
    sourceArtistRefs: [],
  },
  {
    schemaVersion: 1,
    id: 'artist-ben-bohmer',
    canonicalName: 'Ben Böhmer',
    aliases: ['Ben Bohmer'],
    sourceArtistRefs: [],
  },
];

export const starterCanonicalWorks: CanonicalWork[] = [
  {
    schemaVersion: 1,
    id: 'work-the-age-of-love',
    canonicalTitle: 'The Age of Love',
    originalArtistIds: ['artist-age-of-love'],
    originalReleaseYear: 1990,
    sourceTrackRefs: [],
  },
];

export const starterCanonicalRecordings: CanonicalRecording[] = [
  {
    schemaVersion: 1,
    id: 'recording-the-age-of-love-jam-and-spoon-watch-out-for-stella',
    canonicalWorkId: 'work-the-age-of-love',
    versionTitle: 'Jam & Spoon Watch Out For Stella Mix',
    remixArtistIds: ['artist-jam-and-spoon'],
    sourceTrackRefs: [],
  },
];

export const starterCurationTags: CurationTag[] = [
  createCurationTag({
    id: 'tag-age-of-love-lineage',
    target: {
      type: 'work',
      id: 'work-the-age-of-love',
    },
    tagType: 'lineage',
    value: 'early trance / European rave',
    confidence: 0.95,
    curator: 'human',
    version: 1,
    createdAt,
  }),
  createCurationTag({
    id: 'tag-age-of-love-role',
    target: {
      type: 'work',
      id: 'work-the-age-of-love',
    },
    tagType: 'role',
    value: 'anthem / reusable peak-time material',
    confidence: 0.9,
    curator: 'human',
    version: 1,
    createdAt,
  }),
  createCurationTag({
    id: 'tag-charlotte-gateway',
    target: {
      type: 'artist',
      id: 'artist-charlotte-de-witte',
    },
    tagType: 'gatewayFor',
    value: 'trance revival / big-room techno pressure',
    confidence: 0.78,
    curator: 'human',
    version: 1,
    createdAt,
  }),
];

export const starterArtistReferences: ArtistReference[] = [
  {
    schemaVersion: 1,
    canonicalArtistId: 'artist-charlotte-de-witte',
    name: 'Charlotte de Witte',
    recognitionLevel: 'mainstream',
    lineages: ['big-room techno', 'trance revival', 'rave pressure'],
    sceneContexts: ['Belgium', 'European festival techno'],
    gatewayFor: ['Amelie Lens', 'KI/KI', 'Indira Paganotto'],
    accessibility: 78,
    independence: 35,
    historicalWeight: 45,
    currentRelevance: 92,
  },
  {
    schemaVersion: 1,
    canonicalArtistId: 'artist-ben-klock',
    name: 'Ben Klock',
    recognitionLevel: 'known-scene',
    lineages: ['Berlin hypnotic', 'Berghain techno'],
    sceneContexts: ['Berlin'],
    gatewayFor: ['DVS1', 'Marcel Dettmann', 'Function', 'Rødhåd'],
    accessibility: 52,
    independence: 72,
    historicalWeight: 75,
    currentRelevance: 76,
  },
  {
    schemaVersion: 1,
    canonicalArtistId: 'artist-bicep',
    name: 'Bicep',
    recognitionLevel: 'mainstream',
    lineages: ['UK breaks', 'melodic rave', 'club nostalgia'],
    sceneContexts: ['UK', 'Ireland'],
    gatewayFor: ['Overmono', 'Joy Orbison', 'Skee Mask', 'Special Request'],
    accessibility: 82,
    independence: 48,
    historicalWeight: 55,
    currentRelevance: 88,
  },
  {
    schemaVersion: 1,
    canonicalArtistId: 'artist-ben-bohmer',
    name: 'Ben Böhmer',
    recognitionLevel: 'mainstream',
    lineages: ['melodic deep', 'progressive house'],
    sceneContexts: ['Germany', 'European melodic house'],
    gatewayFor: ['NTO', 'Worakls', 'Kiasmos'],
    accessibility: 86,
    independence: 32,
    historicalWeight: 32,
    currentRelevance: 84,
  },
];
