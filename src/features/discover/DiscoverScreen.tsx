import { useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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

  return (
    <ScreenContainer>
      <FlatList
        key={useGrid ? 'grid' : 'list'}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Klangfeld</Text>
            <Text style={styles.title}>Curated signals for electronic discovery.</Text>
            <Text style={styles.subtitle}>
              {profile?.completedAt
                ? 'Your Klangprofil shapes this preview feed before the player and SoundCloud proxy arrive.'
                : 'Demo mode is active: real SoundCloud links, local matching, no embedded player yet.'}
            </Text>
            {!profile?.completedAt && (
              <ActionButton onPress={() => router.push('/onboarding/welcome' as never)}>
                Create taste profile
              </ActionButton>
            )}
          </View>
        }
        columnWrapperStyle={useGrid ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.list}
        data={recommendations}
        keyExtractor={(item) => item.id}
        numColumns={useGrid ? 2 : 1}
        renderItem={({ item }) => <RecommendationCard track={item} />}
      />
    </ScreenContainer>
  );
}

function RecommendationCard({ track }: { track: RecommendationTrack }) {
  const openSoundCloud = async () => {
    if (!track.externalUrl) {
      return;
    }

    await Linking.openURL(track.externalUrl).catch(() => undefined);
  };

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
        {track.externalUrl ? (
          <Pressable accessibilityRole="link" style={styles.soundCloudButton} onPress={openSoundCloud}>
            <Text style={styles.soundCloudButtonText}>Open on SoundCloud</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
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
  soundCloudButton: {
    alignItems: 'center',
    backgroundColor: '#FF5500',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  soundCloudButtonText: {
    color: '#1B0B00',
    fontSize: 14,
    fontWeight: '900',
  },
});
