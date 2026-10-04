// Secondary-text contrast guard. Runs on the BUILT package (npm test builds
// first), i.e. on exactly what consumers install.
//
// Negative control: the pre-v0.4.0 values must be refused by the same check
// (a guard exists only if it has been seen failing).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  darkTheme,
  lightTheme,
  MIN_SECONDARY_TEXT_CONTRAST,
  SECONDARY_TEXT_SURFACES,
} from '../dist/index.js';

const hslToRgb = (hsl) => {
  const [h, s, l] = hsl.replace(/%/g, '').split(/\s+/).map(Number);
  const sat = s / 100;
  const lig = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};

const luminance = (rgb) => {
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg, bg) => {
  const a = luminance(hslToRgb(fg));
  const b = luminance(hslToRgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** Returns what it refuses: the surfaces where `fg` is under the floor. */
const secondaryTextFailures = (theme, fg = theme['muted-foreground']) =>
  SECONDARY_TEXT_SURFACES.map((surface) => ({ surface, ratio: contrast(fg, theme[surface]) })).filter(
    ({ ratio }) => ratio < MIN_SECONDARY_TEXT_CONTRAST,
  );

test('contrast formula matches known WCAG anchors', () => {
  assert.equal(contrast('0 0% 0%', '0 0% 100%').toFixed(1), '21.0');
  assert.equal(contrast('0 0% 50%', '0 0% 50%'), 1);
});

for (const [name, theme] of [
  ['dark', darkTheme],
  ['light', lightTheme],
]) {
  test(`${name}: muted-foreground ≥ ${MIN_SECONDARY_TEXT_CONTRAST}:1 on every secondary-text surface`, () => {
    assert.ok(SECONDARY_TEXT_SURFACES.every((s) => typeof theme[s] === 'string'), 'surface missing from theme');
    assert.deepEqual(secondaryTextFailures(theme), []);
  });
}

test('negative control: the pre-v0.4.0 values are refused', () => {
  assert.ok(secondaryTextFailures(darkTheme, '215 18% 64%').length > 0, 'old dark value should fail');
  assert.ok(secondaryTextFailures(lightTheme, '250 10% 42%').length > 0, 'old light value should fail');
});
