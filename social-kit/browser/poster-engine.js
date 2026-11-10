/** Canonical UEB browser poster engine. See PROVENANCE.md in this directory.
 * Reusable renderer: no application credentials, data fetching or publishing. */

export const COLORS = Object.freeze({
  night: '#101E42', blue: '#3448A1', sky: '#B6DDF5', gold: '#D8AF69',
  white: '#FFFFFF', paper: '#F5F8FC', muted: '#526078', line: '#DCE2EC',
});

const BACKGROUNDS = ['white', 'paper', 'sky', 'blue', 'night', 'gold'];

export function getPosterBackground(templateId, data = {}) {
  let background = { '01-resultats': 'white', '02-programme': 'sky', '03-partenaire': 'white',
    '04-player-of-the-week': 'white', '05-annonce-officielle': 'night', '06-communication': 'paper',
    '07-score-final': 'night', '08-libre': 'white' }[templateId];
  if (['04-player-of-the-week', '08-libre'].includes(templateId) && data.variant === 'dark') background = 'night';
  if (['01-resultats', '02-programme', '03-partenaire', '06-communication', '08-libre'].includes(templateId) && ['white', 'paper', 'sky'].includes(data.surface)) background = data.surface;
  if (templateId === '08-libre' && data.variant === 'dark') background = 'night';
  return data.visual && BACKGROUNDS.includes(data.surface) ? data.surface : background;
}

/** Select an available photograph automatically, with a faithful logo fallback.
 * The explicit choices never silently substitute one kind of image for another. */
export function resolvePosterVisual(templateId, data) {
  const settings = data.visual || { source: 'auto' };
  const photo = settings.photo ?? data.portrait ?? data.backgroundPhoto ?? data.photo ?? null;
  const logo = settings.logo ?? (templateId === '03-partenaire' ? data.logo : null) ?? 'assets/ueb-logo.svg';
  const source = settings.source === 'auto' ? (photo ? 'photo' : 'logo') : settings.source;
  const image = source === 'none' ? null : source === 'photo' ? photo : logo;
  const clubLogo = source === 'logo' && /^assets\/ueb-logo\.(svg|png)$/.test(image || '');
  const mode = settings.mode || (source === 'photo' || (templateId === '03-partenaire' && !clubLogo) ? 'foreground-color' : 'background-monochrome');
  return { source, image, mode, clubLogo };
}

/** One source of layout defaults for renderer and controls. */
export function getPosterCrest(templateId, data) {
  const dark = ['night', 'blue'].includes(getPosterBackground(templateId, data));
  const visual = data.visual ? resolvePosterVisual(templateId, data) : null;
  const hasForeground = visual?.mode === 'foreground-color' && !!visual.image;
  const portrait = visual ? hasForeground : !!data.portrait;
  const photograph = visual ? hasForeground : !!(data.backgroundPhoto || data.photo);
  const base = { x: 520, y: -190, width: 1000, opacity: templateId === '03-partenaire' ? .15 : .11, color: dark ? 'white' : 'night' };
  if (templateId === '04-player-of-the-week') Object.assign(base, portrait
    ? { x: -235, y: 375, width: 780, opacity: .12, color: dark ? 'white' : 'blue' }
    : { x: 450, y: 225, width: 1050, opacity: .36, color: dark ? 'white' : 'blue' });
  if (templateId === '07-score-final') Object.assign(base, photograph
    ? { x: 400, y: 400, width: 900, opacity: .10 }
    : { x: 400, y: -80, width: 1100, opacity: .18 });
  return { ...base, ...data.crest };
}

const NAMES = {
  '01-resultats': 'Résultats du week-end',
  '02-programme': 'Programme du week-end',
  '03-partenaire': 'Présentation d’un partenaire',
  '04-player-of-the-week': 'Player of the week',
  '05-annonce-officielle': 'Annonce officielle',
  '06-communication': 'Communication pratique',
  '07-score-final': 'Score final',
  '08-libre': 'Publication libre',
};

const assetURLs = new Map();
let fontsCSS = '';
let ready = false;
let initPromise;
let measuringContext;
let documentCounter = 0;
let assetBaseURL;

const escapeXML = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[c]));

function bytesToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let result = '';
  for (let offset = 0; offset < bytes.length; offset += 32768) {
    result += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  }
  return btoa(result);
}

async function fetchDataURL(path, mime) {
  const response = await fetch(new URL(path, assetBaseURL));
  if (!response.ok) throw new Error(`La ressource ${path.split('/').pop()} n’a pas pu être chargée.`);
  return `data:${mime};base64,${bytesToBase64(await response.arrayBuffer())}`;
}

export async function initEngine(options = {}) {
  const requestedURL = new URL(options.assetBaseUrl || assetBaseURL || '/social-posts/', document.baseURI).href;
  const requestedBase = requestedURL.endsWith('/') ? requestedURL : `${requestedURL}/`;
  if (assetBaseURL && requestedBase !== assetBaseURL) throw new Error('Le moteur est déjà configuré avec un autre dossier d’actifs.');
  assetBaseURL = requestedBase;
  if (ready) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const fontSpecs = [
      ['Kanit', '700', 'Kanit-Bold.ttf'],
      ['Kanit', '800', 'Kanit-ExtraBold.ttf'],
      ['DM Sans', '100 1000', 'DM-Sans-Variable.ttf'],
    ];
    const files = [
      ['assets/ueb-logo.svg', 'image/svg+xml'],
      ['assets/ueb-logo.png', 'image/png'],
      ...['night', 'blue', 'white'].map(c => [`assets/decorative/ueb-crest-${c}.svg`, 'image/svg+xml']),
      ...fontSpecs.map(([, , name]) => [`assets/fonts/${name}`, 'font/ttf']),
    ];
    await Promise.all(files.map(async ([path, mime]) => assetURLs.set(path, await fetchDataURL(`./${path}`, mime))));
    const faces = fontSpecs.map(([family, weight, filename]) => {
      const uri = assetURLs.get(`assets/fonts/${filename}`);
      return new FontFace(family, `url("${uri}")`, { style: 'normal', weight });
    });
    await Promise.all(faces.map(face => face.load()));
    faces.forEach(face => document.fonts.add(face));
    await document.fonts.ready;
    fontsCSS = fontSpecs.map(([family, weight, filename]) =>
      `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};src:url('${assetURLs.get(`assets/fonts/${filename}`)}') format('truetype');}`
    ).join('');
    measuringContext = document.createElement('canvas').getContext('2d');
    if (!measuringContext) throw new Error('Le navigateur ne dispose pas du rendu graphique nécessaire.');
    ready = true;
  })();
  try { await initPromise; } catch (error) { initPromise = null; throw error; }
}

export function getAssetDataURL(path) {
  return assetURLs.get(String(path).replace(/^\.?\//, '')) || '';
}

function setCanvasFont(context, size, weight, family, tracking = 0) {
  context.font = `${weight} ${size}px "${family}"`;
  context.fontKerning = 'normal';
  if ('letterSpacing' in context) context.letterSpacing = `${tracking}px`;
}

function textWidth(value, size, weight = 400, display = false, tracking = 0) {
  setCanvasFont(measuringContext, size, weight, display ? 'Kanit' : 'DM Sans', tracking);
  let width = measuringContext.measureText(String(value)).width;
  if (!('letterSpacing' in measuringContext)) width += Math.max(0, Array.from(String(value)).length - 1) * tracking;
  return width;
}

function imageURL(value) {
  const url = String(value || '');
  if (/^data:image\/(?:png|jpeg|jpg|webp|svg\+xml);/i.test(url)) return url;
  return getAssetDataURL(url);
}

function cleanLines(value) {
  return (Array.isArray(value) ? value : [value]).flatMap(v => String(v ?? '').split(/\r?\n/)).map(v => v.trim()).filter(Boolean);
}

function upper(value) {
  return cleanLines(value).map(v => v.toLocaleUpperCase('fr-FR'));
}

function wrapLines(value, size, width, weight = 400, display = false, tracking = 0) {
  const result = [];
  for (const paragraph of cleanLines(value)) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && textWidth(next, size, weight, display, tracking) > width) { result.push(line); line = word; }
      else line = next;
    }
    if (line) result.push(line);
  }
  return result;
}

/** Row geometry is shared by pagination and drawing. Facts keep their complete
 * spelling; a taller row consumes more page space instead of shrinking type. */
function listRowLayout(template, row) {
  if (template === '02-programme') {
    const opponentX = row.opponentLogo ? 350 : 280;
    const opponentWidth = row.opponentLogo ? 408 : 478;
    const day = wrapLines(row.day, 40, 170, 700);
    const category = wrapLines(row.category, 52, 170, 700, true);
    const opponent = wrapLines(row.opponent, 52, opponentWidth, 700, true);
    const venue = wrapLines(row.venue, 44, 728);
    const categoryY = Math.max(1, day.length) * 48 + 18;
    const venueY = Math.max(1, opponent.length) * 58 + 9;
    const sideY = venueY + Math.max(0, venue.length - 1) * 52 + 59;
    const end = Math.max(sideY, categoryY + Math.max(0, category.length - 1) * 58);
    return { day, category, opponent, venue, opponentX, opponentWidth, categoryY, venueY, sideY, end, height: end + 77 };
  }
  const namesX = row.homeLogo || row.awayLogo ? 142 : 74;
  const namesWidth = 654 - namesX;
  const category = wrapLines(row.category, 40, 620, 600, false, 1.2);
  const home = wrapLines(row.home, 52, namesWidth, 700, true);
  const away = wrapLines(row.away, 48, namesWidth, 700, true);
  const homeY = Math.max(1, category.length) * 48 + 18;
  const awayY = homeY + Math.max(0, home.length - 1) * 58 + 60;
  const end = awayY + Math.max(0, away.length - 1) * 56;
  return { category, home, away, namesX, namesWidth, homeY, awayY, end, height: end + 77 };
}

class Poster {
  constructor(key, data, format) {
    this.key = key;
    this.visual = data.visual ? resolvePosterVisual(key, data) : null;
    this.d = { ...data };
    if (this.visual) {
      this.d.portrait = this.d.photo = this.d.backgroundPhoto = null;
      this.d.backgroundStyle = 'plain';
      if (key === '03-partenaire') this.d.logo = null;
      if (this.visual.mode === 'foreground-color' && this.visual.image) {
        if (key === '04-player-of-the-week') this.d.portrait = this.visual.image;
        else if (key === '07-score-final') this.d.backgroundPhoto = this.visual.image;
        else if (key === '08-libre') this.d.photo = this.visual.image;
        else if (key === '03-partenaire') this.d.logo = this.visual.image;
        else this.headerVisual = this.visual.image;
      }
    }
    this.story = format === 'story';
    this.height = this.story ? 1920 : 1350;
    this.offset = this.story ? 200 : 0;
    this.bg = getPosterBackground(key, data);
    this.dark = ['night', 'blue'].includes(this.bg);
    this.ink = COLORS[this.dark ? 'white' : 'night'];
    this.secondary = COLORS[this.dark ? 'sky' : 'muted'];
    this.accent = COLORS[this.dark ? 'sky' : this.bg === 'gold' ? 'night' : 'blue'];
    this.parts = [];
    this.fieldIDs = [];
    this.warnings = [];
    this.counter = 0;
    this.sponsored = Boolean(data.sponsor);
    this.contentBottom = this.height - (this.sponsored ? 210 : 72);
    this.headerBottom = 250 + this.offset;
    this.rect(0, 0, 1080, this.height, COLORS[this.bg]);
  }

  warn(message) {
    if (!this.warnings.includes(message)) this.warnings.push(message);
  }

  text(value, x, y, size = 36, options = {}) {
    const content = String(value ?? '');
    if (!content) return;
    const { color = this.ink, weight = 400, display = false, anchor = 'start', tracking = 0, field, maxWidth } = options;
    const nodeId = field || `text-${++this.counter}`;
    if (field) this.fieldIDs.push(field);
    let fitted = size;
    if (maxWidth) {
      const width = textWidth(content, size, weight, display, tracking);
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        const minimum = Math.min(size, Math.max(40, size * .8));
        fitted = Math.max(minimum, Math.floor(size * ratio * 100) / 100);
        // Tracking does not scale with the font: a second measurement resolves that difference.
        for (let pass = 0; pass < 3; pass++) {
          const currentWidth = textWidth(content, fitted, weight, display, tracking);
          if (currentWidth <= maxWidth) break;
          fitted = Math.max(minimum, Math.floor(fitted * maxWidth / currentWidth * 100) / 100);
        }
        if (textWidth(content, fitted, weight, display, tracking) > maxWidth + .5) this.warn(`Le texte « ${content.length > 65 ? content.slice(0, 62) + '…' : content} » est trop long. Raccourcissez-le ou répartissez-le sur plusieurs lignes.`);
      }
    }
    if (y > this.contentBottom && !String(field || '').startsWith('sponsor-') && field !== 'working-label') this.warn('Le contenu atteint la zone réservée en bas de page. Répartissez-le sur plusieurs pages.');
    this.parts.push(`<text id="${escapeXML(nodeId)}" x="${x}" y="${y}" font-size="${fitted}" font-weight="${weight}" fill="${color}" font-family="${display ? 'Kanit' : 'DM Sans'}" text-anchor="${anchor}" letter-spacing="${tracking}"${maxWidth ? ` data-max-width="${maxWidth}"` : ''}>${escapeXML(content)}</text>`);
  }

  lines(values, x, y, size, leading = size, options = {}, maxLines = 2) {
    let lines = cleanLines(values);
    if (options.maxWidth && maxLines > 1) {
      const paragraphs = lines;
      const wrapped = [];
      for (const paragraph of paragraphs) {
        let current = '';
        for (const word of paragraph.split(/\s+/)) {
          const candidate = current ? `${current} ${word}` : word;
          if (current && textWidth(candidate, size, options.weight || 400, !!options.display, options.tracking || 0) > options.maxWidth) {
            wrapped.push(current); current = word;
          } else current = candidate;
        }
        if (current) wrapped.push(current);
      }
      lines = wrapped;
    }
    if (lines.length > maxLines) {
      lines = [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(' ')];
      this.warn('Un bloc contient beaucoup de texte. Vérifiez la lisibilité ou utilisez une autre page.');
    }
    lines.forEach((line, index) => this.text(line, x, y + index * leading, size, {
      ...options, field: options.field ? `${options.field}-${index + 1}` : undefined,
    }));
    return lines.length;
  }

  rect(x, y, width, height, color, opacity = 1) {
    this.parts.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" opacity="${opacity}"/>`);
  }

  rule(y, color = this.accent, x1 = 72, x2 = 1008) {
    this.parts.push(`<path d="M${x1} ${y}H${x2}" fill="none" stroke="${color}" stroke-width="1.5"/>`);
  }

  image(value, x, y, width, height, field = 'photo', contain = false, opacity = 1, position = 'center') {
    const uri = imageURL(value);
    if (!uri) {
      if (value) this.warn('Une image n’a pas pu être incorporée. Ajoutez-la à nouveau depuis votre appareil.');
      return;
    }
    const alignment = { center: 'xMidYMid', top: 'xMidYMin', bottom: 'xMidYMax', left: 'xMinYMid', right: 'xMaxYMid' }[position] || 'xMidYMid';
    this.parts.push(`<svg id="${escapeXML(field)}" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" overflow="hidden" opacity="${opacity}"><image href="${escapeXML(uri)}" width="${width}" height="${height}" preserveAspectRatio="${alignment} ${contain ? 'meet' : 'slice'}"/></svg>`);
  }

  crest({ x = 520, y = -190, width = 1000, opacity = .12, color = this.dark ? 'white' : 'night' } = {}) {
    if (![x, y, width, opacity].every(Number.isFinite) || width <= 0 || opacity < 0 || opacity > 1) {
      this.warn('Les réglages du blason sont invalides. Rétablissez sa position, sa taille et son opacité.'); return;
    }
    const chosen = ['night', 'blue', 'white'].includes(color) ? color : 'night';
    if (chosen !== color) this.warn('Choisissez une teinte autorisée pour le blason décoratif.');
    this.image(`assets/decorative/ueb-crest-${chosen}.svg`, x, y + this.offset, width, width * 1755.26 / 1555.73, 'decorative-crest', true, opacity);
  }

  backdrop() {
    if (this.visual) {
      if (this.visual.mode === 'background-monochrome' && this.visual.image) {
        const settings = getPosterCrest(this.key, { ...this.d, surface: this.bg });
        if (this.visual.clubLogo) this.crest(settings);
        else {
          const tint = COLORS[settings.color] || COLORS[this.dark ? 'white' : 'night'];
          const channels = [1, 3, 5].map(index => parseInt(tint.slice(index, index + 2), 16) / 255);
          const matrix = channels.map(c => `${.2126*c} ${.7152*c} ${.0722*c} 0 0`).join(' ') + ' 0 0 0 1 0';
          this.parts.push(`<defs><filter id="visual-monochrome" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${matrix}"/></filter></defs><g filter="url(#visual-monochrome)">`);
          if (this.visual.source === 'photo') this.image(this.visual.image, 0, 0, 1080, this.height, 'visual-background', false, this.d.crest?.opacity ?? .25, this.d.photoPosition);
          else this.image(this.visual.image, settings.x, settings.y + this.offset, settings.width, settings.width, 'decorative-crest', true, settings.opacity);
          this.parts.push('</g>');
        }
      }
      return;
    }
    if (['04-player-of-the-week', '07-score-final'].includes(this.key)) return;
    if (this.d.backgroundPhoto) {
      this.image(this.d.backgroundPhoto, 0, 0, 1080, this.height, 'background-photo', false, 1, this.d.photoPosition);
      this.rect(0, 0, 1080, this.height, COLORS[this.bg], this.dark ? .9 : .92);
    }
    if (this.d.backgroundStyle !== 'plain') this.crest({ opacity: this.key === '03-partenaire' ? .15 : .11, ...this.d.crest });
  }

  title(defaultLines, meta, size = 100, maxLines = 2) {
    let values = cleanLines(this.d.title).length ? upper(this.d.title) : defaultLines;
    const titleWidth = this.headerVisual ? 700 : 936;
    if (this.headerVisual) {
      values = wrapLines(values, size, titleWidth, 800, true, -2);
      if (this.visual.source === 'logo') this.rect(792, 20 + this.offset, 232, 232, COLORS.white);
      this.image(this.headerVisual, 808, 36 + this.offset, 200, 200, 'visual-foreground', this.visual.source === 'logo', 1, this.d.photoPosition);
    }
    const y = 172 + this.offset;
    const count = this.lines(values, 72, y, size, size * .98, {
      display: true, weight: 800, tracking: -2, field: 'headline', maxWidth: titleWidth,
    }, maxLines);
    const baseline = y + Math.max(0, count - 1) * size * .98;
    this.text(meta, 74, baseline + 78, 42, { color: this.accent, weight: 600, tracking: 1, field: 'edition', maxWidth: 932 });
    this.headerBottom = baseline + (meta ? 78 : 0);
  }

  footer() {
    const label = this.d.demo === true ? 'EXEMPLE FICTIF' : this.d.footer || '';
    if (!label) return;
    const color = this.key === '04-player-of-the-week' && !this.dark ? COLORS.night : this.secondary;
    this.text(label, 72, this.sponsored ? this.height - 196 : 1300 + this.offset, 32, { color, tracking: 1.2, field: 'working-label', maxWidth: 936 });
  }

  sponsor() {
    const sponsor = this.d.sponsor;
    if (!sponsor) return;
    const y = this.height - 180;
    this.rect(0, y, 1080, 180, COLORS.white);
    this.rule(y, COLORS.line, 0, 1080);
    this.text(sponsor.label || 'AVEC LE SOUTIEN DE', 72, y + 48, 40, { color: COLORS.muted, weight: 600, field: 'sponsor-label', maxWidth: sponsor.logo ? 710 : 936 });
    this.lines(sponsor.name, 72, y + 104, 44, 46, { color: COLORS.night, display: true, weight: 700, field: 'sponsor-name', maxWidth: sponsor.logo ? 710 : 936 }, 2);
    if (sponsor.logo) this.image(sponsor.logo, 830, y + 26, 178, 128, 'sponsor-logo', true);
  }

  results() {
    this.title(['LES RÉSULTATS.'], this.d.edition, 99);
    const rows = Array.isArray(this.d.matches) ? this.d.matches : [];
    if (rows.length > 4) this.warn('Cette page affiche quatre rencontres au maximum. Répartissez les autres sur une autre page.');
    const start = Math.max(371 + this.offset, this.headerBottom + 100);
    let y = start;
    rows.slice(0, 4).forEach((row, i) => {
      const layout = listRowLayout(this.key, row);
      const score = row.score ?? (row.homeScore !== undefined && row.awayScore !== undefined ? `${row.homeScore} – ${row.awayScore}` : '');
      this.lines(layout.category, 74, y, 40, 48, { color: this.accent, weight: 600, tracking: 1.2, field: `match-${i}-category`, maxWidth: 620 }, Math.max(1, layout.category.length));
      if (row.homeLogo) this.image(row.homeLogo, 74, y + layout.homeY - 40, 50, 50, `match-${i}-home-logo`, true);
      if (row.awayLogo) this.image(row.awayLogo, 74, y + layout.awayY - 40, 50, 50, `match-${i}-away-logo`, true);
      this.lines(layout.home, layout.namesX, y + layout.homeY, 52, 58, { weight: 700, display: true, field: `match-${i}-home`, maxWidth: layout.namesWidth }, Math.max(1, layout.home.length));
      this.lines(layout.away, layout.namesX, y + layout.awayY, 48, 56, { weight: 700, display: true, field: `match-${i}-away`, maxWidth: layout.namesWidth }, Math.max(1, layout.away.length));
      this.text(score, 1008, y + (layout.homeY + layout.end) / 2 + 15, 88, { weight: 700, display: true, color: this.accent, anchor: 'end', tracking: -1.5, field: `match-${i}-score`, maxWidth: 310 });
      if (i < Math.min(rows.length, 4) - 1) this.rule(y + layout.end + 21, COLORS.line);
      y += layout.height;
    });
  }

  schedule() {
    this.title(['CE WEEK-END.'], this.d.edition, 105);
    const rows = Array.isArray(this.d.matches) ? this.d.matches : [];
    if (rows.length > 4) this.warn('Cette page affiche quatre rencontres au maximum. Répartissez les autres sur une autre page.');
    const start = Math.max(371 + this.offset, this.headerBottom + 100);
    let y = start;
    rows.slice(0, 4).forEach((row, i) => {
      const layout = listRowLayout(this.key, row);
      this.lines(layout.day, 72, y, 40, 48, { color: this.accent, weight: 700, field: `match-${i}-day`, maxWidth: 170 }, Math.max(1, layout.day.length));
      this.lines(layout.category, 72, y + layout.categoryY, 52, 58, { weight: 700, display: true, field: `match-${i}-category`, maxWidth: 170 }, Math.max(1, layout.category.length));
      if (row.opponentLogo) this.image(row.opponentLogo, 280, y - 42, 54, 54, `match-${i}-opponent-logo`, true);
      this.lines(layout.opponent, layout.opponentX, y + 1, 52, 58, { weight: 700, display: true, field: `match-${i}-opponent`, maxWidth: layout.opponentWidth }, Math.max(1, layout.opponent.length));
      this.lines(layout.venue, 280, y + layout.venueY, 44, 52, { field: `match-${i}-venue`, maxWidth: 728 }, Math.max(1, layout.venue.length));
      this.text(row.side, 280, y + layout.sideY, 40, { color: this.accent, weight: 600, field: `match-${i}-side`, maxWidth: 728 });
      this.text(row.time, 1008, y + 5, 64, { weight: 700, display: true, anchor: 'end', field: `match-${i}-time`, maxWidth: 210 });
      if (i < Math.min(rows.length, 4) - 1) this.rule(y + layout.end + 21, COLORS.blue);
      y += layout.height;
    });
  }

  partner() {
    this.title(['À NOS', 'CÔTÉS.'], this.d.edition || 'PARTENAIRE DU CLUB', 108);
    const off = this.offset;
    if (this.d.logo) {
      this.rect(72, 440 + off, 936, 300, COLORS.white);
      this.image(this.d.logo, 116, 470 + off, 848, 240, 'partner-logo', this.visual?.source !== 'photo');
    } else {
      this.lines(upper(this.d.name), 72, 620 + off, 122, 116, { weight: 700, display: true, tracking: -1.5, field: 'partner-name', maxWidth: 936 }, 2);
    }
    if (this.visual && this.d.logo) this.text(cleanLines(this.d.name).join(' '), 72, 795 + off, 44, { weight: 700, display: true, field: 'partner-identity', maxWidth: 936 });
    this.rect(72, 812 + off, 112, 6, COLORS.gold);
    this.lines(this.d.contribution, 72, 896 + off, 48, 64, { field: 'contribution', maxWidth: 936 }, 2);
    this.text(this.d.season, 72, 1084 + off, 42, { color: this.accent, weight: 600, field: 'season', maxWidth: 936 });
  }

  player() {
    const off = this.offset;
    const compact = this.sponsored && !this.story;
    const portrait = this.d.portrait;
    if (portrait) {
      if (this.visual?.source === 'logo') this.rect(588, 180 + off, 432, 730, COLORS.white);
      this.image(portrait, this.visual?.source === 'logo' ? 600 : 420, this.visual?.source === 'logo' ? off + 170 : off, this.visual?.source === 'logo' ? 408 : 660, this.visual?.source === 'logo' ? 700 : compact ? 930 : 1100, 'player-photo', this.visual?.source === 'logo', 1, this.d.photoPosition);
      this.rect(0, off, 600, compact ? 930 : 1100, COLORS[this.bg]);
      if (this.d.backgroundStyle !== 'plain') this.crest({ x: -235, y: 375, width: 780, opacity: .12, color: this.dark ? 'white' : 'blue', ...this.d.crest });
    } else if (this.d.backgroundStyle !== 'plain') {
      this.crest({ x: 450, y: 225, width: 1050, opacity: .36, color: this.dark ? 'white' : 'blue', ...this.d.crest });
    }
    this.lines(cleanLines(this.d.title).length ? upper(this.d.title) : ['PLAYER OF', 'THE WEEK.'], 72, 174 + off, 97, 100, { display: true, weight: 800, tracking: -1.8, field: 'headline', maxWidth: 525 }, 2);
    this.text('UCCLE EUROPE', 74, 365 + off, 40, { color: this.accent, weight: 700, display: true, field: 'club-signature', maxWidth: 510 });
    this.lines(upper(this.d.name), 72, (compact ? 560 : 657) + off, compact ? 88 : 100, compact ? 94 : 108, { weight: 800, display: true, tracking: -2, field: 'player-name', maxWidth: 490 }, 2);
    this.text(this.d.category, 74, (compact ? 755 : 893) + off, 40, { color: this.secondary, weight: 600, field: 'category', maxWidth: 510 });
    if (this.d.number !== '' && this.d.number !== undefined && this.d.number !== null) {
      this.text(`N° ${this.d.number}`, 74, (compact ? 824 : 971) + off, 52, { color: this.accent, weight: 700, display: true, field: 'jersey-number', maxWidth: 460 });
    }
    this.text(this.d.edition, 74, (compact ? 893 : 1045) + off, 40, { color: this.secondary, weight: 500, field: 'edition', maxWidth: 470 });
    const stats = (Array.isArray(this.d.stats) ? this.d.stats : []).filter(s => String(s.value ?? '') || String(s.label ?? ''));
    if (stats.length > 3) this.warn('Cette composition affiche trois repères au maximum. Placez les autres dans la légende.');
    if (stats.length) {
      this.rect(0, (compact ? 930 : 1100) + off, 1080, compact ? 220 : this.height - (1100 + off), COLORS[this.dark ? 'night' : 'sky']);
      const colWidth = 936 / Math.min(3, stats.length);
      stats.slice(0, 3).forEach((stat, i) => {
        const x = 72 + i * colWidth;
        this.text(stat.value, x, (compact ? 1035 : 1205) + off, 94, { weight: 700, display: true, field: `stat-${i}-value`, maxWidth: colWidth - 32 });
        this.text(stat.label, x + 2, (compact ? 1090 : 1260) + off, 40, { color: COLORS[this.dark ? 'sky' : 'night'], weight: 600, field: `stat-${i}-label`, maxWidth: colWidth - 32 });
      });
    }
  }

  official() {
    this.title(['ANNONCE', 'OFFICIELLE.'], this.d.edition, 104);
    const off = this.offset;
    this.lines(upper(this.d.subject), 72, 520 + off, 94, 100, { display: true, weight: 700, color: this.dark ? COLORS.sky : this.ink, tracking: -1.1, field: 'subject', maxWidth: 936 }, 2);
    this.lines(this.d.body, 72, 790 + off, 44, 63, { field: 'body', maxWidth: 936 }, 4);
    this.text(this.d.signature, 72, 1080 + off, 40, { color: this.dark ? COLORS.sky : this.ink, weight: 500, field: 'signature', maxWidth: 936 });
  }

  communication() {
    this.title(['BON À', 'SAVOIR.'], this.d.edition, 108);
    const off = this.offset;
    this.lines(upper(this.d.subject), 72, 510 + off, 88, 95, { display: true, weight: 700, color: this.accent, tracking: -1, field: 'subject', maxWidth: 936 }, 2);
    if (this.d.when) {
      this.rect(72, 680 + off, 936, 110, COLORS.blue);
      this.text(this.d.when, 106, 752 + off, 44, { color: COLORS.white, weight: 700, field: 'effective-date', maxWidth: 866 });
    }
    this.lines(this.d.details, 72, 900 + off, 46, 65, { field: 'details', maxWidth: 936 }, 2);
    this.text(this.d.note, 72, 1080 + off, 40, { color: COLORS.muted, field: 'note', maxWidth: 936 });
  }

  finalScore() {
    const off = this.offset;
    const photo = this.d.backgroundPhoto || this.d.photo;
    const compact = this.sponsored && !this.story;
    let namesY, scoreY, logosY;
    if (photo) {
      const photoHeight = compact ? 490 : 590;
      if (this.visual?.source === 'logo') this.rect(0, off, 1080, photoHeight, COLORS.white);
      this.image(photo, 0, off, 1080, photoHeight, 'match-photo', this.visual?.source === 'logo', 1, this.d.photoPosition);
      if (this.d.backgroundStyle !== 'plain') this.crest({ x: 400, y: 400, width: 900, opacity: .10, ...this.d.crest });
      this.lines(cleanLines(this.d.title).length ? upper(this.d.title) : ['SCORE FINAL.'], 72, photoHeight + 96 + off, 88, 92, { display: true, weight: 800, field: 'headline', maxWidth: 936 }, 1);
      this.text(this.d.edition, 74, photoHeight + 166 + off, 40, { color: this.accent, weight: 600, field: 'edition', maxWidth: 936 });
      logosY = photoHeight + 200 + off;
      namesY = photoHeight + 340 + off;
      scoreY = compact ? 1100 : 1240;
      scoreY += off;
      if (this.d.photoCaption) {
        this.rect(48, 32 + off, 984, 64, COLORS.night, .88);
        this.text(this.d.photoCaption, 72, 78 + off, 40, { color: COLORS.white, field: 'photo-caption', maxWidth: 936 });
      }
    } else {
      if (this.d.backgroundStyle !== 'plain') this.crest({ x: 400, y: -80, width: 1100, opacity: .18, ...this.d.crest });
      this.title(['SCORE FINAL.'], this.d.edition, 103);
      logosY = 475 + off;
      namesY = 675 + off;
      scoreY = 995 + off;
      this.lines(this.d.closing, 72, (compact ? 1090 : 1150) + off, 44, 60, { display: true, weight: 700, color: this.dark ? COLORS.sky : this.ink, field: 'closing', maxWidth: 936 }, compact ? 1 : 2);
    }
    if (this.d.homeLogo) this.image(this.d.homeLogo, 72, logosY, 136, 112, 'home-logo', true);
    if (this.d.awayLogo) this.image(this.d.awayLogo, 872, logosY, 136, 112, 'away-logo', true);
    this.lines(upper(this.d.home), 72, namesY, 48, 58, { display: true, weight: 700, field: 'home-name', maxWidth: 400 }, 2);
    this.lines(upper(this.d.away), 1008, namesY, 48, 58, { display: true, weight: 700, anchor: 'end', field: 'away-name', maxWidth: 400 }, 2);
    this.text(this.d.homeScore ?? '', 72, scoreY, compact && photo ? 184 : 238, { display: true, weight: 800, tracking: -6, field: 'home-score', maxWidth: 405 });
    this.text('—', 540, scoreY - 52, 98, { color: this.accent, display: true, anchor: 'middle', weight: 700, maxWidth: 120 });
    this.text(this.d.awayScore ?? '', 1008, scoreY, compact && photo ? 184 : 238, { display: true, weight: 800, tracking: -6, anchor: 'end', field: 'away-score', maxWidth: 405 });
  }

  freeHeader() {
    this.title(cleanLines(this.d.subject).length && !cleanLines(this.d.title).length ? upper(this.d.subject) : ['UCCLE EUROPE.'], this.d.edition, 94);
    let bodyStart = this.headerBottom + 116;
    if (cleanLines(this.d.title).length && cleanLines(this.d.subject).length) {
      const count = this.lines(this.d.subject, 72, bodyStart, 64, 72, { display: true, weight: 700, field: 'subject', maxWidth: 936 }, 2);
      bodyStart += count * 72 + 48;
    }
    const photo = this.d.photo || this.d.backgroundPhoto;
    if (photo) {
      const photoHeight = this.sponsored && !this.story ? 300 : 380;
      if (this.visual?.source === 'logo') this.rect(72, bodyStart - 40, 936, photoHeight, COLORS.white);
      this.image(photo, 72, bodyStart - 40, 936, photoHeight, 'free-photo', this.visual?.source === 'logo', 1, this.d.photoPosition);
      bodyStart += photoHeight + 40;
    }
    const bodyBottom = this.contentBottom - (this.d.action ? 104 : 16);
    const maxLines = Math.max(1, Math.floor((bodyBottom - bodyStart) / 60) + 1);
    return { bodyStart, maxLines };
  }

  free() {
    const { bodyStart, maxLines } = this.freeHeader();
    this.lines(this.d.body || this.d.details, 72, bodyStart, 44, 60, { field: 'body', maxWidth: 936 }, maxLines);
    if (this.d.action) this.text(this.d.action, 72, this.contentBottom - 12, 44, { weight: 700, color: this.accent, field: 'action', maxWidth: 936 });
  }

  render() {
    this.backdrop();
    if (this.visual && !this.visual.clubLogo && !['04-player-of-the-week', '07-score-final'].includes(this.key)) {
      this.text('UCCLE EUROPE', 72, 56 + this.offset, 40, { weight: 700, display: true, field: 'club-identity', maxWidth: 700 });
    }
    const method = {
      '01-resultats': 'results', '02-programme': 'schedule', '03-partenaire': 'partner',
      '04-player-of-the-week': 'player', '05-annonce-officielle': 'official',
      '06-communication': 'communication', '07-score-final': 'finalScore',
      '08-libre': 'free',
    }[this.key];
    this[method]();
    this.footer();
    this.sponsor();
    const uid = `ueb-${++documentCounter}`;
    const metadata = escapeXML(JSON.stringify({ template: this.key, format: `1080x${this.height}`, demo: this.d.demo === true, editableFields: this.fieldIDs, warnings: this.warnings }));
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${this.height}" viewBox="0 0 1080 ${this.height}" role="img" aria-labelledby="${uid}-title ${uid}-desc"><title id="${uid}-title">UEB — ${escapeXML(NAMES[this.key])}</title><desc id="${uid}-desc">${escapeXML(this.d.alt || NAMES[this.key])}</desc><metadata>${metadata}</metadata><defs><style>${fontsCSS}text{font-optical-sizing:auto;}</style></defs>${this.parts.join('\n')}</svg>`;
  }
}

export function buildPoster(templateId, data = {}, format = 'feed') {
  if (!ready) throw new Error('Le studio charge encore ses polices et ses logos.');
  if (!NAMES[templateId]) throw new Error('Ce modèle n’est pas disponible.');
  if (!['feed', 'story'].includes(format)) throw new Error('Choisissez le format publication ou story.');
  const poster = new Poster(templateId, data, format);
  validateData(poster);
  const svg = poster.render();
  return { svg, warnings: poster.warnings, width: 1080, height: poster.height };
}

function validateData(poster) {
  const d = poster.d;
  if (d.surface !== undefined && !BACKGROUNDS.includes(d.surface)) poster.warn('Choisissez une couleur de fond de la charte UEB.');
  if (d.visual) {
    if (!['auto', 'photo', 'logo', 'none'].includes(d.visual.source) || (d.visual.mode !== undefined && !['background-monochrome', 'foreground-color'].includes(d.visual.mode))) poster.warn('Choisissez un visuel et une présentation valides.');
    if (poster.visual.source === 'photo' && !poster.visual.image) poster.warn('Ajoutez une photo ou choisissez le logo du club.');
  }
  const present = value => cleanLines(value).length > 0;
  const need = (value, label) => { if (!present(value)) poster.warn(`Complétez ${label} avant l’export.`); };
  if (poster.key === '01-resultats' || poster.key === '02-programme') {
    if (!Array.isArray(d.matches) || !d.matches.length) poster.warn('Sélectionnez au moins une rencontre avant l’export.');
    for (const row of d.matches || []) {
      need(row.category, 'la catégorie de chaque rencontre');
      if (poster.key === '01-resultats') {
        need(row.home, 'le nom de l’équipe à domicile'); need(row.away, 'le nom de l’équipe visiteuse');
        if (!row.score && !(validScore(row.homeScore) && validScore(row.awayScore))) poster.warn('Chaque résultat doit contenir les deux scores vérifiés.');
        if (row.score && !/^\d{1,3}\s*[–—:-]\s*\d{1,3}$/.test(row.score.trim())) poster.warn('Un résultat contient un score incomplet ou invalide.');
      } else { need(row.opponent, 'le nom de l’adversaire'); need(row.day, 'le jour'); need(row.time, 'l’horaire'); need(row.venue, 'le lieu'); }
    }
  } else if (poster.key === '07-score-final') {
    need(d.home, 'le nom de l’équipe à domicile'); need(d.away, 'le nom de l’équipe visiteuse');
    if (!validScore(d.homeScore) || !validScore(d.awayScore)) poster.warn('Les deux scores finaux vérifiés sont nécessaires avant l’export.');
  } else if (poster.key === '04-player-of-the-week') need(d.name, 'le nom du joueur');
  else if (poster.key === '03-partenaire') { if (!d.logo) need(d.name, 'le nom du partenaire'); need(d.contribution, 'la présentation du partenaire'); }
  else if (poster.key === '08-libre') { if (!present(d.title) && !present(d.subject)) poster.warn('Ajoutez un titre ou un sujet à cette publication.'); }
  else need(d.subject, 'le sujet');
  if (d.sponsor) need(d.sponsor.name, 'le nom du partenaire qui soutient la publication');
}

const validScore = value => (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 999) || (typeof value === 'string' && /^\d{1,3}$/.test(value));

/** Split selected records or long copy without editing the caller's draft.
 * Text is wrapped at its real font size, never silently discarded. */
export function paginatePosterData(templateId, data, format = 'feed') {
  if (!ready) throw new Error('Le studio charge encore ses polices et ses logos.');
  if (!NAMES[templateId] || !['feed', 'story'].includes(format)) throw new Error('Modèle ou format indisponible.');
  if (['01-resultats', '02-programme'].includes(templateId)) {
    const rows = Array.isArray(data.matches) ? data.matches : [];
    const probe = new Poster(templateId, data, format);
    probe.title([templateId === '01-resultats' ? 'LES RÉSULTATS.' : 'CE WEEK-END.'], data.edition, templateId === '01-resultats' ? 99 : 105);
    const start = Math.max(371 + probe.offset, probe.headerBottom + 100);
    if (!rows.length) return [{ ...data, matches: [] }];
    const pages = [];
    let page = [], nextY = start;
    for (const row of rows) {
      const layout = listRowLayout(templateId, row);
      if (page.length && (page.length >= 4 || nextY + layout.end > probe.contentBottom)) { pages.push({ ...data, matches: page }); page = []; nextY = start; }
      page.push(row); nextY += layout.height;
    }
    if (page.length) pages.push({ ...data, matches: page });
    return pages;
  }
  const field = templateId === '08-libre' ? (data.body ? 'body' : 'details') : templateId === '05-annonce-officielle' ? 'body' : templateId === '06-communication' ? 'details' : templateId === '03-partenaire' ? 'contribution' : null;
  if (!field) return [{ ...data }];
  let capacity = templateId === '05-annonce-officielle' ? 4 : 2;
  let size = templateId === '03-partenaire' ? 48 : templateId === '06-communication' ? 46 : 44;
  if (templateId === '08-libre') { const probe = new Poster(templateId, data, format); capacity = probe.freeHeader().maxLines; }
  const lines = wrapLines(data[field], size, 936);
  if (!lines.length) return [{ ...data }];
  const pages = [];
  for (let index = 0; index < lines.length; index += capacity) pages.push({ ...data, [field]: lines.slice(index, index + capacity) });
  return pages;
}

function loadSVGImage(svg) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Le navigateur n’a pas pu préparer cette image pour l’export.')); };
    image.src = url;
  });
}

function paintText(context, node) {
  const content = node.textContent || '';
  const size = Number(node.getAttribute('font-size')) || 36;
  const weight = node.getAttribute('font-weight') || '400';
  const family = node.getAttribute('font-family') || 'DM Sans';
  const tracking = Number(node.getAttribute('letter-spacing')) || 0;
  const x = Number(node.getAttribute('x')) || 0;
  const y = Number(node.getAttribute('y')) || 0;
  const anchor = node.getAttribute('text-anchor') || 'start';
  context.save();
  setCanvasFont(context, size, weight, family, tracking);
  context.fillStyle = node.getAttribute('fill') || COLORS.night;
  context.textBaseline = 'alphabetic';
  context.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left';
  if ('letterSpacing' in context || tracking === 0) {
    context.fillText(content, x, y);
  } else {
    const characters = Array.from(content);
    const width = context.measureText(content).width + Math.max(0, characters.length - 1) * tracking;
    let left = x - (anchor === 'middle' ? width / 2 : anchor === 'end' ? width : 0);
    context.textAlign = 'left';
    characters.forEach(character => {
      context.fillText(character, left, y);
      left += context.measureText(character).width + tracking;
    });
  }
  context.restore();
}

/** Rasterize artwork and paint the editable text with the loaded local fonts.
 * SVG used as an <img> does not consistently load embedded fonts across browsers. */
export async function posterToPng(svg) {
  await initEngine();
  const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
  if (parsed.querySelector('parsererror')) throw new Error('Le document graphique ne peut pas être exporté.');
  const root = parsed.documentElement;
  const metadata = root.querySelector('metadata');
  if (metadata) {
    let details;
    try { details = JSON.parse(metadata.textContent); } catch { throw new Error('Les informations du document graphique sont invalides.'); }
    if (Array.isArray(details.warnings) && details.warnings.length) throw new Error('Corrigez les avertissements de composition avant l’export PNG.');
  }
  if ([...root.querySelectorAll('image')].some(node => !/^data:image\//i.test(node.getAttribute('href') || ''))) throw new Error('Toutes les images doivent être incorporées avant l’export.');
  const width = Number(root.getAttribute('width'));
  const height = Number(root.getAttribute('height'));
  if (width !== 1080 || ![1350, 1920].includes(height)) throw new Error('Dimensions d’export non prises en charge.');
  const textNodes = [...root.querySelectorAll('text')];
  textNodes.forEach(node => node.remove());
  // Remove CSS font payload from the bitmap background: text is painted separately.
  root.querySelectorAll('style').forEach(node => node.remove());
  root.removeAttribute('role');
  root.removeAttribute('aria-labelledby');
  const image = await loadSVGImage(new XMLSerializer().serializeToString(root));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Le navigateur ne dispose pas du rendu graphique nécessaire.');
  context.drawImage(image, 0, 0, width, height);
  textNodes.forEach(node => paintText(context, node));
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Le navigateur n’a pas pu créer le PNG.')), 'image/png');
  });
}
