export type ListeningEventType =
  | 'played'
  | 'completed'
  | 'skipped'
  | 'liked'
  | 'saved'
  | 'searched'
  | 'playlistAdd';

export type ListeningEvent = {
  id: string;
  schemaVersion: 1;
  type: ListeningEventType;
  trackId?: string;
  query?: string;
  createdAt: string;
};
