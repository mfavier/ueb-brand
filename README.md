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
npm install github:mfavier/ueb-brand#v0.4.0
```

`dist/` is committed, so consumers don't build the package.

## Use

**Tailwind (v3 apps)** — `tailwind.config.ts`:

```ts
import uebBrandPreset from '@ueb/brand/tailwind-preset';

export default {
  presets: [uebBrandPreset], // colours, club.*, fonts, radius, glows, keyframes, :root+.dark vars, base resets
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
};
```

Then, per app:

- **Set `--radius`** in your own `:root` (the preset only provides the lg/md/sm scale):
  ```css
  :root { --radius: 0.75rem; } /* evolution; the others use 0.5rem */
  ```
- **Choose the mode**: the preset emits `:root` = light, `.dark` = dark. A light-default
  app does nothing; a **dark-only** app sets `<html class="dark">`.

Load the fonts in `index.html` (Kanit + DM Sans + DM Mono):

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Kanit:wght@500;600;700&display=swap" rel="stylesheet" />
```

**Density (touch) tokens** — they switch on `@media (pointer: coarse)`, not on width:

| Utility | Fine pointer (desktop) | Coarse pointer (touch) |
|---|---|---|
| `min-h-target` / `min-w-target` | 0 (no-op) | 44 px |
| `gap-target` | 4 px | 8 px |
| `text-control` | 14 px | 16 px |
| `text-table` | 14 px | 15 px |
| `text-table-head` | 12 px | 13 px |
| `text-caption` | 12 px | 12 px (floor) |

Variants `coarse:` and `fine:` cover the rest (e.g. `fine:h-8` keeps a compact desktop override).

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
| `@ueb/brand` | `clubBrand`, `clubFonts`, `darkTheme`, `lightTheme`, `densityTokens`, contrast constants (framework-agnostic) |
| `@ueb/brand/tailwind-preset` | Tailwind v3 preset (theme, keyframes, `:root`/`.dark` vars + base resets via addBase) |
| `@ueb/brand/react` | `ClubLogo`, `clubLogoSvg` |
| `@ueb/brand/logo.svg` | the raw vector crest |

## Re-skin for another club

1. Edit `src/tokens.ts` — `clubBrand` hex (and any `darkTheme` role hues).
2. Replace `src/logos/uccle-europe.svg`.
3. `npm test` (builds, then checks contrast + the preset contract), commit `dist/`, tag a new version.
4. Bump the dependency in each app and redeploy.

## Versioning & compatibility

The package is **SemVer**, consumed via tagged git dependency (`#vX.Y.Z`). Apps pin a tag and
bump deliberately — no silent drift. The **public contract** is: the set of token *names*
(`--primary`, `--accent`, `club.*`, the `gold`/`stat-highlight` roles…), the preset entry points,
and the `ClubLogo` props. That contract — not the hex values — is what SemVer protects.

| Change | Bump |
|---|---|
| Re-skin (change hex / theme values), add a token or theme, additive preset keys | **minor** |
| Bug fix, doc, crest asset swap (same name) | **patch** |
| Rename/remove a token role, change a token's meaning, change an export shape | **major** |

**Product mindset (to keep in view as this grows):** apps will run *mixed* versions of `@ueb/brand`
(one repo on `0.2.x`, another still on `0.1.x`). Because the contract is token *names*, a minor
re-skin propagates safely as each app bumps on its own cadence; only a **major** forces a coordinated
update across consumers. Track who's on what in the consumer matrix in `VERSIONS.md`, and treat a
major as a planned, ecosystem-wide release (all apps bumped + redeployed + smoke-tested together).
When this becomes multi-club, the per-club brand values become inputs (a config), kept separate from
this contract so version compatibility stays about the *shape*, not the *colours*.

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
