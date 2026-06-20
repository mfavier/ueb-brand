import { Config } from 'tailwindcss';

/**
 * Tailwind preset = the shared theme. A consuming app does:
 *
 *   import uebBrandPreset from '@ueb/brand/tailwind-preset';
 *   export default { presets: [uebBrandPreset], content: [...], ... };
 *
 * It provides the semantic colours (hsl(var(--token))), the `club.*` brand
 * utilities, fonts, the radius scale, brand glows, common keyframes/animations,
 * AND emits the CSS variables via an addBase plugin — `:root` = light theme,
 * `.dark` = dark theme — so the variables and the Tailwind colours can never
 * drift apart. The addBase layer also carries shared base resets (stable
 * scrollbar gutter, reduced-motion, focus-visible ring, thin scrollbar) — the
 * "design system" base layer every consumer inherits.
 *
 * Consumers must set `--radius` in their own `:root` (app-level layout choice),
 * load the fonts (Kanit + DM Sans + DM Mono), and choose their mode: a
 * light-default app does nothing; a dark-only app (evolution) sets
 * `<html class="dark">`.
 */
declare const uebBrandPreset: Partial<Config>;

export { uebBrandPreset as default };
