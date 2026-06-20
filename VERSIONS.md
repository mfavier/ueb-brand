# VERSIONS — @ueb/brand

Shared brand identity (design tokens, fonts, crest) for the Uccle Europe Basketball ecosystem.
Versioning: **SemVer** (`MAJOR.MINOR.PATCH`) — this is a library consumed by version, not an app.
Consumed via tagged git dependency: `github:mfavier/ueb-brand#vX.Y.Z`.

Current version: **v0.2.0**

Most recent version first. Full detail in `CHANGELOG.md`.

---

## v0.2.0 — 2026-06-20 · Light theme + dual-mode preset
Added `lightTheme` and made the preset emit `:root` (light) + `.dark` (dark). Removed `--radius`
from brand themes (now app-level). New exports: `lightTheme`, `SemanticTheme`.

**Consumer matrix**

| App | Min version | On this version | Notes |
|---|---|---|---|
| ueb-evolution | v0.1.0 | v0.2.0 (pending) | dark-only (`html.dark`); must set `--radius` |
| ueb-manager | — | — | phase 4 (light) |
| ueb-public | — | — | phase 4 (light, reconcile palette) |
| ueb-drills | — | — | phase 4 (light) |
| ueb-stats | — | — | later (OKLCH adapter, non-game UI only) |

## v0.1.0 — 2026-06-20 · Initial release
Tokens + Tailwind preset + crest. First consumed by ueb-evolution.
