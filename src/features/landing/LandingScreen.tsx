import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { appConfig } from '@/config/appConfig';
import { colors } from '@/theme/colors';

export function LandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 780;

  return (
    <ScreenContainer edges={['top', 'right', 'bottom', 'left']} padded={false}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <Text style={styles.brand}>{appConfig.appName}</Text>
          <View style={styles.navLinks}>
            <LandingLink label="App" onPress={() => router.push('/(tabs)' as never)} />
            <LandingLink label="Datenschutz" onPress={() => router.push('/datenschutz' as never)} />
            <LandingLink label="Impressum" onPress={() => router.push('/impressum' as never)} />
          </View>
        </View>

        <View style={[styles.hero, wide && styles.heroWide]}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Electronic discovery</Text>
            <Text style={styles.title}>Klangfeld</Text>
            <Text style={styles.subtitle}>
              Eine mobile Discovery-Oberflaeche fuer elektronische Musik: kuratierte Szenen,
              gewichtete Tags, technische Track-Signale und nachvollziehbare Quellen.
            </Text>
            <View style={styles.actions}>
              <ActionButton onPress={() => router.push('/(tabs)' as never)}>App oeffnen</ActionButton>
              <ActionButton variant="secondary" onPress={() => router.push('/onboarding/welcome' as never)}>
                Klangprofil bauen
              </ActionButton>
            </View>
          </View>

          <View style={styles.productPreview} accessibilityLabel="Klangfeld mobile app preview">
            <View style={styles.phoneTop}>
              <Text style={styles.phoneKicker}>Featured signal</Text>
              <Text numberOfLines={1} style={styles.phoneTitle}>
                Spannung Radio Show 054
              </Text>
              <Text style={styles.phoneArtist}>Lilly Palmer</Text>
            </View>
            <View style={styles.signalPanel}>
              {[28, 72, 44, 86, 58, 34, 66, 48].map((height, index) => (
                <View key={`${height}-${index}`} style={[styles.signalBar, { height }]} />
              ))}
            </View>
            <View style={styles.tagRow}>
              <Text style={styles.tag}>Hard Techno 92%</Text>
              <Text style={styles.tag}>Technical Read</Text>
              <Text style={styles.tagMuted}>SoundCloud source</Text>
            </View>
            <View style={styles.reasonBox}>
              <Text style={styles.reasonLabel}>Why it leads</Text>
              <Text style={styles.reasonText}>
                High energy, compressed kick pressure and mainstage tension with a traceable radio-show source.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sections}>
          <FeatureBand
            title="Vom Genre zur Signal-Landkarte"
            body="Klangfeld bewertet Stil, Kontext, Energie, Raum, Rhythmus und Herkunftsschicht gemeinsam statt Tracks in starre Genres zu pressen."
          />
          <FeatureBand
            title="Quellen bleiben sichtbar"
            body="Empfehlungen tragen ihre Referenzen mit: Live-Sets, Radio-Shows, Versionen, Remixe und redaktionelle Hinweise."
          />
          <FeatureBand
            title="Play-Store-Pfad vorbereitet"
            body="Die Expo-App ist portrait-orientiert, mobile-ready, mit Android-Package, Safe-Area-Flows und Netlify-Web-Ausgabe."
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Klangfeld v{appConfig.version}</Text>
          <View style={styles.navLinks}>
            <LandingLink label="Datenschutz" onPress={() => router.push('/datenschutz' as never)} />
            <LandingLink label="Impressum" onPress={() => router.push('/impressum' as never)} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function LandingLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

function FeatureBand({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.featureBand}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 24,
    paddingBottom: 28,
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  brand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  navLinks: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
  },
  link: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  hero: {
    gap: 22,
    minHeight: 620,
    paddingHorizontal: 20,
    paddingTop: 34,
  },
  heroWide: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 34,
    minHeight: 650,
  },
  heroCopy: {
    flex: 1,
    gap: 16,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 54,
    fontWeight: '900',
    lineHeight: 58,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 27,
    maxWidth: 640,
  },
  actions: {
    gap: 10,
    maxWidth: 340,
  },
  productPreview: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 14,
    maxWidth: 430,
    overflow: 'hidden',
    padding: 16,
  },
  phoneTop: {
    gap: 5,
  },
  phoneKicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  phoneTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  phoneArtist: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  signalPanel: {
    alignItems: 'flex-end',
    backgroundColor: '#071018',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 150,
    justifyContent: 'center',
    padding: 16,
  },
  signalBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 11,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.elevated,
    borderRadius: 8,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagMuted: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  reasonBox: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  reasonLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  reasonText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sections: {
    gap: 12,
    paddingHorizontal: 20,
  },
  featureBand: {
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: 6,
    paddingVertical: 16,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  featureBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingTop: 18,
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
});

