import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { colors } from '@/theme/colors';

export function ArtistsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { draft, refreshArtistSuggestions, toggleSelectedArtist, validation } = useOnboarding();
  const useTwoColumns = width >= 430;

  useEffect(() => {
    if (draft.suggestedArtists.length === 0) {
      refreshArtistSuggestions();
    }
  }, [draft.suggestedArtists.length, refreshArtistSuggestions]);

  return (
    <OnboardingScaffold
      eyebrow="Step 4 of 5"
      title="Choose one to five reference artists."
      description="These ten suggestions come from your genres, dimensions, and context. They anchor the initial profile until listening data becomes stronger."
    >
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Selected artists are references, not a locked taste box. They start at full weight and
          lose influence as behavior data grows.
        </Text>
      </View>
      <View style={styles.grid}>
        {draft.suggestedArtists.map((artist) => (
          <ArtistCard
            key={artist}
            artist={artist}
            compact={useTwoColumns}
            selected={draft.selectedArtists.includes(artist)}
            onPress={() => toggleSelectedArtist(artist)}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton
          disabled={!validation.canContinueArtists}
          onPress={() => router.push('/onboarding/review' as never)}
        >
          Review profile
        </ActionButton>
        <ActionButton variant="ghost" onPress={() => router.back()}>
          Back
        </ActionButton>
      </View>
    </OnboardingScaffold>
  );
}

function ArtistCard({
  artist,
  compact,
  selected,
  onPress,
}: {
  artist: string;
  compact: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const visual = getArtistVisual(artist);

  return (
    <Pressable
      accessibilityLabel={artist}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.artistCard,
        compact && styles.artistCardCompact,
        selected && styles.artistCardSelected,
        pressed && styles.artistCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.cover, { backgroundColor: visual.background }]}>
        <View style={[styles.coverBlockLarge, { backgroundColor: visual.primary }]} />
        <View style={[styles.coverBlockSmall, { backgroundColor: visual.secondary }]} />
        <View style={styles.coverLines}>
          <View style={[styles.coverLine, { backgroundColor: visual.primary }]} />
          <View style={[styles.coverLine, { backgroundColor: visual.secondary, width: '62%' }]} />
          <View style={[styles.coverLine, { backgroundColor: visual.primary, width: '42%' }]} />
        </View>
      </View>
      <View style={styles.artistCopy}>
        <Text numberOfLines={1} style={styles.artistName}>
          {artist}
        </Text>
        <Text style={styles.artistMeta}>{visual.meta}</Text>
      </View>
      <View style={[styles.selectionBadge, selected && styles.selectionBadgeSelected]}>
        <Text style={[styles.selectionText, selected && styles.selectionTextSelected]}>
          {selected ? 'Selected' : 'Tap to add'}
        </Text>
      </View>
    </Pressable>
  );
}

function getArtistVisual(artist: string) {
  const visuals: Record<string, { background: string; primary: string; secondary: string; meta: string }> = {
    'Boris Brejcha': {
      background: '#171018',
      primary: '#F97316',
      secondary: '#2DD4BF',
      meta: 'High-tech minimal',
    },
    'Charlotte de Witte': {
      background: '#0B1018',
      primary: '#A78BFA',
      secondary: '#38BDF8',
      meta: 'Peak-time techno',
    },
    'Amelie Lens': {
      background: '#111827',
      primary: '#FB7185',
      secondary: '#2DD4BF',
      meta: 'Driving techno',
    },
    'Paul Kalkbrenner': {
      background: '#14110D',
      primary: '#FBBF24',
      secondary: '#38BDF8',
      meta: 'Berlin melodic',
    },
    'Ben Böhmer': {
      background: '#08161A',
      primary: '#22D3EE',
      secondary: '#A7F3D0',
      meta: 'Melodic deep',
    },
    'KI/KI': {
      background: '#180F20',
      primary: '#F472B6',
      secondary: '#FBBF24',
      meta: 'Trance / rave',
    },
    Bicep: {
      background: '#101828',
      primary: '#60A5FA',
      secondary: '#F472B6',
      meta: 'Breakbeat warmth',
    },
    Overmono: {
      background: '#0C1218',
      primary: '#34D399',
      secondary: '#A78BFA',
      meta: 'UK breaks',
    },
    Burial: {
      background: '#111111',
      primary: '#9CA3AF',
      secondary: '#38BDF8',
      meta: 'Night garage',
    },
    Solomun: {
      background: '#13120E',
      primary: '#F59E0B',
      secondary: '#2DD4BF',
      meta: 'Club house',
    },
  };

  return (
    visuals[artist] ?? {
      background: '#0B1018',
      primary: colors.primary,
      secondary: colors.secondary,
      meta: 'Artist reference',
    }
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  infoText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  artistCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 11,
    padding: 10,
    width: '100%',
  },
  artistCardCompact: {
    flexGrow: 1,
    flexBasis: '47%',
  },
  artistCardSelected: {
    borderColor: colors.primary,
  },
  artistCardPressed: {
    opacity: 0.82,
  },
  cover: {
    aspectRatio: 1.35,
    borderRadius: 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 12,
  },
  coverBlockLarge: {
    borderRadius: 999,
    height: 46,
    opacity: 0.94,
    width: 46,
  },
  coverBlockSmall: {
    alignSelf: 'flex-end',
    borderRadius: 999,
    height: 28,
    opacity: 0.82,
    width: 28,
  },
  coverLines: {
    gap: 6,
  },
  coverLine: {
    borderRadius: 999,
    height: 6,
    opacity: 0.88,
    width: '82%',
  },
  artistCopy: {
    gap: 4,
  },
  artistName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  artistMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  selectionBadge: {
    alignItems: 'center',
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  selectionBadgeSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  selectionTextSelected: {
    color: '#06110F',
  },
  actions: {
    gap: 10,
  },
});
