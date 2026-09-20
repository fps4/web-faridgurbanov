#!/usr/bin/env node
// Voice check for the site copy (AGENTS.md → "Voice"). Counts the patterns that make prose read
// as generated and prints one row per file against the budgets. Report-only by default; pass
// --strict to exit 1 when any file is over budget (for CI, or before opening a PR).
//
//   node scripts/voice-check.mjs            # every copy surface
//   node scripts/voice-check.mjs --strict   # same, non-zero exit on a miss
//   node scripts/voice-check.mjs content/en/work/cloud-gateway.md  # one or more files
//
// What it measures, per file, on body text only (frontmatter title, headings, code blocks and
// code comments are excluded — headings and labels may keep their dashes):
//   dash/1k   em-dashes per 1,000 words          budget ≤ 3.5  (about one per 300 words)
//   anti/1k   "X, not Y" / "rather than" / "instead of" (NL: ", geen" / "in plaats van" / ", niet")
//             per 1,000 words                    budget ≤ 5   (the old corpus ran at ~8)
//   sincere   honest·genuine·deliberate·on purpose·actually (NL: oprecht·daadwerkelijk·
//             werkelijk·eerlijk gezegd)                          budget 0
//   template  the case-study mould phrases ("Two decisions made that stick", "The trade-off to
//             know upfront")                                     budget 0
//   calque    Dutch calques of the English idiom (naad, ruggengraat, gebaande/verharde weg,
//             wave voor wave, dragend)                           budget 0
// A number over budget is not automatically wrong — it needs a reason in the PR.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUDGET = { dashPer1k: 3.5, antiPer1k: 5, sincere: 0, template: 0, calque: 0 };

const EN = {
  anti: [/, not /g, /\brather than\b/g, /\binstead of\b/g],
  sincere: /\b(honest\w*|genuine\w*|deliberate\w*|on purpose|actually)\b/gi,
  template: /(Two decisions (made that stick|carry it)|The trade-off to know (upfront|in advance))/g,
  calque: null,
};
const NL = {
  anti: [/, geen /g, /\bin plaats van\b/g, /, niet /g],
  sincere: /\b(oprecht|daadwerkelijk|werkelijk|eerlijk gezegd)\b/gi,
  template: /(Twee beslissingen (maakten dat|dragen)|De afweging om vooraf te kennen)/g,
  calque: /\b(naad\w*|ruggengraat|gebaande weg|verharde[- ]weg|wave voor wave|dragend\w*)\b/gi,
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function bodyOf(path, text) {
  if (path.endsWith('.ts')) {
    // Strings only: drop comment lines and property keys; good enough for dictionaries/site.
    return text
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .map((l) => l.replace(/^\s*[\w$]+:\s*/, ''))
      .join('\n');
  }
  return text
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .filter((l) => !/^(title:|#{1,6} )/.test(l))
    .join('\n');
}

function count(re, s) {
  return (s.match(re) ?? []).length;
}

function measure(path) {
  const text = readFileSync(path, 'utf8');
  const body = bodyOf(path, text);
  const words = body.split(/\s+/).filter(Boolean).length;
  // A .ts file carries both locales; score it with the union of both rule sets.
  const nl = path.includes('/nl/') || path.endsWith('.ts');
  const en = !path.includes('/nl/');
  const rules = [en && EN, nl && NL].filter(Boolean);
  const dashes = count(/—/g, body);
  const anti = rules.reduce((n, r) => n + r.anti.reduce((m, re) => m + count(re, body), 0), 0);
  const sincere = rules.reduce((n, r) => n + count(r.sincere, body), 0);
  const template = rules.reduce((n, r) => n + count(r.template, body), 0);
  const calque = rules.reduce((n, r) => n + (r.calque ? count(r.calque, body) : 0), 0);
  const per1k = (n) => (words ? (n * 1000) / words : 0);
  const row = { path, words, dashes, dashPer1k: per1k(dashes), anti, antiPer1k: per1k(anti), sincere, template, calque };
  row.over = [
    row.dashPer1k > BUDGET.dashPer1k && 'dash',
    row.antiPer1k > BUDGET.antiPer1k && 'anti',
    row.sincere > BUDGET.sincere && 'sincere',
    row.template > BUDGET.template && 'template',
    row.calque > BUDGET.calque && 'calque',
  ].filter(Boolean);
  return row;
}

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const explicit = args.filter((a) => !a.startsWith('--'));
const files = explicit.length
  ? explicit
  : [...walk('content'), 'lib/dictionaries.ts', 'lib/site.ts'].filter(
      // content/references/ holds other people's words, quoted verbatim (FS-0009); the voice
      // rules are for the owner's prose, so those files are not measured.
      (f) => !f.includes('/mcp-enterprise-architecture') && !f.includes('content/references/'),
    );

const rows = files.map(measure);
const w = Math.max(...rows.map((r) => relative('.', r.path).length));
console.log(`${'file'.padEnd(w)}  words  dash/1k  anti/1k  sincere  template  calque`);
for (const r of rows) {
  const flag = r.over.length ? ` ! ${r.over.join(',')}` : '';
  console.log(
    `${relative('.', r.path).padEnd(w)}  ${String(r.words).padStart(5)}  ${r.dashPer1k.toFixed(1).padStart(7)}  ${r.antiPer1k.toFixed(1).padStart(7)}  ${String(r.sincere).padStart(7)}  ${String(r.template).padStart(8)}  ${String(r.calque).padStart(6)}${flag}`,
  );
}
const misses = rows.filter((r) => r.over.length);
console.log(`\n${rows.length} files, ${misses.length} over budget (dash ≤ ${BUDGET.dashPer1k}/1k, anti ≤ ${BUDGET.antiPer1k}/1k, sincere/template/calque = 0).`);
if (strict && misses.length) process.exit(1);
