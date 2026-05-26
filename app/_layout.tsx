import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingProvider } from '@/features/onboarding/OnboardingContext';
import { ThemeProvider } from '@/theme/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#080B10' },
            }}
          />
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
