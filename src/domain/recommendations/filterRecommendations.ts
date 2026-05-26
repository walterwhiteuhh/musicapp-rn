import type { TasteProfile, TrackDimensions } from '@/domain/taste/TasteProfile';
import type { RecommendationTrack } from './RecommendationTrack';

export function filterRecommendations(
  tracks: RecommendationTrack[],
  profile: TasteProfile | null,
): RecommendationTrack[] {
  if (!profile || profile.completedAt === null) {
    return tracks;
  }

  const scoredTracks = tracks.map((track) => ({
    track,
    score: scoreRecommendation(track, profile),
  }));
  const matchingTracks = scoredTracks
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.track);

  return matchingTracks.length > 0 ? matchingTracks : tracks;
}

function scoreRecommendation(track: RecommendationTrack, profile: TasteProfile): number {
  let score = 0;

  if (profile.genres.includes(track.genre)) {
    score += 4;
  }

  if (profile.selectedArtists.includes(track.artistName)) {
    score += 7;
  }

  score +=
    (track.relatedArtists?.filter((artist) => profile.selectedArtists.includes(artist)).length ??
      0) * 3;

  score += track.contexts.filter((context) => profile.contexts.includes(context)).length * 2;
  score += Math.max(0, 4 - dimensionDistance(track.dimensions, profile.dimensions) / 25);

  return score;
}

function dimensionDistance(left: TrackDimensions, right: TrackDimensions): number {
  const keys: (keyof TrackDimensions)[] = ['energy', 'density', 'texture', 'space', 'rhythm'];
  const totalDistance = keys.reduce((sum, key) => sum + Math.abs(left[key] - right[key]), 0);

  return totalDistance / keys.length;
}
