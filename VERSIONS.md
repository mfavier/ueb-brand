# VERSIONS — @ueb/brand

Shared brand identity (design tokens, fonts, crest) for the Uccle Europe Basketball ecosystem.
Versioning: **SemVer** (`MAJOR.MINOR.PATCH`) — this is a library consumed by version, not an app.
Consumed via tagged git dependency: `github:mfavier/ueb-brand#vX.Y.Z`.

Current version: **v0.4.0**

Most recent version first. Full detail in `CHANGELOG.md`.

---

## v0.4.0 — 2026-10-03 · Touch density + secondary-text contrast
Density tokens that follow the POINTER TYPE (`@media (pointer: coarse)`), not the width:
`min-h-target` / `min-w-target` (0 on fine, 44 px on coarse), `gap-target`, `text-control`,
`text-table`, `text-table-head`, `text-caption` (12 px floor), and `coarse:` / `fine:` variants. On a coarse
pointer the base layer puts the 44 px floor on every interactive element (opt-out `data-touch-exempt`).
Desktop (fine pointer) renders as before. `muted-foreground` reaches ≥ 7:1 on background, card,
muted and secondary: dark 64% → 72%, light 42% → 33% (visible change for every consumer that
bumps). Contrast and preset contract checked by `npm test` (with negative control).

**Consumer matrix**

| App | Min version | On this version | Notes |
|---|---|---|---|
| ueb-evolution | v0.4.0 | v0.4.0 (pending, U2 tablet) | base components use the density tokens |
| ueb-manager | v0.3.1 | v0.3.1 | bumping brings the new `muted-foreground` (darker in light) — review before bumping |
| ueb-public / ueb-drills / ueb-stats | — | — | unchanged |

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
