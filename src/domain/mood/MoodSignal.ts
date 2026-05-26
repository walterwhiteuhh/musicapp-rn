export type MoodSchemaVersion = 1;

export type MoodEntityType = 'track' | 'set' | 'radio_show';

export type MoodSignalSource = 'explicit_user';

export type MoodVector = {
  valence: number;
  arousal: number;
  dominance: number;
};

export type EmojiMoodMappingEntry = {
  schemaVersion: MoodSchemaVersion;
  emojiCode: string;
  vector: MoodVector;
  defaultWeight: number;
};

export type UserMoodSignal = {
  schemaVersion: MoodSchemaVersion;
  signalId: string;
  userId: string;
  entityId: string;
  entityType: MoodEntityType;
  emojiCode: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  vector: MoodVector;
  context: string | null;
  source: MoodSignalSource;
  createdAt: string;
};

export type UserMoodProfile = {
  schemaVersion: MoodSchemaVersion;
  userId: string;
  valenceMean: number;
  arousalMean: number;
  dominanceMean: number;
  signalCount: number;
  confidence: number;
  updatedAt: string;
};

export function mapEmojiToMoodVector(
  emojiCode: string,
  mapping: EmojiMoodMappingEntry[],
): MoodVector | null {
  const entry = mapping.find((item) => item.emojiCode === emojiCode);

  if (!entry) {
    return null;
  }

  return entry.vector;
}

export function clampMoodVector(vector: MoodVector): MoodVector {
  return {
    valence: clampUnit(vector.valence),
    arousal: clampUnit(vector.arousal),
    dominance: clampUnit(vector.dominance),
  };
}

function clampUnit(value: number): number {
  return Math.max(-1, Math.min(1, Math.round(value * 1000) / 1000));
}
