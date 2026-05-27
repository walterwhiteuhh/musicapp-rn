# Klangfeld

Klangfeld is an Expo app for SoundCloud-backed electronic music discovery. It combines curated scene knowledge, transparent recommendation signals, weighted tags, technical reads, and a backend planning path for safer profile and API-key handling.

The technical repository name is still `musicapp-rn`. While Netlify is blocked by account credits, GitHub is the working source of truth. See [docs/github-workflow.md](docs/github-workflow.md) for the current branch, deployment status, gates, and Netlify return path.

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
npm.cmd test -- --watch=false
npm run test:watch
npm.cmd run typecheck
npm.cmd run lint
npm start
```

For web output:

```sh
npm.cmd run build:web
```

## Android / Play Store Foundation

- Android package: `com.klangfeld.app`
- App version: `1.0.0`
- Android version code: `1`
- EAS profiles: `development`, `preview`, `production`
- Production Android builds are configured as app bundles (`.aab`)

Before submitting to Google Play, configure a Google Play service account for `eas submit`.

## SoundCloud Boundary

The mobile app does not embed a `client_secret`. The `SoundCloudProvider` accepts an access-token provider so a later backend/proxy can own OAuth token exchange safely. Iteration 1 uses tested mapping and mockable fetch boundaries.

By default, the app uses local SoundCloud-style fixtures so Expo Go and web preview are immediately interactive. Set `EXPO_PUBLIC_USE_LIVE_SOUNDCLOUD_API=true` only after a safe token/proxy flow exists.
