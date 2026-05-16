export type AppConfig = {
  appName: string;
  version: string;
  musicApiBaseUrl: string;
  features: {
    soundCloudSearch: boolean;
  };
};

export const appConfig: AppConfig = {
  appName: 'MusicApp',
  version: '1.0.0',
  musicApiBaseUrl:
    process.env.EXPO_PUBLIC_SOUNDCLOUD_API_BASE_URL ?? 'https://api.soundcloud.com',
  features: {
    soundCloudSearch: true,
  },
};
