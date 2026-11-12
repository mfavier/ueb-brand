import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
export function changedPublishedFiles(before, after) {
  const frozen = new Set(before.map(name => name.split('/').slice(0, 4).join('/')));
  return after.filter(({ name, status }) => frozen.has(name.split('/').slice(0, 4).join('/')) && status !== 'unchanged');
}
export function changedRecipes(before, after) {
  return before.filter(old => !after.some(next => old.id === next.id && old.version === next.version && isDeepStrictEqual(old, next)));
}
export function assertVersionBump(before, after, changed, label) {
  if (changed && before === after) throw new Error(`${label}_VERSION_BUMP_REQUIRED`);
}
if (process.argv[1]?.endsWith('guard-identity.mjs') && process.argv.includes('--base')) {
  const base = process.argv[process.argv.indexOf('--base') + 1];
  if (!base) throw new Error('BASE_REF_REQUIRED');
  const files = execFileSync('git', ['ls-tree', '-r', '--name-only', base, '--', 'identity/releases'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const diff = execFileSync('git', ['diff', '--name-status', '--no-renames', `${base}...HEAD`, '--', 'identity/releases'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean).map(line => { const [status, name] = line.split('\t'); return { status, name }; });
  const changed = changedPublishedFiles(files, diff);
  if (changed.length) { console.error('Published identity releases are immutable:', changed); process.exit(1); }
  const at = (ref, file) => { try { return JSON.parse(execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] })); } catch { return null; } };
  const oldTemplates = at(base, 'document-kit/templates/registry.json');
  if (oldTemplates && changedRecipes(oldTemplates.templates, at('HEAD', 'document-kit/templates/registry.json').templates).length) throw new Error('TEMPLATE_VERSION_IMMUTABLE');
  const names = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' }).trim().split('\n');
  const oldEngine = at(base, 'document-kit/package.json');
  if (oldEngine) assertVersionBump(oldEngine.version, at('HEAD', 'document-kit/package.json').version, names.some(name => /^document-kit\/(src|schemas|scripts)\//.test(name)), 'RENDERER');
  const oldPlugin = at(base, 'plugins/ueb-documents/plugin.json');
  if (oldPlugin) assertVersionBump(oldPlugin.version, at('HEAD', 'plugins/ueb-documents/plugin.json').version, names.some(name => /^(identity\/|document-kit\/|plugins\/ueb-documents\/|scripts\/package_documents\.py)/.test(name)), 'PLUGIN');
  console.log('Published identity releases unchanged.');
}
