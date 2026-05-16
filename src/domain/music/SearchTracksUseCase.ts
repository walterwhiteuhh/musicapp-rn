import type { MusicProvider } from './MusicProvider';
import type { Track } from './Track';

export class SearchTracksUseCase {
  constructor(private readonly musicProvider: MusicProvider) {}

  async execute(query: string): Promise<Track[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    return this.musicProvider.searchTracks(normalizedQuery);
  }
}
