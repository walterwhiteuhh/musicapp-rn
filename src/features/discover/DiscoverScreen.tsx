import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [profile, setProfile] = useState<TasteProfile | null>(null);

  useEffect(() => {
    void repository.getProfile().then(setProfile);
  }, []);

  const recommendations = useMemo(() => {
    return filterRecommendations(electronicRecommendationFixtures, profile);
  }, [profile]);

  return (
    <ScreenContainer>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Klangfeld</Text>
            <Text style={styles.title}>Discover electronic tracks with reasons.</Text>
            <Text style={styles.subtitle}>
              {profile?.completedAt
                ? 'Your profile is shaping this local demo feed.'
                : 'Demo mode is active. Create a taste profile to shape the feed.'}
            </Text>
            {!profile?.completedAt && (
              <ActionButton onPress={() => router.push('/onboarding/welcome' as never)}>
                Create taste profile
              </ActionButton>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecommendationCard track={item} />}
      />
    </ScreenContainer>
  );
}

function RecommendationCard({ track }: { track: RecommendationTrack }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.artwork}>
        <Text style={styles.artworkText}>{track.genre.slice(0, 2).toUpperCase()}</Text>
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
          <Text style={styles.tag}>{track.contexts[0]}</Text>
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Why recommended</Text>
          <Text style={styles.reasonText}>{track.reason}</Text>
          <Text style={styles.reasonText}>
            Energy {track.dimensions.energy} / Space {track.dimensions.space} / Rhythm{' '}
            {track.dimensions.rhythm}
          </Text>
        </View>
      </View>
    </Pressable>
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
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.82,
  },
  artwork: {
    alignItems: 'center',
    backgroundColor: colors.elevated,
    height: 170,
    justifyContent: 'center',
  },
  artworkText: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: '900',
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
});
