import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { OnboardingScaffold } from '@/features/onboarding/components/OnboardingScaffold';
import { dimensionCopy } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import type { TrackDimensions } from '@/domain/taste/TasteProfile';
import { colors } from '@/theme/colors';

const dimensionKeys: (keyof TrackDimensions)[] = [
  'energy',
  'density',
  'texture',
  'space',
  'rhythm',
];

const dimensionValues = [20, 40, 60, 80];

export function DimensionsScreen() {
  const router = useRouter();
  const { draft, setDimension, validation } = useOnboarding();

  return (
    <OnboardingScaffold
      eyebrow="Step 2 of 5"
      title="Describe the tracks you tend to stay with."
      description="These axes mirror how tracks can be tagged later. They are not final taste rules, just a starting signal."
    >
      <View style={styles.list}>
        {dimensionKeys.map((dimension) => {
          const copy = dimensionCopy[dimension];
          const currentValue = draft.dimensions[dimension];

          return (
            <View key={dimension} style={styles.dimensionCard}>
              <View style={styles.dimensionHeader}>
                <Text style={styles.dimensionLabel}>{copy.label}</Text>
                <Text style={styles.dimensionValue}>{currentValue}</Text>
              </View>
              <View style={styles.scaleLabels}>
                <Text style={styles.scaleText}>{copy.low}</Text>
                <Text style={styles.scaleText}>{copy.high}</Text>
              </View>
              <View style={styles.segmentRow}>
                {dimensionValues.map((value) => (
                  <ActionButton
                    key={value}
                    variant={nearestBucket(currentValue) === value ? 'primary' : 'secondary'}
                    onPress={() => setDimension(dimension, value)}
                  >
                    {String(value)}
                  </ActionButton>
                ))}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.actions}>
        <ActionButton
          disabled={!validation.canContinueDimensions}
          onPress={() => router.push('/onboarding/contexts' as never)}
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

function nearestBucket(value: number) {
  return dimensionValues.reduce((nearest, candidate) => {
    return Math.abs(candidate - value) < Math.abs(nearest - value) ? candidate : nearest;
  }, dimensionValues[0]);
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  dimensionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  dimensionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  dimensionValue: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: colors.muted,
    fontSize: 13,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actions: {
    gap: 10,
  },
});
