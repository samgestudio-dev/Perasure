#!/usr/bin/env node
// PeraSure tokens v2 codemod — rewrites var(--old) → var(--new) from rename-map.json.
// Usage: node migrate-tokens.mjs <src-dir-or-file> [--write]   (dry run without --write: prints what would change)
// Removed tokens with no replacement are left alone and listed. Review the diff before committing.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const full = JSON.parse(fs.readFileSync(path.join(here, 'rename-map.json'), 'utf8'));
const map = full.tokens; const classes = full.classes || {};
const [dir, flag] = process.argv.slice(2); const write = flag === '--write';
if (!dir) { console.error('usage: node migrate-tokens.mjs <src-dir> [--write]'); process.exit(1); }
const exts = new Set(['.css', '.scss', '.ts', '.tsx', '.js', '.jsx', '.html']);
const pairs = Object.entries(map).filter(([o, r]) => r.new && r.new !== o).sort((a, b) => b[0].length - a[0].length);
const re = new RegExp('--(' + pairs.map(([o]) => o.replace(/[-]/g, '\\-')).join('|') + ')(?![a-z0-9-])', 'g');
const lookup = Object.fromEntries(pairs);
const cpairs = Object.keys(classes).sort((a, b) => b.length - a.length);
const cre = cpairs.length ? new RegExp('(?<![a-z0-9-])(' + cpairs.map(c => c.replace(/[-]/g, '\\-')).join('|') + ')(?![a-z0-9-])', 'g') : null;
let files = 0, hits = 0; const orphans = new Map();
function walk(p) {
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const f = path.join(p, e.name);
    if (e.isDirectory()) walk(f); else if (exts.has(path.extname(f)) && !/figma-tokens\.css$|legacy-aliases\.css$|tokens\.css$/.test(f)) fix(f);
  }
}
function fix(f) {
  const s = fs.readFileSync(f, 'utf8'); let n = 0;
  let out = s.replace(re, (m, old) => { n++; return '--' + lookup[old].new; });
  if (cre) out = out.replace(cre, (m, old) => { n++; return classes[old]; });
  for (const [o, r] of Object.entries(map)) if (!r.new && s.includes('--' + o)) orphans.set(o, (orphans.get(o) || 0) + 1);
  if (n) { files++; hits += n; console.log(`${write ? 'fixed' : 'would fix'} ${n}\t${f}`); if (write) fs.writeFileSync(f, out); }
}
if (fs.statSync(dir).isDirectory()) walk(dir); else fix(dir);
console.log(`\n${hits} replacements in ${files} files${write ? '' : ' (dry run; add --write)'}`);
if (orphans.size) console.log('removed tokens with no replacement still used (check by hand):', Object.fromEntries(orphans));
