import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import {
  completeTasteProfile,
  emptyTasteProfileDraft,
  maximumTasteProfile,
  toggleLimitedValue,
  updateTrackDimension,
  validateTasteProfile,
  type ListeningContext,
  type TasteProfile,
  type TasteProfileDraft,
  type TasteProfileValidation,
  type TrackDimensions,
} from '@/domain/taste/TasteProfile';
import { deriveArtistSuggestions } from './options';

type OnboardingContextValue = {
  draft: TasteProfileDraft;
  validation: TasteProfileValidation;
  toggleGenre(genre: string): void;
  toggleContext(context: ListeningContext): void;
  setDimension(dimension: keyof TrackDimensions, value: number): void;
  refreshArtistSuggestions(): void;
  toggleSelectedArtist(artist: string): void;
  complete(): TasteProfile;
  reset(): void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

type OnboardingProviderProps = PropsWithChildren<{
  initialDraft?: TasteProfileDraft;
}>;

export function OnboardingProvider({ children, initialDraft }: OnboardingProviderProps) {
  const [draft, setDraft] = useState<TasteProfileDraft>(initialDraft ?? emptyTasteProfileDraft);

  const value = useMemo<OnboardingContextValue>(() => {
    return {
      draft,
      validation: validateTasteProfile(draft),
      toggleGenre: (genre) => {
        setDraft((current) => ({
          ...current,
          genres: toggleLimitedValue(current.genres, genre, maximumTasteProfile.genres),
        }));
      },
      toggleContext: (context) => {
        setDraft((current) => ({
          ...current,
          contexts: toggleLimitedValue(current.contexts, context, maximumTasteProfile.contexts),
        }));
      },
      setDimension: (dimension, dimensionValue) => {
        setDraft((current) => ({
          ...current,
          dimensions: updateTrackDimension(current.dimensions, dimension, dimensionValue),
        }));
      },
      refreshArtistSuggestions: () => {
        setDraft((current) => {
          const suggestedArtists = deriveArtistSuggestions(current);

          return {
            ...current,
            suggestedArtists,
            selectedArtists: current.selectedArtists.filter((artist) =>
              suggestedArtists.includes(artist),
            ),
          };
        });
      },
      toggleSelectedArtist: (artist) => {
        setDraft((current) => ({
          ...current,
          selectedArtists: toggleLimitedValue(
            current.selectedArtists,
            artist,
            maximumTasteProfile.selectedArtists,
          ),
        }));
      },
      complete: () => completeTasteProfile(draft),
      reset: () => {
        setDraft(emptyTasteProfileDraft);
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
