# MusicApp RN

Greenfield Expo app for a SoundCloud-backed music search experience. Iteration 1 focuses on a store-ready Android foundation, strict TypeScript, TDD, and a tested search slice.

## Setup

```sh
npm install
```

Optional local configuration:

```sh
cp .env.example .env.local
```

## Scripts

```sh
npm test
npm run test:watch
npm run typecheck
npm run lint
npm start
```

## Android / Play Store Foundation

- Android package placeholder: `com.example.musicapp`
- App version: `1.0.0`
- Android version code: `1`
- EAS profiles: `development`, `preview`, `production`
- Production Android builds are configured as app bundles (`.aab`)

Before submitting to Google Play, replace the placeholder package ID and app branding, then configure a Google Play service account for `eas submit`.

## SoundCloud Boundary

The mobile app does not embed a `client_secret`. The `SoundCloudProvider` accepts an access-token provider so a later backend/proxy can own OAuth token exchange safely. Iteration 1 uses tested mapping and mockable fetch boundaries.

By default, the app uses local SoundCloud-style fixtures so Expo Go and web preview are immediately interactive. Set `EXPO_PUBLIC_USE_LIVE_SOUNDCLOUD_API=true` only after a safe token/proxy flow exists.
