import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ListeningEvent } from '@/domain/events/ListeningEvent';
import type { ListeningEventRepository } from '@/domain/events/ListeningEventRepository';

export const listeningEventsStorageKey = 'klangfeld:listening-events:v1';

export class AsyncStorageListeningEventRepository implements ListeningEventRepository {
  async append(event: ListeningEvent): Promise<void> {
    const events = await this.list();
    await AsyncStorage.setItem(listeningEventsStorageKey, JSON.stringify([...events, event]));
  }

  async list(): Promise<ListeningEvent[]> {
    const rawEvents = await AsyncStorage.getItem(listeningEventsStorageKey);

    if (!rawEvents) {
      return [];
    }

    try {
      const parsedEvents: unknown = JSON.parse(rawEvents);

      if (!Array.isArray(parsedEvents)) {
        return [];
      }

      return parsedEvents.filter(isListeningEvent);
    } catch {
      return [];
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(listeningEventsStorageKey);
  }
}

function isListeningEvent(value: unknown): value is ListeningEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const event = value as Partial<ListeningEvent>;

  return (
    event.schemaVersion === 1 &&
    typeof event.id === 'string' &&
    typeof event.type === 'string' &&
    typeof event.createdAt === 'string'
  );
}
