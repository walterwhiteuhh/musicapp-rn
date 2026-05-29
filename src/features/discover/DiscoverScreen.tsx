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
import { Play, Pause } from 'lucide-react-native';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import { electronicRecommendationFixtures } from '@/data/recommendations/fixtures';
import { filterRecommendations } from '@/domain/recommendations/filterRecommendations';
import type { RecommendationTrack } from '@/domain/recommendations/RecommendationTrack';
import type { TasteProfile } from '@/domain/taste/TasteProfile';
import { useAudioPlayer } from '@/features/player/PlayerContext';
import { useThemePalette } from '@/theme/ThemeContext';
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
                  ? 'Artist picks start strong now and adapt as listening behavior becomes more useful.'
                  : 'Preview catalog is active: source-first recommendations with transparent signal context.'}
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
        showsVerticalScrollIndicator={false}
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
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();
  const { palette } = useThemePalette();

  const isCurrent = currentTrack?.id === track.id;
  const activePlaying = isCurrent && isPlaying;

  const handlePlayPress = () => {
    if (track.source !== 'local') return;
    if (activePlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <View style={[styles.featuredCard, { borderColor: activePlaying ? palette.primary : palette.border }]}>
      <Text style={[styles.previewLabel, { color: palette.primary }]}>Featured from your Klangprofil</Text>
      
      <Pressable
        accessibilityRole="button"
        onPress={handlePlayPress}
        disabled={track.source !== 'local'}
        style={[
          styles.playerSurface,
          track.source === 'local' && { cursor: 'pointer' },
          activePlaying && { borderColor: palette.primary }
        ]}
      >
        <View style={styles.previewSignal}>
          <View style={[styles.previewBar, { height: 24, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 54, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 34, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 70, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 42, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 28, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
          <View style={[styles.previewBar, { height: 58, backgroundColor: activePlaying ? palette.primary : palette.muted }]} />
        </View>
        <View style={styles.playerCopy}>
          <Text numberOfLines={1} style={[styles.featuredTitle, { color: palette.text }]}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={[styles.featuredArtist, { color: palette.muted }]}>
            {track.artistName}
          </Text>
<<<<<<< HEAD
          {track.source === 'local' ? (
            <View style={styles.localPlayStatus}>
              {activePlaying ? (
                <View style={styles.activePlayIndicator}>
                  <Pause size={12} color={palette.primary} fill={palette.primary} />
                  <Text style={[styles.playStatusTextActive, { color: palette.primary }]}>
                    Wiedergabe läuft (Tippen zum Pausieren)
                  </Text>
                </View>
              ) : (
                <View style={styles.activePlayIndicator}>
                  <Play size={12} color={palette.primary} fill={palette.primary} />
                  <Text style={[styles.playStatusText, { color: palette.primary }]}>
                    In-App abspielbar (Tippen zum Starten)
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.previewUnavailable}>
              Playback arrives later. Source context is already part of the profile.
            </Text>
          )}
=======
          <Text style={styles.previewUnavailable}>
            Playback integration is on the roadmap. Source context is already part of the profile.
          </Text>
>>>>>>> 603ce25e0f0facecbfda8a57b58dcf8c7e5934e3
        </View>
      </Pressable>
      <View style={styles.matchStrip}>
        <Text style={styles.matchText}>{formatWeightedTags(track.styleTags, track.genre)}</Text>
        <Text style={styles.matchDivider}>/</Text>
        <Text style={styles.matchText}>{track.contexts.join(' + ')}</Text>
        {track.sourceLinks?.[0]?.context ? (
          <>
            <Text style={styles.matchDivider}>/</Text>
            <Text style={styles.matchText}>{track.sourceLinks[0].context}</Text>
          </>
        ) : null}
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
      {track.culturalContext ? (
        <View style={styles.contextBox}>
          <Text style={styles.contextLabel}>Reference layer</Text>
          <Text style={styles.contextText}>{track.culturalContext}</Text>
        </View>
      ) : null}
      {track.technicalProfile ? <TechnicalProfile profile={track.technicalProfile} /> : null}
      <SourceLink track={track} />
    </View>
  );
}

function RecommendationCard({ track }: { track: RecommendationTrack }) {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();
  const { palette } = useThemePalette();

  const isCurrent = currentTrack?.id === track.id;
  const activePlaying = isCurrent && isPlaying;

  const handlePlayPress = () => {
    if (track.source !== 'local') return;
    if (activePlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <View style={[styles.card, activePlaying && { borderColor: palette.primary }]}>
      <Pressable
        disabled={track.source !== 'local'}
        onPress={handlePlayPress}
        style={[styles.artwork, track.source === 'local' && { cursor: 'pointer' }]}
      >
        <View style={styles.cardArtworkHeader}>
          <Text style={[styles.artworkKicker, track.source === 'local' && { color: palette.primary }]}>
            {track.source === 'local' ? '✓ LOKAL ABSPIELBAR' : track.genre}
          </Text>
          {track.source === 'local' && (
            <View style={[styles.cardPlayIconContainer, { backgroundColor: palette.primary }]}>
              {activePlaying ? (
                <Pause size={12} color="#06110F" fill="#06110F" />
              ) : (
                <Play size={12} color="#06110F" fill="#06110F" />
              )}
            </View>
          )}
        </View>
        <View style={styles.signalField}>
          <View style={[styles.signalBar, { height: 22, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
          <View style={[styles.signalBar, { height: 42, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
          <View style={[styles.signalBar, { height: 30, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
          <View style={[styles.signalBar, { height: 54, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
          <View style={[styles.signalBar, { height: 36, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
          <View style={[styles.signalBar, { height: 24, backgroundColor: activePlaying ? palette.primary : palette.muted + '80' }]} />
        </View>
        <Text numberOfLines={1} style={styles.artworkCaption}>
          {track.source === 'local' ? 'In-App Player / Taste Profile coupled' : `${formatSourceKind(track.sourceLinks?.[0]?.kind)} / ${track.contexts.join(' / ')}`}
        </Text>
      </Pressable>
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
          {(track.styleTags ?? [{ tag: track.genre, weight: 1 }]).slice(0, 4).map((styleTag) => (
            <Text key={styleTag.tag} style={styles.tag}>
              {styleTag.tag} {formatWeight(styleTag.weight)}
            </Text>
          ))}
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
        {track.culturalContext ? (
          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>Reference layer</Text>
            <Text style={styles.contextText}>{track.culturalContext}</Text>
          </View>
        ) : null}
        {track.technicalProfile ? <TechnicalProfile profile={track.technicalProfile} /> : null}
        <SourceLink track={track} compact />
      </View>
    </View>
  );
}

function SourceLink({ track, compact = false }: { track: RecommendationTrack; compact?: boolean }) {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();
  const { palette } = useThemePalette();

  const isCurrent = currentTrack?.id === track.id;
  const activePlaying = isCurrent && isPlaying;

  const handlePlayPress = () => {
    if (activePlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  const primarySource = track.sourceLinks?.[0] ?? null;
  const linkUrl = primarySource?.url ?? track.externalUrl;

  const openSource = async () => {
    if (!linkUrl) {
      return;
    }

    await Linking.openURL(linkUrl).catch(() => undefined);
  };

  if (track.source === 'local') {
    return (
      <Pressable
        accessibilityRole="button"
        style={[
          styles.sourceLink,
          compact && styles.sourceLinkCompact,
          {
            borderColor: palette.primary,
            backgroundColor: activePlaying ? palette.surface : '#071018',
          }
        ]}
        onPress={handlePlayPress}
      >
        <Text style={[styles.sourceLabel, { color: palette.primary }]}>✓ Klangfeld Player</Text>
        <Text style={styles.sourceText}>
          {activePlaying ? 'Pause abspielen' : 'Jetzt in-App abspielen'}
        </Text>
        <Text style={styles.sourceContext}>
          Geschmacksprofil wird kalibriert
        </Text>
      </Pressable>
    );
  }

  if (!linkUrl) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="link"
      style={[styles.sourceLink, compact && styles.sourceLinkCompact]}
      onPress={openSource}
    >
      <Text style={styles.sourceLabel}>{formatProvider(primarySource?.provider ?? track.source)}</Text>
      <Text style={styles.sourceText}>Open {primarySource?.label ?? 'source'}</Text>
      {primarySource?.context ? <Text style={styles.sourceContext}>{primarySource.context}</Text> : null}
    </Pressable>
  );
}

function TechnicalProfile({ profile }: { profile: NonNullable<RecommendationTrack['technicalProfile']> }) {
  const items = [
    profile.bpmRange ? `BPM ${profile.bpmRange}` : null,
    profile.kickPressure ? `Kick ${profile.kickPressure}` : null,
    profile.dropDensity ? `Drops ${profile.dropDensity}` : null,
    profile.melodicLift ? `Lift ${profile.melodicLift}` : null,
    ...(profile.legacySignals ?? []),
  ].filter((item): item is string => Boolean(item));

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.technicalBox}>
      <Text style={styles.technicalLabel}>Technical read</Text>
      <View style={styles.technicalChips}>
        {items.map((item) => (
          <Text key={item} style={styles.technicalChip}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

function formatProvider(provider: string) {
  if (provider === 'youtube') {
    return 'YouTube source';
  }

  if (provider === 'editorial') {
    return 'Reference source';
  }

  return 'SoundCloud source';
}

function formatSourceKind(kind?: string) {
  if (!kind) {
    return 'Source';
  }

  return kind
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatWeightedTags(tags: RecommendationTrack['styleTags'], fallback: string) {
  const primaryTags = tags?.slice(0, 3).map((tag) => tag.tag) ?? [fallback];

  return primaryTags.join(' + ');
}

function formatWeight(weight: number) {
  return weight < 1 ? `${Math.round(weight * 100)}%` : '';
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
  contextBox: {
    backgroundColor: '#080D13',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  contextLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  contextText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  technicalBox: {
    backgroundColor: '#071018',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 10,
  },
  technicalLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  technicalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  technicalChip: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 5,
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
  sourceContext: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  localPlayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  activePlayIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playStatusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  playStatusTextActive: {
    fontSize: 12,
    fontWeight: '900',
  },
  cardArtworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardPlayIconContainer: {
    borderRadius: 999,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

