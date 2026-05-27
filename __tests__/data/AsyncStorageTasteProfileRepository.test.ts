import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AsyncStorageTasteProfileRepository,
  tasteProfileStorageKey,
} from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { TasteProfile } from '@/domain/taste/TasteProfile';
import { createInitialDiscoveryDepth } from '@/domain/catalog';

const profile: TasteProfile = {
  schemaVersion: 1,
  genres: ['Techno', 'Ambient'],
  contexts: ['Club', 'Headphones'],
  dimensions: {
    energy: 65,
    density: 45,
    texture: 55,
    space: 70,
    rhythm: 40,
  },
  suggestedArtists: ['Ben Klock', 'Jon Hopkins'],
  selectedArtists: ['Ben Klock'],
  lineageWeights: {
    'Berlin hypnotic': 1,
  },
  artistAnchorWeights: {
    'Ben Klock': 1,
  },
  discoveryDepth: createInitialDiscoveryDepth(0),
  calibration: {
    onboardingWeight: 1,
    behaviorWeight: 0,
    confidence: 0,
    interactionCount: 0,
  },
  completedAt: '2026-05-26T10:00:00.000Z',
  updatedAt: '2026-05-26T10:00:00.000Z',
};

describe('AsyncStorageTasteProfileRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('saves and loads a versioned taste profile', async () => {
    const repository = new AsyncStorageTasteProfileRepository();

    await repository.saveProfile(profile);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      tasteProfileStorageKey,
      JSON.stringify(profile),
    );
    await expect(repository.getProfile()).resolves.toEqual(profile);
  });

  it('returns null for malformed or old profile data', async () => {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify({ genres: ['Techno'] }));

    const repository = new AsyncStorageTasteProfileRepository();

    await expect(repository.getProfile()).resolves.toBeNull();
  });

  it('hydrates legacy versioned profiles with default derived fields', async () => {
    const { lineageWeights, artistAnchorWeights, discoveryDepth, ...legacyProfile } = profile;
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify(legacyProfile));

    const repository = new AsyncStorageTasteProfileRepository();

    await expect(repository.getProfile()).resolves.toMatchObject({
      lineageWeights: {},
      artistAnchorWeights: {},
      discoveryDepth,
    });
  });

  it('clears a stored profile', async () => {
    const repository = new AsyncStorageTasteProfileRepository();

    await repository.saveProfile(profile);
    await repository.clearProfile();

    await expect(repository.getProfile()).resolves.toBeNull();
  });
});
