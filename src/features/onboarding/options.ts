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
  { artist: 'Ben Klock', genres: ['Techno'], contexts: ['Club'], dimension: 'energy', min: 55 },
  { artist: 'Amelie Lens', genres: ['Techno'], contexts: ['Training'], dimension: 'energy', min: 65 },
  { artist: 'Dax J', genres: ['Techno'], dimension: 'texture', min: 60 },
  { artist: 'Bicep', genres: ['Breakbeat', 'House'], contexts: ['Home'], dimension: 'space', min: 45 },
  { artist: 'Overmono', genres: ['Breakbeat', 'UK Garage'], dimension: 'rhythm', min: 55 },
  { artist: 'Skee Mask', genres: ['IDM', 'Breakbeat'], dimension: 'rhythm', min: 55 },
  { artist: 'Aphex Twin', genres: ['IDM', 'Ambient'], dimension: 'density', min: 55 },
  { artist: 'Jon Hopkins', genres: ['Ambient', 'Downtempo'], contexts: ['Focus', 'Headphones'] },
  { artist: 'Kiasmos', genres: ['Ambient', 'Downtempo'], dimension: 'space', min: 55 },
  { artist: 'Loscil', genres: ['Ambient'], contexts: ['Focus'], dimension: 'energy', max: 45 },
  { artist: 'Deepchord', genres: ['Dub Techno'], dimension: 'space', min: 55 },
  { artist: 'Donato Dozzy', genres: ['Dub Techno', 'Ambient'], contexts: ['Afterhours'] },
  { artist: 'Vril', genres: ['Dub Techno', 'Techno'], dimension: 'texture', min: 50 },
  { artist: 'Floating Points', genres: ['House', 'Downtempo'], contexts: ['Headphones'] },
  { artist: 'Four Tet', genres: ['House', 'Downtempo', 'UK Garage'], dimension: 'density', min: 45 },
  { artist: 'DJ Stingray 313', genres: ['Electro'], dimension: 'energy', min: 55 },
  { artist: 'Drexciya', genres: ['Electro'], dimension: 'texture', min: 45 },
  { artist: 'Calibre', genres: ['Drum & Bass'], dimension: 'energy', max: 65 },
  { artist: 'Goldie', genres: ['Drum & Bass'], dimension: 'energy', min: 55 },
  { artist: 'Burial', genres: ['UK Garage', 'Leftfield Bass'], contexts: ['Night drive'] },
  { artist: 'SOPHIE', genres: ['Leftfield Bass'], dimension: 'texture', min: 65 },
  { artist: 'Autechre', genres: ['IDM', 'Experimental'], dimension: 'density', min: 65 },
  { artist: 'Robert Hood', genres: ['Techno'], dimension: 'density', max: 45 },
  { artist: 'Sasha', genres: ['Trance', 'House'], dimension: 'space', min: 45 },
  { artist: 'Solarstone', genres: ['Trance'], dimension: 'space', min: 55 },
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
