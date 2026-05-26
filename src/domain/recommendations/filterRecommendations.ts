import type { TasteProfile, TrackDimensions } from '@/domain/taste/TasteProfile';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
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

  const trackStyleTags = track.styleTags ?? [{ tag: track.genre, weight: 1 }];
  const selectedStyleTags = new Set(profile.genres);
  score += weightedTagOverlap(trackStyleTags, selectedStyleTags) * 4;

  const lineageWeights = profile.lineageWeights ?? {};
  const discoveryDepth = profile.discoveryDepth ?? createInitialDiscoveryDepth(0);

  const lineageTags = track.sceneTags ?? [{ tag: track.genreLineage ?? track.genre, weight: 1 }];
  score += weightedRecordOverlap(lineageTags, lineageWeights) * 4;

  if (profile.selectedArtists.includes(track.artistName)) {
    score += 4 + discoveryDepth.recognitionBias / 25;
  }

  score +=
    (track.relatedArtists?.filter((artist) => profile.selectedArtists.includes(artist)).length ??
      0) * (2 + discoveryDepth.recognitionBias / 50);

  score += track.contexts.filter((context) => profile.contexts.includes(context)).length * 2;
  score += Math.max(0, 4 - dimensionDistance(track.dimensions, profile.dimensions) / 25);

  return score;
}

function weightedTagOverlap(
  tags: NonNullable<RecommendationTrack['styleTags']>,
  selectedTags: Set<string>,
): number {
  return tags.reduce((score, tag) => score + (selectedTags.has(tag.tag) ? tag.weight : 0), 0);
}

function weightedRecordOverlap(
  tags: NonNullable<RecommendationTrack['sceneTags']>,
  weights: Record<string, number>,
): number {
  return tags.reduce((score, tag) => score + (weights[tag.tag] ?? 0) * tag.weight, 0);
}

function dimensionDistance(left: TrackDimensions, right: TrackDimensions): number {
  const keys: (keyof TrackDimensions)[] = ['energy', 'density', 'texture', 'space', 'rhythm'];
  const totalDistance = keys.reduce((sum, key) => sum + Math.abs(left[key] - right[key]), 0);

  return totalDistance / keys.length;
}
