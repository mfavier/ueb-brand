# VERSIONS — @ueb/brand

Shared brand identity (design tokens, fonts, crest) for the Uccle Europe Basketball ecosystem.
Versioning: **SemVer** (`MAJOR.MINOR.PATCH`) — this is a library consumed by version, not an app.
Consumed via tagged git dependency: `github:mfavier/ueb-brand#vX.Y.Z`.

Current version: **v0.3.1**

Most recent version first. Full detail in `CHANGELOG.md`.

---

## v0.3.1 — 2026-06-20 · Fix: stable viewport width
Base layer now uses `html { overflow-y: scroll; overflow-x: clip }` instead of `scrollbar-gutter`
(which is defeated by viewport overflow propagation on a `visible` `<html>`). Kills the navbar
horizontal shift when the vertical scrollbar toggles between routes. Consumer matrix: ueb-evolution
→ v0.3.1 (pending).

## v0.3.0 — 2026-06-20 · Base layer (resets + keyframes)
The preset now also owns common keyframes/animations and shared base CSS resets (scrollbar-gutter
on `<html>`, reduced-motion, `:focus-visible`, thin scrollbar) via `addBase`. Tier 1 of the
design-system layering. Purely additive — no contract change, no new entry points.

**Consumer matrix**

| App | Min version | On this version | Notes |
|---|---|---|---|
| ueb-evolution | v0.1.0 | v0.3.0 (pending) | dark-only (`html.dark`); sets `--radius`; dropped local resets/keyframes |
| ueb-manager | v0.3.1 | v0.3.1 | phase 4 (light) — full re-skin onto preset palette; DM Sans body; default light; harmonized login/sidebar + `data-scroll-locked` shift fix |
| ueb-public | — | — | phase 4 (light, reconcile palette + base rules) |
| ueb-drills | — | — | phase 4 (light) |
| ueb-stats | — | — | later (OKLCH adapter, non-game UI only) |

## v0.2.0 — 2026-06-20 · Light theme + dual-mode preset
Added `lightTheme` and made the preset emit `:root` (light) + `.dark` (dark). Removed `--radius`
from brand themes (now app-level). New exports: `lightTheme`, `SemanticTheme`.

## v0.1.0 — 2026-06-20 · Initial release
Tokens + Tailwind preset + crest. First consumed by ueb-evolution.
