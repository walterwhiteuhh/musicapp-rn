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
      title="Build a signal profile, not a playlist questionnaire."
      description="Klangfeld starts with a compact map of genres, listening context, and track dimensions. Later, real listening behavior slowly takes over from this onboarding signal."
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What the profile captures</Text>
        <Text style={styles.cardText}>Electronic genres as a narrow starting field</Text>
        <Text style={styles.cardText}>Energy, density, texture, space, and rhythm</Text>
        <Text style={styles.cardText}>Listening contexts that can become statistics later</Text>
      </View>

      <View style={styles.actions}>
        <ActionButton onPress={() => router.push('/onboarding/genres' as never)}>
          Build Klangprofil
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
