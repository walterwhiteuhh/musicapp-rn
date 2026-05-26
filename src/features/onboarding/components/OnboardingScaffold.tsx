import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
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
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
});
