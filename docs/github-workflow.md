# Klangfeld GitHub Workflow

This repository is the working source of truth for Klangfeld while Netlify is blocked by account credits.

## Current Source of Truth

- Product name: Klangfeld
- Repository: https://github.com/walterwhiteuhh/musicapp-rn.git
- Primary working branch: `codex/dev-ui-iteration`
- Netlify project: `klangfeld`
- Production URL: https://klangfeld.netlify.app
- Netlify site ID: `bc1d681b-4066-434d-89aa-32e62d74c72a`
- Netlify status: deployments are blocked while the account reports `Account usage exceeded for credits`.

The technical repository name stays `musicapp-rn` for now. Klangfeld is the product name used by the Expo app and product documentation.

## Preserved Klangfeld Context

The current Klangfeld feature baseline includes:

- Lilly Palmer and Spannung Radio Show content.
- SoundCloud radio-show source links.
- Weighted multi-tags instead of exclusive genre labels.
- Technical feature layer and Technical Read surfaces.
- Mood signal contracts.
- SQL backend planning with a `users` foreign key and encrypted API key table.

## Working Rules

Before meaningful work:

```sh
git status --short --branch
git log --oneline -5 --decorate
```

Use `codex/dev-ui-iteration` for the current Klangfeld iteration. For larger isolated work, branch from that baseline with the `codex/` prefix, for example:

- `codex/klangfeld-backend-contracts`
- `codex/klangfeld-ui-polish`
- `codex/klangfeld-netlify-reconnect`

Do not update `main` until the standard gates pass.

## Standard Gates

Run these before committing completed work:

```sh
npm.cmd test -- --watch=false
npm.cmd run typecheck
```

For UI, routing, Netlify, or web-output changes, also run:

```sh
npm.cmd run build:web
```

Commit and push only after the relevant gates pass.

## Netlify Return Path

Do not spend more time debugging Netlify deploy failures while the site is disabled for credits.

When the account is active again:

1. Check `netlify.cmd status`.
2. Confirm the linked project is `klangfeld`.
3. Connect or repair the GitHub repo link if needed.
4. Use build command `npm ci && npm run build:web`.
5. Use publish directory `dist`.
6. Deploy production.
7. Verify https://klangfeld.netlify.app in the browser.

