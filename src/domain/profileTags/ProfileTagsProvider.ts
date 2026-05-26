import type { TasteProfile } from '@/domain/taste';
import type { ProfileTagSummary } from './ProfileTagSummary';

export interface ProfileTagsProvider {
  generateTags(profile: TasteProfile): Promise<ProfileTagSummary>;
}
