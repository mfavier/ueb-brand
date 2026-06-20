# @ueb/brand

Shared **brand identity** for the Uccle Europe Basketball app ecosystem — the single
source of truth for colour design tokens, typography, and the crest logo.

Decision record: `ueb-documentation/docs/adr/0001-brand-identity-shared-package.md`.

## Why

The `club.*` palette and the `:root` theme variables used to be copy-pasted across
`ueb-public`, `ueb-manager`, `ueb-evolution` and `ueb-drills`. A brand change meant
editing many files in two colour spaces. This package owns the brand once and exposes
ready-to-consume adapters, so a re-skin is one edit + a version bump.

## Install (consumers)

```bash
npm install github:mfavier/ueb-brand#v0.1.0
```

`dist/` is committed, so consumers don't build the package.

## Use

**Tailwind (v3 apps)** — `tailwind.config.ts`:

```ts
import uebBrandPreset from '@ueb/brand/tailwind-preset';

export default {
  presets: [uebBrandPreset], // semantic colours, club.*, fonts, radius, glows, :root vars
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
};
```

Load the fonts in `index.html` (Kanit + DM Sans + DM Mono):

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Kanit:wght@500;600;700&display=swap" rel="stylesheet" />
```

**Crest (React):**

```tsx
import { ClubLogo } from '@ueb/brand/react';
<ClubLogo className="h-8 w-auto" />
```

Or the raw asset URL: `import logo from '@ueb/brand/logo.svg'`.

**Tokens (plain data):**

```ts
import { clubBrand, clubFonts, darkTheme } from '@ueb/brand';
```

## Entry points

| Import | Contents |
|---|---|
| `@ueb/brand` | `clubBrand`, `clubFonts`, `darkTheme` (framework-agnostic) |
| `@ueb/brand/tailwind-preset` | Tailwind v3 preset (theme + `:root` addBase plugin) |
| `@ueb/brand/react` | `ClubLogo`, `clubLogoSvg` |
| `@ueb/brand/logo.svg` | the raw vector crest |

## Re-skin for another club

1. Edit `src/tokens.ts` — `clubBrand` hex (and any `darkTheme` role hues).
2. Replace `src/logos/uccle-europe.svg`.
3. `npm run build`, commit `dist/`, tag a new version.
4. Bump the dependency in each app and redeploy.

## Roadmap

- v0: tokens + Tailwind v3 preset + crest (consumed first by `ueb-evolution`).
- Later: `lightTheme` for `ueb-public` / `ueb-manager` / `ueb-drills`; an OKLCH
  adapter for `ueb-stats` (Tailwind v4) non-game UI.

## Develop

```bash
npm install
npm run build      # tsup → dist (ESM + CJS + d.ts); commit the result
npm run typecheck
```
