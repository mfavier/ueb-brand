// The density contract of the preset, checked on generated CSS:
// - pointer: fine keeps the desktop rendering (--target-min: 0px);
// - pointer: coarse raises targets to 44 px and the control/table text;
// - `min-h-target` and `coarse:` / `fine:` compile.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
// The CJS build: Tailwind v3 loads configs through jiti/require, and
// `tailwindcss/plugin` has no ESM export path.
const preset = require('../dist/tailwind-preset.cjs').default;

const build = async (classes) => {
  const config = { presets: [preset], content: [{ raw: classes.join(' ') }] };
  const result = await postcss([tailwindcss(config)]).process('@tailwind base;\n@tailwind utilities;', {
    from: undefined,
  });
  return result.css;
};

const block = (css, selectorRe) => {
  const m = css.match(selectorRe);
  return m ? m[0] : '';
};

test('fine pointer (default :root) keeps the desktop values', async () => {
  const css = await build(['min-h-target']);
  const root = block(css, /:root\s*\{[^}]*--target-min[^}]*\}/);
  assert.match(root, /--target-min:\s*0px/);
  assert.match(root, /--text-control:\s*0\.875rem/);
  assert.match(root, /--text-table:\s*0\.875rem/);
});

test('coarse pointer raises targets to 44 px', async () => {
  const css = await build(['min-h-target']);
  const coarse = block(css, /@media \(pointer: coarse\)\s*\{\s*:root\s*\{[^}]*\}/);
  assert.match(coarse, /--target-min:\s*2\.75rem/);
  assert.match(coarse, /--target-gap:\s*0\.5rem/);
  assert.match(coarse, /--text-control:\s*1rem/);
});

test('density utilities and pointer variants compile', async () => {
  const css = await build(['min-h-target', 'min-w-target', 'gap-target', 'text-table', 'text-caption', 'coarse:h-12', 'fine:h-8']);
  assert.match(css, /\.min-h-target\s*\{\s*min-height:\s*var\(--target-min\)/);
  assert.match(css, /\.min-w-target\s*\{\s*min-width:\s*var\(--target-min\)/);
  assert.match(css, /\.gap-target\s*\{\s*gap:\s*var\(--target-gap\)/);
  assert.match(css, /\.text-table\s*\{\s*font-size:\s*var\(--text-table\);\s*line-height:\s*var\(--leading-table\)/);
  assert.match(css, /\.text-caption\s*\{\s*font-size:\s*0\.75rem/);
  assert.match(css, /@media \(pointer: coarse\)\s*\{\s*\.coarse\\:h-12/);
  assert.match(css, /@media \(pointer: fine\)\s*\{\s*\.fine\\:h-8/);
});

test('coarse pointer puts the floor on every interactive element, with an opt-out', async () => {
  const css = await build(['min-h-target']);
  const coarse = css.slice(css.indexOf('@media (pointer: coarse)'));
  assert.match(coarse, /:where\(button,[^{]*a\[href\]\):not\([^{]*\[data-touch-exempt\]\)\s*\{\s*min-height:\s*var\(--target-min\);\s*min-width:\s*var\(--target-min\);\s*touch-action:\s*manipulation/);
  // Near miss: nothing of the sort outside the coarse media query.
  const fine = css.slice(0, css.indexOf('@media (pointer: coarse)'));
  assert.doesNotMatch(fine, /touch-action/);
});
