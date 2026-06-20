var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  clubBrand: () => clubBrand,
  clubFonts: () => clubFonts,
  darkTheme: () => darkTheme,
  lightTheme: () => lightTheme
});
module.exports = __toCommonJS(src_exports);

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
  "muted-foreground": "215 18% 64%",
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
  "muted-foreground": "250 10% 42%",
  // ultraViolet-ish, readable on light
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clubBrand,
  clubFonts,
  darkTheme,
  lightTheme
});
