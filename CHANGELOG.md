# Changelog — @ueb/brand

All notable changes to the brand package. The package follows **SemVer**; see the
"Versioning & compatibility" section of the README for what counts as breaking.

Most recent first.

## v0.3.1 — 2026-06-20

**Fix: stable viewport width (navbar shift on route change).**

- The base layer now uses `html { overflow-y: scroll; overflow-x: clip }` instead of `scrollbar-gutter: stable`. On a default `overflow: visible` `<html>`, the viewport's scrollbar gutter is propagated from `<body>`, so `scrollbar-gutter` on `<html>` was silently ignored and centered layout (the navbar) still shifted when the vertical scrollbar toggled between routes. Forcing a permanent scrollbar track makes the content width constant and sidesteps the propagation. `overflow-x: clip` absorbs stray horizontal overflow without breaking the sticky navbar.
- No contract change. Consumers just bump and inherit the fix.

## v0.3.0 — 2026-06-20

**Base layer (design-system foundation).**

- The Tailwind preset now ships **common keyframes/animations** (`fade-in`, `fade-up`, `slide-in-right`, `slide-in-left`, `pulse-subtle`, `accordion-down`, `accordion-up`) via `theme.extend`.
- The preset's `addBase` now also emits shared **base CSS resets**: stable scrollbar gutter on `<html>` (kills page-to-page layout shift), `prefers-reduced-motion` neutralization, a `:focus-visible` ring (using `--ring`), and the thin brand scrollbar (webkit).
- Purely additive — the token-name contract is unchanged, no new entry points. This is Tier 1 of the design-system layering (see `ueb-documentation/PRODUCTIZATION-NOTES.md`).

**Migration from v0.2.0:** optional but recommended — delete your app's local copies of the reduced-motion block, the `:focus-visible` rule, the webkit-scrollbar rules, the `scrollbar-gutter` declarations, and the duplicated keyframes; they now come from the preset. Keep app-specific keyframes/shadows.

## v0.2.0 — 2026-06-20

**Light theme + dual-mode preset.**

- Added `lightTheme` (warm club palette for `ueb-public` / `ueb-manager` / `ueb-drills`). Provisional — to be reconciled with `ueb-public`'s existing light values during rollout.
- The Tailwind preset now emits **`:root` = light** and **`.dark` = dark** (was dark-only in `:root`). Dark-only apps opt in with `<html class="dark">`.
- Removed `--radius` from the brand themes — corner radius is an app-level choice now. Consumers must set `--radius` in their own `:root`; the preset still provides the `lg/md/sm` scale.
- New exports: `lightTheme`, `SemanticTheme` type.

**Migration from v0.1.0:** add `--radius` to your app's `:root` (evolution: `0.75rem`). Light-default apps get the light theme automatically; keep `<html class="dark">` for dark-only apps.

## v0.1.0 — 2026-06-20

Initial release.

- `clubBrand` primitives (official crest hex), `clubFonts`, `darkTheme`.
- `@ueb/brand/tailwind-preset` — semantic colours, `club.*`, fonts, radius scale, brand glows, `:root` emission.
- `@ueb/brand/react` — `ClubLogo` (inlined crest), `clubLogoSvg`.
- `@ueb/brand/logo.svg` — raw vector crest.
- First consumer: `ueb-evolution`.
