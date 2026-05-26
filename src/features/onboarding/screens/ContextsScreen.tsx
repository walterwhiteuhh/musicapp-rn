import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { SelectableChip } from '@/components/SelectableChip';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { listeningContexts } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

export function ContextsScreen() {
  const router = useRouter();
  const { draft, refreshArtistSuggestions, toggleContext, validation } = useOnboarding();

  const continueToArtists = () => {
    refreshArtistSuggestions();
    router.push('/onboarding/artists' as never);
  };

  return (
    <OnboardingScaffold
      eyebrow="Step 3 of 5"
      title="Where should Klangfeld understand your listening?"
      description="Pick one to three contexts. These can later become useful stats, not just onboarding labels."
    >
      <View style={styles.grid}>
        {listeningContexts.map((context) => (
          <SelectableChip
            key={context}
            label={context}
            selected={draft.contexts.includes(context)}
            onPress={() => toggleContext(context)}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton disabled={!validation.canContinueContexts} onPress={continueToArtists}>
          Derive artists
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
