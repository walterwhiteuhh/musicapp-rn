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
  const useGrid = Platform.OS === 'web' && width >= 780;

  useEffect(() => {
    void repository.getProfile().then(setProfile);
  }, []);

  const recommendations = useMemo(() => {
    return filterRecommendations(electronicRecommendationFixtures, profile);
  }, [profile]);
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
            {featuredTrack ? <FeaturedPreview track={featuredTrack} /> : null}
            <Text style={styles.sectionTitle}>Next signals</Text>
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

function FeaturedPreview({ track }: { track: RecommendationTrack }) {
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
      <View style={styles.primaryActions}>
        <ActionPill label="Save" />
        <ActionPill label="More like this" />
        <ActionPill label="Skip" muted />
      </View>
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
        <View style={styles.primaryActions}>
          <ActionPill label="Save" />
          <ActionPill label="Tune profile" />
        </View>
        <SourceLink track={track} compact />
      </View>
    </View>
  );
}

function ActionPill({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <Pressable accessibilityRole="button" style={[styles.actionPill, muted && styles.actionPillMuted]}>
      <Text style={[styles.actionPillText, muted && styles.actionPillTextMuted]}>{label}</Text>
    </Pressable>
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
    fontSize: 31,
    fontWeight: '800',
    lineHeight: 37,
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
  featuredCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
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
    gap: 16,
    padding: 16,
  },
  previewSignal: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    height: 76,
  },
  previewBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 10,
  },
  playerCopy: {
    gap: 6,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  featuredArtist: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  previewUnavailable: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
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
    minHeight: 118,
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
    gap: 12,
    padding: 16,
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
    fontSize: 18,
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
    gap: 5,
    padding: 12,
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
  primaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionPill: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionPillMuted: {
    backgroundColor: colors.elevated,
    borderColor: colors.border,
    borderWidth: 1,
  },
  actionPillText: {
    color: '#06110F',
    fontSize: 13,
    fontWeight: '900',
  },
  actionPillTextMuted: {
    color: colors.muted,
  },
  sourceLink: {
    backgroundColor: '#15100B',
    borderColor: '#FF5500',
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    padding: 12,
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
