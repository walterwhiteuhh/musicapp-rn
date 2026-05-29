import { Platform } from 'react-native';

export type AppConfig = {
  appName: string;
  version: string;
  musicApiBaseUrl: string;
  profileTagsEndpoint: string;
  features: {
    soundCloudSearch: boolean;
    useLiveSoundCloudApi: boolean;
    aiProfileTags: boolean;
  };
};

const isNative = Platform.OS === 'android' || Platform.OS === 'ios';
const productionBackendUrl = 'https://klangfeld.netlify.app';

function resolveEndpoint(endpoint: string): string {
  if (endpoint.startsWith('/') && isNative) {
    return `${productionBackendUrl}${endpoint}`;
  }
  return endpoint;
}

const rawProfileTagsEndpoint =
  process.env.EXPO_PUBLIC_PROFILE_TAGS_ENDPOINT ?? '/api/profile-tags';

export const appConfig: AppConfig = {
  appName: 'Klangfeld',
  version: '1.0.0',
  musicApiBaseUrl:
    process.env.EXPO_PUBLIC_SOUNDCLOUD_API_BASE_URL ?? 'https://api.soundcloud.com',
  profileTagsEndpoint: resolveEndpoint(rawProfileTagsEndpoint),
  features: {
    soundCloudSearch: true,
    useLiveSoundCloudApi: process.env.EXPO_PUBLIC_USE_LIVE_SOUNDCLOUD_API === 'true',
    aiProfileTags: process.env.EXPO_PUBLIC_AI_PROFILE_TAGS_ENABLED !== 'false',
  },
};

