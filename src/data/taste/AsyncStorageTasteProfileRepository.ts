import AsyncStorage from '@react-native-async-storage/async-storage';

import { createInitialDiscoveryDepth, type DiscoveryDepth } from '@/domain/catalog';
import type { TasteProfile, TrackDimensions } from '@/domain/taste/TasteProfile';
import type { TasteProfileRepository } from '@/domain/taste/TasteProfileRepository';

export const tasteProfileStorageKey = 'klangfeld:taste-profile:v1';

export class AsyncStorageTasteProfileRepository implements TasteProfileRepository {
  async getProfile(): Promise<TasteProfile | null> {
    const rawProfile = await AsyncStorage.getItem(tasteProfileStorageKey);

    if (!rawProfile) {
      return null;
    }

    try {
      const parsedProfile: unknown = JSON.parse(rawProfile);

      const profile = normalizeTasteProfile(parsedProfile);

      if (!profile) {
        return null;
      }

      return profile;
    } catch {
      return null;
    }
  }

  async saveProfile(profile: TasteProfile): Promise<void> {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify(profile));
  }

  async clearProfile(): Promise<void> {
    await AsyncStorage.removeItem(tasteProfileStorageKey);
  }
}

function normalizeTasteProfile(value: unknown): TasteProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const hasBaseProfile =
    value.schemaVersion === 1 &&
    isStringArray(value.genres) &&
    isStringArray(value.contexts) &&
    isTrackDimensions(value.dimensions) &&
    isStringArray(value.suggestedArtists) &&
    isStringArray(value.selectedArtists) &&
    isRecord(value.calibration) &&
    typeof value.calibration.onboardingWeight === 'number' &&
    typeof value.calibration.behaviorWeight === 'number' &&
    typeof value.calibration.confidence === 'number' &&
    typeof value.calibration.interactionCount === 'number' &&
    (typeof value.completedAt === 'string' || value.completedAt === null) &&
    typeof value.updatedAt === 'string';

  if (!hasBaseProfile) {
    return null;
  }

  const calibration = value.calibration as TasteProfile['calibration'];

  return {
    schemaVersion: 1,
    genres: value.genres as string[],
    contexts: value.contexts as TasteProfile['contexts'],
    dimensions: value.dimensions as TrackDimensions,
    suggestedArtists: value.suggestedArtists as string[],
    selectedArtists: value.selectedArtists as string[],
    lineageWeights: isNumberRecord(value.lineageWeights) ? value.lineageWeights : {},
    artistAnchorWeights: isNumberRecord(value.artistAnchorWeights) ? value.artistAnchorWeights : {},
    discoveryDepth: isDiscoveryDepth(value.discoveryDepth)
      ? value.discoveryDepth
      : createInitialDiscoveryDepth(calibration.interactionCount),
    calibration,
    completedAt: value.completedAt as string | null,
    updatedAt: value.updatedAt as string,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isTrackDimensions(value: unknown): value is TrackDimensions {
  if (!isRecord(value)) {
    return false;
  }

  return ['energy', 'density', 'texture', 'space', 'rhythm'].every((key) => {
    return typeof value[key] === 'number' && value[key] >= 0 && value[key] <= 100;
  });
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
