import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { AsyncStorageTasteProfileRepository } from '@/data/taste/AsyncStorageTasteProfileRepository';
import type { RecommendationTrack } from '@/domain/recommendations/RecommendationTrack';
import type { TasteProfile } from '@/domain/taste/TasteProfile';

const repository = new AsyncStorageTasteProfileRepository();

type PlayerContextValue = {
  currentTrack: RecommendationTrack | null;
  isPlaying: boolean;
  durationMs: number;
  positionMs: number;
  /** Nur für source === 'local' Tracks erlaubt. Simuliert Wiedergabe visuell. */
  playTrack(track: RecommendationTrack): void;
  pauseTrack(): void;
  resumeTrack(): void;
  stopTrack(): void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

// Standard Halbwertszeit für Musikgeschmack (14 Tage in Millisekunden)
const TEMPORAL_HALF_LIFE_MS = 14 * 24 * 60 * 60 * 1000;
const DECAY_CONSTANT = Math.log(2) / TEMPORAL_HALF_LIFE_MS;

export function PlayerProvider({ children }: PropsWithChildren) {
  const [currentTrack, setCurrentTrack] = useState<RecommendationTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);

  // Simulierter Ticker zur visuellen Fortschrittsaktualisierung
  // HINWEIS: Kein echtes Audio — rein visuell. Echte Wiedergabe folgt,
  // sobald lokale Audiodateien eingebunden werden.
  useEffect(() => {
    if (!isPlaying || !currentTrack) {
      return;
    }

    const stepMs = 500;
    const interval = setInterval(() => {
      setPositionMs((prev) => {
        const next = prev + stepMs;
        if (next >= durationMs) {
          setIsPlaying(false);
          // Profil kalibrieren am Ende des Songs
          void triggerTasteProfileUpdate(currentTrack);
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, durationMs]);

  // Registriert ein Hörereignis und kalibriert das Klangprofil mathematisch neu
  const triggerTasteProfileUpdate = async (track: RecommendationTrack) => {
    try {
      const profile = await repository.getProfile();
      if (!profile) {
        return;
      }

      // 1. Initialisiere Onboarding-Anker, falls noch nicht vorhanden
      const onboardingAnchors = profile.onboardingAnchors ?? {
        genres: [...profile.genres],
        dimensions: { ...profile.dimensions },
        selectedArtists: [...profile.selectedArtists],
      };

      // 2. Erhöhe Interaktions-Zähler
      const interactionCount = (profile.calibration.interactionCount ?? 0) + 1;

      // 3. Berechne Verhaltensgewicht (wächst linear bis max 0.8)
      const behaviorWeight = Math.min(0.8, interactionCount / 100);
      const onboardingWeight = 1 - behaviorWeight;

      // 4. Füge Wiedergabe-Ereignis zur Historie hinzu
      const newPlayback = {
        trackId: track.id,
        timestamp: new Date().toISOString(),
        dimensions: { ...track.dimensions },
      };
      
      const playbackHistory = [...(profile.playbackHistory ?? []), newPlayback];

      // 5. Zeitgewichtung (Temporal Decay) für alle vergangenen Plays berechnen
      const tNow = Date.now();
      let weightSum = 0;
      const dimsSum = { energy: 0, density: 0, texture: 0, space: 0, rhythm: 0 };

      playbackHistory.forEach((play) => {
        const tPlay = new Date(play.timestamp).getTime();
        const tDiff = Math.max(0, tNow - tPlay);
        
        // Exponentieller Zerfall: W = e^(-lambda * delta_t)
        const weight = Math.exp(-DECAY_CONSTANT * tDiff);
        
        weightSum += weight;
        dimsSum.energy += weight * play.dimensions.energy;
        dimsSum.density += weight * play.dimensions.density;
        dimsSum.texture += weight * play.dimensions.texture;
        dimsSum.space += weight * play.dimensions.space;
        dimsSum.rhythm += weight * play.dimensions.rhythm;
      });

      // 6. Berechne die neue Verhaltens-Dimension
      const behaviorDims = weightSum > 0 
        ? {
            energy: dimsSum.energy / weightSum,
            density: dimsSum.density / weightSum,
            texture: dimsSum.texture / weightSum,
            space: dimsSum.space / weightSum,
            rhythm: dimsSum.rhythm / weightSum,
          }
        : { ...onboardingAnchors.dimensions };

      // 7. Kombiniere Anker- und Verhaltensdimensionen
      const updatedDimensions = {
        energy: Math.round(onboardingWeight * onboardingAnchors.dimensions.energy + behaviorWeight * behaviorDims.energy),
        density: Math.round(onboardingWeight * onboardingAnchors.dimensions.density + behaviorWeight * behaviorDims.density),
        texture: Math.round(onboardingWeight * onboardingAnchors.dimensions.texture + behaviorWeight * behaviorDims.texture),
        space: Math.round(onboardingWeight * onboardingAnchors.dimensions.space + behaviorWeight * behaviorDims.space),
        rhythm: Math.round(onboardingWeight * onboardingAnchors.dimensions.rhythm + behaviorWeight * behaviorDims.rhythm),
      };

      // 8. Aktualisiere Genre-Lineages im Profil
      const lineageWeights = { ...(profile.lineageWeights ?? {}) };
      const trackGenre = track.genre;
      if (trackGenre) {
        lineageWeights[trackGenre] = (lineageWeights[trackGenre] ?? 0.5) + 0.1;
        // Auf 1.0 deckeln
        if (lineageWeights[trackGenre] > 1) {
          lineageWeights[trackGenre] = 1;
        }
      }

      // Speichere das aktualisierte TasteProfile
      const updatedProfile: TasteProfile = {
        ...profile,
        dimensions: updatedDimensions,
        lineageWeights,
        onboardingAnchors,
        playbackHistory,
        calibration: {
          onboardingWeight,
          behaviorWeight,
          interactionCount,
        },
        updatedAt: new Date().toISOString(),
      };

      await repository.saveProfile(updatedProfile);
    } catch {
      // Fehler beim Aktualisieren des Profils silent abfangen
    }
  };

  const playTrack = (track: RecommendationTrack) => {
    // SICHERHEITSCHECK: Nur lokale Quellen dürfen im Player simuliert werden.
    // SoundCloud, YouTube und andere externe Quellen werden NICHT in-App abgespielt.
    if (track.source !== 'local') {
      console.warn(`[Klangfeld] Playback blocked: track "${track.title}" has source "${track.source}". Only 'local' sources are allowed.`);
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setPositionMs(0);

    const duration = track.durationMs || 180000; // Standard 3 Minuten Fallback
    setDurationMs(duration);

    // HINWEIS: Aktuell wird kein echtes Audio geladen.
    // Der Player simuliert den Fortschritt visuell (Waveform + Progressbar).
    // Echte Audio-Wiedergabe kommt erst mit lokalen Dateien (expo-av / expo-audio).

    // Inkrementiere das Profil bei jedem Anspielen direkt leicht
    void triggerTasteProfileUpdate(track);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (!currentTrack) {
      return;
    }
    setIsPlaying(true);
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setPositionMs(0);
  };

  const value = useMemo<PlayerContextValue>(() => {
    return {
      currentTrack,
      isPlaying,
      durationMs,
      positionMs,
      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
    };
  }, [currentTrack, isPlaying, durationMs, positionMs]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within PlayerProvider');
  }
  return context;
}

