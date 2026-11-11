/** Browser regressions. Set PLAYWRIGHT_MODULE to an installed playwright/index.mjs.
 * Optional UEB_ENGINE_QA_DIR retains representative PNGs and the detailed report. */
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const playwright = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(playwright ? pathToFileURL(path.resolve(playwright)).href : 'playwright');
const types = { '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html lang="fr"><body></body></html>'); return; }
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}${path.sep}`)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(await fs.readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const report = await page.evaluate(async () => {
    const engine = await import('/browser/poster-engine.js');
    await engine.initEngine({ assetBaseUrl: '/' });
    const logo = engine.getAssetDataURL('assets/ueb-logo.png');
    const photo = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="900" height="1100" fill="#B6DDF5"/><circle cx="500" cy="360" r="150" fill="#3448A1"/></svg>')}`;
    const sponsor = { id: 'test-partner', name: 'Partenaire test', label: 'AVEC LE SOUTIEN DE', logo };
    const fixtures = {
      '01-resultats': { edition: '7 & 8 NOVEMBRE', matches: Array.from({ length: 4 }, (_, i) => ({ id: String(i), category: `U${14 + i}`, home: 'Uccle Europe', away: 'Adversaire', homeScore: 101, awayScore: 108, homeLogo: logo, awayLogo: logo })) },
      '02-programme': { edition: '7 & 8 NOVEMBRE', matches: Array.from({ length: 4 }, (_, i) => ({ id: String(i), day: 'SAM. 7', category: `U${14 + i}`, opponent: 'Adversaire', time: '14:30', venue: 'Salle du Centre', side: 'À DOMICILE', opponentLogo: logo })) },
      '03-partenaire': { name: 'Partenaire test', logo, contribution: 'Un soutien au projet du club.', season: 'SAISON 2026–2027' },
      '04-player-of-the-week': { edition: 'SEMAINE DU 7 NOV.', name: ['PRÉNOM', 'JOUEUR'], category: 'U18', number: 12, portrait: photo, stats: [{ value: 18, label: 'POINTS' }, { value: 8, label: 'REBONDS' }, { value: 5, label: 'PASSES' }] },
      '05-annonce-officielle': { edition: '7 NOVEMBRE 2026', subject: ['NOUVEAU', 'PROJET'], body: 'La communication officielle du club.', signature: 'LE COMITÉ UCCLE EUROPE' },
      '06-communication': { edition: 'INFORMATION CLUB', subject: ['HORAIRE', 'ADAPTÉ'], when: 'SAMEDI 7 NOVEMBRE', details: ['Retrouvez les équipes dès 14 h.', 'L’entrée se fait par le hall.'], note: 'Merci pour votre présence.' },
      '07-score-final': { edition: 'U18 · 7 NOVEMBRE 2026', home: 'Uccle Europe', away: 'Adversaire', homeScore: 101, awayScore: 108, homeLogo: logo, awayLogo: logo, closing: 'Un collectif engagé.' },
      '08-libre': { title: ['LA VIE', 'DU CLUB.'], edition: 'UCCLE EUROPE', body: 'Retrouvons-nous pour partager un moment autour du basket.', photo, action: 'Rendez-vous au club.' },
    };
    const check = async (name, result) => {
      const parsed = new DOMParser().parseFromString(result.svg, 'image/svg+xml');
      const context = document.createElement('canvas').getContext('2d');
      const nodes = [...parsed.querySelectorAll('text')].map(node => {
        const size = Number(node.getAttribute('font-size'));
        context.font = `${node.getAttribute('font-weight')} ${size}px "${node.getAttribute('font-family')}"`;
        context.letterSpacing = `${node.getAttribute('letter-spacing') || 0}px`;
        context.textAlign = { start: 'left', end: 'right', middle: 'center' }[node.getAttribute('text-anchor')] || 'left';
        const m = context.measureText(node.textContent);
        return { id: node.id, size, x: Number(node.getAttribute('x')) - m.actualBoundingBoxLeft, y: Number(node.getAttribute('y')) - m.actualBoundingBoxAscent, width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent };
      });
      const collisions = nodes.flatMap((a, i) => nodes.slice(i + 1).filter(b => a.x + 1 < b.x + b.width && a.x + a.width > b.x + 1 && a.y + 1 < b.y + b.height && a.y + a.height > b.y + 1).map(b => [a.id, b.id]));
      const overflow = nodes.filter(n => n.x < -.5 || n.y < -.5 || n.x + n.width > result.width + .5 || n.y + n.height > result.height + .5);
      const tooSmall = nodes.filter(n => n.size < 40 && n.id !== 'working-label');
      const external = [...parsed.querySelectorAll('image')].filter(n => !n.getAttribute('href').startsWith('data:image/')).length;
      let png = null;
      if (!result.warnings.length) {
        const blob = await engine.posterToPng(result.svg);
        const image = await createImageBitmap(blob);
        png = { width: image.width, height: image.height, bytes: blob.size }; image.close();
      }
      return { name, warnings: result.warnings, collisions, overflow, tooSmall, external, png };
    };
    const checks = [];
    for (const [template, data] of Object.entries(fixtures)) for (const format of ['feed', 'story']) for (const sponsored of [false, true]) {
      checks.push(await check(`${template}-${format}${sponsored ? '-sponsor' : ''}`, engine.buildPoster(template, { ...data, ...(sponsored ? { sponsor } : {}) }, format)));
    }
    for (const format of ['feed', 'story']) for (const sponsored of [false, true]) checks.push(await check(`score-photo-${format}-${sponsored}`, engine.buildPoster('07-score-final', { ...fixtures['07-score-final'], photo, ...(sponsored ? { sponsor } : {}) }, format)));
    const adaptivePages = [];
    for (const template of ['01-resultats', '02-programme']) for (const format of ['feed', 'story']) for (const sponsored of [false, true]) {
      const data = { ...fixtures[template], ...(sponsored ? { sponsor } : {}), matches: Array.from({ length: 9 }, (_, i) => ({ ...fixtures[template].matches[0], id: String(i), category: 'U16 Gold', opponent: 'Royal Basket Club de la Vallée Européenne', away: 'Royal Basket Club de la Vallée Européenne', venue: 'Complexe sportif du centre communal · Bruxelles' })) };
      const pages = engine.paginatePosterData(template, data, format);
      adaptivePages.push({ template, format, sponsored, count: pages.length, ids: pages.flatMap(p => p.matches.map(m => m.id)) });
      for (const [i, data] of pages.entries()) checks.push(await check(`${template}-long-${format}-${sponsored}-page${i + 1}`, engine.buildPoster(template, data, format)));
    }
    const pages = engine.paginatePosterData('02-programme', { ...fixtures['02-programme'], sponsor, matches: Array.from({ length: 9 }, (_, i) => ({ ...fixtures['02-programme'].matches[0], id: String(i) })) });
    const longCopy = Array.from({ length: 30 }, (_, i) => `Information ${i + 1} pour les équipes et les familles du club.`).join(' ');
    const freePages = engine.paginatePosterData('08-libre', { title: 'VIE DU CLUB', body: longCopy, sponsor });
    for (const [i, data] of freePages.entries()) checks.push(await check(`free-page-${i + 1}`, engine.buildPoster('08-libre', data)));
    for (const [template, fixture] of Object.entries(fixtures)) for (const surface of ['white', 'paper', 'sky', 'blue', 'night', 'gold']) for (const format of ['feed', 'story']) {
      for (const visual of [{ source: 'none' }, { source: 'photo', mode: 'background-monochrome', photo }, { source: 'logo', mode: 'foreground-color', logo: 'assets/ueb-logo.svg' }]) {
        const data = { ...fixture, surface, visual, sponsor };
        for (const [index, paged] of engine.paginatePosterData(template, data, format).entries()) {
          checks.push(await check(`${template}-${surface}-${format}-${visual.source}-page${index + 1}`, engine.buildPoster(template, paged, format)));
        }
      }
    }
    const redPhoto = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="900" height="1100" fill="#ff0000"/></svg>')}`;
    const pixels = async mode => {
      const result = engine.buildPoster('08-libre', { title: 'VISUEL', body: 'Un message.', surface: 'white', visual: { source: 'photo', mode, photo: redPhoto } });
      const bitmap = await createImageBitmap(await engine.posterToPng(result.svg));
      const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
      const context = canvas.getContext('2d'); context.drawImage(bitmap, 0, 0); bitmap.close();
      return [...context.getImageData(mode === 'background-monochrome' ? 20 : 100, mode === 'background-monochrome' ? 800 : 300, 1, 1).data];
    };
    const monochromePixel = await pixels('background-monochrome');
    const foregroundPixel = await pixels('foreground-color');
    const long = engine.buildPoster('07-score-final', { ...fixtures['07-score-final'], home: 'NOM EXCESSIVEMENT LONG '.repeat(12) });
    let blocked = false;
    try { await engine.posterToPng(long.svg); } catch { blocked = true; }
    const external = engine.buildPoster('08-libre', { title: 'TEST', photo: 'https://example.com/photo.png' });
    const crestResults = ['04-player-of-the-week', '07-score-final', '08-libre'].map(template => engine.buildPoster(template, { ...fixtures[template], crest: { x: 123, y: 234, width: 555, opacity: .22, color: 'blue' } }, 'story').svg.includes('id="decorative-crest" x="123" y="434" width="555"'));
    const photoCopies = [];
    for (const template of ['05-annonce-officielle', '06-communication', '08-libre']) for (const placement of ['above', 'left', 'right']) for (const format of ['feed', 'story']) for (const sponsored of [false, true]) {
      const message = Array.from({ length: 8 }, (_, i) => `Information ${i + 1} pour les familles du club.`).join(' ');
      const data = { subject: 'RENDEZ-VOUS CLUB', [template === '06-communication' ? 'details' : 'body']: message,
        ...(sponsored ? { sponsor } : {}), action: 'www.uebasket.be', visual: { source: 'photo', mode: 'foreground-color', photo,
          photoSettings: { placement, width: placement === 'above' ? 82 : 45, height: placement === 'above' ? 420 : 600, fit: 'contain', zoom: 1, x: 50, y: 0 } } };
      await engine.preparePosterImages(template, data);
      const pages = engine.paginatePosterData(template, data, format);
      const copy = pages.map(page => page[template === '06-communication' ? 'details' : 'body'].join(' ')).join(' ');
      photoCopies.push({ message, copy });
      for (const [index, paged] of pages.entries()) {
        const result = engine.buildPoster(template, paged, format);
        const parsed = new DOMParser().parseFromString(result.svg, 'image/svg+xml');
        const frame = parsed.querySelector('[data-photo-frame]');
        const bounds = { x: +frame.getAttribute('x'), y: +frame.getAttribute('y'), w: +frame.getAttribute('width'), h: +frame.getAttribute('height') };
        const body = [...parsed.querySelectorAll('text[id^="body-"]')];
        const overlaps = body.some(node => {
          const x = +node.getAttribute('x'), y = +node.getAttribute('y');
          return x < bounds.x + bounds.w && x >= bounds.x && y > bounds.y && y < bounds.y + bounds.h;
        });
        if (overlaps || bounds.x < 72 || bounds.x + bounds.w > 1008.1 || bounds.y + bounds.h > (format === 'story' ? 1630 : 1060)) result.warnings.push('Photo overlaps body or footer');
        checks.push(await check(`photo-${template}-${placement}-${format}-${sponsored}-page${index + 1}`, result));
      }
    }
    const swatches = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"><path fill="#ff0000" d="M0 0h400v200H0z"/><path fill="#00ff00" d="M0 200h400v400H0z"/><path fill="#0000ff" d="M0 600h400v200H0z"/></svg>')}`;
    const samplePhoto = async (photoSettings, image = swatches, mode = 'foreground-color') => {
      const data = { title: 'PHOTO', body: 'Un message.', surface: 'white', visual: { source: 'photo', mode, photo: image, photoSettings: { placement: 'above', width: 100, height: 400, ...photoSettings } } };
      await engine.preparePosterImages('08-libre', data);
      const result = engine.buildPoster('08-libre', data);
      if (result.warnings.length) throw new Error(result.warnings.join(' '));
      const parsed = new DOMParser().parseFromString(result.svg, 'image/svg+xml');
      const frame = parsed.querySelector('[data-photo-frame]'), node = frame.querySelector('image');
      const imageBounds = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, +node.getAttribute(key)]));
      const bitmap = await createImageBitmap(await engine.posterToPng(result.svg));
      const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0); bitmap.close();
      const x = +frame.getAttribute('x'), y = +frame.getAttribute('y'), w = +frame.getAttribute('width'), h = +frame.getAttribute('height');
      return { pixel: [...ctx.getImageData(x + w / 2, y + h / 2, 1, 1).data], edge: [...ctx.getImageData(x + 2, y + h / 2, 1, 1).data], imageBounds };
    };
    const photoPixels = {
      top: await samplePhoto({ y: 0 }), bottom: await samplePhoto({ y: 100 }),
      contain: await samplePhoto({ fit: 'contain', y: 0 }), zoom: await samplePhoto({ zoom: 2, x: 0, y: 0 }),
      gray: await samplePhoto({ effect: 'grayscale', y: 0 }, redPhoto),
      opacity: await samplePhoto({ opacity: .5, y: 0 }, redPhoto),
      zeroStrength: await samplePhoto({ effect: 'tint', tint: 'night', strength: 0, y: 0 }, redPhoto),
      background: await samplePhoto({ effect: 'grayscale', opacity: .5, y: 0 }, redPhoto, 'background-monochrome'),
      tints: await Promise.all(['night', 'blue', 'sky', 'gold', 'white', 'paper'].map(tint => samplePhoto({ effect: 'tint', tint, y: 0 }, redPhoto))),
    };
    window.__samplePhoto = samplePhoto; window.__photo = photo;
    window.__engine = engine; window.__fixtures = fixtures; window.__sponsor = sponsor;
    return { checks, photoCopies, photoPixels, adaptivePages, pagination: pages.map(p => p.matches.map(m => m.id)), freeCopy: freePages.map(p => (Array.isArray(p.body) ? p.body : [p.body]).join(' ')).join(' '), longCopy, warningExportBlocked: blocked, externalWarnings: external.warnings, crestResults, monochromePixel, foregroundPixel };
  });
  const failures = report.checks.filter(r => r.warnings.length || r.collisions.length || r.overflow.length || r.tooSmall.length || r.external || !r.png || r.png.width !== 1080 || ![1350, 1920].includes(r.png.height));
  if (process.env.UEB_ENGINE_QA_DIR) {
    await fs.mkdir(process.env.UEB_ENGINE_QA_DIR, { recursive: true });
    await fs.writeFile(path.join(process.env.UEB_ENGINE_QA_DIR, 'report.json'), JSON.stringify(report, null, 2));
    for (const template of ['02-programme', '04-player-of-the-week', '07-score-final', '08-libre']) {
      await page.evaluate(template => { const result = window.__engine.buildPoster(template, { ...window.__fixtures[template], sponsor: window.__sponsor }); document.body.innerHTML = result.svg; document.body.style.margin = '0'; }, template);
      await page.setViewportSize({ width: 1080, height: 1350 });
      await page.screenshot({ path: path.join(process.env.UEB_ENGINE_QA_DIR, `${template}.png`) });
    }
  }
  if (process.env.UEB_ENGINE_QA_DIR) {
    for (const placement of ['above', 'left', 'right']) {
      await page.evaluate(async placement => {
        const engine = window.__engine;
        const data = { subject: 'TOMBOLA DU CLUB', body: 'Retrouvons-nous samedi pour soutenir les équipes. Inscriptions auprès du club.', action: 'www.uebasket.be', sponsor: window.__sponsor,
          visual: { source: 'photo', photo: window.__photo, photoSettings: { placement, width: placement === 'above' ? 80 : 45, height: 500, fit: 'contain', y: 0 } } };
        await engine.preparePosterImages('08-libre', data);
        document.body.innerHTML = engine.buildPoster('08-libre', engine.paginatePosterData('08-libre', data)[0]).svg;
      }, placement);
      await page.screenshot({ path: path.join(process.env.UEB_ENGINE_QA_DIR, `photo-${placement}.png`) });
    }
  }
  assert.deepEqual(failures, [], 'Valid compositions must render without warnings, collisions, overflow or small text');
  for (const copy of report.photoCopies) assert.equal(copy.copy, copy.message, 'Photo layout pagination preserves all words');
  const pp = report.photoPixels;
  assert.ok(pp.top.pixel[0] > 240 && pp.top.pixel[1] < 10, 'Top crop preserves the head of a portrait');
  assert.ok(pp.bottom.pixel[2] > 240 && pp.bottom.pixel[0] < 10, 'Bottom crop moves to the feet');
  assert.ok(pp.contain.edge.slice(0, 3).every(v => v > 240), 'Contain keeps a clear margin around the whole portrait');
  assert.equal(pp.zoom.imageBounds.width, pp.top.imageBounds.width * 2, 'Zoom uses intrinsic proportions');
  assert.equal(pp.gray.pixel[0], pp.gray.pixel[1]); assert.equal(pp.gray.pixel[1], pp.gray.pixel[2]);
  assert.ok(pp.opacity.pixel[0] > 240 && pp.opacity.pixel[1] > 120 && pp.opacity.pixel[1] < 135, 'Opacity is applied in the PNG');
  assert.ok(pp.zeroStrength.pixel[0] > 240 && pp.zeroStrength.pixel[1] < 10, 'Zero filter strength preserves original colour');
  assert.ok(Math.abs(pp.background.pixel[0] - pp.background.pixel[2]) < 2, 'Background photos use the chosen effect');
  assert.ok(pp.tints[0].pixel[2] > pp.tints[0].pixel[0]);
  assert.ok(pp.tints[3].pixel[0] > pp.tints[3].pixel[2], 'Gold tint uses the official palette');
  assert.ok(pp.tints[4].pixel[0] === pp.tints[4].pixel[2], 'White tint is monochrome');
  assert.deepEqual(report.pagination.flat(), Array.from({ length: 9 }, (_, i) => String(i)));
  assert.equal(report.pagination.length, 3, 'Nine short fixtures should remain three pages');
  for (const entry of report.adaptivePages) assert.deepEqual(entry.ids, Array.from({ length: 9 }, (_, i) => String(i)), 'Long labels must preserve every selected game');
  assert.ok(report.adaptivePages.some(entry => entry.count > 3), 'Tall rows need additional pages, not smaller type');
  assert.equal(report.freeCopy, report.longCopy, 'Pagination must preserve every word in order');
  assert.equal(report.warningExportBlocked, true);
  assert.ok(report.externalWarnings.length);
  assert.ok(report.crestResults.every(Boolean));
  assert.ok(report.monochromePixel[2] > report.monochromePixel[0] + 2, 'The PNG background must have the blue monochrome treatment, not a colour photograph');
  assert.ok(report.foregroundPixel[0] > 240 && report.foregroundPixel[1] < 10 && report.foregroundPixel[2] < 10, 'The foreground PNG must retain the photograph’s original colour');
  console.log(JSON.stringify({ compositions: report.checks.length, allChecksPassed: true }));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
