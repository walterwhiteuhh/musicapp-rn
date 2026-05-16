import { SearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import type { MusicProvider } from '@/domain/music/MusicProvider';
import type { Track } from '@/domain/music/Track';

const track: Track = {
  id: '1',
  title: 'Midnight City',
  artistName: 'M83',
  artworkUrl: null,
  durationMs: 243000,
  source: 'soundcloud',
};

describe('SearchTracksUseCase', () => {
  it('returns no tracks and skips the provider when the query is blank', async () => {
    const provider: MusicProvider = {
      searchTracks: jest.fn(),
    };
    const useCase = new SearchTracksUseCase(provider);

    await expect(useCase.execute('   ')).resolves.toEqual([]);
    expect(provider.searchTracks).not.toHaveBeenCalled();
  });

  it('trims the query before searching', async () => {
    const provider: MusicProvider = {
      searchTracks: jest.fn().mockResolvedValue([track]),
    };
    const useCase = new SearchTracksUseCase(provider);

    await expect(useCase.execute('  midnight  ')).resolves.toEqual([track]);
    expect(provider.searchTracks).toHaveBeenCalledWith('midnight');
  });
});
