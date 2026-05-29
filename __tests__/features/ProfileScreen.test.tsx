import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen } from '@testing-library/react-native';

import { tasteProfileStorageKey } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { ProfileTagsProvider } from '@/domain/profileTags';
import { ProfileScreen } from '@/features/profile/ProfileScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const storedProfile = {
  schemaVersion: 1,
  genres: ['Techno', 'Ambient'],
  contexts: ['Club'],
  dimensions: {
    energy: 70,
    density: 55,
    texture: 60,
    space: 45,
    rhythm: 80,
  },
  suggestedArtists: ['Ben Klock'],
  selectedArtists: ['Ben Klock'],
  calibration: {
    onboardingWeight: 1,
    behaviorWeight: 0,
    confidence: 0,
    interactionCount: 0,
  },
  completedAt: '2026-05-26T10:00:00.000Z',
  updatedAt: '2026-05-26T10:00:00.000Z',
};

describe('ProfileScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('shows local profile data while AI tags resolve separately', async () => {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify(storedProfile));
    const provider: ProfileTagsProvider = {
      generateTags: jest.fn(() =>
        Promise.resolve({
          schemaVersion: 1,
          primaryEnergy: 'high',
          rhythmBias: 'Driving four-to-the-floor',
          listeningIntent: 'Club discovery',
          discoveryVector: ['hypnotic'],
          profileNotes: ['Loading state passed through'],
          confidence: 0.72,
        }),
      ),
    };

    render(<ProfileScreen profileTagsProvider={provider} />);

    expect(await screen.findByText('Techno, Ambient')).toBeTruthy();
    expect(await screen.findByText('Driving four-to-the-floor')).toBeTruthy();
  });

  it('renders generated AI profile tags', async () => {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify(storedProfile));
    const provider: ProfileTagsProvider = {
      generateTags: jest.fn(() =>
        Promise.resolve({
          schemaVersion: 1,
          primaryEnergy: 'high',
          rhythmBias: 'Driving four-to-the-floor',
          listeningIntent: 'Club discovery',
          discoveryVector: ['hypnotic', 'percussive'],
          profileNotes: ['High rhythmic confidence'],
          confidence: 0.86,
        }),
      ),
    };

    render(<ProfileScreen profileTagsProvider={provider} />);

    expect(await screen.findByText('Driving four-to-the-floor')).toBeTruthy();
    expect(screen.getByText('86%')).toBeTruthy();
  });

  it('keeps the profile usable when AI tags are disabled', async () => {
    await AsyncStorage.setItem(tasteProfileStorageKey, JSON.stringify(storedProfile));
    const provider: ProfileTagsProvider = {
      generateTags: jest.fn(),
    };

    render(<ProfileScreen profileTagsProvider={provider} aiProfileTagsEnabled={false} />);

    expect(await screen.findByText('Techno, Ambient')).toBeTruthy();
    expect(screen.getByText('AI profile tags are off for this preview. Local profile data remains available.')).toBeTruthy();
    expect(provider.generateTags).not.toHaveBeenCalled();
  });
});
