# Klangfeld GitHub Workflow

This repository is the working source of truth for Klangfeld. GitHub carries the reviewed code history; Netlify provides preview and production web deploys.

## Current Source of Truth

- Product name: Klangfeld
- Repository: https://github.com/walterwhiteuhh/musicapp-rn.git
- Primary working branch: `codex/dev-ui-iteration`
- Netlify project: `klangfeld`
- Production URL: https://klangfeld.netlify.app
- Netlify site ID: `bc1d681b-4066-434d-89aa-32e62d74c72a`
- Netlify status: active; use preview deploys by default and production deploys only after explicit approval.

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

## Netlify Deploy Path

1. Check `netlify.cmd status`.
2. Confirm the linked project is `klangfeld`.
3. Run `npm.cmd run build:web`.
4. Create a preview with `netlify.cmd deploy --dir=dist --functions=netlify/functions`.
5. Review the preview URL.
6. Deploy production with `--prod` only after separate approval.
7. Verify https://klangfeld.netlify.app after production deploys.
