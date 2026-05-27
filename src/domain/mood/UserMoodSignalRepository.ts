import type { MoodEntityType, UserMoodSignal, UserMoodProfile } from './MoodSignal';

export type UserMoodSignalRepository = {
  addSignal(signal: UserMoodSignal): Promise<void>;
  listSignalsForUser(userId: string): Promise<UserMoodSignal[]>;
  listSignalsForEntity(input: {
    entityId: string;
    entityType: MoodEntityType;
  }): Promise<UserMoodSignal[]>;
  getMoodProfile(userId: string): Promise<UserMoodProfile | null>;
};
