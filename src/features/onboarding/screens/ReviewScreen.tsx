import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import { initialRecommendationCalibration } from '@/domain/taste/TasteProfile';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { dimensionCopy } from '@/features/onboarding/options';
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
      eyebrow="Step 5 of 5"
      title="Your initial Klangprofil is ready."
      description="This is the profile foundation. It starts with full onboarding weight, then behavior events can gradually take over."
    >
      <View style={styles.summaryCard}>
        <SummaryRow label="Genres" value={draft.genres.join(', ')} />
        <SummaryRow
          label="Lineages"
          value={Object.entries(draft.lineageWeights ?? {})
            .sort((left, right) => right[1] - left[1])
            .slice(0, 3)
            .map(([lineage]) => lineage)
            .join(', ')}
        />
        <SummaryRow label="Contexts" value={draft.contexts.join(', ')} />
        <SummaryRow label="Reference artists" value={draft.selectedArtists.join(', ')} />
      </View>
      <View style={styles.dimensionCard}>
        {Object.entries(draft.dimensions).map(([key, value]) => (
          <View key={key} style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>
              {dimensionCopy[key as keyof typeof dimensionCopy].label}
            </Text>
            <View style={styles.dimensionTrack}>
              <View style={[styles.dimensionFill, { width: `${value}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Initial weighting</Text>
        <Text style={styles.infoText}>
          Onboarding {Math.round(initialRecommendationCalibration.onboardingWeight * 100)}% /
          behavior {Math.round(initialRecommendationCalibration.behaviorWeight * 100)}%.
          Listening events will lower onboarding influence over time, but keep it as a profile
          anchor.
        </Text>
      </View>
      <View style={styles.actions}>
        <ActionButton disabled={!validation.canComplete || isSaving} onPress={handleComplete}>
          {isSaving ? 'Saving...' : 'Start discovery'}
        </ActionButton>
        {isSaving && <ActivityIndicator color={colors.primary} />}
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
      <Text style={styles.summaryValue}>{value || 'No selection yet'}</Text>
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
  dimensionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  dimensionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dimensionLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    width: 72,
  },
  dimensionTrack: {
    backgroundColor: colors.elevated,
    borderRadius: 8,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  dimensionFill: {
    backgroundColor: colors.primary,
    height: 8,
  },
  dimensionValue: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    width: 30,
  },
  infoCard: {
    backgroundColor: colors.elevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  infoTitle: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
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
