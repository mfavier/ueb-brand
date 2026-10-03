# Changelog — @ueb/brand

All notable changes to the brand package. The package follows **SemVer**; see the
"Versioning & compatibility" section of the README for what counts as breaking.

Most recent first.

## v0.4.0 — 2026-10-03

**Touch density tokens + secondary-text contrast (courtside tablet use).**

- New density CSS variables emitted by the preset: `--target-min`, `--target-gap`, `--text-control`, `--leading-control`, `--text-table`, `--leading-table`, `--text-table-head`, `--leading-table-head`. `:root` holds the fine-pointer (desktop) values — `--target-min: 0px`, so nothing changes on desktop — and `@media (pointer: coarse)` the touch values (44 px targets, 8 px gaps, 16/15/13 px text). The criterion is the pointer type, not the width: a wide touch screen stays touch.
- Base layer, coarse pointer only: every interactive element (`button`, `[role=button|tab|option|menuitem]`, `summary`, `select`, text `input`, `a[href]`) gets `min-height`/`min-width: var(--target-min)` and `touch-action: manipulation`, at specificity 0 (`:where`). Inline text links are unaffected (inline boxes ignore `min-*`, the WCAG 2.5.8 inline exception); checkbox / radio / switch keep their size (the label row is the target). Opt-out: `data-touch-exempt="<reason>"`.
- New utilities: `min-h-target`, `min-w-target`, `gap-target`, `text-control`, `text-table`, `text-table-head`, `text-caption` (12 px, the floor). New variants: `coarse:` and `fine:`.
- `muted-foreground` darkened/lightened to reach **≥ 7:1** on `background`, `card`, `muted` and `secondary`: dark `215 18% 64%` → `215 18% 72%`, light `250 10% 42%` → `250 10% 33%`. Exported `MIN_SECONDARY_TEXT_CONTRAST`, `SECONDARY_TEXT_SURFACES`, `densityTokens`, `CAPTION_FONT_SIZE`.
- `npm test` (build + `node --test`): contrast floor per theme with a negative control on the old values, and the preset's density contract on generated CSS.

**Migration from v0.3.x:** none required. To benefit, put `min-h-target` (+ `min-w-target` on icon buttons) and `text-control` on interactive base components; a caller's fixed `h-8` no longer defeats the touch floor because `min-height` wins over `height`.

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
