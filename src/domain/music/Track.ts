export type MusicSource = 'soundcloud' | 'youtube' | 'local';

export type Track = {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string | null;
  durationMs: number;
  source: MusicSource;
  externalUrl?: string;
};
