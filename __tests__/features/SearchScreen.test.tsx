import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SearchScreen } from '@/features/search/SearchScreen';
import { SearchTracksUseCase } from '@/domain/music/SearchTracksUseCase';
import type { MusicProvider } from '@/domain/music/MusicProvider';
import type { Track } from '@/domain/music/Track';

const track: Track = {
  id: '1',
  title: 'Late Night Signal',
  artistName: 'Mira Vale',
  artworkUrl: null,
  durationMs: 184000,
  source: 'soundcloud',
};

function renderWithProvider(provider: MusicProvider) {
  return render(<SearchScreen searchTracksUseCase={new SearchTracksUseCase(provider)} />);
}

async function enterQueryAndSearch(query: string) {
  fireEvent.changeText(screen.getByLabelText('Search tracks'), query);

  await waitFor(() => {
    expect(screen.getByDisplayValue(query)).toBeTruthy();
  });

  fireEvent.press(screen.getByLabelText('Search'));
}

describe('SearchScreen', () => {
  it('renders the initial search state', () => {
    renderWithProvider({ searchTracks: jest.fn() });

    expect(screen.getByText('Find electronic tracks and artists.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Track or artist')).toBeTruthy();
    expect(screen.getByText('Start with a track or artist name.')).toBeTruthy();
  });

  it('renders matching tracks after search', async () => {
    const searchTracks = jest.fn().mockResolvedValue([track]);

    renderWithProvider({ searchTracks });
    await enterQueryAndSearch('signal');

    expect(searchTracks).toHaveBeenCalledWith('signal');
    expect(await screen.findByText('Late Night Signal')).toBeTruthy();
    expect(screen.getByText('Mira Vale')).toBeTruthy();
  });

  it('renders the loading state while the request is pending', async () => {
    let resolveSearch: (tracks: Track[]) => void = () => undefined;
    const pendingSearch = new Promise<Track[]>((resolve) => {
      resolveSearch = resolve;
    });

    renderWithProvider({
      searchTracks: jest.fn().mockReturnValue(pendingSearch),
    });

    await enterQueryAndSearch('signal');

    expect(await screen.findByTestId('search-loading')).toBeTruthy();

    resolveSearch([track]);
    expect(await screen.findByText('Late Night Signal')).toBeTruthy();
  });

  it('renders the empty state when no tracks match', async () => {
    renderWithProvider({
      searchTracks: jest.fn().mockResolvedValue([]),
    });

    await enterQueryAndSearch('unknown');

    expect(await screen.findByText('No tracks found.')).toBeTruthy();
  });

  it('renders the error state when search fails', async () => {
    renderWithProvider({
      searchTracks: jest.fn().mockRejectedValue(new Error('Network failed')),
    });

    await enterQueryAndSearch('signal');

    await waitFor(() => {
      expect(screen.getByText('Search is unavailable.')).toBeTruthy();
    });
  });
});
