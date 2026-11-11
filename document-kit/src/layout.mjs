import React from 'react';
import { Document, Page, View, Text, Image, Link, Font } from '@react-pdf/renderer';
import { RENDERER } from './contract.mjs';
const h = React.createElement;
export function createDocument(input, identity, photos = {}) {
  const c = identity.tokens.colors;
  const family = `UEB-${identity.manifest.id}-${identity.manifest.version}`;
  Font.register({ family: `${family}-body`, fonts: [{ src: identity.assets.bodyRegular, fontWeight: 400 }, { src: identity.assets.bodyBold, fontWeight: 700 }] });
  Font.register({ family: `${family}-display`, fonts: [{ src: identity.assets.displayBold, fontWeight: 700 }, { src: identity.assets.displayExtraBold, fontWeight: 800 }] });
  Font.registerHyphenationCallback(word => [word]);
  const body = { fontFamily: `${family}-body`, fontSize: 11, lineHeight: 1.5, color: c.night };
  const display = { fontFamily: `${family}-display`, fontWeight: 700 };
  const tx = (text, style = {}, props = {}) => h(Text, { ...props, style: { ...body, ...style } }, text);
  const box = (style, ...children) => h(View, { style }, ...children);
  const en = input.language === 'en';
  const label = input.demo ? (en ? 'LAYOUT SAMPLE · FOR REVIEW' : 'MODÈLE · CONTENUS À VALIDER') : input.status === 'draft' ? (en ? 'DRAFT · FOR REVIEW' : 'BROUILLON · POUR RELECTURE') : '';
  const footer = dark => h(View, { fixed: true, style: { position: 'absolute', top: 795, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: .5, borderTopColor: dark ? c.blue : c.line, paddingTop: 9 } },
    tx(label || 'UCCLE EUROPE BASKETBALL', { fontSize: 8.5, color: dark ? c.sky : c.muted }),
    h(Text, { style: { ...body, fontSize: 8.5, color: dark ? c.sky : c.muted }, render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` }));
  const header = kicker => h(View, { fixed: true, style: { position: 'absolute', top: 28, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between' } },
    tx('UCCLE EUROPE', { ...display, fontSize: 11, letterSpacing: .3 }), tx(kicker, { fontSize: 9, color: c.muted }));
  const paragraphs = page => (page.paragraphs || []).map((p, index) => tx(p, { marginBottom: 12 }, { key: `p-${index}`, orphans: 3, widows: 3 }));
  const heading = page => box({ marginBottom: 24 }, tx(page.kicker.toLocaleUpperCase(input.language), { fontSize: 10, color: c.blue, fontWeight: 700, letterSpacing: 1.4, marginBottom: 14 }), tx(page.title, { ...display, fontSize: 34, lineHeight: 1.03, marginBottom: 15 }), page.lead && tx(page.lead, { fontSize: 14, lineHeight: 1.45, color: c.blue }));
  const cards = (page, kind) => (page.cards || []).map((card, i) => h(View, { key: i, wrap: false, style: { marginBottom: kind === 'offers' ? 16 : 20, padding: kind === 'offers' ? 14 : 0, paddingLeft: kind === 'offers' ? 14 : 17, borderLeftWidth: kind === 'offers' ? 0 : 3, borderLeftColor: i % 2 ? c.gold : c.blue, backgroundColor: kind === 'offers' ? (i % 2 ? c.sky : c.paper) : undefined } },
    tx(card.label || `${String(i + 1).padStart(2, '0')}`, { fontSize: 9, fontWeight: 700, color: c.blue, marginBottom: 5 }),
    tx(card.title, { ...display, fontSize: kind === 'offers' ? 18 : 21, lineHeight: 1.2, marginBottom: 7 }),
    tx(card.text, { marginBottom: card.items?.length ? 8 : 0 }),
    ...(card.items || []).map((item, j) => tx(`— ${item}`, { fontSize: 11, marginBottom: 3 }, { key: j }))));
  const pages = input.pages.map((page, index) => {
    const cover = page.kind === 'cover', contact = page.kind === 'contact';
    const dark = cover || contact;
    if (cover) return h(Page, { key: index, size: 'A4', style: { ...body, height: 841.89, backgroundColor: c.night, padding: 44, paddingBottom: 65 } },
      box({ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
        box({ marginTop: 6 }, tx('UCCLE EUROPE', { ...display, fontSize: 17, color: c.white }), tx('BASKETBALL', { fontSize: 10, letterSpacing: 2, color: c.sky, marginTop: 3 })),
        h(Image, { src: identity.assets.logo, style: { width: 58, height: 65.5, objectFit: 'contain' } })),
      box({ height: 3, width: 70, backgroundColor: c.gold, marginTop: 48, marginBottom: 20 }),
      tx(page.kicker.toLocaleUpperCase(input.language), { fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: c.sky, marginBottom: 24 }),
      tx(page.title, { ...display, fontWeight: 800, fontSize: 64, lineHeight: 1, color: c.white, maxWidth: 500, marginBottom: 28 }),
      page.lead && tx(page.lead, { fontSize: 16, lineHeight: 1.45, color: c.sky, maxWidth: 400 }),
      h(View, { style: { position: 'absolute', bottom: 105, left: 44, right: 44 } }, tx(page.note || 'LE JEU. LE LIEN. L’AVENIR.', { ...display, fontSize: 17, color: c.gold })), footer(true));
    if (contact) return h(Page, { key: index, size: 'A4', style: { ...body, paddingTop: 105, paddingHorizontal: 44, paddingBottom: 75, backgroundColor: c.night } },
      h(Image, { src: identity.assets.logo, style: { width: 62, height: 70, objectFit: 'contain', marginBottom: 40 } }),
      tx(page.kicker.toLocaleUpperCase(input.language), { fontSize: 11, letterSpacing: 1.3, color: c.sky, marginBottom: 20 }),
      tx(page.title, { ...display, fontSize: 47, lineHeight: 1.06, color: c.white, marginBottom: 28 }),
      page.lead && tx(page.lead, { fontSize: 16, color: c.sky, marginBottom: 25 }),
      ...(page.paragraphs || []).map((p, i) => tx(p, { color: c.white, marginBottom: 14 }, { key: i })),
      ...(page.links || []).map((link, i) => h(Link, { key: i, src: link.url, style: { ...body, color: c.gold, fontWeight: 700, marginTop: 12, textDecoration: 'none' } }, link.label)),
      page.note && tx(page.note, { color: c.sky, fontSize: 10, marginTop: 35 }), footer(true));
    return h(Page, { key: index, size: 'A4', style: { ...body, backgroundColor: c.white, paddingTop: 88, paddingHorizontal: 44, paddingBottom: 78 } },
      header(page.kicker), heading(page),
      page.photo && h(View, { wrap: false, style: { marginBottom: 22 } }, h(Image, { src: photos[index], style: { width: '100%', height: 255, objectFit: 'contain' } }), tx(page.photo.caption, { fontSize: 9, color: c.muted, marginTop: 6 })),
      ...paragraphs(page), ...cards(page, page.kind),
      page.quote && box({ backgroundColor: c.night, padding: 22, marginTop: 15 }, tx(page.quote, { ...display, fontSize: 24, lineHeight: 1.2, color: c.white })),
      page.note && tx(page.note, { fontSize: 10, color: c.muted, marginTop: 13 }), footer(dark));
  });
  return h(Document, { title: input.title, author: 'Uccle Europe Basketball', subject: `${input.identity.id}@${input.identity.version} | ${input.template.id}@${input.template.version}`, keywords: `UEB; identity=${input.identity.id}@${input.identity.version}; template=${input.template.id}@${input.template.version}; renderer=${RENDERER_VERSION}`, creator: `UEB Documents ${RENDERER_VERSION}`, producer: 'UEB · @react-pdf/renderer 4.9.0', language: input.language, creationDate: new Date(input.createdAt), modificationDate: new Date(input.createdAt), pdfVersion: '1.7' }, ...pages);
}
const RENDERER_VERSION = RENDERER.version;
