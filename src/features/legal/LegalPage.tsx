import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { appConfig } from '@/config/appConfig';
import { legalConfig } from '@/config/legalConfig';
import { colors } from '@/theme/colors';

type LegalPageProps = {
  type: 'imprint' | 'privacy';
};

export function LegalPage({ type }: LegalPageProps) {
  const router = useRouter();
  const isPrivacy = type === 'privacy';

  return (
    <ScreenContainer edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{appConfig.appName}</Text>
          <Text style={styles.title}>{isPrivacy ? 'Datenschutzerklaerung' : 'Impressum'}</Text>
          <Text style={styles.updated}>Stand: {legalConfig.lastUpdated}</Text>
        </View>

        {isPrivacy ? <PrivacyContent /> : <ImprintContent />}

        <View style={styles.actions}>
          <ActionButton onPress={() => router.push('/' as never)}>Zur Landingpage</ActionButton>
          <ActionButton variant="secondary" onPress={() => router.push('/(tabs)' as never)}>
            App oeffnen
          </ActionButton>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ImprintContent() {
  return (
    <>
      <LegalSection title="Angaben gemaess Paragraf 5 DDG">
        <Text style={styles.body}>{legalConfig.operatorName}</Text>
        {legalConfig.operatorAddressLines.map((line) => (
          <Text key={line} style={styles.body}>
            {line}
          </Text>
        ))}
      </LegalSection>

      <LegalSection title="Kontakt">
        <Text style={styles.body}>E-Mail: {legalConfig.contactEmail}</Text>
        <Text style={styles.body}>Website: {legalConfig.appUrl}</Text>
        <Text style={styles.body}>Kontakt derzeit per E-Mail.</Text>
      </LegalSection>

      <LegalSection title="Verantwortlich fuer den Inhalt">
        <Text style={styles.body}>{legalConfig.operatorName}</Text>
      </LegalSection>

      <LegalSection title="Hinweis">
        <Text style={styles.body}>
          Dieses Impressum bildet die derzeit hinterlegten Betreiberangaben ab. Vor einem
          Store-Release sollten die Angaben und Kontaktwege final rechtlich geprueft werden.
        </Text>
      </LegalSection>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <LegalSection title="Verantwortlicher">
        <Text style={styles.body}>{legalConfig.operatorName}</Text>
        {legalConfig.operatorAddressLines.map((line) => (
          <Text key={line} style={styles.body}>
            {line}
          </Text>
        ))}
        <Text style={styles.body}>E-Mail: {legalConfig.contactEmail}</Text>
      </LegalSection>

      <LegalSection title="Zwecke der Verarbeitung">
        <Text style={styles.body}>
          Klangfeld verarbeitet lokale Profil- und Nutzungsdaten, um Musikempfehlungen,
          Onboarding-Signale, Suchfunktionen und App-Einstellungen bereitzustellen.
        </Text>
      </LegalSection>

      <LegalSection title="Lokale Daten auf dem Geraet">
        <Text style={styles.body}>
          Das Klangprofil wird derzeit lokal auf dem Geraet gespeichert. Dazu koennen gewaehlte
          Genres, Hoerkontexte, Referenzkuenstler, Track-Dimensionen und Kalibrierungswerte
          gehoeren.
        </Text>
      </LegalSection>

      <LegalSection title="Netlify und technische Zugriffsdaten">
        <Text style={styles.body}>
          Die Web-Version wird ueber Netlify bereitgestellt. Beim Abruf der Website koennen
          technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt, angefragte Datei,
          Browser-Informationen und Referrer verarbeitet werden, um die Website auszuliefern und
          zu schuetzen.
        </Text>
      </LegalSection>

      <LegalSection title="AI-Profilanalyse">
        <Text style={styles.body}>
          Wenn die AI-Profilanalyse aktiviert ist, kann ein Profil-Summary an die Netlify Function
          von Klangfeld gesendet werden, um beschreibende Tags zu erzeugen. Geheimnisse wie
          API-Schluessel werden nicht im Client ausgeliefert.
        </Text>
      </LegalSection>

      <LegalSection title="Rechtsgrundlagen">
        <Text style={styles.body}>
          Die Verarbeitung erfolgt, soweit anwendbar, zur Bereitstellung der App-Funktionen, auf
          Grundlage berechtigter Interessen an einem sicheren und stabilen Betrieb sowie auf Basis
          freiwilliger Nutzung der jeweiligen Funktionen.
        </Text>
      </LegalSection>

      <LegalSection title="Drittanbieter und externe Links">
        <Text style={styles.body}>
          Klangfeld kann auf externe Musikquellen und redaktionelle Referenzen verlinken. Externe
          Anbieter werden erst aufgerufen, wenn ein Link aktiv geoeffnet wird. Beim Oeffnen solcher
          Links gelten die Datenschutzregeln der jeweiligen Anbieter.
        </Text>
        <View style={styles.providerList}>
          {legalConfig.externalLinkProviders.map((provider) => (
            <View key={provider.name} style={styles.providerItem}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.body}>{provider.purpose}</Text>
              <Text style={styles.providerUrl}>{provider.privacyUrl}</Text>
            </View>
          ))}
        </View>
      </LegalSection>

      <LegalSection title="Betroffenenrechte">
        <Text style={styles.body}>
          Betroffene Personen koennen Auskunft, Berichtigung, Loeschung, Einschraenkung der
          Verarbeitung, Datenuebertragbarkeit und Widerspruch verlangen. Ausserdem besteht ein
          Beschwerderecht bei einer Datenschutzaufsichtsbehoerde.
        </Text>
      </LegalSection>

      <LegalSection title="Hinweis">
        <Text style={styles.body}>
          Diese Datenschutzerklaerung beschreibt den aktuellen Funktionsstand von Klangfeld. Vor
          einem Store-Release sollten eingesetzte Dienstleister, Rechtsgrundlagen und Datenfluesse
          final rechtlich geprueft werden.
        </Text>
      </LegalSection>
    </>
  );
}

function LegalSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 32,
    paddingTop: 24,
  },
  header: {
    gap: 8,
    paddingBottom: 8,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 39,
  },
  updated: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  providerList: {
    gap: 10,
  },
  providerItem: {
    backgroundColor: '#0D141D',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  providerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  providerUrl: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  actions: {
    gap: 10,
    paddingTop: 8,
  },
});
