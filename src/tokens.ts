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
export const clubBrand = {
  marianBlue: '#39458E', // primary navy — crest right half / wordmark
  uranianBlue: '#A7CDE4', // light sky blue — crest left half (accent)
  lion: '#CBA165', // gold — crest border / stars / excellence
  ultraViolet: '#5b5574', // muted purple — secondary
  babyPowder: '#fcfaf6', // near-white / warm light surface
  alabaster: '#f2ede5', // warm off-white — light section surface
} as const;

export const clubFonts = {
  display: 'Kanit', // headings + names (the club display face)
  body: 'DM Sans', // UI / body copy
  mono: 'DM Mono', // all numbers / stats
} as const;

/** A semantic theme: role → HSL channels (`H S% L%`), so the shadcn
 *  `hsl(var(--token))` mechanism (and `/opacity` modifiers) keep working. */
export type SemanticTheme = Record<string, string>;

/**
 * DARK theme — navy-tinted surfaces (marianBlue), sky accent (uranianBlue),
 * gold (lion) for stat highlights and the signature. Used by `ueb-evolution`
 * (dark-only, gym use) and as the `.dark` variant everywhere else.
 */
export const darkTheme: SemanticTheme = {
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
};

/**
 * LIGHT theme — warm off-white surfaces (babyPowder/alabaster), navy primary
 * (marianBlue), a deeper azure accent that reads on light, gold darkened for
 * contrast. Default `:root` for `ueb-public` / `ueb-manager` / `ueb-drills`.
 *
 * PROVISIONAL: to be reconciled with `ueb-public`'s existing light palette when
 * the package is rolled out there (phase 4).
 */
export const lightTheme: SemanticTheme = {
  background: '40 38% 98%', // babyPowder
  foreground: '232 30% 18%',

  card: '0 0% 100%',
  'card-foreground': '232 30% 18%',
  popover: '0 0% 100%',
  'popover-foreground': '232 30% 18%',

  primary: '232 43% 39%', // marianBlue
  'primary-foreground': '40 38% 98%',

  secondary: '38 30% 92%', // alabaster
  'secondary-foreground': '232 30% 22%',

  muted: '38 28% 93%',
  'muted-foreground': '250 10% 42%', // ultraViolet-ish, readable on light

  accent: '205 65% 48%', // deeper azure — pops on light surfaces
  'accent-foreground': '0 0% 100%',

  destructive: '0 72% 48%',
  'destructive-foreground': '0 0% 100%',

  border: '38 22% 86%',
  input: '38 22% 86%',
  ring: '205 65% 48%',

  'stat-highlight': '35 55% 40%', // lion gold, darkened for contrast on light
  gold: '35 55% 40%',

  'sidebar-background': '38 33% 96%',
  'sidebar-foreground': '232 30% 18%',
  'sidebar-primary': '232 43% 39%',
  'sidebar-primary-foreground': '40 38% 98%',
  'sidebar-accent': '38 30% 92%',
  'sidebar-accent-foreground': '232 30% 22%',
  'sidebar-border': '38 22% 86%',
  'sidebar-ring': '205 65% 48%',
};

export type ClubBrand = typeof clubBrand;
export type ClubFonts = typeof clubFonts;
