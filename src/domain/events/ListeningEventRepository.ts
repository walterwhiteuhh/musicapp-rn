import type { ListeningEvent } from './ListeningEvent';

export type ListeningEventRepository = {
  append(event: ListeningEvent): Promise<void>;
  list(): Promise<ListeningEvent[]>;
  clear(): Promise<void>;
};
