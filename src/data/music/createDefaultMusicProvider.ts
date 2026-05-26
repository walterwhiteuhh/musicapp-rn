import { appConfig } from '@/config/appConfig';
import { MockMusicProvider } from '@/data/music/MockMusicProvider';
import { SoundCloudProvider } from '@/data/music/SoundCloudProvider';
import { soundCloudTrackFixtures } from '@/data/music/fixtures';
import type { MusicProvider } from '@/domain/music/MusicProvider';

export function createDefaultMusicProvider(): MusicProvider {
  if (!appConfig.features.useLiveSoundCloudApi) {
    return new MockMusicProvider(soundCloudTrackFixtures);
  }

  return new SoundCloudProvider({
    baseUrl: appConfig.musicApiBaseUrl,
  });
}
