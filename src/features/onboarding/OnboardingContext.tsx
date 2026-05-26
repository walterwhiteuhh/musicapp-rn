import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import {
  completeTasteProfile,
  emptyTasteProfile,
  toggleTasteValue,
  validateTasteProfile,
  type TasteProfile,
  type TasteProfileDraft,
  type TasteProfileValidation,
} from '@/domain/taste/TasteProfile';

type OnboardingContextValue = {
  draft: TasteProfileDraft;
  validation: TasteProfileValidation;
  toggleGenre(genre: string): void;
  toggleMood(mood: string): void;
  toggleArtist(artist: string): void;
  complete(): TasteProfile;
  reset(): void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

type OnboardingProviderProps = PropsWithChildren<{
  initialDraft?: TasteProfileDraft;
}>;

export function OnboardingProvider({ children, initialDraft }: OnboardingProviderProps) {
  const [draft, setDraft] = useState<TasteProfileDraft>(
    initialDraft ?? {
      genres: emptyTasteProfile.genres,
      moods: emptyTasteProfile.moods,
      artists: emptyTasteProfile.artists,
    },
  );

  const value = useMemo<OnboardingContextValue>(() => {
    return {
      draft,
      validation: validateTasteProfile(draft),
      toggleGenre: (genre) => {
        setDraft((current) => ({
          ...current,
          genres: toggleTasteValue(current.genres, genre),
        }));
      },
      toggleMood: (mood) => {
        setDraft((current) => ({
          ...current,
          moods: toggleTasteValue(current.moods, mood),
        }));
      },
      toggleArtist: (artist) => {
        setDraft((current) => ({
          ...current,
          artists: toggleTasteValue(current.artists, artist),
        }));
      },
      complete: () => completeTasteProfile(draft),
      reset: () => {
        setDraft({
          genres: [],
          moods: [],
          artists: [],
        });
      },
    };
  }, [draft]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider.');
  }

  return context;
}
