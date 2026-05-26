import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AsyncStorageListeningEventRepository,
  listeningEventsStorageKey,
} from '@/data/events/AsyncStorageListeningEventRepository';

describe('AsyncStorageListeningEventRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('appends listening events as an ordered event log', async () => {
    const repository = new AsyncStorageListeningEventRepository();

    await repository.append({
      id: 'event-1',
      schemaVersion: 1,
      type: 'played',
      trackId: 'rec-101',
      createdAt: '2026-05-26T10:00:00.000Z',
    });
    await repository.append({
      id: 'event-2',
      schemaVersion: 1,
      type: 'searched',
      query: 'dub techno',
      createdAt: '2026-05-26T10:01:00.000Z',
    });

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      listeningEventsStorageKey,
      expect.stringContaining('event-2'),
    );
    await expect(repository.list()).resolves.toHaveLength(2);
  });
});
