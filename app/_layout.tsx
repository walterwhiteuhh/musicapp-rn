import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingProvider } from '@/features/onboarding/OnboardingContext';
import { ThemeProvider } from '@/theme/ThemeContext';
import { PlayerProvider } from '@/features/player/PlayerContext';
import { AudioPlayer } from '@/features/player/AudioPlayer';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PlayerProvider>
          <OnboardingProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#080B10' },
              }}
            />
            <AudioPlayer />
          </OnboardingProvider>
        </PlayerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

