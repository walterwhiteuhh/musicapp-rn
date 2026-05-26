import type { TasteProfileDraft } from '@/domain/taste';
import { deriveArtistSuggestions } from '@/features/onboarding/options';

const technoDraft: TasteProfileDraft = {
  genres: ['Techno', 'Trance'],
  contexts: ['Club', 'Afterhours'],
  dimensions: {
    energy: 72,
    density: 50,
    texture: 55,
    space: 58,
    rhythm: 48,
  },
  suggestedArtists: [],
  selectedArtists: [],
};

describe('deriveArtistSuggestions', () => {
  it('prioritizes recognizable European electronic artists', () => {
    const suggestions = deriveArtistSuggestions(technoDraft);

    expect(suggestions).toHaveLength(10);
    expect(suggestions.slice(0, 5)).toEqual(
      expect.arrayContaining(['Boris Brejcha', 'Charlotte de Witte', 'KI/KI']),
    );
  });
});
