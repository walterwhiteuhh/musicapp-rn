import type { ListeningContext, TasteProfileDraft } from '@/domain/taste/TasteProfile';

export const electronicGenres = [
  'Techno',
  'House',
  'Electro',
  'Breakbeat',
  'Drum & Bass',
  'Ambient',
  'IDM',
  'Trance',
  'Dub Techno',
  'UK Garage',
  'Leftfield Bass',
  'Downtempo',
];

export const listeningContexts: ListeningContext[] = [
  'Club',
  'Headphones',
  'Focus',
  'Night drive',
  'Training',
  'Afterhours',
  'Home',
];

export const dimensionCopy = {
  energy: {
    label: 'Energy',
    low: 'Calm',
    high: 'Driving',
  },
  density: {
    label: 'Density',
    low: 'Minimal',
    high: 'Complex',
  },
  texture: {
    label: 'Texture',
    low: 'Clean',
    high: 'Raw',
  },
  space: {
    label: 'Space',
    low: 'Close',
    high: 'Atmospheric',
  },
  rhythm: {
    label: 'Rhythm',
    low: 'Straight',
    high: 'Broken',
  },
} as const;

type ArtistRule = {
  artist: string;
  genres?: string[];
  contexts?: ListeningContext[];
  dimension?: keyof TasteProfileDraft['dimensions'];
  min?: number;
  max?: number;
};

const artistRules: ArtistRule[] = [
  { artist: 'Boris Brejcha', genres: ['Techno'], contexts: ['Club'], dimension: 'energy', min: 55 },
  { artist: 'Charlotte de Witte', genres: ['Techno'], contexts: ['Club'], dimension: 'energy', min: 60 },
  { artist: 'Amelie Lens', genres: ['Techno'], contexts: ['Training'], dimension: 'energy', min: 65 },
  { artist: 'Paul Kalkbrenner', genres: ['House', 'Techno'], contexts: ['Home'], dimension: 'density', max: 50 },
  { artist: 'Ben Böhmer', genres: ['Downtempo', 'House'], contexts: ['Headphones', 'Home'], dimension: 'space', min: 45 },
  { artist: 'Stephan Bodzin', genres: ['Techno', 'Trance'], dimension: 'space', min: 50 },
  { artist: 'Solomun', genres: ['House'], contexts: ['Club', 'Afterhours'], dimension: 'density', max: 55 },
  { artist: 'Âme', genres: ['House', 'Techno'], contexts: ['Afterhours'], dimension: 'space', min: 45 },
  { artist: 'KI/KI', genres: ['Trance', 'Techno'], contexts: ['Afterhours'], dimension: 'energy', min: 60 },
  { artist: 'Job Jobse', genres: ['Trance', 'House'], contexts: ['Club'], dimension: 'space', min: 45 },
  { artist: 'Marlon Hoffstadt', genres: ['Trance', 'Techno'], contexts: ['Training'], dimension: 'energy', min: 65 },
  { artist: 'DJ Heartstring', genres: ['Trance', 'UK Garage'], contexts: ['Afterhours'], dimension: 'rhythm', min: 50 },
  { artist: 'Reinier Zonneveld', genres: ['Techno'], dimension: 'energy', min: 70 },
  { artist: 'NTO', genres: ['Downtempo', 'Techno'], contexts: ['Headphones'], dimension: 'space', min: 50 },
  { artist: 'Worakls', genres: ['Downtempo', 'Trance'], contexts: ['Home'], dimension: 'space', min: 55 },
  { artist: 'Kölsch', genres: ['House', 'Techno'], dimension: 'space', min: 45 },
  { artist: 'Bicep', genres: ['Breakbeat', 'House'], contexts: ['Home'], dimension: 'rhythm', min: 45 },
  { artist: 'Overmono', genres: ['Breakbeat', 'UK Garage'], dimension: 'rhythm', min: 55 },
  { artist: 'Burial', genres: ['UK Garage', 'Leftfield Bass'], contexts: ['Night drive'] },
  { artist: 'Skee Mask', genres: ['IDM', 'Breakbeat'], dimension: 'rhythm', min: 55 },
  { artist: 'Aphex Twin', genres: ['IDM', 'Ambient'], dimension: 'density', min: 55 },
  { artist: 'Jon Hopkins', genres: ['Ambient', 'Downtempo'], contexts: ['Focus', 'Headphones'] },
  { artist: 'Donato Dozzy', genres: ['Dub Techno', 'Ambient'], contexts: ['Afterhours'] },
  { artist: 'Deepchord', genres: ['Dub Techno'], dimension: 'space', min: 55 },
  { artist: 'Calibre', genres: ['Drum & Bass'], dimension: 'energy', max: 65 },
  { artist: 'Goldie', genres: ['Drum & Bass'], dimension: 'energy', min: 55 },
];

export function deriveArtistSuggestions(profile: TasteProfileDraft, limit = 10): string[] {
  const scoredArtists = artistRules.map((rule, index) => {
    let score = 0;

    if (rule.genres?.some((genre) => profile.genres.includes(genre))) {
      score += 4;
    }

    if (rule.contexts?.some((context) => profile.contexts.includes(context))) {
      score += 2;
    }

    if (rule.dimension) {
      const value = profile.dimensions[rule.dimension];

      if (typeof rule.min === 'number' && value >= rule.min) {
        score += 2;
      }

      if (typeof rule.max === 'number' && value <= rule.max) {
        score += 2;
      }
    }

    return {
      artist: rule.artist,
      score,
      index,
    };
  });

  return scoredArtists
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map((entry) => entry.artist);
}
