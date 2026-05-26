import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

export function LibraryScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Library</Text>
        <InfoCard title="Saved tracks" body="Liked tracks will collect here once playback is added." />
        <InfoCard title="Playlists" body="Playlist creation is planned after the player slice." />
        <InfoCard title="Recently played" body="Listening history will stay local until account sync exists." />
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
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
    gap: 7,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
});
