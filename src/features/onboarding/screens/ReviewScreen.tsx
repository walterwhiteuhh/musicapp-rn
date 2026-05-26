import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { colors } from '@/theme/colors';

const repository = new AsyncStorageTasteProfileRepository();

export function ReviewScreen() {
  const router = useRouter();
  const { complete, draft, reset, validation } = useOnboarding();
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    if (!validation.canComplete) {
      return;
    }

    setIsSaving(true);
    const profile = complete();
    await repository.saveProfile(profile);
    reset();
    router.replace('/(tabs)' as never);
  };

  return (
    <OnboardingScaffold
      eyebrow="Step 4 of 4"
      title="Review the signal before discovery starts."
      description="You can refine this later from Profile. The first feed is still local and transparent."
    >
      <View style={styles.summaryCard}>
        <SummaryRow label="Genres" value={draft.genres.join(', ')} />
        <SummaryRow label="Moods" value={draft.moods.join(', ')} />
        <SummaryRow label="Artists" value={draft.artists.join(', ')} />
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Klangfeld will use these selections to rank electronic demo tracks and explain why each
          one appears.
        </Text>
      </View>
      <View style={styles.actions}>
        <ActionButton disabled={!validation.canComplete || isSaving} onPress={handleComplete}>
          {isSaving ? <ActivityIndicator color="#06110F" /> : 'Start discovery'}
        </ActionButton>
        <ActionButton variant="ghost" onPress={() => router.back()}>
          Back
        </ActionButton>
      </View>
    </OnboardingScaffold>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || 'Not selected'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  summaryRow: {
    gap: 5,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.elevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  infoText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    gap: 10,
  },
});
