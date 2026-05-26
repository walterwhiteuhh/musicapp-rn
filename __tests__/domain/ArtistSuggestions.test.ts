import type { TasteProfileDraft } from '@/domain/taste';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
import { artistSuggestionLimit, deriveArtistSuggestions } from '@/features/onboarding/options';

const peakTimeDraft: TasteProfileDraft = {
  genres: ['Peak-time Techno', 'Acid Techno'],
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
  lineageWeights: {},
  artistAnchorWeights: {},
  discoveryDepth: createInitialDiscoveryDepth(0),
};

describe('deriveArtistSuggestions', () => {
  it('returns a wider artist cluster instead of capping discovery at ten names', () => {
    expect(deriveArtistSuggestions(peakTimeDraft)).toHaveLength(artistSuggestionLimit);
    expect(artistSuggestionLimit).toBeGreaterThan(10);
  });

  it('keeps Charlotte de Witte near Amelie Lens and away from high-tech minimal by default', () => {
    const suggestions = deriveArtistSuggestions(peakTimeDraft);

    expect(suggestions.slice(0, 5)).toEqual(
      expect.arrayContaining(['Charlotte de Witte', 'Amelie Lens', 'Indira Paganotto']),
    );
    expect(suggestions.indexOf('Amelie Lens')).toBeLessThan(suggestions.indexOf('Boris Brejcha'));
  });

  it('routes melodic progressive profiles toward Miss Monique before harder techno', () => {
    const suggestions = deriveArtistSuggestions({
      ...peakTimeDraft,
      genres: ['Melodic Techno', 'Progressive House'],
      contexts: ['Night drive', 'Headphones'],
      dimensions: {
        energy: 55,
        density: 44,
        texture: 52,
        space: 70,
        rhythm: 40,
      },
    });

    expect(suggestions.slice(0, 6)).toEqual(
      expect.arrayContaining(['Miss Monique', 'ARTBAT', 'Tale Of Us']),
    );
    expect(suggestions.indexOf('Miss Monique')).toBeLessThan(suggestions.indexOf('Boris Brejcha'));
  });

  it('only promotes Boris Brejcha when high-tech minimal is explicitly selected', () => {
    const suggestions = deriveArtistSuggestions({
      ...peakTimeDraft,
      genres: ['High-tech Minimal', 'House'],
      contexts: ['Club'],
      dimensions: {
        energy: 62,
        density: 38,
        texture: 42,
        space: 44,
        rhythm: 28,
      },
    });

    expect(suggestions.slice(0, 4)).toContain('Boris Brejcha');
  });

  it('places Lilly Palmer in the hard-techno mainstage path with trance legacy nearby', () => {
    const suggestions = deriveArtistSuggestions({
      ...peakTimeDraft,
      genres: ['Hard Techno', 'Trance Revival'],
      contexts: ['Club', 'Training'],
      dimensions: {
        energy: 86,
        density: 76,
        texture: 68,
        space: 40,
        rhythm: 46,
      },
    });

    expect(suggestions.slice(0, 6)).toContain('Lilly Palmer');
    expect(suggestions).toEqual(expect.arrayContaining(['Armin van Buuren', 'Tiesto']));
    expect(suggestions.slice(0, 8)).not.toContain('Boris Brejcha');
  });
});
