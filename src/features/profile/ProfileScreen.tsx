import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { appConfig } from '@/config/appConfig';
import { HttpProfileTagsProvider } from '@/data/profileTags';
import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { ProfileTagSummary, ProfileTagsProvider } from '@/domain/profileTags';
import type { TasteProfile } from '@/domain/taste/TasteProfile';
import { colors, palettes, type DesignPaletteId } from '@/theme/colors';
import { useThemePalette } from '@/theme/ThemeContext';

const repository = new AsyncStorageTasteProfileRepository();
const defaultProfileTagsProvider = new HttpProfileTagsProvider({
  endpoint: appConfig.profileTagsEndpoint,
});

type ProfileScreenProps = {
  profileTagsProvider?: ProfileTagsProvider;
  aiProfileTagsEnabled?: boolean;
};

export function ProfileScreen({
  profileTagsProvider = defaultProfileTagsProvider,
  aiProfileTagsEnabled = appConfig.features.aiProfileTags,
}: ProfileScreenProps = {}) {
  const router = useRouter();
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [tagSummary, setTagSummary] = useState<ProfileTagSummary | null>(null);
  const [tagStatus, setTagStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { palette, setPaletteId } = useThemePalette();

  useEffect(() => {
    void repository.getProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (!profile?.completedAt || !aiProfileTagsEnabled) {
      return;
    }

    let active = true;
    setTagStatus('loading');

    void profileTagsProvider
      .generateTags(profile)
      .then((summary) => {
        if (!active) {
          return;
        }

        setTagSummary(summary);
        setTagStatus('success');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setTagStatus('error');
      });

    return () => {
      active = false;
    };
  }, [aiProfileTagsEnabled, profile, profileTagsProvider]);

  const resetProfile = async () => {
    await repository.clearProfile();
    setProfile(null);
    setTagSummary(null);
    setTagStatus('idle');
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
              <ProfileRow label="Contexts" value={profile.contexts.join(', ')} />
              <ProfileRow label="Artists" value={profile.selectedArtists.join(', ')} />
              <ProfileRow
                label="Calibration"
                value={`Onboarding ${Math.round(
                  profile.calibration.onboardingWeight * 100,
                )}% / behavior ${Math.round(profile.calibration.behaviorWeight * 100)}%`}
              />
              <ProfileRow
                label="Dimensions"
                value={`Energy ${profile.dimensions.energy}, density ${profile.dimensions.density}, texture ${profile.dimensions.texture}, space ${profile.dimensions.space}, rhythm ${profile.dimensions.rhythm}`}
              />
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
        {profile?.completedAt && aiProfileTagsEnabled ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Klangprofil Analyse</Text>
            {tagStatus === 'loading' ? (
              <Text style={styles.bodyText}>Analysing profile tags...</Text>
            ) : null}
            {tagStatus === 'error' ? (
              <Text style={styles.bodyText}>
                AI analysis is currently unavailable. The local taste profile remains active.
              </Text>
            ) : null}
            {tagStatus === 'success' && tagSummary ? (
              <>
                <ProfileRow label="Primary energy" value={tagSummary.primaryEnergy} />
                <ProfileRow label="Rhythm bias" value={tagSummary.rhythmBias} />
                <ProfileRow label="Intent" value={tagSummary.listeningIntent} />
                <ProfileRow label="Discovery" value={tagSummary.discoveryVector.join(', ')} />
                <ProfileRow label="Notes" value={tagSummary.profileNotes.join(', ')} />
                <ProfileRow
                  label="AI confidence"
                  value={`${Math.round(tagSummary.confidence * 100)}%`}
                />
              </>
            ) : null}
          </View>
        ) : null}
        {profile?.completedAt && !aiProfileTagsEnabled ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Klangprofil Analyse</Text>
            <Text style={styles.bodyText}>
              AI profile tags are disabled for this build. Local profile data is still available.
            </Text>
          </View>
        ) : null}
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
