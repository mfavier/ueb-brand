import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { clubBrand, clubFonts, lightTheme, darkTheme, type SemanticTheme } from './tokens';

const toCssVars = (theme: SemanticTheme): Record<string, string> =>
  Object.fromEntries(Object.entries(theme).map(([k, v]) => [`--${k}`, v]));

/**
 * Tailwind preset = the shared theme. A consuming app does:
 *
 *   import uebBrandPreset from '@ueb/brand/tailwind-preset';
 *   export default { presets: [uebBrandPreset], content: [...], ... };
 *
 * It provides the semantic colours (hsl(var(--token))), the `club.*` brand
 * utilities, fonts, the radius scale, brand glows, AND emits the CSS variables
 * via an addBase plugin — `:root` = light theme, `.dark` = dark theme — so the
 * variables and the Tailwind colours can never drift apart.
 *
 * Consumers must set `--radius` in their own `:root` (app-level layout choice),
 * load the fonts (Kanit + DM Sans + DM Mono), and choose their mode: a
 * light-default app does nothing; a dark-only app (evolution) sets
 * `<html class="dark">`.
 */
const uebBrandPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        gold: 'hsl(var(--gold))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        club: { ...clubBrand },
      },
      fontFamily: {
        kanit: [clubFonts.display, 'sans-serif'],
        dm: [clubFonts.body, 'system-ui', 'sans-serif'],
        mono: [clubFonts.mono, 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-sky': `0 0 20px ${clubBrand.uranianBlue}59`,
        'glow-gold': `0 0 20px ${clubBrand.lion}59`,
        // Legacy aliases (older components reference these names).
        'glow-cyan': `0 0 20px ${clubBrand.uranianBlue}59`,
        'glow-amber': `0 0 20px ${clubBrand.lion}59`,
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': toCssVars(lightTheme),
        '.dark': toCssVars(darkTheme),
      });
    }),
  ],
};

export default uebBrandPreset;
