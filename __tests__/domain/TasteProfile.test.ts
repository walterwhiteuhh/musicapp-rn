import {
  completeTasteProfile,
  deriveRecommendationCalibration,
  toggleLimitedValue,
  updateTrackDimension,
  validateTasteProfile,
} from '@/domain/taste/TasteProfile';

const validDraft = {
  genres: ['Techno', 'Dub Techno'],
  contexts: ['Club' as const],
  dimensions: {
    energy: 70,
    density: 45,
    texture: 55,
    space: 60,
    rhythm: 35,
  },
  suggestedArtists: ['Ben Klock', 'Deepchord'],
  selectedArtists: ['Ben Klock'],
};

describe('TasteProfile domain', () => {
  it('validates min and max onboarding selections', () => {
    expect(
      validateTasteProfile({
        ...validDraft,
        genres: ['Techno'],
        selectedArtists: [],
      }),
    ).toMatchObject({
      canContinueGenres: false,
      canContinueArtists: false,
      canComplete: false,
    });

    expect(validateTasteProfile(validDraft)).toMatchObject({
      canContinueGenres: true,
      canContinueDimensions: true,
      canContinueContexts: true,
      canContinueArtists: true,
      canComplete: true,
    });
  });

  it('toggles selected values while respecting max limits', () => {
    expect(toggleLimitedValue(['Techno'], 'House', 4)).toEqual(['Techno', 'House']);
    expect(toggleLimitedValue(['Techno', 'House'], 'Techno', 4)).toEqual(['House']);
    expect(toggleLimitedValue(['A', 'B'], 'C', 2)).toEqual(['A', 'B']);
  });

  it('clamps track dimensions to the 0-100 range', () => {
    expect(updateTrackDimension(validDraft.dimensions, 'energy', 120).energy).toBe(100);
    expect(updateTrackDimension(validDraft.dimensions, 'space', -5).space).toBe(0);
  });

  it('completes a versioned profile with initial calibration', () => {
    expect(completeTasteProfile(validDraft, new Date('2026-05-26T10:00:00.000Z'))).toEqual({
      schemaVersion: 1,
      ...validDraft,
      calibration: {
        onboardingWeight: 1,
        behaviorWeight: 0,
        confidence: 0,
        interactionCount: 0,
      },
      completedAt: '2026-05-26T10:00:00.000Z',
      updatedAt: '2026-05-26T10:00:00.000Z',
    });
  });

  it('decays onboarding weight as interaction count grows', () => {
    expect(deriveRecommendationCalibration(0)).toMatchObject({
      onboardingWeight: 1,
      behaviorWeight: 0,
      confidence: 0,
    });
    expect(deriveRecommendationCalibration(50)).toMatchObject({
      onboardingWeight: 0.5,
      behaviorWeight: 0.5,
      confidence: 0.5,
    });
    expect(deriveRecommendationCalibration(150)).toMatchObject({
      onboardingWeight: 0.2,
      behaviorWeight: 0.8,
      confidence: 1,
    });
  });
});
