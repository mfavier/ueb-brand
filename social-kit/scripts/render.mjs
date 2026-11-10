/** Render local SVGs with embedded fonts and images, then inspect the actual text bounds.
 * npm install --no-save --prefix /tmp/ueb-social-render playwright
 * PLAYWRIGHT_MODULE=/tmp/ueb-social-render/node_modules/playwright/index.mjs node scripts/render.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moduleName = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(moduleName ? pathToFileURL(path.resolve(moduleName)).href : 'playwright');
const browser = await chromium.launch({ headless: true });
const report = [];
const target = process.argv[2];
const directories = target ? [path.resolve(target)] : ['examples', 'templates'].map(dir => path.join(root, dir));
try {
  for (const dir of directories) {
    for (const name of (await fs.readdir(dir)).filter(name => name.endsWith('.svg')).sort()) {
      const input = path.join(dir, name);
      const svg = await fs.readFile(input, 'utf8');
      const width = 1080;
      const height = Number(svg.match(/height="(\d+)"/)[1]);
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.route('**/*', route => route.abort());
      await page.setContent(`<html><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden}svg{display:block}</style>${svg}</html>`);
      await page.evaluate(async () => {
        await document.fonts.load('700 40px Kanit');
        await document.fonts.load('800 40px Kanit');
        await document.fonts.load('400 36px "DM Sans"');
        await document.fonts.load('600 36px "DM Sans"');
        await document.fonts.ready;
        await Promise.all(Array.from(document.querySelectorAll('svg image')).map(async image => {
          const img = new Image(); img.src = image.getAttribute('href'); await img.decode();
        }));
      });
      // Shrink within each deliberately allocated field. Long texts must be shortened if < 80%.
      const fit = await page.evaluate(() => Array.from(document.querySelectorAll('text[data-max-width]')).map(text => {
        const max = Number(text.dataset.maxWidth);
        const original = Number(text.getAttribute('font-size'));
        const length = text.getComputedTextLength();
        const ratio = Math.min(1, max / length);
        if (ratio < 1) text.setAttribute('font-size', String(Math.floor(original * ratio * 100) / 100));
        return { id: text.id, original, fitted: Number(text.getAttribute('font-size')), ratio };
      }));
      const bounds = await page.evaluate(({ width, height }) => {
        // Kanit's em box reserves space for Thai diacritics. Measure painted Latin glyphs,
        // rather than getBBox()'s full font box, to detect actual collisions.
        const context = document.createElement('canvas').getContext('2d');
        const text = Array.from(document.querySelectorAll('text')).map(node => {
          const style = getComputedStyle(node);
          context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
          context.textAlign = { start: 'left', end: 'right', middle: 'center' }[node.getAttribute('text-anchor')] || 'left';
          const metrics = context.measureText(node.textContent);
          return { id: node.id, text: node.textContent,
            x: Number(node.getAttribute('x')) - metrics.actualBoundingBoxLeft,
            y: Number(node.getAttribute('y')) - metrics.actualBoundingBoxAscent,
            width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
        });
        return { fonts: [...document.fonts].map(f => ({ family: f.family, weight: f.weight, status: f.status })),
          overflow: text.filter(t => t.x < 0 || t.y < 0 || t.x + t.width > width + .5 || t.y + t.height > height + .5),
          overlapping: text.flatMap((a, i) => text.slice(i + 1).filter(b => a.text && b.text && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y).map(b => [a.id, b.id])),
          text };
      }, { width, height });
      const fitted = await page.locator('body > svg').evaluate(el => new XMLSerializer().serializeToString(el));
      await fs.writeFile(input, fitted + '\n');
      await page.screenshot({ path: input.replace(/\.svg$/, '.png') });
      report.push({ file: path.relative(root, input), width, height, fit, ...bounds });
      await page.close();
    }
  }
  if (!target) {
    const page = await browser.newPage({ viewport: { width: 1760, height: 1550 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(root, 'previews/index.html')).href);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    await page.screenshot({ path: path.join(root, 'previews/planche-feed.png'), fullPage: true });
    await page.close();
    const storiesPage = await browser.newPage({ viewport: { width: 1760, height: 1920 }, deviceScaleFactor: 1 });
    await storiesPage.goto(pathToFileURL(path.join(root, 'previews/stories.html')).href);
    await storiesPage.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    await storiesPage.screenshot({ path: path.join(root, 'previews/planche-stories.png'), fullPage: true });
    await storiesPage.close();
    const logoPage = await browser.newPage({ viewport: { width: 886, height: 1000 }, deviceScaleFactor: 1 });
    const logo = await fs.readFile(path.join(root, 'assets/ueb-logo.svg'), 'utf8');
    await logoPage.setContent(`<html><style>body{margin:0}svg{display:block;width:886px;height:1000px}</style>${logo}</html>`);
    await logoPage.screenshot({ path: path.join(root, 'assets/ueb-logo.png'), omitBackground: true });
    await logoPage.close();
    // Bind the manifest to fitted SVGs, not to the preflight files from generate.py.
    const { createHash } = await import('node:crypto');
    const manifestPath = path.join(root, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    for (const file of manifest.files) file.sha256 = createHash('sha256').update(await fs.readFile(path.join(root, file.file))).digest('hex');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
} finally {
  await browser.close();
}
const reportPath = target ? path.join(path.resolve(target), 'render-check.json') : path.join(root, 'previews/render-check.json');
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
const errors = report.flatMap(r => [
  ...r.overflow.map(t => `${r.file}: débordement ${t.id}`),
  ...r.overlapping.map(pair => `${r.file}: chevauchement ${pair.join(' / ')}`),
  ...r.fit.filter(f => f.ratio < .8).map(f => `${r.file}: texte trop long ${f.id} (${Math.round(f.ratio * 100)}%)`),
  ...r.fonts.filter(f => f.status !== 'loaded').map(f => `${r.file}: police absente ${f.family}`),
]);
console.log(JSON.stringify({ rendered: report.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
