import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appConfig } from '@/config/appConfig';
import { SoundCloudProvider } from '@/data/music/SoundCloudProvider';
import type { SearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import { SearchTracksUseCase as DefaultSearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import type { Track } from '@/domain/music/Track';

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

type SearchScreenProps = {
  searchTracksUseCase?: SearchTracksUseCase;
};

export function SearchScreen({ searchTracksUseCase }: SearchScreenProps) {
  const defaultUseCase = useMemo(() => {
    return new DefaultSearchTracksUseCase(
      new SoundCloudProvider({
        baseUrl: appConfig.musicApiBaseUrl,
      }),
    );
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>MusicApp</Text>
        <Text style={styles.subtitle}>SoundCloud search</Text>
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
    </SafeAreaView>
  );
}

function TrackResult({ track }: { track: Track }) {
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
    backgroundColor: '#0B0F14',
    paddingHorizontal: 20,
  },
  header: {
    paddingBottom: 20,
    paddingTop: 24,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A7B0BE',
    fontSize: 16,
    marginTop: 4,
  },
  searchBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#171D26',
    borderColor: '#2A3441',
    borderRadius: 8,
    borderWidth: 1,
    color: '#F5F7FA',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#5DE4C7',
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
    color: '#07100D',
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
    color: '#A7B0BE',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF8A8A',
  },
  results: {
    gap: 10,
    paddingBottom: 28,
    paddingTop: 20,
  },
  trackRow: {
    alignItems: 'center',
    backgroundColor: '#171D26',
    borderColor: '#2A3441',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 74,
    padding: 12,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#2A3441',
    borderRadius: 6,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  artworkText: {
    color: '#5DE4C7',
    fontSize: 20,
    fontWeight: '700',
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
  },
  artistName: {
    color: '#A7B0BE',
    fontSize: 14,
    marginTop: 4,
  },
});
