import { Config } from 'tailwindcss';

/**
 * Tailwind preset = the shared theme. A consuming app does:
 *
 *   import uebBrandPreset from '@ueb/brand/tailwind-preset';
 *   export default { presets: [uebBrandPreset], content: [...], ... };
 *
 * It provides the semantic colours (hsl(var(--token))), the `club.*` brand
 * utilities, fonts, radius, brand glows, AND emits the `:root` CSS variables
 * from `darkTheme` via an addBase plugin — so the variables and the Tailwind
 * colours can never drift apart.
 */
declare const uebBrandPreset: Partial<Config>;

export { uebBrandPreset as default };
