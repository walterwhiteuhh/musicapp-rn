export type TasteProfile = {
  genres: string[];
  moods: string[];
  artists: string[];
  completedAt: string | null;
};

export type TasteProfileDraft = Omit<TasteProfile, 'completedAt'>;

export type TasteProfileValidation = {
  canContinueGenres: boolean;
  canContinueMoods: boolean;
  canContinueArtists: boolean;
  canComplete: boolean;
};

export const emptyTasteProfile: TasteProfile = {
  genres: [],
  moods: [],
  artists: [],
  completedAt: null,
};

export const minimumTasteProfile = {
  genres: 2,
  moods: 1,
  artists: 1,
};

export function validateTasteProfile(profile: TasteProfileDraft): TasteProfileValidation {
  const canContinueGenres = profile.genres.length >= minimumTasteProfile.genres;
  const canContinueMoods = profile.moods.length >= minimumTasteProfile.moods;
  const canContinueArtists = profile.artists.length >= minimumTasteProfile.artists;

  return {
    canContinueGenres,
    canContinueMoods,
    canContinueArtists,
    canComplete: canContinueGenres && canContinueMoods && canContinueArtists,
  };
}

export function toggleTasteValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function completeTasteProfile(profile: TasteProfileDraft, completedAt = new Date()): TasteProfile {
  return {
    ...profile,
    completedAt: completedAt.toISOString(),
  };
}
