// Negative controls for the CI commands themselves: the type-check and the
// test runner must go red on a planted fault, or a green CI proves nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// NODE_TEST_CONTEXT makes a nested `node --test` report to its parent runner and
// exit 0: without this purge the planted failure below would pass silently.
const { NODE_TEST_CONTEXT, ...env } = process.env;
const run = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, env, encoding: 'utf8' });
const root = resolve(import.meta.dirname, '..');

test('negative control: the type-check refuses a planted type error', () => {
  const dir = mkdtempSync(join(tmpdir(), 'brand-ci-'));
  writeFileSync(join(dir, 'planted.ts'), 'export const n: number = "not a number";\n');
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { noEmit: true, strict: false, types: [] }, include: ['planted.ts'] }),
  );
  const planted = run(join(root, 'node_modules/.bin/tsc'), ['--noEmit', '-p', dir], root);
  assert.notEqual(planted.status, 0, 'tsc accepted a planted type error');
  assert.match(planted.stdout, /TS2322/);
  // and the same command accepts the real sources
  assert.equal(run(join(root, 'node_modules/.bin/tsc'), ['--noEmit'], root).status, 0);
});

test('negative control: the test runner refuses a planted failing test', () => {
  const dir = mkdtempSync(join(tmpdir(), 'brand-ci-'));
  const file = join(dir, 'planted.test.mjs');
  writeFileSync(file, "import {test} from 'node:test'; test('x', () => { throw new Error('planted'); });\n");
  const planted = run(process.execPath, ['--test', file], root);
  assert.notEqual(planted.status, 0, 'node --test accepted a planted failing test');
  assert.match(planted.stdout, /planted/);
});
