import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { SelectableChip } from '@/components/SelectableChip';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { suggestedArtists } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { colors } from '@/theme/colors';

export function ArtistsScreen() {
  const router = useRouter();
  const { draft, validation, toggleArtist } = useOnboarding();
  const [query, setQuery] = useState('');

  const artists = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return suggestedArtists;
    }

    return suggestedArtists.filter((artist) => artist.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <OnboardingScaffold
      eyebrow="Step 3 of 4"
      title="Add at least one reference artist."
      description="For now these are curated electronic artists. Live SoundCloud artist search comes after the backend proxy."
    >
      <TextInput
        accessibilityLabel="Search artists"
        autoCapitalize="none"
        placeholder="Search artists"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.grid}>
        {artists.map((artist) => (
          <SelectableChip
            key={artist}
            label={artist}
            selected={draft.artists.includes(artist)}
            onPress={() => toggleArtist(artist)}
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
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
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
