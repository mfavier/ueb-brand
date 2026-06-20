# Changelog — @ueb/brand

All notable changes to the brand package. The package follows **SemVer**; see the
"Versioning & compatibility" section of the README for what counts as breaking.

Most recent first.

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
