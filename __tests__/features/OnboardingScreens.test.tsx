import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { tasteProfileStorageKey } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { TasteProfileDraft } from '@/domain/taste/TasteProfile';
import { OnboardingProvider } from '@/features/onboarding/OnboardingContext';
import { ArtistsScreen } from '@/features/onboarding/screens/ArtistsScreen';
import { ContextsScreen } from '@/features/onboarding/screens/ContextsScreen';
import { GenresScreen } from '@/features/onboarding/screens/GenresScreen';
import { ReviewScreen } from '@/features/onboarding/screens/ReviewScreen';
import { WelcomeScreen } from '@/features/onboarding/screens/WelcomeScreen';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
}));

function renderWithOnboarding(ui: ReactElement, initialDraft?: TasteProfileDraft) {
  return render(<OnboardingProvider initialDraft={initialDraft}>{ui}</OnboardingProvider>);
}

const completedDraft: TasteProfileDraft = {
  genres: ['Techno', 'Dub Techno'],
  contexts: ['Club'],
  dimensions: {
    energy: 70,
    density: 45,
    texture: 55,
    space: 60,
    rhythm: 35,
  },
  suggestedArtists: ['Ben Klock', 'Deepchord', 'Vril'],
  selectedArtists: ['Ben Klock'],
};

describe('Onboarding screens', () => {
  beforeEach(async () => {
    mockPush.mockClear();
    mockReplace.mockClear();
    mockBack.mockClear();
    await AsyncStorage.clear();
  });

  it('starts the onboarding flow from welcome', () => {
    renderWithOnboarding(<WelcomeScreen />);

    fireEvent.press(screen.getByText('Build Klangprofil'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/genres');
  });

  it('keeps the genres next button disabled until two genres are selected', () => {
    renderWithOnboarding(<GenresScreen />);

    fireEvent.press(screen.getByText('Next'));
    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Techno'));
    fireEvent.press(screen.getByText('House'));
    fireEvent.press(screen.getByText('Next'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/dimensions');
  });

  it('derives artist suggestions from context before artist selection', async () => {
    renderWithOnboarding(<ContextsScreen />, {
      ...completedDraft,
      contexts: [],
      suggestedArtists: [],
      selectedArtists: [],
    });

    fireEvent.press(screen.getByText('Club'));
    fireEvent.press(screen.getByText('Derive artists'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/artists');
  });

  it('requires one selected artist from derived suggestions', async () => {
    renderWithOnboarding(<ArtistsScreen />, {
      ...completedDraft,
      selectedArtists: [],
    });

    fireEvent.press(screen.getByText('Review profile'));
    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.press(await screen.findByText('Ben Klock'));
    fireEvent.press(screen.getByText('Review profile'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/review');
  });

  it('saves a completed versioned profile from review', async () => {
    renderWithOnboarding(<ReviewScreen />, completedDraft);

    await screen.findByText('Ben Klock');
    fireEvent.press(screen.getByText('Start discovery'));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(tasteProfileStorageKey)).resolves.toContain(
        '"schemaVersion":1',
      );
    });
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });
});
