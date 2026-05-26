import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';
import { filterRecommendations } from '@/domain/recommendations/filterRecommendations';
import type { RecommendationTrack } from '@/domain/recommendations/RecommendationTrack';
import type { TasteProfile } from '@/domain/taste/TasteProfile';
import { colors } from '@/theme/colors';

const repository = new AsyncStorageTasteProfileRepository();

export function DiscoverScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [focusTrack, setFocusTrack] = useState<RecommendationTrack | null>(null);
  const useGrid = Platform.OS === 'web' && width >= 780;

  useEffect(() => {
    void repository.getProfile().then(setProfile);
  }, []);

  const recommendations = useMemo(() => {
    const baseRecommendations = filterRecommendations(electronicRecommendationFixtures, profile);

    if (!focusTrack) {
      return baseRecommendations;
    }

    return [...baseRecommendations].sort(
      (left, right) => scoreSimilarity(right, focusTrack) - scoreSimilarity(left, focusTrack),
    );
  }, [focusTrack, profile]);
  const featuredTrack = recommendations[0] ?? null;
  const feedTracks = featuredTrack ? recommendations.slice(1) : recommendations;

  return (
    <ScreenContainer>
      <FlatList
        key={useGrid ? 'grid' : 'list'}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Klangfeld</Text>
              <Text style={styles.title}>Your electronic discovery surface.</Text>
              <Text style={styles.subtitle}>
                {profile?.completedAt
                  ? 'Artist picks start strong now and fade as listening behavior becomes more useful.'
                  : 'Demo mode is active: Klangfeld actions first, source links second.'}
              </Text>
              {!profile?.completedAt && (
                <ActionButton onPress={() => router.push('/onboarding/welcome' as never)}>
                  Create taste profile
                </ActionButton>
              )}
            </View>
            {featuredTrack ? (
              <FeaturedPreview
                focusActive={Boolean(focusTrack)}
                track={featuredTrack}
                onMoreLikeThis={() => setFocusTrack(featuredTrack)}
              />
            ) : null}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {focusTrack ? `More like ${focusTrack.artistName}` : 'Next signals'}
              </Text>
              {focusTrack ? (
                <Pressable accessibilityRole="button" style={styles.clearFocus} onPress={() => setFocusTrack(null)}>
                  <Text style={styles.clearFocusText}>Reset</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        }
        columnWrapperStyle={useGrid ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.list}
        data={feedTracks}
        keyExtractor={(item) => item.id}
        numColumns={useGrid ? 2 : 1}
        renderItem={({ item }) => <RecommendationCard track={item} />}
      />
    </ScreenContainer>
  );
}

function FeaturedPreview({
  focusActive,
  track,
  onMoreLikeThis,
}: {
  focusActive: boolean;
  track: RecommendationTrack;
  onMoreLikeThis: () => void;
}) {
  return (
    <View style={styles.featuredCard}>
      <Text style={styles.previewLabel}>Featured from your Klangprofil</Text>
      <View style={styles.playerSurface}>
        <View style={styles.previewSignal}>
          <View style={[styles.previewBar, { height: 24 }]} />
          <View style={[styles.previewBar, { height: 54 }]} />
          <View style={[styles.previewBar, { height: 34 }]} />
          <View style={[styles.previewBar, { height: 70 }]} />
          <View style={[styles.previewBar, { height: 42 }]} />
          <View style={[styles.previewBar, { height: 28 }]} />
          <View style={[styles.previewBar, { height: 58 }]} />
        </View>
        <View style={styles.playerCopy}>
          <Text numberOfLines={1} style={styles.featuredTitle}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={styles.featuredArtist}>
            {track.artistName}
          </Text>
          <Text style={styles.previewUnavailable}>Playback arrives later. Discovery data is active.</Text>
        </View>
      </View>
      <View style={styles.matchStrip}>
        <Text style={styles.matchText}>{track.genre}</Text>
        <Text style={styles.matchDivider}>/</Text>
        <Text style={styles.matchText}>{track.contexts.join(' + ')}</Text>
      </View>
      <Pressable accessibilityRole="button" style={styles.moreLikeButton} onPress={onMoreLikeThis}>
        <Text style={styles.moreLikeButtonText}>
          {focusActive ? 'Refresh similar signals' : 'More like this'}
        </Text>
      </Pressable>
      <View style={styles.reasonBox}>
        <Text style={styles.reasonLabel}>Why this leads</Text>
        <Text style={styles.reasonText}>{track.reason}</Text>
      </View>
      <SourceLink track={track} />
    </View>
  );
}

function RecommendationCard({ track }: { track: RecommendationTrack }) {
  return (
    <View style={styles.card}>
      <View style={styles.artwork}>
        <Text style={styles.artworkKicker}>{track.genre}</Text>
        <View style={styles.signalField}>
          <View style={[styles.signalBar, { height: 22 }]} />
          <View style={[styles.signalBar, { height: 42 }]} />
          <View style={[styles.signalBar, { height: 30 }]} />
          <View style={[styles.signalBar, { height: 54 }]} />
          <View style={[styles.signalBar, { height: 36 }]} />
          <View style={[styles.signalBar, { height: 24 }]} />
        </View>
        <Text numberOfLines={1} style={styles.artworkCaption}>
          SoundCloud preview / {track.contexts.join(' / ')}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.trackText}>
            <Text numberOfLines={1} style={styles.trackTitle}>
              {track.title}
            </Text>
            <Text numberOfLines={1} style={styles.artistName}>
              {track.artistName}
            </Text>
          </View>
          <Text style={styles.duration}>{formatDuration(track.durationMs)}</Text>
        </View>
        <View style={styles.tags}>
          <Text style={styles.tag}>{track.genre}</Text>
          {track.contexts.map((context) => (
            <Text key={context} style={styles.tagMuted}>
              {context}
            </Text>
          ))}
        </View>
        <View style={styles.dimensionStack}>
          <DimensionBar label="Energy" value={track.dimensions.energy} />
          <DimensionBar label="Space" value={track.dimensions.space} />
          <DimensionBar label="Rhythm" value={track.dimensions.rhythm} />
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Why recommended</Text>
          <Text style={styles.reasonText}>{track.reason}</Text>
        </View>
        <SourceLink track={track} compact />
      </View>
    </View>
  );
}

function SourceLink({ track, compact = false }: { track: RecommendationTrack; compact?: boolean }) {
  const openSource = async () => {
    if (!track.externalUrl) {
      return;
    }

    await Linking.openURL(track.externalUrl).catch(() => undefined);
  };

  if (!track.externalUrl) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="link"
      style={[styles.sourceLink, compact && styles.sourceLinkCompact]}
      onPress={openSource}
    >
      <Text style={styles.sourceLabel}>Source</Text>
      <Text style={styles.sourceText}>Open source on SoundCloud</Text>
    </Pressable>
  );
}

function DimensionBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.dimensionRow}>
      <Text style={styles.dimensionLabel}>{label}</Text>
      <View style={styles.dimensionTrack}>
        <View style={[styles.dimensionFill, { width: `${Math.max(4, Math.min(100, value))}%` }]} />
      </View>
      <Text style={styles.dimensionValue}>{value}</Text>
    </View>
  );
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function scoreSimilarity(track: RecommendationTrack, focusTrack: RecommendationTrack): number {
  let score = 0;

  if (track.id === focusTrack.id) {
    score += 10;
  }

  if (track.genre === focusTrack.genre) {
    score += 4;
  }

  score += track.contexts.filter((context) => focusTrack.contexts.includes(context)).length * 2;
  score += Math.max(0, 4 - dimensionDistance(track, focusTrack) / 25);
  score +=
    track.relatedArtists?.filter((artist) => focusTrack.relatedArtists?.includes(artist)).length ??
    0;

  return score;
}

function dimensionDistance(left: RecommendationTrack, right: RecommendationTrack): number {
  const keys: (keyof RecommendationTrack['dimensions'])[] = [
    'energy',
    'density',
    'texture',
    'space',
    'rhythm',
  ];

  return keys.reduce((sum, key) => sum + Math.abs(left.dimensions[key] - right.dimensions[key]), 0) /
    keys.length;
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
    paddingBottom: 28,
    paddingTop: 20,
  },
  columnWrapper: {
    gap: 14,
  },
  header: {
    gap: 12,
    paddingBottom: 10,
  },
  headerStack: {
    gap: 14,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 33,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    paddingTop: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  clearFocus: {
    backgroundColor: colors.elevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  clearFocusText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  featuredCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  previewLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  playerSurface: {
    backgroundColor: '#071018',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    padding: 12,
  },
  previewSignal: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 5,
    height: 50,
    width: 96,
  },
  previewBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 7,
  },
  playerCopy: {
    flex: 1,
    gap: 6,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  featuredArtist: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  previewUnavailable: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  artwork: {
    backgroundColor: '#071018',
    gap: 10,
    minHeight: 86,
    justifyContent: 'space-between',
    padding: 16,
  },
  artworkKicker: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  signalField: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 7,
    height: 58,
  },
  signalBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 9,
  },
  artworkCaption: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  cardBody: {
    gap: 10,
    padding: 14,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  trackText: {
    flex: 1,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  artistName: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  duration: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.elevated,
    borderRadius: 8,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagMuted: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dimensionStack: {
    gap: 8,
  },
  dimensionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dimensionLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    width: 52,
  },
  dimensionTrack: {
    backgroundColor: '#071018',
    borderRadius: 999,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  dimensionFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 7,
  },
  dimensionValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
    width: 28,
  },
  reasonBox: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  reasonLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  reasonText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  matchStrip: {
    alignItems: 'center',
    backgroundColor: '#071018',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  matchText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  matchDivider: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  moreLikeButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  moreLikeButtonText: {
    color: '#06110F',
    fontSize: 13,
    fontWeight: '900',
  },
  sourceLink: {
    backgroundColor: '#10151C',
    borderColor: '#FF5500',
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    padding: 10,
  },
  sourceLinkCompact: {
    paddingVertical: 10,
  },
  sourceLabel: {
    color: '#FF8A3D',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourceText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
});
