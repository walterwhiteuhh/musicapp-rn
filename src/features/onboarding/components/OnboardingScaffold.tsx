import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

type OnboardingScaffoldProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function OnboardingScaffold({
  children,
  eyebrow,
  title,
  description,
}: OnboardingScaffoldProps) {
  const { height, width } = useWindowDimensions();
  const compact = width < 380 || height < 720;

  return (
    <ScreenContainer edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, compact && styles.scrollContentCompact]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          <Text style={[styles.description, compact && styles.descriptionCompact]}>
            {description}
          </Text>
        </View>
        {children}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    gap: 24,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingTop: 24,
  },
  scrollContentCompact: {
    gap: 18,
    justifyContent: 'flex-start',
    paddingBottom: 24,
    paddingTop: 18,
  },
  header: {
    gap: 10,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  titleCompact: {
    fontSize: 29,
    lineHeight: 34,
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  descriptionCompact: {
    fontSize: 15,
    lineHeight: 22,
  },
});
