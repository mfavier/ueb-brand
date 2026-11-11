import { build } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await fs.mkdir(path.join(root, 'dist'), { recursive: true });
// PDFKit 0.20 lazily loads standard metrics with a private package import.
// Resolve those known literals while bundling, so no node_modules is needed.
const pdfkitMetrics = { name: 'pdfkit-standard-metrics', setup(builder) {
  builder.onLoad({ filter: /pdfkit[\\/]js[\\/]pdfkit\.node\.mjs$/ }, async ({ path: file }) => {
    const source = await fs.readFile(file, 'utf8');
    const contents = source.replace(/require\$1\('#standard-fonts\/([A-Za-z]+)'\)/g, "require('./standard-fonts/$1.cjs')");
    if (source === contents || contents.includes("require$1('#standard-fonts/")) throw new Error('PDFKIT_METRICS_BUNDLE_CONTRACT_CHANGED');
    return { contents, loader: 'js' };
  });
} };
await build({ entryPoints: [path.join(root, 'src/renderer.mjs')], outfile: path.join(root, 'dist/renderer.mjs'), bundle: true, platform: 'node', target: 'node22', format: 'esm', minify: true, legalComments: 'linked', plugins: [pdfkitMetrics], banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' } });
console.log('Built standalone UEB PDF renderer for Node 22+.');
const lock = JSON.parse(await fs.readFile(path.join(root, 'package-lock.json'), 'utf8'));
const notices = ['UEB Documents · bundled production dependencies · see also renderer.mjs.LEGAL.txt'];
for (const [location, item] of Object.entries(lock.packages)) {
  if (!location || item.dev) continue;
  const directory = path.join(root, location);
  const meta = JSON.parse(await fs.readFile(path.join(directory, 'package.json'), 'utf8'));
  notices.push(`\n=== ${meta.name}@${meta.version} · ${meta.license || 'See package source'} ===\n`);
  for (const name of (await fs.readdir(directory)).sort()) if (/^(licen[cs]e|notice)([._-].*)?$/i.test(name) && (await fs.stat(path.join(directory, name))).isFile()) notices.push(await fs.readFile(path.join(directory, name), 'utf8'));
}
await fs.writeFile(path.join(root, 'dist/THIRD-PARTY-LICENSES.txt'), notices.join('\n'));
