import { createInitialDiscoveryDepth, type DiscoveryDepth } from '@/domain/catalog';

export type ListeningContext =
  | 'Club'
  | 'Headphones'
  | 'Focus'
  | 'Night drive'
  | 'Training'
  | 'Afterhours'
  | 'Home';

export type TrackDimensions = {
  energy: number;
  density: number;
  texture: number;
  space: number;
  rhythm: number;
};

export type RecommendationCalibration = {
  onboardingWeight: number;
  behaviorWeight: number;
  confidence: number;
  interactionCount: number;
};

export type TasteProfile = {
  schemaVersion: 1;
  genres: string[];
  contexts: ListeningContext[];
  dimensions: TrackDimensions;
  suggestedArtists: string[];
  selectedArtists: string[];
  lineageWeights: Record<string, number>;
  artistAnchorWeights: Record<string, number>;
  discoveryDepth: DiscoveryDepth;
  calibration: RecommendationCalibration;
  completedAt: string | null;
  updatedAt: string;
};

export type TasteProfileDraft = {
  genres: string[];
  contexts: ListeningContext[];
  dimensions: TrackDimensions;
  suggestedArtists: string[];
  selectedArtists: string[];
  lineageWeights: Record<string, number>;
  artistAnchorWeights: Record<string, number>;
  discoveryDepth: DiscoveryDepth;
};

export type TasteProfileValidation = {
  canContinueGenres: boolean;
  canContinueDimensions: boolean;
  canContinueContexts: boolean;
  canContinueArtists: boolean;
  canComplete: boolean;
};

export const defaultTrackDimensions: TrackDimensions = {
  energy: 55,
  density: 45,
  texture: 50,
  space: 60,
  rhythm: 45,
};

export const emptyTasteProfileDraft: TasteProfileDraft = {
  genres: [],
  contexts: [],
  dimensions: defaultTrackDimensions,
  suggestedArtists: [],
  selectedArtists: [],
  lineageWeights: {},
  artistAnchorWeights: {},
  discoveryDepth: createInitialDiscoveryDepth(0),
};

export const minimumTasteProfile = {
  genres: 2,
  contexts: 1,
  selectedArtists: 1,
};

export const maximumTasteProfile = {
  genres: 4,
  contexts: 3,
  selectedArtists: 5,
};

export const initialRecommendationCalibration: RecommendationCalibration = {
  onboardingWeight: 1,
  behaviorWeight: 0,
  confidence: 0,
  interactionCount: 0,
};

export function validateTasteProfile(profile: TasteProfileDraft): TasteProfileValidation {
  const canContinueGenres =
    profile.genres.length >= minimumTasteProfile.genres &&
    profile.genres.length <= maximumTasteProfile.genres;
  const canContinueDimensions = Object.values(profile.dimensions).every(
    (value) => value >= 0 && value <= 100,
  );
  const canContinueContexts =
    profile.contexts.length >= minimumTasteProfile.contexts &&
    profile.contexts.length <= maximumTasteProfile.contexts;
  const canContinueArtists =
    profile.selectedArtists.length >= minimumTasteProfile.selectedArtists &&
    profile.selectedArtists.length <= maximumTasteProfile.selectedArtists;

  return {
    canContinueGenres,
    canContinueDimensions,
    canContinueContexts,
    canContinueArtists,
    canComplete:
      canContinueGenres && canContinueDimensions && canContinueContexts && canContinueArtists,
  };
}

export function toggleLimitedValue<T extends string>(
  values: T[],
  value: T,
  maxValues: number,
): T[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  if (values.length >= maxValues) {
    return values;
  }

  return [...values, value];
}

export function updateTrackDimension(
  dimensions: TrackDimensions,
  dimension: keyof TrackDimensions,
  value: number,
): TrackDimensions {
  return {
    ...dimensions,
    [dimension]: clampDimension(value),
  };
}

export function completeTasteProfile(
  profile: TasteProfileDraft,
  completedAt = new Date(),
): TasteProfile {
  const timestamp = completedAt.toISOString();

  return {
    schemaVersion: 1,
    ...profile,
    lineageWeights: profile.lineageWeights,
    artistAnchorWeights: profile.artistAnchorWeights,
    discoveryDepth: profile.discoveryDepth,
    calibration: initialRecommendationCalibration,
    completedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function deriveRecommendationCalibration(interactionCount: number): RecommendationCalibration {
  const normalizedInteractionCount = Math.max(0, Math.floor(interactionCount));
  const onboardingWeight = roundWeight(Math.max(0.2, 1 - normalizedInteractionCount / 100));
  const behaviorWeight = roundWeight(1 - onboardingWeight);
  const confidence = roundWeight(Math.min(1, normalizedInteractionCount / 100));

  return {
    onboardingWeight,
    behaviorWeight,
    confidence,
    interactionCount: normalizedInteractionCount,
  };
}

function clampDimension(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function roundWeight(value: number): number {
  return Math.round(value * 100) / 100;
}
