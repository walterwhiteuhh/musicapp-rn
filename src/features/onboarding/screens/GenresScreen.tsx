import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { SelectableChip } from '@/components/SelectableChip';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { electronicGenres } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

export function GenresScreen() {
  const router = useRouter();
  const { draft, validation, toggleGenre } = useOnboarding();

  return (
    <OnboardingScaffold
      eyebrow="Step 1 of 4"
      title="Pick at least two electronic directions."
      description="This keeps the first recommendation model narrow enough to reason about later."
    >
      <View style={styles.grid}>
        {electronicGenres.map((genre) => (
          <SelectableChip
            key={genre}
            label={genre}
            selected={draft.genres.includes(genre)}
            onPress={() => toggleGenre(genre)}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton
          disabled={!validation.canContinueGenres}
          onPress={() => router.push('/onboarding/moods' as never)}
        >
          Next
        </ActionButton>
        <ActionButton variant="ghost" onPress={() => router.back()}>
          Back
        </ActionButton>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actions: {
    gap: 10,
  },
});
