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

export const appConfig: AppConfig = {
  appName: 'Klangfeld',
  version: '1.0.0',
  musicApiBaseUrl:
    process.env.EXPO_PUBLIC_SOUNDCLOUD_API_BASE_URL ?? 'https://api.soundcloud.com',
  profileTagsEndpoint: process.env.EXPO_PUBLIC_PROFILE_TAGS_ENDPOINT ?? '/api/profile-tags',
  features: {
    soundCloudSearch: true,
    useLiveSoundCloudApi: process.env.EXPO_PUBLIC_USE_LIVE_SOUNDCLOUD_API === 'true',
    aiProfileTags: process.env.EXPO_PUBLIC_AI_PROFILE_TAGS_ENABLED !== 'false',
  },
};
