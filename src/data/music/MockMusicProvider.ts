import type { MusicProvider } from '@/domain/music/MusicProvider';
import type { Track } from '@/domain/music/Track';

export class MockMusicProvider implements MusicProvider {
  constructor(private readonly tracks: Track[] = []) {}

  async searchTracks(query: string): Promise<Track[]> {
    const normalizedQuery = query.toLowerCase();

    return this.tracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.artistName.toLowerCase().includes(normalizedQuery)
      );
    });
  }
}
