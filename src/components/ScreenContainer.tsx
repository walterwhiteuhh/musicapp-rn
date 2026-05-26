import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type ScreenContainerProps = PropsWithChildren<{
  edges?: Edge[];
  padded?: boolean;
}>;

export function ScreenContainer({
  children,
  edges = ['top', 'left', 'right'],
  padded = true,
}: ScreenContainerProps) {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={edges} style={styles.safeArea}>
        <View style={[styles.content, padded && styles.padded]}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 920 : 760,
    width: '100%',
  },
  padded: {
    paddingHorizontal: 20,
  },
});
