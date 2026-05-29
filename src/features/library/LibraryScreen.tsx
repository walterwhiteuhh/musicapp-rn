import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Heart, Play, Pause, ExternalLink } from 'lucide-react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useLibrary } from './hooks/useLibrary';
import { useAudioPlayer } from '@/features/player/PlayerContext';
import { useThemePalette } from '@/theme/ThemeContext';
import type { RecommendationTrack } from '@/domain/recommendations/RecommendationTrack';

export function LibraryScreen() {
  const { favorites, history, loading, toggleFavorite, addToHistory } = useLibrary();
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();
  const { palette } = useThemePalette();

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={palette.primary} size="large" />
          <Text style={[styles.loadingText, { color: palette.muted }]}>Lade Bibliothek...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Trennung der Favoriten in lokale und externe Quellen
  const localFavorites = favorites.filter((track) => track.source === 'local');
  const externalFavorites = favorites.filter((track) => track.source !== 'local');

  const handlePlayLocalTrack = (track: RecommendationTrack) => {
    const isCurrent = currentTrack?.id === track.id;
    if (isCurrent && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
      void addToHistory(track); // Zum Verlauf hinzufügen
    }
  };

  const handleOpenExternalTrack = async (track: RecommendationTrack) => {
    const primarySource = track.sourceLinks?.[0] ?? null;
    const url = primarySource?.url ?? track.externalUrl;
    if (url) {
      await Linking.openURL(url).catch(() => undefined);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>Bibliothek</Text>

        {/* Sektion 1: In-App Abspielbare Favoriten */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Lokale Musik (In-App Player)</Text>
          {localFavorites.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Heart color={palette.muted} size={28} />
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                Noch keine lokalen Favoriten gesichert. Füge Lieder im Entdecken-Feed hinzu!
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {localFavorites.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                const activePlaying = isCurrent && isPlaying;
                return (
                  <View 
                    key={track.id} 
                    style={[
                      styles.trackCard, 
                      { 
                        backgroundColor: palette.surface, 
                        borderColor: activePlaying ? palette.primary : palette.border 
                      }
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handlePlayLocalTrack(track)}
                      style={({ pressed }) => [
                        styles.playIconBox,
                        { 
                          backgroundColor: palette.primary,
                          transform: [{ scale: pressed ? 0.92 : 1 }] 
                        }
                      ]}
                    >
                      {activePlaying ? (
                        <Pause color="#06110F" size={14} fill="#06110F" />
                      ) : (
                        <Play color="#06110F" size={14} fill="#06110F" />
                      )}
                    </Pressable>

                    <View style={styles.trackDetails}>
                      <Text numberOfLines={1} style={[styles.trackTitle, { color: palette.text }]}>
                        {track.title}
                      </Text>
                      <Text numberOfLines={1} style={[styles.trackArtist, { color: palette.muted }]}>
                        {track.artistName}
                      </Text>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void toggleFavorite(track)}
                      style={styles.favButton}
                    >
                      <Heart color={palette.primary} size={18} fill={palette.primary} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Sektion 2: Kürzlich Gehört */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Zuletzt gehört</Text>
            <View style={styles.list}>
              {history.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                const activePlaying = isCurrent && isPlaying;
                return (
                  <View 
                    key={`history-${track.id}`} 
                    style={[
                      styles.trackCard, 
                      { 
                        backgroundColor: palette.surface, 
                        borderColor: activePlaying ? palette.primary : palette.border 
                      }
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handlePlayLocalTrack(track)}
                      style={({ pressed }) => [
                        styles.playIconBoxSmall,
                        { 
                          backgroundColor: palette.elevated,
                          borderColor: palette.border,
                          transform: [{ scale: pressed ? 0.92 : 1 }] 
                        }
                      ]}
                    >
                      {activePlaying ? (
                        <Pause color={palette.primary} size={12} fill={palette.primary} />
                      ) : (
                        <Play color={palette.primary} size={12} fill={palette.primary} />
                      )}
                    </Pressable>

                    <View style={styles.trackDetails}>
                      <Text numberOfLines={1} style={[styles.trackTitle, { color: palette.text }]}>
                        {track.title}
                      </Text>
                      <Text numberOfLines={1} style={[styles.trackArtist, { color: palette.muted }]}>
                        {track.artistName}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Sektion 3: Verlinkte Fremdquellen */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Verlinkte Entdeckungen (Fremdquellen)</Text>
          {externalFavorites.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <ExternalLink color={palette.muted} size={28} />
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                Noch keine SoundCloud- oder YouTube-Favoriten gesichert.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {externalFavorites.map((track) => (
                <View 
                  key={track.id} 
                  style={[styles.trackCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                >
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => void handleOpenExternalTrack(track)}
                    style={styles.trackDetails}
                  >
                    <Text numberOfLines={1} style={[styles.trackTitle, { color: palette.text }]}>
                      {track.title}
                    </Text>
                    <View style={styles.providerRow}>
                      <Text numberOfLines={1} style={[styles.trackArtist, { color: palette.muted }]}>
                        {track.artistName}
                      </Text>
                      <Text style={[styles.providerTag, { color: '#FF8A3D', borderColor: '#FF5500' }]}>
                        {track.source.toUpperCase()}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void toggleFavorite(track)}
                    style={styles.favButton}
                  >
                    <Heart color={palette.primary} size={18} fill={palette.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 110, // Genug Platz, damit der schwebende Player nichts verdeckt
    paddingTop: 20,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    gap: 8,
  },
  trackCard: {
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  playIconBox: {
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconBoxSmall: {
    borderRadius: 999,
    borderWidth: 1,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  trackArtist: {
    fontSize: 12,
    fontWeight: '600',
  },
  favButton: {
    padding: 6,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerTag: {
    fontSize: 9,
    fontWeight: '800',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  emptyCard: {
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    minHeight: 120,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
