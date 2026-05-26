import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { TasteProfile } from '@/domain/taste/TasteProfile';
import { colors, palettes, type DesignPaletteId } from '@/theme/colors';
import { useThemePalette } from '@/theme/ThemeContext';

const repository = new AsyncStorageTasteProfileRepository();

export function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const { palette, setPaletteId } = useThemePalette();

  useEffect(() => {
    void repository.getProfile().then(setProfile);
  }, []);

  const resetProfile = async () => {
    await repository.clearProfile();
    setProfile(null);
    router.push('/onboarding/welcome' as never);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Taste profile</Text>
          {profile?.completedAt ? (
            <>
              <ProfileRow label="Genres" value={profile.genres.join(', ')} />
              <ProfileRow label="Moods" value={profile.moods.join(', ')} />
              <ProfileRow label="Artists" value={profile.artists.join(', ')} />
              <ActionButton variant="secondary" onPress={resetProfile}>
                Edit taste profile
              </ActionButton>
            </>
          ) : (
            <>
              <Text style={styles.bodyText}>
                No completed taste profile yet. Klangfeld is currently in demo mode.
              </Text>
              <ActionButton onPress={() => router.push('/onboarding/welcome' as never)}>
                Create taste profile
              </ActionButton>
            </>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Play Store readiness</Text>
          <Text style={styles.bodyText}>
            Android package is configured as com.klangfeld.app. Production builds are planned as
            EAS app bundles.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Design palette</Text>
          <Text style={styles.bodyText}>
            Choose between two electronic music palettes. The selected palette is used for this
            session.
          </Text>
          <View style={styles.paletteGrid}>
            {(Object.keys(palettes) as DesignPaletteId[]).map((paletteId) => {
              const option = palettes[paletteId];
              const selected = palette.id === paletteId;

              return (
                <ActionButton
                  key={paletteId}
                  variant={selected ? 'primary' : 'secondary'}
                  onPress={() => setPaletteId(paletteId)}
                >
                  {option.name}
                </ActionButton>
              );
            })}
          </View>
          <Text style={styles.bodyText}>{palette.description}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 28,
    paddingTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  profileRow: {
    gap: 4,
  },
  paletteGrid: {
    gap: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
});
