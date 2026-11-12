import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { COLORS } from '../social-kit/browser/poster-engine.js';
import { loadIdentity } from '../document-kit/dist/renderer.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const consumers = JSON.parse(await fs.readFile(path.join(root, 'identity/consumers.json'), 'utf8')).consumers;
const social = await loadIdentity(root, consumers.find(c => c.id === 'social-engine').identity);
for (const [name, hex] of Object.entries(social.tokens.colors)) assert.equal(COLORS[name], hex, `Social palette diverged: ${name}`);
for (const name of ['document-engine','document-plugin','social-plugin','app-package']) {
  const row = consumers.find(c => c.id === name);
  if (row.source.endsWith('.json')) assert.equal(JSON.parse(await fs.readFile(path.join(root, row.source), 'utf8')).version, row.version);
}
console.log('Declared consumer palettes and package versions align.');
