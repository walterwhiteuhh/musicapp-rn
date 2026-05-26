import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { colors } from '@/theme/colors';

type ArtistVisual = {
  background: string;
  primary: string;
  secondary: string;
  meta: string;
};

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
      description="This wider cluster comes from your scenes, dimensions, and context. Pick references, not a fixed taste box."
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

function getArtistVisual(artist: string): ArtistVisual {
  const visuals: Record<string, ArtistVisual> = {
    'Charlotte de Witte': visual('#0B1018', '#A78BFA', '#38BDF8', 'Belgian peak-time'),
    'Amelie Lens': visual('#111827', '#FB7185', '#2DD4BF', 'Belgian peak-time'),
    'Miss Monique': visual('#07151A', '#22D3EE', '#A78BFA', 'Melodic progressive'),
    'Indira Paganotto': visual('#130B1D', '#F472B6', '#FBBF24', 'Psy / techno pressure'),
    Alignment: visual('#111020', '#A78BFA', '#FB7185', 'Rave pressure'),
    '999999999': visual('#150C0C', '#FB7185', '#FBBF24', 'Acid pressure'),
    'Reinier Zonneveld': visual('#100F0B', '#FBBF24', '#FB7185', 'Acid techno'),
    ANNA: visual('#081315', '#2DD4BF', '#A78BFA', 'Techno / acid'),
    'Boris Brejcha': visual('#171018', '#F97316', '#2DD4BF', 'High-tech minimal'),
    'Ann Clue': visual('#171018', '#F97316', '#A78BFA', 'High-tech minimal'),
    'Deniz Bul': visual('#18110E', '#F97316', '#FBBF24', 'High-tech minimal'),
    ARTBAT: visual('#0D1117', '#38BDF8', '#F97316', 'Melodic peak-time'),
    'Tale Of Us': visual('#101018', '#A78BFA', '#22D3EE', 'Afterlife melodic'),
    Anyma: visual('#080F18', '#60A5FA', '#34D399', 'Visual melodic'),
    'Mind Against': visual('#0B1114', '#2DD4BF', '#A78BFA', 'Dark melodic'),
    Innellea: visual('#111318', '#F472B6', '#38BDF8', 'Melodic tension'),
    'Ben Boehmer': visual('#08161A', '#22D3EE', '#A7F3D0', 'Melodic deep'),
    'Stephan Bodzin': visual('#111827', '#38BDF8', '#FBBF24', 'Melodic techno'),
    NTO: visual('#07151A', '#22D3EE', '#34D399', 'Melodic live'),
    Worakls: visual('#101014', '#A78BFA', '#FBBF24', 'Orchestral melodic'),
    'KI/KI': visual('#180F20', '#F472B6', '#FBBF24', 'Trance / rave'),
    'Marlon Hoffstadt': visual('#1A1020', '#F472B6', '#38BDF8', 'Eurodance pressure'),
    'DJ Heartstring': visual('#111827', '#F472B6', '#22D3EE', 'Trance revival'),
    'Job Jobse': visual('#10160F', '#34D399', '#FBBF24', 'Rave selector'),
    'Anfisa Letyago': visual('#101111', '#FB7185', '#2DD4BF', 'Rolling techno'),
    Chlar: visual('#111111', '#F97316', '#A78BFA', 'Hardgroove'),
    'Funk Assault': visual('#101010', '#FBBF24', '#FB7185', 'Hardgroove'),
    'Ben Klock': visual('#0B1018', '#9CA3AF', '#38BDF8', 'Berlin hypnotic'),
    DVS1: visual('#0B0E12', '#9CA3AF', '#A78BFA', 'Hypnotic techno'),
    Rodhad: visual('#0C1014', '#38BDF8', '#9CA3AF', 'Deep techno'),
    Bicep: visual('#101828', '#60A5FA', '#F472B6', 'Breakbeat warmth'),
    Overmono: visual('#0C1218', '#34D399', '#A78BFA', 'UK breaks'),
    Burial: visual('#111111', '#9CA3AF', '#38BDF8', 'Night garage'),
    'Skee Mask': visual('#0B1114', '#38BDF8', '#34D399', 'Breaks / IDM'),
    'Aphex Twin': visual('#141414', '#A78BFA', '#34D399', 'IDM / ambient'),
    'Jon Hopkins': visual('#08161A', '#22D3EE', '#A7F3D0', 'Listening energy'),
    'Donato Dozzy': visual('#0A1110', '#2DD4BF', '#9CA3AF', 'Deep listening'),
    Deepchord: visual('#0A1016', '#38BDF8', '#9CA3AF', 'Dub techno'),
    Calibre: visual('#10150F', '#34D399', '#FBBF24', 'Liquid DnB'),
    Goldie: visual('#16120B', '#FBBF24', '#F97316', 'DnB history'),
  };

  return visuals[artist] ?? visual('#0B1018', colors.primary, colors.secondary, 'Artist reference');
}

function visual(
  background: string,
  primary: string,
  secondary: string,
  meta: string,
): ArtistVisual {
  return {
    background,
    primary,
    secondary,
    meta,
  };
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
