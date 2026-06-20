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
type ClubBrand = typeof clubBrand;
type ClubFonts = typeof clubFonts;

export { type ClubBrand, type ClubFonts, type SemanticTheme, clubBrand, clubFonts, darkTheme, lightTheme };
