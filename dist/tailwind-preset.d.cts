import { Config } from 'tailwindcss';

/** `(pointer: coarse)` = the PRIMARY pointer is a finger. Width-independent on
 *  purpose: a wide touch screen is still touch. */
declare const COARSE_POINTER = "@media (pointer: coarse)";
declare const FINE_POINTER = "@media (pointer: fine)";
/** Interactive elements that get the touch floor on a coarse pointer. */
declare const TOUCH_TARGETS: string;
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
 * drift apart. Since v0.4.0 it also emits the density tokens (target size,
 * target gap, control/table text) that switch on the POINTER TYPE, plus the
 * `coarse:` / `fine:` variants. The addBase layer also carries shared base resets (stable
 * scrollbar gutter, reduced-motion, focus-visible ring, thin scrollbar) — the
 * "design system" base layer every consumer inherits.
 *
 * Consumers must set `--radius` in their own `:root` (app-level layout choice),
 * load the fonts (Kanit + DM Sans + DM Mono), and choose their mode: a
 * light-default app does nothing; a dark-only app (evolution) sets
 * `<html class="dark">`.
 */
declare const uebBrandPreset: Partial<Config>;

export { COARSE_POINTER, FINE_POINTER, TOUCH_TARGETS, uebBrandPreset as default };
