import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TasteProfile } from '@/domain/taste/TasteProfile';
import type { TasteProfileRepository } from '@/domain/taste/TasteProfileRepository';

export const tasteProfileStorageKey = 'klangfeld:taste-profile';

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
    isStringArray(value.genres) &&
    isStringArray(value.moods) &&
    isStringArray(value.artists) &&
    (typeof value.completedAt === 'string' || value.completedAt === null)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
