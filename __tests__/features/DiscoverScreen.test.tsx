import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

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
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders demo recommendations without a completed profile', async () => {
    render(<DiscoverScreen />);

    expect(await screen.findByText('Red In The Desert')).toBeTruthy();
    expect(screen.getByText('Create taste profile')).toBeTruthy();
    expect(screen.getAllByText('Open on SoundCloud').length).toBeGreaterThan(0);
  });

  it('opens recommendation links on SoundCloud', async () => {
    render(<DiscoverScreen />);
    fireEvent.press((await screen.findAllByText('Open on SoundCloud'))[0]);

    expect(Linking.openURL).toHaveBeenCalledWith('https://soundcloud.com/boris-brejcha');
  });

  it('shows profile-shaped recommendations when a versioned profile exists', async () => {
    await AsyncStorage.setItem(
      tasteProfileStorageKey,
      JSON.stringify({
        schemaVersion: 1,
        genres: ['Downtempo'],
        contexts: ['Headphones'],
        dimensions: {
          energy: 25,
          density: 35,
          texture: 40,
          space: 85,
          rhythm: 35,
        },
        suggestedArtists: ['Ben Böhmer', 'NTO'],
        selectedArtists: ['Ben Böhmer'],
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

    expect(await screen.findByText('Beyond Beliefs')).toBeTruthy();
  });
});
