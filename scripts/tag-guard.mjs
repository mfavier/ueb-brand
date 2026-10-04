// A release tag is publishable only if it is what CI verified: the tag names
// the package version, and its commit is on main (so it went through a PR).
// Pure function, tested in test/tag-guard.test.mjs; the CLI is the workflow's.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Returns what it refuses (empty = OK). */
export const tagProblems = ({ tag, pkgVersion, onMain }) => {
  const problems = [];
  if (!/^v\d+\.\d+\.\d+$/.test(tag)) problems.push(`tag "${tag}" is not vMAJOR.MINOR.PATCH`);
  else if (tag !== `v${pkgVersion}`) problems.push(`tag ${tag} but package.json says ${pkgVersion}`);
  if (!onMain) problems.push(`tag ${tag} is not on main: it did not go through a PR`);
  return problems;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tag = process.argv[2];
  const sha = execFileSync('git', ['rev-list', '-n', '1', tag], { encoding: 'utf8' }).trim();
  let onMain = true;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', sha, 'origin/main']);
  } catch {
    onMain = false;
  }
  const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
  const problems = tagProblems({ tag, pkgVersion: version, onMain });
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ ${tag} = package.json ${version}, commit ${sha.slice(0, 7)} on main`);
}
