import { starterArtistReferences } from '@/data/catalog';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
import type { ListeningContext, TasteProfileDraft } from '@/domain/taste/TasteProfile';

export const electronicGenres = [
  'Peak-time Techno',
  'Hard Techno',
  'Acid Techno',
  'Trance Revival',
  'Melodic Techno',
  'Progressive House',
  'High-tech Minimal',
  'Hardgroove',
  'Hypnotic Techno',
  'House',
  'Breakbeat',
  'UK Garage',
  'Dub Techno',
  'Ambient',
  'Drum & Bass',
  'Leftfield Bass',
];

export const lineageOptions = [
  'Belgian peak-time techno',
  'hard techno / hard dance crossover',
  'modern acid / trance pressure',
  'mainstage trance legacy',
  'melodic techno / progressive',
  'high-tech minimal',
  'hardgroove',
  'Berlin hypnotic',
  'early trance / rave',
  'UK breaks / garage',
  'dub techno',
  'ambient / listening',
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
  cluster:
    | 'belgian-peak-time'
    | 'melodic-progressive'
    | 'hardtechno-mainstage'
    | 'high-tech-minimal'
    | 'hardgroove'
    | 'trance-revival'
    | 'berlin-hypnotic'
    | 'uk-breaks'
    | 'ambient-listening';
  genres?: string[];
  contexts?: ListeningContext[];
  dimension?: keyof TasteProfileDraft['dimensions'];
  min?: number;
  max?: number;
  gatewayScore: number;
};

export const artistSuggestionLimit = 18;

const artistRules: ArtistRule[] = [
  {
    artist: 'Charlotte de Witte',
    cluster: 'belgian-peak-time',
    genres: ['Peak-time Techno', 'Hard Techno', 'Acid Techno', 'Trance Revival'],
    contexts: ['Club', 'Training'],
    dimension: 'energy',
    min: 60,
    gatewayScore: 1,
  },
  {
    artist: 'Lilly Palmer',
    cluster: 'hardtechno-mainstage',
    genres: ['Hard Techno', 'Peak-time Techno', 'Trance Revival'],
    contexts: ['Club', 'Training', 'Afterhours'],
    dimension: 'energy',
    min: 68,
    gatewayScore: 0.94,
  },
  {
    artist: 'Amelie Lens',
    cluster: 'belgian-peak-time',
    genres: ['Peak-time Techno', 'Hard Techno', 'Acid Techno'],
    contexts: ['Club', 'Training'],
    dimension: 'energy',
    min: 62,
    gatewayScore: 0.98,
  },
  {
    artist: 'Miss Monique',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House', 'Trance Revival'],
    contexts: ['Club', 'Night drive', 'Headphones'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.94,
  },
  {
    artist: 'Indira Paganotto',
    cluster: 'belgian-peak-time',
    genres: ['Peak-time Techno', 'Hard Techno', 'Trance Revival'],
    contexts: ['Club', 'Training'],
    dimension: 'energy',
    min: 65,
    gatewayScore: 0.9,
  },
  {
    artist: 'Alignment',
    cluster: 'belgian-peak-time',
    genres: ['Peak-time Techno', 'Hard Techno', 'Trance Revival'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'energy',
    min: 65,
    gatewayScore: 0.78,
  },
  {
    artist: '999999999',
    cluster: 'belgian-peak-time',
    genres: ['Acid Techno', 'Hard Techno', 'Trance Revival'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'texture',
    min: 55,
    gatewayScore: 0.74,
  },
  {
    artist: 'Reinier Zonneveld',
    cluster: 'hardtechno-mainstage',
    genres: ['Peak-time Techno', 'Acid Techno', 'Hard Techno'],
    contexts: ['Club', 'Training'],
    dimension: 'energy',
    min: 70,
    gatewayScore: 0.82,
  },
  {
    artist: 'Armin van Buuren',
    cluster: 'hardtechno-mainstage',
    genres: ['Trance Revival'],
    contexts: ['Club'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.7,
  },
  {
    artist: 'Tiesto',
    cluster: 'hardtechno-mainstage',
    genres: ['Trance Revival'],
    contexts: ['Club'],
    dimension: 'energy',
    min: 55,
    gatewayScore: 0.68,
  },
  {
    artist: 'ANNA',
    cluster: 'belgian-peak-time',
    genres: ['Peak-time Techno', 'Acid Techno', 'Melodic Techno'],
    contexts: ['Club'],
    dimension: 'density',
    min: 45,
    gatewayScore: 0.8,
  },
  {
    artist: 'Boris Brejcha',
    cluster: 'high-tech-minimal',
    genres: ['High-tech Minimal'],
    contexts: ['Club'],
    dimension: 'density',
    max: 58,
    gatewayScore: 0.92,
  },
  {
    artist: 'Ann Clue',
    cluster: 'high-tech-minimal',
    genres: ['High-tech Minimal'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'density',
    max: 60,
    gatewayScore: 0.72,
  },
  {
    artist: 'Deniz Bul',
    cluster: 'high-tech-minimal',
    genres: ['High-tech Minimal'],
    contexts: ['Club'],
    dimension: 'density',
    max: 60,
    gatewayScore: 0.68,
  },
  {
    artist: 'ARTBAT',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Club', 'Night drive'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.9,
  },
  {
    artist: 'Tale Of Us',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Club', 'Afterhours', 'Night drive'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.93,
  },
  {
    artist: 'Anyma',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Club'],
    dimension: 'space',
    min: 48,
    gatewayScore: 0.86,
  },
  {
    artist: 'Mind Against',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Afterhours', 'Night drive'],
    dimension: 'space',
    min: 50,
    gatewayScore: 0.8,
  },
  {
    artist: 'Innellea',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Club', 'Headphones'],
    dimension: 'texture',
    min: 45,
    gatewayScore: 0.76,
  },
  {
    artist: 'Ben Boehmer',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House', 'Ambient'],
    contexts: ['Headphones', 'Home'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.84,
  },
  {
    artist: 'Stephan Bodzin',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Club', 'Headphones'],
    dimension: 'space',
    min: 50,
    gatewayScore: 0.82,
  },
  {
    artist: 'NTO',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Headphones', 'Home'],
    dimension: 'space',
    min: 50,
    gatewayScore: 0.72,
  },
  {
    artist: 'Worakls',
    cluster: 'melodic-progressive',
    genres: ['Melodic Techno', 'Progressive House'],
    contexts: ['Home', 'Headphones'],
    dimension: 'space',
    min: 55,
    gatewayScore: 0.7,
  },
  {
    artist: 'KI/KI',
    cluster: 'trance-revival',
    genres: ['Trance Revival', 'Acid Techno'],
    contexts: ['Afterhours', 'Club'],
    dimension: 'energy',
    min: 60,
    gatewayScore: 0.88,
  },
  {
    artist: 'Marlon Hoffstadt',
    cluster: 'trance-revival',
    genres: ['Trance Revival', 'Hard Techno'],
    contexts: ['Training', 'Club'],
    dimension: 'energy',
    min: 65,
    gatewayScore: 0.82,
  },
  {
    artist: 'DJ Heartstring',
    cluster: 'trance-revival',
    genres: ['Trance Revival', 'UK Garage'],
    contexts: ['Afterhours', 'Club'],
    dimension: 'rhythm',
    min: 50,
    gatewayScore: 0.78,
  },
  {
    artist: 'Job Jobse',
    cluster: 'trance-revival',
    genres: ['Trance Revival', 'House'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.76,
  },
  {
    artist: 'Anfisa Letyago',
    cluster: 'hardgroove',
    genres: ['Hardgroove', 'Peak-time Techno'],
    contexts: ['Club', 'Training'],
    dimension: 'rhythm',
    min: 55,
    gatewayScore: 0.76,
  },
  {
    artist: 'Chlar',
    cluster: 'hardgroove',
    genres: ['Hardgroove', 'Hard Techno'],
    contexts: ['Club', 'Training'],
    dimension: 'rhythm',
    min: 60,
    gatewayScore: 0.64,
  },
  {
    artist: 'Funk Assault',
    cluster: 'hardgroove',
    genres: ['Hardgroove'],
    contexts: ['Club', 'Training'],
    dimension: 'rhythm',
    min: 62,
    gatewayScore: 0.58,
  },
  {
    artist: 'Ben Klock',
    cluster: 'berlin-hypnotic',
    genres: ['Hypnotic Techno', 'Dub Techno'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'density',
    max: 60,
    gatewayScore: 0.82,
  },
  {
    artist: 'DVS1',
    cluster: 'berlin-hypnotic',
    genres: ['Hypnotic Techno'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'density',
    max: 62,
    gatewayScore: 0.72,
  },
  {
    artist: 'Rodhad',
    cluster: 'berlin-hypnotic',
    genres: ['Hypnotic Techno', 'Dub Techno'],
    contexts: ['Club', 'Afterhours'],
    dimension: 'space',
    min: 45,
    gatewayScore: 0.7,
  },
  {
    artist: 'Bicep',
    cluster: 'uk-breaks',
    genres: ['Breakbeat', 'House'],
    contexts: ['Home', 'Headphones'],
    dimension: 'rhythm',
    min: 45,
    gatewayScore: 0.9,
  },
  {
    artist: 'Overmono',
    cluster: 'uk-breaks',
    genres: ['Breakbeat', 'UK Garage'],
    contexts: ['Club', 'Headphones'],
    dimension: 'rhythm',
    min: 55,
    gatewayScore: 0.82,
  },
  {
    artist: 'Burial',
    cluster: 'uk-breaks',
    genres: ['UK Garage', 'Leftfield Bass'],
    contexts: ['Night drive', 'Headphones'],
    dimension: 'space',
    min: 50,
    gatewayScore: 0.78,
  },
  {
    artist: 'Skee Mask',
    cluster: 'uk-breaks',
    genres: ['Breakbeat', 'Leftfield Bass'],
    contexts: ['Headphones', 'Night drive'],
    dimension: 'rhythm',
    min: 55,
    gatewayScore: 0.7,
  },
  {
    artist: 'Aphex Twin',
    cluster: 'ambient-listening',
    genres: ['Ambient', 'Leftfield Bass'],
    contexts: ['Focus', 'Headphones'],
    dimension: 'density',
    min: 55,
    gatewayScore: 0.84,
  },
  {
    artist: 'Jon Hopkins',
    cluster: 'ambient-listening',
    genres: ['Ambient', 'Melodic Techno'],
    contexts: ['Focus', 'Headphones'],
    dimension: 'space',
    min: 50,
    gatewayScore: 0.8,
  },
  {
    artist: 'Donato Dozzy',
    cluster: 'ambient-listening',
    genres: ['Dub Techno', 'Ambient', 'Hypnotic Techno'],
    contexts: ['Afterhours', 'Focus'],
    dimension: 'space',
    min: 55,
    gatewayScore: 0.68,
  },
  {
    artist: 'Deepchord',
    cluster: 'ambient-listening',
    genres: ['Dub Techno', 'Ambient'],
    contexts: ['Focus', 'Headphones'],
    dimension: 'space',
    min: 55,
    gatewayScore: 0.62,
  },
  {
    artist: 'Calibre',
    cluster: 'uk-breaks',
    genres: ['Drum & Bass'],
    contexts: ['Headphones', 'Night drive'],
    dimension: 'energy',
    max: 65,
    gatewayScore: 0.76,
  },
  {
    artist: 'Goldie',
    cluster: 'uk-breaks',
    genres: ['Drum & Bass'],
    contexts: ['Club', 'Headphones'],
    dimension: 'energy',
    min: 55,
    gatewayScore: 0.74,
  },
];

export function deriveArtistSuggestions(
  profile: TasteProfileDraft,
  limit = artistSuggestionLimit,
): string[] {
  const profileLineages = deriveLineageWeights(profile);
  const selectedClusters = selectedGenreClusters(profile.genres);

  const scoredArtists = artistRules.map((rule, index) => {
    let score = rule.gatewayScore;

    if (rule.genres?.some((genre) => profile.genres.includes(genre))) {
      score += 4;
    }

    if (selectedClusters.includes(rule.cluster)) {
      score += 3;
    }

    score += clusterLineageScore(rule.cluster, profileLineages);

    if (rule.contexts?.some((context) => profile.contexts.includes(context))) {
      score += 1.5;
    }

    if (rule.dimension) {
      const value = profile.dimensions[rule.dimension];

      if (typeof rule.min === 'number' && value >= rule.min) {
        score += 1.5;
      }

      if (typeof rule.max === 'number' && value <= rule.max) {
        score += 1.5;
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

export function enrichTasteDraft(profile: TasteProfileDraft): TasteProfileDraft {
  return {
    ...profile,
    lineageWeights: deriveLineageWeights(profile),
    artistAnchorWeights: deriveArtistAnchorWeights(profile.selectedArtists),
    discoveryDepth: createInitialDiscoveryDepth(0),
  };
}

export function deriveLineageWeights(profile: TasteProfileDraft): Record<string, number> {
  const weights: Record<string, number> = {};

  for (const genre of profile.genres) {
    for (const lineage of genreLineages[genre] ?? []) {
      weights[lineage] = (weights[lineage] ?? 0) + 2;
    }
  }

  for (const artistName of profile.selectedArtists) {
    const artist = starterArtistReferences.find((reference) => reference.name === artistName);

    for (const lineage of artist?.lineages ?? []) {
      weights[lineage] = (weights[lineage] ?? 0) + 3;
    }
  }

  return normalizeWeights(weights);
}

export function deriveArtistAnchorWeights(selectedArtists: string[]): Record<string, number> {
  return Object.fromEntries(selectedArtists.map((artist) => [artist, 1]));
}

const genreLineages: Record<string, string[]> = {
  'Peak-time Techno': ['Belgian peak-time techno', 'modern acid / trance pressure'],
  'Hard Techno': [
    'hard techno / hard dance crossover',
    'modern acid / trance pressure',
    'mainstage trance legacy',
  ],
  'Acid Techno': ['modern acid / trance pressure', 'early trance / rave'],
  'Trance Revival': ['early trance / rave', 'modern acid / trance pressure', 'mainstage trance legacy'],
  'Melodic Techno': ['melodic techno / progressive'],
  'Progressive House': ['melodic techno / progressive'],
  'High-tech Minimal': ['high-tech minimal'],
  Hardgroove: ['hardgroove'],
  'Hypnotic Techno': ['Berlin hypnotic'],
  House: ['melodic techno / progressive'],
  Breakbeat: ['UK breaks / garage'],
  'Drum & Bass': ['UK breaks / garage'],
  Ambient: ['ambient / listening'],
  'Dub Techno': ['dub techno', 'Berlin hypnotic'],
  'UK Garage': ['UK breaks / garage'],
  'Leftfield Bass': ['UK breaks / garage'],
  Techno: ['Belgian peak-time techno', 'Berlin hypnotic', 'hardgroove'],
  Trance: ['early trance / rave', 'modern acid / trance pressure'],
  Downtempo: ['melodic techno / progressive', 'ambient / listening'],
  Electro: ['early trance / rave'],
  IDM: ['ambient / listening', 'UK breaks / garage'],
};

function selectedGenreClusters(genres: string[]): ArtistRule['cluster'][] {
  return Array.from(
    new Set(
      genres.flatMap((genre) => {
    if (['Peak-time Techno', 'Acid Techno'].includes(genre)) {
      return ['belgian-peak-time'] as ArtistRule['cluster'][];
    }

    if (genre === 'Hard Techno') {
      return ['hardtechno-mainstage', 'belgian-peak-time'] as ArtistRule['cluster'][];
    }

        if (['Melodic Techno', 'Progressive House', 'House'].includes(genre)) {
          return ['melodic-progressive'] as ArtistRule['cluster'][];
        }

        if (genre === 'High-tech Minimal') {
          return ['high-tech-minimal'] as ArtistRule['cluster'][];
        }

        if (genre === 'Hardgroove') {
          return ['hardgroove'] as ArtistRule['cluster'][];
        }

        if (genre === 'Trance Revival') {
          return ['trance-revival', 'hardtechno-mainstage', 'belgian-peak-time'] as ArtistRule['cluster'][];
        }

        if (['Hypnotic Techno', 'Dub Techno'].includes(genre)) {
          return ['berlin-hypnotic'] as ArtistRule['cluster'][];
        }

        if (['Breakbeat', 'UK Garage', 'Drum & Bass', 'Leftfield Bass'].includes(genre)) {
          return ['uk-breaks'] as ArtistRule['cluster'][];
        }

        if (genre === 'Ambient') {
          return ['ambient-listening'] as ArtistRule['cluster'][];
        }

        return [];
      }),
    ),
  );
}

function clusterLineageScore(
  cluster: ArtistRule['cluster'],
  lineageWeights: Record<string, number>,
): number {
  const lineageByCluster: Record<ArtistRule['cluster'], string[]> = {
    'belgian-peak-time': ['Belgian peak-time techno', 'modern acid / trance pressure'],
    'melodic-progressive': ['melodic techno / progressive'],
    'hardtechno-mainstage': [
      'hard techno / hard dance crossover',
      'modern acid / trance pressure',
      'mainstage trance legacy',
    ],
    'high-tech-minimal': ['high-tech minimal'],
    hardgroove: ['hardgroove'],
    'trance-revival': ['early trance / rave', 'modern acid / trance pressure'],
    'berlin-hypnotic': ['Berlin hypnotic', 'dub techno'],
    'uk-breaks': ['UK breaks / garage'],
    'ambient-listening': ['ambient / listening', 'dub techno'],
  };

  return lineageByCluster[cluster].reduce((score, lineage) => score + (lineageWeights[lineage] ?? 0), 0) * 2;
}

function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const maxWeight = Math.max(1, ...Object.values(weights));

  return Object.fromEntries(
    Object.entries(weights)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, Math.round((value / maxWeight) * 100) / 100]),
  );
}
