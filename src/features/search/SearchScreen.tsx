import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { createDefaultMusicProvider } from '@/data/music/createDefaultMusicProvider';
import type { SearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import { SearchTracksUseCase as DefaultSearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import type { Track } from '@/domain/music/Track';
import { colors } from '@/theme/colors';

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

type SearchScreenProps = {
  searchTracksUseCase?: SearchTracksUseCase;
};

export function SearchScreen({ searchTracksUseCase }: SearchScreenProps) {
  const defaultUseCase = useMemo(() => {
    return new DefaultSearchTracksUseCase(createDefaultMusicProvider());
  }, []);

  const useCase = searchTracksUseCase ?? defaultUseCase;
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');

  const runSearch = async () => {
    setStatus('loading');

    try {
      const result = await useCase.execute(query);
      setTracks(result);
      setStatus(result.length > 0 ? 'success' : 'empty');
    } catch {
      setTracks([]);
      setStatus('error');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Search</Text>
        <Text style={styles.title}>Find electronic tracks and artists.</Text>
        <Text style={styles.subtitle}>
          Demo fixtures are active until the secure SoundCloud proxy is added.
        </Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          accessibilityLabel="Search tracks"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Track or artist"
          placeholderTextColor="#8793A2"
          returnKeyType="search"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
        />
        <Pressable
          accessibilityLabel="Search"
          accessibilityRole="button"
          disabled={status === 'loading'}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.searchButtonPressed,
            status === 'loading' && styles.searchButtonDisabled,
          ]}
          onPress={runSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {status === 'idle' && <StateMessage text="Start with a track or artist name." />}
      {status === 'loading' && (
        <View style={styles.stateMessage}>
          <ActivityIndicator color="#5DE4C7" testID="search-loading" />
          <Text style={styles.stateText}>Searching...</Text>
        </View>
      )}
      {status === 'empty' && <StateMessage text="No tracks found." />}
      {status === 'error' && <StateMessage text="Search is unavailable." tone="error" />}
      {status === 'success' && (
        <FlatList
          contentContainerStyle={styles.results}
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TrackResult track={item} />}
        />
      )}
    </ScreenContainer>
  );
}

function TrackResult({ track }: { track: Track }) {
  const openSoundCloud = async () => {
    if (!track.externalUrl) {
      return;
    }

    await Linking.openURL(track.externalUrl).catch(() => undefined);
  };

  return (
    <View style={styles.trackRow}>
      <View style={styles.artworkPlaceholder}>
        <Text style={styles.artworkText}>{track.artistName.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.trackCopy}>
        <Text numberOfLines={1} style={styles.trackTitle}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={styles.artistName}>
          {track.artistName}
        </Text>
        {track.externalUrl ? (
          <Pressable accessibilityRole="link" style={styles.soundCloudLink} onPress={openSoundCloud}>
            <Text style={styles.sourceLabel}>Source</Text>
            <Text style={styles.soundCloudLinkText}>Open source on SoundCloud</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function StateMessage({ text, tone = 'neutral' }: { text: string; tone?: 'neutral' | 'error' }) {
  return (
    <View style={styles.stateMessage}>
      <Text style={[styles.stateText, tone === 'error' && styles.errorText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    paddingTop: 20,
    gap: 8,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '800',
    lineHeight: 37,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  searchBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 92,
    paddingHorizontal: 16,
  },
  searchButtonPressed: {
    opacity: 0.82,
  },
  searchButtonDisabled: {
    opacity: 0.55,
  },
  searchButtonText: {
    color: '#06110F',
    fontSize: 16,
    fontWeight: '700',
  },
  stateMessage: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  stateText: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
  },
  results: {
    gap: 10,
    paddingBottom: 28,
    paddingTop: 20,
  },
  trackRow: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 74,
    padding: 12,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.elevated,
    borderRadius: 6,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  artworkText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  artistName: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  soundCloudLink: {
    alignSelf: 'flex-start',
    backgroundColor: '#15100B',
    borderColor: '#FF5500',
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    marginTop: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  sourceLabel: {
    color: '#FF8A3D',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  soundCloudLinkText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
});
