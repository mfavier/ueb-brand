/**
 * Club design tokens — SINGLE SOURCE OF TRUTH for the whole ecosystem.
 *
 * Everything brand-related (colours, fonts, the dark semantic theme) is defined
 * here and nowhere else. The Tailwind preset (./tailwind-preset) consumes this
 * to generate both the `club.*` utility colours AND the `:root` CSS variables,
 * so changing a value here re-skins every consuming app.
 *
 * Re-skinning for another club = edit `clubBrand` (and, if a hue needs it, the
 * role mappings in `darkTheme`), bump the package version, bump the dependency
 * in each app. See ueb-documentation/docs/adr/0001-brand-identity-shared-package.md.
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
/**
 * Dark semantic theme: role → HSL channels (`H S% L%`), so the shadcn
 * `hsl(var(--token))` mechanism (and `/opacity` modifiers) keep working.
 * Surfaces are navy-tinted (marianBlue), the interactive accent is uranianBlue,
 * and gold (lion) is reserved for stat highlights and the signature.
 *
 * Apps that need a light theme (public / manager / drills) will add a
 * `lightTheme` here when the package is rolled out to them.
 */
declare const darkTheme: Record<string, string>;
type ClubBrand = typeof clubBrand;
type ClubFonts = typeof clubFonts;

export { type ClubBrand, type ClubFonts, clubBrand, clubFonts, darkTheme };
