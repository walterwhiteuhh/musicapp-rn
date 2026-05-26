import {
  createProfileTagsRequest,
  parseProfileTagSummary,
  type ProfileTagSummary,
} from '@/domain/profileTags';
import { createInitialDiscoveryDepth } from '@/domain/catalog';
import type { TasteProfile } from '@/domain/taste';

const profile: TasteProfile = {
  schemaVersion: 1,
  genres: ['Techno', 'Ambient'],
  contexts: ['Club', 'Focus'],
  dimensions: {
    energy: 70,
    density: 55,
    texture: 60,
    space: 45,
    rhythm: 80,
  },
  suggestedArtists: ['Ben Klock', 'Jon Hopkins'],
  selectedArtists: ['Ben Klock'],
  lineageWeights: {
    'Berlin hypnotic': 1,
  },
  artistAnchorWeights: {
    'Ben Klock': 1,
  },
  discoveryDepth: createInitialDiscoveryDepth(0),
  calibration: {
    onboardingWeight: 1,
    behaviorWeight: 0,
    confidence: 0,
    interactionCount: 0,
  },
  completedAt: '2026-05-26T10:00:00.000Z',
  updatedAt: '2026-05-26T10:00:00.000Z',
};

describe('ProfileTagSummary', () => {
  it('normalizes the profile request to allowed fields only', () => {
    const request = createProfileTagsRequest(profile);

    expect(request).toEqual({
      schemaVersion: 1,
      genres: ['Techno', 'Ambient'],
      contexts: ['Club', 'Focus'],
      dimensions: profile.dimensions,
      selectedArtists: ['Ben Klock'],
      lineageWeights: {
        'Berlin hypnotic': 1,
      },
      artistAnchorWeights: {
        'Ben Klock': 1,
      },
      discoveryDepth: profile.discoveryDepth,
      calibration: profile.calibration,
    });
    expect(request).not.toHaveProperty('completedAt');
    expect(request).not.toHaveProperty('updatedAt');
    expect(request).not.toHaveProperty('suggestedArtists');
  });

  it('parses a valid profile tag summary', () => {
    const summary: ProfileTagSummary = parseProfileTagSummary({
      schemaVersion: 1,
      primaryEnergy: 'high',
      rhythmBias: 'Driving four-to-the-floor with precise low-end focus',
      listeningIntent: 'Club-ready discovery',
      discoveryVector: ['hypnotic techno', 'deep pressure'],
      profileNotes: ['Strong rhythmic preference'],
      confidence: 0.812,
    });

    expect(summary.confidence).toBe(0.81);
    expect(summary.primaryEnergy).toBe('high');
  });

  it('rejects incomplete profile tag summaries', () => {
    expect(() =>
      parseProfileTagSummary({
        schemaVersion: 1,
        primaryEnergy: 'extreme',
        rhythmBias: 'fast',
      }),
    ).toThrow('invalid energy');
  });
});
