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
export const clubBrand = {
  marianBlue: '#39458E', // primary navy — crest right half / wordmark
  uranianBlue: '#A7CDE4', // light sky blue — crest left half (accent)
  lion: '#CBA165', // gold — crest border / stars / excellence
  ultraViolet: '#5b5574', // muted purple — secondary (not in crest; documented)
  babyPowder: '#fcfaf6', // near-white (light-theme surface, used by other repos)
  alabaster: '#f2ede5', // warm off-white (light-theme surface)
} as const;

export const clubFonts = {
  display: 'Kanit', // headings + names (the club display face)
  body: 'DM Sans', // UI / body copy
  mono: 'DM Mono', // all numbers / stats
} as const;

/**
 * Dark semantic theme: role → HSL channels (`H S% L%`), so the shadcn
 * `hsl(var(--token))` mechanism (and `/opacity` modifiers) keep working.
 * Surfaces are navy-tinted (marianBlue), the interactive accent is uranianBlue,
 * and gold (lion) is reserved for stat highlights and the signature.
 *
 * Apps that need a light theme (public / manager / drills) will add a
 * `lightTheme` here when the package is rolled out to them.
 */
export const darkTheme: Record<string, string> = {
  background: '232 33% 8%',
  foreground: '210 33% 92%',

  card: '232 26% 12%',
  'card-foreground': '210 33% 92%',
  popover: '232 26% 12%',
  'popover-foreground': '210 33% 92%',

  primary: '232 43% 39%', // marianBlue (#39458E)
  'primary-foreground': '210 33% 95%',

  secondary: '232 20% 18%',
  'secondary-foreground': '210 33% 92%',

  muted: '232 18% 16%',
  'muted-foreground': '215 18% 64%',

  accent: '205 58% 72%', // uranianBlue, densified for UI use
  'accent-foreground': '232 45% 14%',

  destructive: '0 65% 50%',
  'destructive-foreground': '210 33% 95%',

  border: '232 18% 24%',
  input: '232 18% 24%',
  ring: '205 58% 72%',

  'stat-highlight': '35 50% 60%', // lion gold (#CBA165)
  gold: '35 50% 60%',

  'sidebar-background': '232 26% 12%',
  'sidebar-foreground': '210 33% 92%',
  'sidebar-primary': '205 58% 72%',
  'sidebar-primary-foreground': '232 45% 14%',
  'sidebar-accent': '232 20% 18%',
  'sidebar-accent-foreground': '210 33% 92%',
  'sidebar-border': '232 18% 24%',
  'sidebar-ring': '205 58% 72%',

  radius: '0.75rem',
};

export type ClubBrand = typeof clubBrand;
export type ClubFonts = typeof clubFonts;
