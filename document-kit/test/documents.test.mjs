import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseDocument, loadIdentity, loadPhotos, sha256 } from '../dist/renderer.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sample = JSON.parse(await fs.readFile(path.join(root, 'examples/documents/sponsoring-demo.json'), 'utf8'));
const clone = () => structuredClone(sample);
test('all three document recipes are explicit and versioned', async () => {
  for (const name of ['sponsoring-demo','presentation-club-demo','partenariat-demo']) {
    const input = JSON.parse(await fs.readFile(path.join(root, `examples/documents/${name}.json`), 'utf8'));
    assert.equal(parseDocument(input).identity.version, '1.0.0');
  }
});
test('an unknown identity version never falls back to active', async () => {
  await assert.rejects(loadIdentity(root, { id: 'ueb-public-2026', version: '9.0.0' }), /IDENTITY_VERSION_UNAVAILABLE/);
  await assert.rejects(loadIdentity(root, { id: 'ueb-apps-legacy', version: '0.4.0' }), /IDENTITY_NOT_DOCUMENT_COMPATIBLE/);
});
test('corrupted identity files are refused before composition', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ueb-identity-'));
  try {
    await fs.cp(path.join(root, 'identity'), path.join(dir, 'identity'), { recursive: true });
    await fs.appendFile(path.join(dir, 'identity/releases/ueb-public-2026/1.0.0/tokens.json'), '\n ');
    await assert.rejects(loadIdentity(dir, sample.identity), /IDENTITY_ASSET_INTEGRITY_FAILED/);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('the registry locks the exact manifest, including its asset catalogue', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ueb-manifest-'));
  try {
    await fs.cp(path.join(root, 'identity'), path.join(dir, 'identity'), { recursive: true });
    await fs.appendFile(path.join(dir, 'identity/releases/ueb-public-2026/1.0.0/manifest.json'), '\n ');
    await assert.rejects(loadIdentity(dir, sample.identity), /IDENTITY_MANIFEST_INTEGRITY_FAILED/);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('ready outputs require reviewed real inputs and no outstanding placeholders', () => {
  for (const patch of [{}, { demo: false }, { demo: false, reviewed: true }, { demo: false, reviewed: true, missing: [] }]) {
    assert.throws(() => parseDocument({ ...clone(), ...patch, status: 'ready' }), /DOCUMENT_REVIEW_REQUIRED|DOCUMENT_PLACEHOLDERS_REMAIN/);
  }
  const ready = { ...clone(), status: 'ready', demo: false, reviewed: true, missing: [] };
  ready.pages[5].paragraphs = ['Contact communiqué par le club.'];
  assert.equal(parseDocument(ready).status, 'ready');
});
test('unknown fields, future engines, wrong page recipes and impossible dates are refused', () => {
  for (const change of [d => { d.identity.version = 'latest'; }, d => { d.renderer.version = '99.0.0'; }, d => { d.pages[0].kind = 'story'; }, d => { d.createdAt = '2026-02-31T00:00:00Z'; }, d => { d.privateField = true; }]) {
    const input = clone(); change(input); assert.throws(() => parseDocument(input));
  }
});
test('photos are local, hash-locked, raster and contained in the input folder', async () => {
  for (const name of ['../package.json','/etc/passwd','https://example.com/photo.jpg']) {
    const input = clone(); input.pages[1].photo.file = name;
    await assert.rejects(loadPhotos(input, path.join(root, 'examples/documents')), /ASSET_PATH_INVALID/);
  }
  const input = clone(); input.pages[1].photo.sha256 = '0'.repeat(64);
  await assert.rejects(loadPhotos(input, path.join(root, 'examples/documents')), /PHOTO_INTEGRITY_FAILED/);
});
test('a standalone delivery runs without node_modules and records the original input hash', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ueb-document-standalone-'));
  try {
    for (const name of ['identity','examples/documents']) await fs.cp(path.join(root, name), path.join(dir, name), { recursive: true });
    for (const name of ['dist','scripts/render.mjs','package-lock.json']) await fs.cp(path.join(root, 'document-kit', name), path.join(dir, 'document-kit', name), { recursive: true });
    const output = path.join(dir, 'result.pdf');
    execFileSync(process.execPath, [path.join(dir, 'document-kit/scripts/render.mjs'), '--input', path.join(dir, 'examples/documents/sponsoring-demo.json'), '--output', output], { cwd: dir });
    assert.equal((await fs.readFile(output)).subarray(0, 5).toString(), '%PDF-');
    const provenance = JSON.parse(await fs.readFile(path.join(dir, 'result.provenance.json'), 'utf8'));
    assert.equal(provenance.identity.version, '1.0.0');
    assert.equal(provenance.inputSha256, sha256(await fs.readFile(path.join(dir, 'examples/documents/sponsoring-demo.json'))));
    assert.equal(provenance.pdfSha256, sha256(await fs.readFile(output)));
    const portablePath = path.join(dir, 'result.source.json');
    const portable = JSON.parse(await fs.readFile(portablePath, 'utf8'));
    assert.equal(provenance.portableSourceSha256, sha256(await fs.readFile(portablePath)));
    assert.ok((await loadPhotos(portable, dir)).photos[1].data.length);
    execFileSync(process.execPath, [path.join(dir, 'document-kit/scripts/render.mjs'), '--input', portablePath, '--output', path.join(dir, 'reopened.pdf')], { cwd: dir });
    assert.throws(() => execFileSync(process.execPath, [path.join(dir, 'document-kit/scripts/render.mjs'), '--input', portablePath, '--output', output], { cwd: dir, stdio: 'pipe' }));
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
