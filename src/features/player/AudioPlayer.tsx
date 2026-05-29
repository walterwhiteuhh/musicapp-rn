import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause, Play, X } from 'lucide-react-native';

import { useAudioPlayer } from './PlayerContext';
import { useThemePalette } from '@/theme/ThemeContext';

export function AudioPlayer() {
  const { currentTrack, isPlaying, durationMs, positionMs, pauseTrack, resumeTrack, stopTrack } = useAudioPlayer();
  const { palette } = useThemePalette();
  
  // Waveform Bar Animation Values
  const barHeights = useRef(Array.from({ length: 12 }, () => new Animated.Value(15))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Visualizer Animationen steuern
  useEffect(() => {
    if (!isPlaying) {
      // Wenn pausiert, Waveform flach halten
      barHeights.forEach((bar) => {
        Animated.timing(bar, {
          toValue: 6,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Dauerschleife für tanzende Waveform-Balken
    const animations = barHeights.map((bar) => {
      const animateBar = () => {
        if (!isPlaying) return;
        const randomHeight = Math.floor(Math.random() * 26) + 8; // Random Höhe zwischen 8 und 34
        const randomDuration = Math.floor(Math.random() * 150) + 150; // Random Tempo zwischen 150 und 300ms

        Animated.timing(bar, {
          toValue: randomHeight,
          duration: randomDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished && isPlaying) {
            animateBar();
          }
        });
      };
      
      animateBar();
      return animateBar;
    });

    // Subtiler pulsierender Glow-Effekt für den Player-Rand
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [isPlaying, barHeights]);

  if (!currentTrack) {
    return null;
  }

  // Progress-Berechnung (Prozentuale Weite)
  const progressPercent = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;

  // Formatierungs-Helfer
  const formatTime = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: palette.surface + 'EE', // Leicht durchscheinendes Glassmorphismus
          borderColor: palette.border,
          shadowColor: palette.primary,
          // Pulsierende Schatten-Glow
          shadowOpacity: isPlaying ? 0.35 : 0.15,
          shadowRadius: isPlaying ? 16 : 6,
          elevation: isPlaying ? 8 : 4,
          transform: [{ scale: pulseAnim }],
        }
      ]}
    >
      {/* Oberer hauchdünner Fortschrittsbalken */}
      <View style={[styles.progressTrack, { backgroundColor: palette.elevated }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.max(0, Math.min(100, progressPercent))}%`,
              backgroundColor: palette.primary,
            }
          ]} 
        />
      </View>

      <View style={styles.playerBody}>
        {/* Play/Pause Button */}
        <Pressable 
          accessibilityRole="button"
          onPress={handlePlayPause}
          style={({ pressed }) => [
            styles.playButton, 
            { 
              backgroundColor: palette.primary,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            }
          ]}
        >
          {isPlaying ? (
            <Pause color="#06110F" size={18} fill="#06110F" />
          ) : (
            <Play color="#06110F" size={18} fill="#06110F" />
          )}
        </Pressable>

        {/* Track Metadaten */}
        <View style={styles.trackInfo}>
          <Text numberOfLines={1} style={[styles.title, { color: palette.text }]}>
            {currentTrack.title}
          </Text>
          <View style={styles.artistRow}>
            <Text numberOfLines={1} style={[styles.artist, { color: palette.muted }]}>
              {currentTrack.artistName}
            </Text>
            <Text style={[styles.timeLabel, { color: palette.muted }]}>
              {formatTime(positionMs)} / {formatTime(durationMs)}
            </Text>
          </View>
        </View>

        {/* Rhythmische Signal-Waveform */}
        <View style={styles.visualizer}>
          {barHeights.map((barHeight, idx) => (
            <Animated.View 
              key={idx}
              style={[
                styles.waveformBar, 
                { 
                  height: barHeight,
                  backgroundColor: palette.primary,
                }
              ]} 
            />
          ))}
        </View>

        {/* Schließen / Stoppen */}
        <Pressable 
          accessibilityRole="button"
          onPress={stopTrack}
          style={({ pressed }) => [
            styles.closeButton, 
            { 
              backgroundColor: palette.elevated,
              borderColor: palette.border,
              transform: [{ scale: pressed ? 0.9 : 1 }],
            }
          ]}
        >
          <X color={palette.muted} size={15} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 66, // Perfekt platziert direkt über der Tab-Bar
    left: 14,
    right: 14,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
  },
  progressTrack: {
    height: 3,
    width: '100%',
  },
  progressFill: {
    height: 3,
  },
  playerBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  playButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  trackInfo: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
  },
  artistRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  artist: {
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 90,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  visualizer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    height: 34,
    justifyContent: 'center',
    width: 66,
  },
  waveformBar: {
    borderRadius: 999,
    width: 3,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
});
