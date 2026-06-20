import {
  clubBrand,
  clubFonts,
  darkTheme,
  lightTheme
} from "./chunk-2NSPXCU6.js";

// src/tailwind-preset.ts
import plugin from "tailwindcss/plugin";
var toCssVars = (theme) => Object.fromEntries(Object.entries(theme).map(([k, v]) => [`--${k}`, v]));
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
    plugin(({ addBase }) => {
      addBase({
        ":root": toCssVars(lightTheme),
        ".dark": toCssVars(darkTheme),
        // --- Base layer (shared by every consumer) ---
        // Stable scrollbar gutter on the scroll container, so page-to-page
        // height changes never shift centered layout. One rule, on <html> only.
        html: { scrollbarGutter: "stable" },
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
export {
  tailwind_preset_default as default
};
