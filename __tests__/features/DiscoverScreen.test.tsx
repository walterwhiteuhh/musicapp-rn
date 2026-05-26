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

    expect(await screen.findByText('Grand Palais for Cercle')).toBeTruthy();
    expect(screen.getByText('Featured from your Klangprofil')).toBeTruthy();
    expect(screen.getByText('Create taste profile')).toBeTruthy();
    expect(screen.getByText('Open YouTube live set')).toBeTruthy();
    expect(screen.getAllByText('Reference layer').length).toBeGreaterThan(0);
  });

  it('opens recommendation source links', async () => {
    render(<DiscoverScreen />);
    fireEvent.press(await screen.findByText('Open YouTube live set'));

    expect(Linking.openURL).toHaveBeenCalledWith('https://www.youtube.com/watch?v=vqz8c4ZP3Wg');
  });

  it('uses more like this to focus the next signals list', async () => {
    render(<DiscoverScreen />);

    fireEvent.press(await screen.findByText('More like this'));

    expect(await screen.findByText('More like Boris Brejcha')).toBeTruthy();
    expect(screen.getByText('Reset')).toBeTruthy();
  });

  it('shows profile-shaped recommendations when a versioned profile exists', async () => {
    await AsyncStorage.setItem(
      tasteProfileStorageKey,
      JSON.stringify({
        schemaVersion: 1,
        genres: ['Melodic Techno', 'Progressive House'],
        contexts: ['Headphones'],
        dimensions: {
          energy: 25,
          density: 35,
          texture: 40,
          space: 85,
          rhythm: 35,
        },
        suggestedArtists: ['Ben Boehmer', 'NTO'],
        selectedArtists: ['Ben Boehmer'],
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

    expect(await screen.findByText('Live above Cappadocia')).toBeTruthy();
  });
});
