export type MusicSource = 'soundcloud';

export type Track = {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string | null;
  durationMs: number;
  source: MusicSource;
};
