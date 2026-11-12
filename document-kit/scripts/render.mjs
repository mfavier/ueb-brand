import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument, loadIdentity, loadPhotos, createDocument, renderToBuffer, sha256, RENDERER } from '../dist/renderer.mjs';
const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('node document-kit/scripts/render.mjs --input brief.json --output document.pdf [--root kit-root]'); process.exit(0); }
const allowed = new Set(['--input', '--output', '--root']);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!allowed.has(args[i]) || !args[i + 1] || options[args[i]]) throw new Error('ARGUMENT_INVALID');
  options[args[i]] = args[i + 1];
}
if (!options['--input'] || !options['--output']) throw new Error('INPUT_AND_OUTPUT_REQUIRED');
const inputFile = path.resolve(options['--input']), output = path.resolve(options['--output']);
const sourceFile = output.replace(/\.pdf$/, '.source.json');
const provenanceFile = output.replace(/\.pdf$/, '.provenance.json');
if (!output.endsWith('.pdf') || [output, sourceFile, provenanceFile].includes(inputFile)) throw new Error('OUTPUT_MUST_NOT_OVERWRITE_INPUT');
const bytes = await fs.readFile(inputFile);
const document = parseDocument(JSON.parse(bytes));
const identity = await loadIdentity(options['--root'] ? path.resolve(options['--root']) : path.dirname(kit), document.identity);
const { photos, hashes } = await loadPhotos(document, path.dirname(inputFile));
const buffer = await renderToBuffer(createDocument(document, identity, photos));
await fs.mkdir(path.dirname(output), { recursive: true });
const portable = structuredClone(document);
const assetDirectory = path.basename(output, '.pdf') + '.assets';
for (const [index, photo] of Object.entries(photos)) {
  const name = `${sha256(photo.data)}.${photo.format}`;
  await fs.mkdir(path.join(path.dirname(output), assetDirectory), { recursive: true });
  await fs.writeFile(path.join(path.dirname(output), assetDirectory, name), photo.data);
  portable.pages[Number(index)].photo.file = `${assetDirectory}/${name}`;
}
const sourceBytes = JSON.stringify(portable, null, 2) + '\n';
const lock = { schemaVersion: 1, documentId: document.id, identity: { ...document.identity, manifestSha256: identity.manifestSha256, files: identity.manifest.files }, template: document.template, renderer: RENDERER, inputSha256: sha256(bytes), portableSourceSha256: sha256(sourceBytes), rendererBundleSha256: sha256(await fs.readFile(path.join(kit, 'dist/renderer.mjs'))), dependencyLockSha256: sha256(await fs.readFile(path.join(kit, 'package-lock.json'))), nodeVersion: process.version, pdfSha256: sha256(buffer), photoHashes: hashes, createdAt: document.createdAt, status: document.status, demo: document.demo };
await fs.writeFile(output, buffer);
await fs.writeFile(sourceFile, sourceBytes);
await fs.writeFile(provenanceFile, JSON.stringify(lock, null, 2) + '\n');
console.log(JSON.stringify({ output, bytes: buffer.length, identity: document.identity, template: document.template, renderer: RENDERER, status: document.status }));
