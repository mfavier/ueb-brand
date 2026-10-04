// Negative control for scripts/tag-guard.mjs: it must refuse what it is for.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tagProblems } from '../scripts/tag-guard.mjs';

test('a tag matching package.json, on main, is accepted', () => {
  assert.deepEqual(tagProblems({ tag: 'v0.4.0', pkgVersion: '0.4.0', onMain: true }), []);
});
test('negative control: version mismatch is refused', () => {
  assert.equal(tagProblems({ tag: 'v0.5.0', pkgVersion: '0.4.0', onMain: true }).length, 1);
});
test('negative control: a tag off main is refused', () => {
  assert.equal(tagProblems({ tag: 'v0.4.0', pkgVersion: '0.4.0', onMain: false }).length, 1);
});
test('negative control: a malformed tag is refused', () => {
  assert.ok(tagProblems({ tag: 'v0.4', pkgVersion: '0.4.0', onMain: true }).length > 0);
});
