import type { Track } from '@/domain/music/Track';
import type { ListeningContext, TrackDimensions } from '@/domain/taste/TasteProfile';

export type RecommendationSourceProvider = 'soundcloud' | 'youtube' | 'editorial';

export type RecommendationSourceKind =
  | 'artist-profile'
  | 'track'
  | 'classic-version'
  | 'live-set'
  | 'festival-set'
  | 'cultural-reference';

export type RecommendationSourceLink = {
  label: string;
  provider: RecommendationSourceProvider;
  kind: RecommendationSourceKind;
  url: string;
  context?: string;
};

export type RecommendationTrack = Track & {
  genre: string;
  contexts: ListeningContext[];
  dimensions: TrackDimensions;
  reason: string;
  genreLineage?: string;
  culturalContext?: string;
  relatedArtists?: string[];
  sourceLinks?: RecommendationSourceLink[];
};
