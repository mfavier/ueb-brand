import {
  clubBrand,
  clubFonts,
  darkTheme
} from "./chunk-DF6HM2RN.js";

// src/tailwind-preset.ts
import plugin from "tailwindcss/plugin";
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
      }
    }
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": Object.fromEntries(
          Object.entries(darkTheme).map(([k, v]) => [`--${k}`, v])
        )
      });
    })
  ]
};
var tailwind_preset_default = uebBrandPreset;
export {
  tailwind_preset_default as default
};
