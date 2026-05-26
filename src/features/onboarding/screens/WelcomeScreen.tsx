import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { colors } from '@/theme/colors';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <OnboardingScaffold
      eyebrow="Klangfeld"
      title="Electronic music discovery that starts with your taste."
      description="Create a lightweight profile from genres, moods, and artists. Klangfeld uses it to shape transparent demo recommendations while the live SoundCloud path is prepared."
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Iteration 2 focus</Text>
        <Text style={styles.cardText}>Mobile and tablet first layout</Text>
        <Text style={styles.cardText}>Web preview deployable on Netlify</Text>
        <Text style={styles.cardText}>Electronic music data for later analysis</Text>
      </View>

      <View style={styles.actions}>
        <ActionButton onPress={() => router.push('/onboarding/genres' as never)}>
          Create taste profile
        </ActionButton>
        <ActionButton variant="ghost" onPress={() => router.replace('/(tabs)' as never)}>
          Skip and use demo mode
        </ActionButton>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  cardText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    gap: 10,
  },
});
