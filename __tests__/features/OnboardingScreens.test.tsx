import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { OnboardingProvider } from '@/features/onboarding/OnboardingContext';
import { GenresScreen } from '@/features/onboarding/screens/GenresScreen';
import { WelcomeScreen } from '@/features/onboarding/screens/WelcomeScreen';
import { ReviewScreen } from '@/features/onboarding/screens/ReviewScreen';
import { tasteProfileStorageKey } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { TasteProfileDraft } from '@/domain/taste/TasteProfile';

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

describe('Onboarding screens', () => {
  beforeEach(async () => {
    mockPush.mockClear();
    mockReplace.mockClear();
    mockBack.mockClear();
    await AsyncStorage.clear();
  });

  it('starts the onboarding flow from welcome', () => {
    renderWithOnboarding(<WelcomeScreen />);

    fireEvent.press(screen.getByText('Create taste profile'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/genres');
  });

  it('keeps the genres next button disabled until two genres are selected', () => {
    renderWithOnboarding(<GenresScreen />);

    fireEvent.press(screen.getByText('Next'));
    expect(mockPush).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Techno'));
    fireEvent.press(screen.getByText('House'));
    fireEvent.press(screen.getByText('Next'));

    expect(mockPush).toHaveBeenCalledWith('/onboarding/moods');
  });

  it('saves a completed profile from review', async () => {
    renderWithOnboarding(<ReviewScreen />, {
      genres: ['Techno', 'House'],
      moods: ['Hypnotic'],
      artists: ['Skee Mask'],
    });

    await screen.findByText('Skee Mask');
    fireEvent.press(screen.getByText('Start discovery'));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(tasteProfileStorageKey)).resolves.toContain('Skee Mask');
    });
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });
});
