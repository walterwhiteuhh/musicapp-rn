import type { TasteProfile } from '@/domain/taste/TasteProfile';
import type { RecommendationTrack } from './RecommendationTrack';

export function filterRecommendations(
  tracks: RecommendationTrack[],
  profile: TasteProfile | null,
): RecommendationTrack[] {
  if (!profile || profile.completedAt === null) {
    return tracks;
  }

  const genreMatches = new Set(profile.genres.map((genre) => genre.toLowerCase()));
  const moodMatches = new Set(profile.moods.map((mood) => mood.toLowerCase()));
  const filteredTracks = tracks.filter((track) => {
    return (
      genreMatches.has(track.genre.toLowerCase()) || moodMatches.has(track.mood.toLowerCase())
    );
  });

  return filteredTracks.length > 0 ? filteredTracks : tracks;
}
