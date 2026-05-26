import type { TasteProfile } from './TasteProfile';

export type TasteProfileRepository = {
  getProfile(): Promise<TasteProfile | null>;
  saveProfile(profile: TasteProfile): Promise<void>;
  clearProfile(): Promise<void>;
};
