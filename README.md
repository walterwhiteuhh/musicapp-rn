# Klangfeld

Klangfeld is a mobile-first music discovery app for electronic music. The project explores how recommendations can become more transparent by combining curated scene knowledge, weighted style tags, listening context, technical track signals, and visible source references.

The current build focuses on a strong product foundation rather than final branding. Visual identity, naming polish, and public launch assets will follow once the core experience is stable.

## What Klangfeld Does

- Builds an initial taste profile from genres, listening contexts, track dimensions, and reference artists.
- Recommends electronic music with explainable signals instead of opaque ranking alone.
- Shows weighted multi-tags, technical reads, source links, and cultural context for recommendations.
- Keeps SoundCloud-style search and source linking behind safe, mockable provider boundaries.
- Prepares a backend path for profile storage, feature schemas, mood signals, and encrypted API-key handling.

## Current Status

Klangfeld is in an early product-development phase with a working Expo app, static web export, Netlify deployment, and a documented backend planning layer.

Implemented:

- Mobile-ready Expo Router app with Discover, Search, Library, Profile, and Onboarding flows.
- Landing page, imprint, and privacy pages for the public web surface.
- Demo recommendation set with source-rich electronic music examples, including radio-show and live-set references.
- Weighted style tags, technical feature layer, and profile-shaped recommendation filtering.
- Local taste profile persistence via AsyncStorage.
- Netlify Function boundary for AI profile-tag generation.
- SQL planning draft for users, feature schemas, and encrypted API-key storage.

Not final yet:

- Production branding and visual identity.
- Native Play Store release build.
- Real account system and production backend.
- Final legal review before store submission.

## Product Direction

The project is moving toward a discovery system that treats music recommendations as a readable signal map:

- Scene and lineage: genres, sub-scenes, artist clusters, legacy references, and remix/version chains.
- Track features: energy, density, texture, space, rhythm, kick pressure, drop density, and melodic lift.
- Context: club, headphones, training, focus, radio shows, live sets, and editorial references.
- Feedback: mood signals and listening behavior that gradually reduce the weight of onboarding choices.
- Transparency: users should see why something is recommended and where the signal comes from.

## Tech Stack

- Expo SDK 55
- React 19 / React Native 0.83
- Expo Router
- TypeScript
- Jest with React Native Testing Library
- Netlify static hosting and functions
- OpenAI SDK behind a Netlify Function boundary

## Repository Structure

```text
app/                 Expo Router routes
src/components/      Shared UI components
src/features/        Product screens and feature modules
src/domain/          Domain models and recommendation logic
src/data/            Provider implementations and fixtures
netlify/functions/   Serverless function boundary
docs/                Feature-schema and backend planning docs
__tests__/           Unit and screen tests
```

## Development

Install dependencies:

```sh
npm install
```

Run the app:

```sh
npm start
```

Run the web build:

```sh
npm.cmd run build:web
```

Quality gates:

```sh
npm.cmd test -- --watch=false
npm.cmd run typecheck
npm.cmd run lint
```

## Configuration

Optional local environment:

```sh
cp .env.example .env.local
```

Relevant flags:

```text
EXPO_PUBLIC_SOUNDCLOUD_API_BASE_URL=https://api.soundcloud.com
EXPO_PUBLIC_USE_LIVE_SOUNDCLOUD_API=false
EXPO_PUBLIC_PROFILE_TAGS_ENDPOINT=/api/profile-tags
EXPO_PUBLIC_AI_PROFILE_TAGS_ENABLED=true
```

The mobile app does not embed a SoundCloud `client_secret`. Live SoundCloud access should only be enabled once a safe token/proxy flow exists.

## Android / Play Store Foundation

- App name: `Klangfeld`
- Android package: `com.klangfeld.app`
- Version: `1.0.0`
- Version code: `1`
- Orientation: portrait
- Keyboard layout mode: resize
- Production Android builds are planned as EAS app bundles.

Before Play Store submission, the project still needs final branding, store assets, a production privacy review, and an EAS production build.

## Roadmap

1. Finalize product branding, app icon, screenshots, and store copy.
2. Connect a production backend for user profiles, source ingestion, and secure API-key handling.
3. Expand recommendation data beyond curated fixtures.
4. Add mood and behavior feedback loops.
5. Prepare native Android release via EAS.
6. Harden privacy, imprint, and external-provider disclosures for store review.

## Links

- Production web: https://klangfeld.netlify.app
- Workflow notes: [docs/github-workflow.md](docs/github-workflow.md)
- Feature schema: [docs/feature-schema-v1.md](docs/feature-schema-v1.md)
- SQL planning draft: [docs/sql/backend_schema_v1.sql](docs/sql/backend_schema_v1.sql)
