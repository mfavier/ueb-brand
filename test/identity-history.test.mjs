import test from 'node:test';
import assert from 'node:assert/strict';
import { changedPublishedFiles, changedRecipes, assertVersionBump } from '../scripts/guard-identity.mjs';
test('frozen identity releases reject edits, deletions and new files in an old version', () => {
  const old = ['identity/releases/ueb-public-2026/1.0.0/tokens.json'];
  for (const status of ['M','D','A']) assert.equal(changedPublishedFiles(old, [{ status, name: 'identity/releases/ueb-public-2026/1.0.0/RULES.md' }]).length, 1);
  assert.equal(changedPublishedFiles(old, [{ status: 'A', name: 'identity/releases/ueb-public-2026/2.0.0/tokens.json' }]).length, 0);
});
test('a published recipe cannot change under the same version', () => {
  const before = [{ id: 'sponsorship-dossier', version: '1.0.0', pageKinds: ['cover'] }];
  assert.equal(changedRecipes(before, [{ ...before[0], pageKinds: ['story'] }]).length, 1);
  assert.equal(changedRecipes(before, [...before, { ...before[0], version: '2.0.0', pageKinds: ['story'] }]).length, 0);
});
test('changing an engine or plugin requires an explicit version bump', () => {
  assert.throws(() => assertVersionBump('0.1.0','0.1.0',true,'RENDERER'), /VERSION_BUMP_REQUIRED/);
  assert.doesNotThrow(() => assertVersionBump('0.1.0','0.1.1',true,'RENDERER'));
  assert.doesNotThrow(() => assertVersionBump('0.1.0','0.1.0',false,'PLUGIN'));
});
