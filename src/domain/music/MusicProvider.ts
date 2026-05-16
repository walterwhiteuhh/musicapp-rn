import type { Track } from './Track';

export type MusicProvider = {
  searchTracks(query: string): Promise<Track[]>;
};
