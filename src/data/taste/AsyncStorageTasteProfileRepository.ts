import AsyncStorage from '@react-native-async-storage/async-storage';

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

      if (!isTasteProfile(parsedProfile)) {
        return null;
      }

      return parsedProfile;
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

function isTasteProfile(value: unknown): value is TasteProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
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
    typeof value.updatedAt === 'string'
  );
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
