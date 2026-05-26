import {
  completeTasteProfile,
  toggleTasteValue,
  validateTasteProfile,
} from '@/domain/taste/TasteProfile';

describe('TasteProfile domain', () => {
  it('validates the minimum onboarding selections', () => {
    expect(
      validateTasteProfile({
        genres: ['Techno'],
        moods: [],
        artists: [],
      }),
    ).toMatchObject({
      canContinueGenres: false,
      canContinueMoods: false,
      canContinueArtists: false,
      canComplete: false,
    });

    expect(
      validateTasteProfile({
        genres: ['Techno', 'House'],
        moods: ['Hypnotic'],
        artists: ['Skee Mask'],
      }),
    ).toMatchObject({
      canContinueGenres: true,
      canContinueMoods: true,
      canContinueArtists: true,
      canComplete: true,
    });
  });

  it('toggles selected taste values', () => {
    expect(toggleTasteValue(['Techno'], 'House')).toEqual(['Techno', 'House']);
    expect(toggleTasteValue(['Techno', 'House'], 'Techno')).toEqual(['House']);
  });

  it('completes a profile with an ISO timestamp', () => {
    expect(
      completeTasteProfile(
        {
          genres: ['Techno', 'House'],
          moods: ['Hypnotic'],
          artists: ['Skee Mask'],
        },
        new Date('2026-05-26T10:00:00.000Z'),
      ),
    ).toEqual({
      genres: ['Techno', 'House'],
      moods: ['Hypnotic'],
      artists: ['Skee Mask'],
      completedAt: '2026-05-26T10:00:00.000Z',
    });
  });
});
