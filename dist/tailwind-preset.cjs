var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/tailwind-preset.ts
var tailwind_preset_exports = {};
__export(tailwind_preset_exports, {
  COARSE_POINTER: () => COARSE_POINTER,
  FINE_POINTER: () => FINE_POINTER,
  TOUCH_TARGETS: () => TOUCH_TARGETS,
  default: () => tailwind_preset_default
});
module.exports = __toCommonJS(tailwind_preset_exports);
var import_plugin = __toESM(require("tailwindcss/plugin"), 1);

// src/tokens.ts
var clubBrand = {
  marianBlue: "#39458E",
  // primary navy — crest right half / wordmark
  uranianBlue: "#A7CDE4",
  // light sky blue — crest left half (accent)
  lion: "#CBA165",
  // gold — crest border / stars / excellence
  ultraViolet: "#5b5574",
  // muted purple — secondary
  babyPowder: "#fcfaf6",
  // near-white / warm light surface
  alabaster: "#f2ede5"
  // warm off-white — light section surface
};
var clubFonts = {
  display: "Kanit",
  // headings + names (the club display face)
  body: "DM Sans",
  // UI / body copy
  mono: "DM Mono"
  // all numbers / stats
};
var darkTheme = {
  background: "232 33% 8%",
  foreground: "210 33% 92%",
  card: "232 26% 12%",
  "card-foreground": "210 33% 92%",
  popover: "232 26% 12%",
  "popover-foreground": "210 33% 92%",
  primary: "232 43% 39%",
  // marianBlue (#39458E)
  "primary-foreground": "210 33% 95%",
  secondary: "232 20% 18%",
  "secondary-foreground": "210 33% 92%",
  muted: "232 18% 16%",
  // ≥ 7:1 on background, card, muted and secondary (outdoor / courtside reading,
  // see MIN_SECONDARY_TEXT_CONTRAST). Was 64% (6.62:1 on card).
  "muted-foreground": "215 18% 72%",
  accent: "205 58% 72%",
  // uranianBlue, densified for UI use
  "accent-foreground": "232 45% 14%",
  destructive: "0 65% 50%",
  "destructive-foreground": "210 33% 95%",
  border: "232 18% 24%",
  input: "232 18% 24%",
  ring: "205 58% 72%",
  "stat-highlight": "35 50% 60%",
  // lion gold (#CBA165)
  gold: "35 50% 60%",
  "sidebar-background": "232 26% 12%",
  "sidebar-foreground": "210 33% 92%",
  "sidebar-primary": "205 58% 72%",
  "sidebar-primary-foreground": "232 45% 14%",
  "sidebar-accent": "232 20% 18%",
  "sidebar-accent-foreground": "210 33% 92%",
  "sidebar-border": "232 18% 24%",
  "sidebar-ring": "205 58% 72%"
};
var lightTheme = {
  background: "40 38% 98%",
  // babyPowder
  foreground: "232 30% 18%",
  card: "0 0% 100%",
  "card-foreground": "232 30% 18%",
  popover: "0 0% 100%",
  "popover-foreground": "232 30% 18%",
  primary: "232 43% 39%",
  // marianBlue
  "primary-foreground": "40 38% 98%",
  secondary: "38 30% 92%",
  // alabaster
  "secondary-foreground": "232 30% 22%",
  muted: "38 28% 93%",
  // ultraViolet-ish; ≥ 7:1 on background, card, muted and secondary
  // (MIN_SECONDARY_TEXT_CONTRAST). Was 42% (5.80:1 on background).
  "muted-foreground": "250 10% 33%",
  accent: "205 65% 48%",
  // deeper azure — pops on light surfaces
  "accent-foreground": "0 0% 100%",
  destructive: "0 72% 48%",
  "destructive-foreground": "0 0% 100%",
  border: "38 22% 86%",
  input: "38 22% 86%",
  ring: "205 65% 48%",
  "stat-highlight": "35 55% 40%",
  // lion gold, darkened for contrast on light
  gold: "35 55% 40%",
  "sidebar-background": "38 33% 96%",
  "sidebar-foreground": "232 30% 18%",
  "sidebar-primary": "232 43% 39%",
  "sidebar-primary-foreground": "40 38% 98%",
  "sidebar-accent": "38 30% 92%",
  "sidebar-accent-foreground": "232 30% 22%",
  "sidebar-border": "38 22% 86%",
  "sidebar-ring": "205 65% 48%"
};
var densityTokens = {
  fine: {
    "target-min": "0px",
    "target-gap": "0.25rem",
    "text-control": "0.875rem",
    "leading-control": "1.25rem",
    "text-table": "0.875rem",
    "leading-table": "1.25rem",
    "text-table-head": "0.75rem",
    "leading-table-head": "1rem"
  },
  coarse: {
    "target-min": "2.75rem",
    "target-gap": "0.5rem",
    "text-control": "1rem",
    "leading-control": "1.5rem",
    "text-table": "0.9375rem",
    "leading-table": "1.375rem",
    "text-table-head": "0.8125rem",
    "leading-table-head": "1.125rem"
  }
};
var CAPTION_FONT_SIZE = "0.75rem";

// src/tailwind-preset.ts
var toCssVars = (theme) => Object.fromEntries(Object.entries(theme).map(([k, v]) => [`--${k}`, v]));
var COARSE_POINTER = "@media (pointer: coarse)";
var FINE_POINTER = "@media (pointer: fine)";
var TOUCH_TARGETS = ':where(button, [role="button"], [role="tab"], [role="option"], [role="menuitem"], summary, select, input:not([type="hidden"], [type="checkbox"], [type="radio"]), a[href]):not([role="checkbox"], [role="switch"], [role="radio"], [data-touch-exempt])';
var uebBrandPreset = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: "hsl(var(--gold))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        },
        club: { ...clubBrand }
      },
      fontFamily: {
        kanit: [clubFonts.display, "sans-serif"],
        dm: [clubFonts.body, "system-ui", "sans-serif"],
        mono: [clubFonts.mono, "monospace"]
      },
      // Density tokens (v0.4.0): one class, two densities. The variables hold
      // the desktop value by default and the touch value under
      // (pointer: coarse) — see densityTokens. `min-h-target` survives a
      // caller's `h-8` (min-height wins over height), which is what makes the
      // 44 px floor systemic instead of per-component.
      minHeight: { target: "var(--target-min)" },
      minWidth: { target: "var(--target-min)" },
      gap: { target: "var(--target-gap)" },
      fontSize: {
        control: ["var(--text-control)", { lineHeight: "var(--leading-control)" }],
        table: ["var(--text-table)", { lineHeight: "var(--leading-table)" }],
        "table-head": ["var(--text-table-head)", { lineHeight: "var(--leading-table-head)" }],
        caption: [CAPTION_FONT_SIZE, { lineHeight: "1rem" }]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        "glow-sky": `0 0 20px ${clubBrand.uranianBlue}59`,
        "glow-gold": `0 0 20px ${clubBrand.lion}59`,
        // Legacy aliases (older components reference these names).
        "glow-cyan": `0 0 20px ${clubBrand.uranianBlue}59`,
        "glow-amber": `0 0 20px ${clubBrand.lion}59`
      },
      // Common keyframes/animations shared across apps. Page-entrance fades
      // (fade-in/fade-up) are intentionally NOT auto-applied to any container
      // here — apps opt in per element; the club convention is no per-route
      // entrance animation. accordion-* back shadcn's Accordion; slide-in-*
      // the mobile drawer; pulse-subtle skeleton/loading accents.
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slide-in-right": { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        "slide-in-left": { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
        "pulse-subtle": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.8" } }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite"
      }
    }
  },
  plugins: [
    (0, import_plugin.default)(({ addBase, addVariant }) => {
      addVariant("coarse", COARSE_POINTER);
      addVariant("fine", FINE_POINTER);
      addBase({
        ":root": { ...toCssVars(lightTheme), ...toCssVars(densityTokens.fine) },
        ".dark": toCssVars(darkTheme),
        [COARSE_POINTER]: {
          ":root": toCssVars(densityTokens.coarse),
          // Touch floor for EVERY interactive element, hand-made ones included
          // (a raw <button className="text-xs">), so the 44 px rule does not
          // depend on each component remembering it. :where() keeps it at
          // specificity 0 — an explicit utility still wins. Inline text links
          // are unaffected (min-* does not apply to display:inline), which is
          // the WCAG 2.5.8 inline exception. Checkbox / radio / switch keep
          // their visual size: their label row carries the target. Opt-out for
          // a deliberate exception: data-touch-exempt="<reason-key>".
          [TOUCH_TARGETS]: {
            minHeight: "var(--target-min)",
            minWidth: "var(--target-min)",
            // No double-tap-zoom delay on targets.
            touchAction: "manipulation"
          }
        },
        // --- Base layer (shared by every consumer) ---
        // Stable viewport width, so page-to-page height changes never shift
        // centered layout (e.g. the navbar). overflow-y:scroll forces a
        // permanent scrollbar track on <html>: the content width is constant
        // whether or not a page scrolls. We do NOT use scrollbar-gutter here —
        // on a default `overflow: visible` <html> the viewport's gutter is
        // propagated from <body>, so a rule on <html> is silently ignored;
        // making <html> a real scroll container (non-visible overflow) avoids
        // that propagation entirely. overflow-x:clip absorbs stray horizontal
        // overflow without breaking the sticky navbar (legitimately wide
        // content keeps its own overflow-x-auto wrapper).
        html: { overflowY: "scroll", overflowX: "clip" },
        // Respect reduced-motion globally: neutralize entrance / looping /
        // long-transition animations site-wide.
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
            scrollBehavior: "auto !important"
          }
        },
        // Visible keyboard focus on every interactive element, including custom
        // ones (card links, table rows). :where() keeps specificity at 0 so
        // component-level focus styles still win.
        ':where(a, button, [role="button"], input, select, textarea, summary, [tabindex]):focus-visible': {
          outline: "2px solid hsl(var(--ring))",
          outlineOffset: "2px"
        },
        // Thin brand scrollbar (webkit).
        "::-webkit-scrollbar": { width: "6px", height: "6px" },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { background: "hsl(var(--border))", borderRadius: "3px" },
        "::-webkit-scrollbar-thumb:hover": { background: "hsl(var(--muted-foreground) / 0.5)" }
      });
    })
  ]
};
var tailwind_preset_default = uebBrandPreset;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COARSE_POINTER,
  FINE_POINTER,
  TOUCH_TARGETS
});
