import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen } from '@testing-library/react-native';

import { DiscoverScreen } from '@/features/discover/DiscoverScreen';
import { tasteProfileStorageKey } from '@/data/taste/AsyncStorageTasteProfileRepository';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('DiscoverScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders demo recommendations without a completed profile', async () => {
    render(<DiscoverScreen />);

    expect(await screen.findByText('Late Night Signal')).toBeTruthy();
    expect(screen.getByText('Create taste profile')).toBeTruthy();
  });

  it('shows profile-shaped recommendations when a profile exists', async () => {
    await AsyncStorage.setItem(
      tasteProfileStorageKey,
      JSON.stringify({
        genres: ['Ambient'],
        moods: ['Atmospheric'],
        artists: ['Jon Hopkins'],
        completedAt: '2026-05-26T10:00:00.000Z',
      }),
    );

    render(<DiscoverScreen />);

    expect(await screen.findByText('Signal Drift')).toBeTruthy();
  });
});
