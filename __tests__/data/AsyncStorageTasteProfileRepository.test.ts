import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AsyncStorageTasteProfileRepository,
  tasteProfileStorageKey,
} from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { TasteProfile } from '@/domain/taste/TasteProfile';

const profile: TasteProfile = {
  genres: ['Techno', 'Ambient'],
  moods: ['Hypnotic'],
  artists: ['Skee Mask'],
  completedAt: '2026-05-26T10:00:00.000Z',
};

describe('AsyncStorageTasteProfileRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('saves and loads a taste profile', async () => {
    const repository = new AsyncStorageTasteProfileRepository();

    await repository.saveProfile(profile);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      tasteProfileStorageKey,
      JSON.stringify(profile),
    );
    await expect(repository.getProfile()).resolves.toEqual(profile);
  });

  it('returns null for malformed stored profile data', async () => {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify({ genres: ['Techno'] }));

    const repository = new AsyncStorageTasteProfileRepository();

    await expect(repository.getProfile()).resolves.toBeNull();
  });

  it('clears a stored profile', async () => {
    const repository = new AsyncStorageTasteProfileRepository();

    await repository.saveProfile(profile);
    await repository.clearProfile();

    await expect(repository.getProfile()).resolves.toBeNull();
  });
});
