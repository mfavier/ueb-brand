import Ajv from 'ajv';
import schema from '../schemas/document.schema.json' with { type: 'json' };
import templates from '../templates/registry.json' with { type: 'json' };
export const RENDERER = Object.freeze({ id: 'ueb-documents', version: '0.1.0' });
const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
export function parseDocument(value) {
  if (!validate(value)) throw new Error(`DOCUMENT_INVALID: ${JSON.stringify(validate.errors)}`);
  if (!Number.isFinite(Date.parse(value.createdAt)) || new Date(value.createdAt).toISOString().replace('.000Z', 'Z') !== value.createdAt) throw new Error('DOCUMENT_DATE_INVALID');
  if (value.renderer.id !== RENDERER.id || value.renderer.version !== RENDERER.version) throw new Error('RENDERER_VERSION_UNAVAILABLE');
  const template = templates.templates.find(t => t.id === value.template.id && t.version === value.template.version);
  if (!template) throw new Error('TEMPLATE_VERSION_UNAVAILABLE');
  if (JSON.stringify(value.pages.map(page => page.kind)) !== JSON.stringify(template.pageKinds)) throw new Error('TEMPLATE_PAGE_SEQUENCE_INVALID');
  if (value.status === 'ready' && (value.demo || !value.reviewed || value.missing.length || !value.sources.some(source => source.kind !== 'example'))) throw new Error('DOCUMENT_REVIEW_REQUIRED');
  if (value.status === 'ready' && /\[(?:À |A |NOM|MONTANT|CONTACT|SAISON|EMAIL|TÉLÉPHONE)/iu.test(JSON.stringify(value.pages))) throw new Error('DOCUMENT_PLACEHOLDERS_REMAIN');
  return structuredClone(value);
}
