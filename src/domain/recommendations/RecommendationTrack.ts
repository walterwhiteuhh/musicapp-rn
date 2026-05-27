import type { Track } from '@/domain/music/Track';
import type { ListeningContext, TrackDimensions } from '@/domain/taste/TasteProfile';

export type RecommendationSourceProvider = 'soundcloud' | 'youtube' | 'editorial';

export type RecommendationSourceKind =
  | 'artist-profile'
  | 'track'
  | 'classic-version'
  | 'live-set'
  | 'festival-set'
  | 'radio-show'
  | 'cultural-reference';

export type RecommendationSourceLink = {
  label: string;
  provider: RecommendationSourceProvider;
  kind: RecommendationSourceKind;
  url: string;
  context?: string;
};

export type WeightedTag = {
  tag: string;
  weight: number;
};

export type RecommendationTrack = Track & {
  genre: string;
  styleTags?: WeightedTag[];
  sceneTags?: WeightedTag[];
  functionTags?: WeightedTag[];
  contexts: ListeningContext[];
  dimensions: TrackDimensions;
  reason: string;
  genreLineage?: string;
  culturalContext?: string;
  technicalProfile?: {
    bpmRange?: string;
    kickPressure?: 'low' | 'medium' | 'high' | 'extreme';
    dropDensity?: 'low' | 'medium' | 'high';
    melodicLift?: 'low' | 'medium' | 'high';
    legacySignals?: string[];
  };
  relatedArtists?: string[];
  sourceLinks?: RecommendationSourceLink[];
};
