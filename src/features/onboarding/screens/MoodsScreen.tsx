import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { SelectableChip } from '@/components/SelectableChip';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { electronicMoods } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

export function MoodsScreen() {
  const router = useRouter();
  const { draft, validation, toggleMood } = useOnboarding();

  return (
    <OnboardingScaffold
      eyebrow="Step 2 of 4"
      title="Choose the energy you want Klangfeld to notice."
      description="Moods make recommendations explainable beyond genre tags."
    >
      <View style={styles.grid}>
        {electronicMoods.map((mood) => (
          <SelectableChip
            key={mood}
            label={mood}
            selected={draft.moods.includes(mood)}
            onPress={() => toggleMood(mood)}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton
          disabled={!validation.canContinueMoods}
          onPress={() => router.push('/onboarding/artists' as never)}
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
