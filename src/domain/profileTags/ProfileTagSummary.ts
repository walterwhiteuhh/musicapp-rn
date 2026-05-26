import type { DiscoveryDepth } from '../catalog';
import type { RecommendationCalibration, TasteProfile, TrackDimensions } from '../taste';

export type ProfileEnergy = 'low' | 'medium' | 'high';

export type ProfileTagSummary = {
  schemaVersion: 1;
  primaryEnergy: ProfileEnergy;
  rhythmBias: string;
  listeningIntent: string;
  discoveryVector: string[];
  profileNotes: string[];
  confidence: number;
};

export type ProfileTagsRequest = {
  schemaVersion: 1;
  genres: string[];
  contexts: string[];
  dimensions: TrackDimensions;
  selectedArtists: string[];
  lineageWeights: Record<string, number>;
  artistAnchorWeights: Record<string, number>;
  discoveryDepth: DiscoveryDepth;
  calibration: RecommendationCalibration;
};

export function createProfileTagsRequest(profile: TasteProfile): ProfileTagsRequest {
  return {
    schemaVersion: profile.schemaVersion,
    genres: profile.genres,
    contexts: profile.contexts,
    dimensions: profile.dimensions,
    selectedArtists: profile.selectedArtists,
    lineageWeights: profile.lineageWeights,
    artistAnchorWeights: profile.artistAnchorWeights,
    discoveryDepth: profile.discoveryDepth,
    calibration: profile.calibration,
  };
}

export function parseProfileTagSummary(payload: unknown): ProfileTagSummary {
  if (!isRecord(payload)) {
    throw new Error('Profile tag summary must be an object.');
  }

  if (payload.schemaVersion !== 1) {
    throw new Error('Profile tag summary uses an unsupported schema version.');
  }

  if (
    payload.primaryEnergy !== 'low' &&
    payload.primaryEnergy !== 'medium' &&
    payload.primaryEnergy !== 'high'
  ) {
    throw new Error('Profile tag summary contains an invalid energy label.');
  }

  if (
    typeof payload.rhythmBias !== 'string' ||
    typeof payload.listeningIntent !== 'string' ||
    !Array.isArray(payload.discoveryVector) ||
    !Array.isArray(payload.profileNotes) ||
    typeof payload.confidence !== 'number'
  ) {
    throw new Error('Profile tag summary is missing required fields.');
  }

  if (
    payload.discoveryVector.some((item) => typeof item !== 'string') ||
    payload.profileNotes.some((item) => typeof item !== 'string')
  ) {
    throw new Error('Profile tag summary lists must contain strings.');
  }

  if (payload.confidence < 0 || payload.confidence > 1) {
    throw new Error('Profile tag summary confidence must be between 0 and 1.');
  }

  return {
    schemaVersion: 1,
    primaryEnergy: payload.primaryEnergy,
    rhythmBias: payload.rhythmBias,
    listeningIntent: payload.listeningIntent,
    discoveryVector: payload.discoveryVector.slice(0, 6),
    profileNotes: payload.profileNotes.slice(0, 6),
    confidence: Math.round(payload.confidence * 100) / 100,
  };
}

export function isProfileTagsRequest(payload: unknown): payload is ProfileTagsRequest {
  if (!isRecord(payload) || payload.schemaVersion !== 1) {
    return false;
  }

  return (
    isStringArray(payload.genres) &&
    isStringArray(payload.contexts) &&
    isTrackDimensions(payload.dimensions) &&
    isStringArray(payload.selectedArtists) &&
    isNumberRecord(payload.lineageWeights) &&
    isNumberRecord(payload.artistAnchorWeights) &&
    isDiscoveryDepth(payload.discoveryDepth) &&
    isCalibration(payload.calibration)
  );
}

function isTrackDimensions(value: unknown): value is TrackDimensions {
  if (!isRecord(value)) {
    return false;
  }

  return ['energy', 'density', 'texture', 'space', 'rhythm'].every(
    (key) => typeof value[key] === 'number' && value[key] >= 0 && value[key] <= 100,
  );
}

function isCalibration(value: unknown): value is RecommendationCalibration {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.onboardingWeight === 'number' &&
    typeof value.behaviorWeight === 'number' &&
    typeof value.confidence === 'number' &&
    typeof value.interactionCount === 'number'
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'number');
}

function isDiscoveryDepth(value: unknown): value is DiscoveryDepth {
  if (!isRecord(value)) {
    return false;
  }

  return ['recognitionBias', 'independentBias', 'historicalBias', 'functionalBias'].every(
    (key) => typeof value[key] === 'number',
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
