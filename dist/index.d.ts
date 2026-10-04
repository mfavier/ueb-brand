/**
 * Club design tokens — SINGLE SOURCE OF TRUTH for the whole ecosystem.
 *
 * Everything brand-related (colours, fonts, the semantic themes) is defined here
 * and nowhere else. The Tailwind preset (./tailwind-preset) consumes this to
 * generate both the `club.*` utility colours AND the `:root` / `.dark` CSS
 * variables, so changing a value here re-skins every consuming app.
 *
 * Re-skinning for another club = edit `clubBrand` (and, if a hue needs it, the
 * role mappings in the themes), bump the package version, bump the dependency in
 * each app. See ueb-documentation/docs/adr/0001-brand-identity-shared-package.md.
 *
 * NOTE: `--radius` is intentionally NOT a brand token — corner radius is an
 * app-level layout choice (evolution 0.75rem, the others 0.5rem). Each consumer
 * sets `--radius` in its own `:root`; the preset only provides the lg/md/sm scale.
 */
/** Brand primitives — the ONLY raw hex values.
 *  Sampled from the official vector crest (UCCLE EUROPE.svg). */
declare const clubBrand: {
    readonly marianBlue: "#39458E";
    readonly uranianBlue: "#A7CDE4";
    readonly lion: "#CBA165";
    readonly ultraViolet: "#5b5574";
    readonly babyPowder: "#fcfaf6";
    readonly alabaster: "#f2ede5";
};
declare const clubFonts: {
    readonly display: "Kanit";
    readonly body: "DM Sans";
    readonly mono: "DM Mono";
};
/** A semantic theme: role → HSL channels (`H S% L%`), so the shadcn
 *  `hsl(var(--token))` mechanism (and `/opacity` modifiers) keep working. */
type SemanticTheme = Record<string, string>;
/**
 * DARK theme — navy-tinted surfaces (marianBlue), sky accent (uranianBlue),
 * gold (lion) for stat highlights and the signature. Used by `ueb-evolution`
 * (dark-only, gym use) and as the `.dark` variant everywhere else.
 */
declare const darkTheme: SemanticTheme;
/**
 * LIGHT theme — warm off-white surfaces (babyPowder/alabaster), navy primary
 * (marianBlue), a deeper azure accent that reads on light, gold darkened for
 * contrast. Default `:root` for `ueb-public` / `ueb-manager` / `ueb-drills`.
 *
 * PROVISIONAL: to be reconciled with `ueb-public`'s existing light palette when
 * the package is rolled out there (phase 4).
 */
declare const lightTheme: SemanticTheme;
/** Secondary text (`muted-foreground`) must reach this WCAG ratio on every
 *  surface it sits on — AAA, because the apps are read courtside, standing,
 *  sometimes outdoors. Checked by test/contrast.test.mjs. */
declare const MIN_SECONDARY_TEXT_CONTRAST = 7;
/** The surfaces secondary text is drawn on (theme keys). */
declare const SECONDARY_TEXT_SURFACES: readonly ["background", "card", "muted", "secondary"];
/**
 * Density tokens — they follow the POINTER TYPE, not the screen width: a wide
 * touch screen (iPad landscape, Android tablet) is still touch. `fine` is the
 * default and must stay identical to the pre-v0.4.0 desktop rendering
 * (`--target-min: 0px` makes `min-h-target` a no-op); `coarse` applies under
 * `@media (pointer: coarse)`.
 *
 * - target-min  minimum box of an interactive target (44 × 44 on touch)
 * - target-gap  gap between adjacent targets
 * - text-control / leading-control   label of buttons, selects, tabs, toggles
 * - text-table / leading-table       numbers in stat tables
 * - text-table-head / leading-table-head   stat table headers
 */
declare const densityTokens: {
    readonly fine: {
        readonly 'target-min': "0px";
        readonly 'target-gap': "0.25rem";
        readonly 'text-control': "0.875rem";
        readonly 'leading-control': "1.25rem";
        readonly 'text-table': "0.875rem";
        readonly 'leading-table': "1.25rem";
        readonly 'text-table-head': "0.75rem";
        readonly 'leading-table-head': "1rem";
    };
    readonly coarse: {
        readonly 'target-min': "2.75rem";
        readonly 'target-gap': "0.5rem";
        readonly 'text-control': "1rem";
        readonly 'leading-control': "1.5rem";
        readonly 'text-table': "0.9375rem";
        readonly 'leading-table': "1.375rem";
        readonly 'text-table-head': "0.8125rem";
        readonly 'leading-table-head': "1.125rem";
    };
};
/** Smallest text size allowed anywhere (`text-caption`). Replaces the
 *  9–11 px arbitrary sizes. */
declare const CAPTION_FONT_SIZE = "0.75rem";
type ClubBrand = typeof clubBrand;
type ClubFonts = typeof clubFonts;

export { CAPTION_FONT_SIZE, type ClubBrand, type ClubFonts, MIN_SECONDARY_TEXT_CONTRAST, SECONDARY_TEXT_SURFACES, type SemanticTheme, clubBrand, clubFonts, darkTheme, densityTokens, lightTheme };
