import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RecommendationTrack } from '@/domain/recommendations/RecommendationTrack';

const FAVORITES_STORAGE_KEY = 'klangfeld:library:favorites:v1';
const HISTORY_STORAGE_KEY = 'klangfeld:library:history:v1';

export function useLibrary() {
  const [favorites, setFavorites] = useState<RecommendationTrack[]>([]);
  const [history, setHistory] = useState<RecommendationTrack[]>([]);
  const [loading, setLoading] = useState(true);

  // Favoriten und Verlauf beim Laden laden
  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        const [rawFavs, rawHistory] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
          AsyncStorage.getItem(HISTORY_STORAGE_KEY),
        ]);

        if (rawFavs) {
          setFavorites(JSON.parse(rawFavs));
        }
        if (rawHistory) {
          setHistory(JSON.parse(rawHistory));
        }
      } catch {
        // Fehler beim Laden abfangen
      } finally {
        setLoading(false);
      }
    };

    void loadLibraryData();
  }, []);

  // Track favorisieren oder Ent-favorisieren
  const toggleFavorite = async (track: RecommendationTrack) => {
    try {
      let updatedFavs: RecommendationTrack[];
      const isAlreadyFav = favorites.some((item) => item.id === track.id);

      if (isAlreadyFav) {
        updatedFavs = favorites.filter((item) => item.id !== track.id);
      } else {
        updatedFavs = [track, ...favorites];
      }

      setFavorites(updatedFavs);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavs));
    } catch {
      // Fehler abfangen
    }
  };

  // Song zum Verlauf hinzufügen (nur lokale Tracks oder nach Belieben alle)
  const addToHistory = async (track: RecommendationTrack) => {
    try {
      // Duplikate aus Verlauf filtern
      const filteredHistory = history.filter((item) => item.id !== track.id);
      // Neuen Track ganz oben einfügen, max 10 Einträge behalten
      const updatedHistory = [track, ...filteredHistory].slice(0, 10);

      setHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch {
      // Fehler abfangen
    }
  };

  const isFavorite = (trackId: string) => {
    return favorites.some((item) => item.id === trackId);
  };

  return {
    favorites,
    history,
    loading,
    toggleFavorite,
    addToHistory,
    isFavorite,
  };
}
