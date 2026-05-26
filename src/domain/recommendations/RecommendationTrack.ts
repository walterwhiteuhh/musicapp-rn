import type { Track } from '@/domain/music/Track';
import type { ListeningContext, TrackDimensions } from '@/domain/taste/TasteProfile';

export type RecommendationTrack = Track & {
  genre: string;
  contexts: ListeningContext[];
  dimensions: TrackDimensions;
  reason: string;
};
