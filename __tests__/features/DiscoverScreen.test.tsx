import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen } from '@testing-library/react-native';

import { tasteProfileStorageKey } from '@/data/taste/AsyncStorageTasteProfileRepository';
import { DiscoverScreen } from '@/features/discover/DiscoverScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.setTimeout(10000);

describe('DiscoverScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders demo recommendations without a completed profile', async () => {
    render(<DiscoverScreen />);

    expect(await screen.findByText('Late Night Signal')).toBeTruthy();
    expect(screen.getByText('Create taste profile')).toBeTruthy();
  });

  it('shows profile-shaped recommendations when a versioned profile exists', async () => {
    await AsyncStorage.setItem(
      tasteProfileStorageKey,
      JSON.stringify({
        schemaVersion: 1,
        genres: ['Ambient'],
        contexts: ['Focus'],
        dimensions: {
          energy: 25,
          density: 35,
          texture: 40,
          space: 85,
          rhythm: 35,
        },
        suggestedArtists: ['Jon Hopkins', 'Loscil'],
        selectedArtists: ['Jon Hopkins'],
        calibration: {
          onboardingWeight: 1,
          behaviorWeight: 0,
          confidence: 0,
          interactionCount: 0,
        },
        completedAt: '2026-05-26T10:00:00.000Z',
        updatedAt: '2026-05-26T10:00:00.000Z',
      }),
    );

    render(<DiscoverScreen />);

    expect(await screen.findByText('Signal Drift')).toBeTruthy();
  });
});
