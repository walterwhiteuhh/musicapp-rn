import type { Track } from '@/domain/music/Track';

export type RecommendationTrack = Track & {
  genre: string;
  mood: string;
  reason: string;
};
