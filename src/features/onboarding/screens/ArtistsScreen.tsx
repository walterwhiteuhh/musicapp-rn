import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { SelectableChip } from '@/components/SelectableChip';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { colors } from '@/theme/colors';

export function ArtistsScreen() {
  const router = useRouter();
  const { draft, refreshArtistSuggestions, toggleSelectedArtist, validation } = useOnboarding();

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
          <SelectableChip
            key={artist}
            label={artist}
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
    gap: 10,
  },
  actions: {
    gap: 10,
  },
});
