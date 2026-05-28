import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

export function LibraryScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Library</Text>
        <InfoCard title="Library foundation" body="Saved tracks will appear here once playback and account sync are connected." />
        <InfoCard title="Playlists" body="Playlist tools are on the release roadmap after the player foundation." />
        <InfoCard title="Recently played" body="Listening history will stay local-first before account sync is introduced." />
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
