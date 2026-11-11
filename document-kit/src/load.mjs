import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export async function containedFile(root, name) {
  if (typeof name !== 'string' || !name || name.includes('\\') || path.isAbsolute(name) || name.split('/').includes('..') || /^[a-z]+:/i.test(name)) throw new Error('ASSET_PATH_INVALID');
  const base = await fs.realpath(root), file = await fs.realpath(path.resolve(base, name));
  if (!file.startsWith(base + path.sep)) throw new Error('ASSET_OUTSIDE_ROOT');
  if (!(await fs.stat(file)).isFile()) throw new Error('ASSET_NOT_FILE');
  return file;
}
export async function loadIdentity(root, reference) {
  const identityRoot = path.join(root, 'identity');
  const registry = JSON.parse(await fs.readFile(path.join(identityRoot, 'registry.json'), 'utf8'));
  const entry = registry.identities.find(row => row.id === reference.id && row.version === reference.version);
  if (!entry) throw new Error('IDENTITY_VERSION_UNAVAILABLE');
  const manifestPath = await containedFile(identityRoot, entry.manifest);
  const bytes = await fs.readFile(manifestPath);
  if (sha256(bytes) !== entry.manifestSha256) throw new Error('IDENTITY_MANIFEST_INTEGRITY_FAILED');
  const manifest = JSON.parse(bytes);
  if (manifest.id !== reference.id || manifest.version !== reference.version || manifest.kind !== 'communication') throw new Error('IDENTITY_NOT_DOCUMENT_COMPATIBLE');
  const releaseRoot = path.dirname(manifestPath);
  const verified = {};
  for (const [name, expected] of Object.entries(manifest.files)) {
    const file = await containedFile(releaseRoot, name), data = await fs.readFile(file);
    if (sha256(data) !== expected) throw new Error(`IDENTITY_ASSET_INTEGRITY_FAILED: ${name}`);
    verified[name] = file;
  }
  if (!verified[manifest.tokens] || Object.values(manifest.assets).some(name => !verified[name])) throw new Error('IDENTITY_ASSET_NOT_LOCKED');
  const tokens = JSON.parse(await fs.readFile(verified[manifest.tokens], 'utf8'));
  return { manifest, tokens, assets: Object.fromEntries(Object.entries(manifest.assets).map(([key, name]) => [key, verified[name]])), manifestSha256: sha256(bytes) };
}
export async function loadPhotos(document, inputRoot) {
  const photos = {}, hashes = {};
  for (const [index, page] of document.pages.entries()) if (page.photo) {
    const file = await containedFile(inputRoot, page.photo.file), data = await fs.readFile(file);
    if (data.length > 15 * 1024 * 1024 || sha256(data) !== page.photo.sha256) throw new Error('PHOTO_INTEGRITY_FAILED');
    const png = data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const jpg = data[0] === 255 && data[1] === 216 && data[2] === 255;
    if (!png && !jpg) throw new Error('PHOTO_FORMAT_UNSUPPORTED');
    photos[index] = { data, format: png ? 'png' : 'jpg' }; hashes[page.photo.file] = sha256(data);
  }
  return { photos, hashes };
}
