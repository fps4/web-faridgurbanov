#!/usr/bin/env node
// Presenter notes for the episode decks (FS-0010). Farid writes them in the wiki, one `▶ \`step\``
// block per click in each episode's `<nn>-<slug>.slides.md` (section "## Presenter notes"); this
// copies them into the deck's words file as `notes` under each step, which the presenter view shows.
// The wiki stays the place to edit them: run this again after a change.
//
//   npm run notes                                   # every .slides.md under the default folder
//   npm run notes -- ../wiki/…/03-data/00-intro.slides.md   # one or more files or folders
//
// The default folder is the sibling wiki checkout: ../wiki/publishing/ai-product-design/episodes.
// A .slides.md names its deck in the front matter (`deck: … /en/deck/3-0 …`). Exit 1 when a file
// names no deck, the deck has no words file, or the steps and the ▶ blocks do not match.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const DEFAULT_DIR = '../wiki/publishing/ai-product-design/episodes';

/**
 * The presenter notes of one .slides.md: the deck it names and, per step, its lines. A line is one
 * `- ` bullet; indented lines continue the bullet above. Section labels (**Intro**), rules and blank
 * lines between blocks are left out.
 */
export function parsePresenterNotes(markdown) {
  const deckMatch = markdown.match(/^deck:.*?\/(en|nl)\/deck\/([\w-]+)/m);
  const deck = deckMatch ? { locale: deckMatch[1], id: deckMatch[2] } : undefined;
  const section = markdown.split(/^## Presenter notes[ \t]*$/m)[1]?.split(/^## /m)[0] ?? '';
  const notes = {};
  let lines = null;
  for (const line of section.split('\n')) {
    const step = line.match(/^▶ `([\w-]+)`\s*$/);
    if (step) {
      lines = notes[step[1]] = [];
      continue;
    }
    if (!lines) continue;
    if (line.startsWith('- ')) lines.push(line.slice(2).trim());
    else if (/^\s{2,}\S/.test(line) && lines.length) lines[lines.length - 1] += ` ${line.trim()}`;
  }
  return { deck, notes };
}

/**
 * The words file with each step's `notes` replaced by the given ones, comments and quoting kept.
 * Returns the new text and the mismatches (a step without a block, a block without a step).
 */
export function applyNotes(yamlText, notes) {
  const doc = parseDocument(yamlText);
  const steps = doc.get('steps');
  const problems = [];
  const names = steps ? steps.items.map((pair) => String(pair.key.value ?? pair.key)) : [];
  for (const name of names) {
    const step = steps.get(name);
    const lines = notes[name];
    if (!lines?.length) {
      problems.push(`step "${name}" has no ▶ block in the presenter notes`);
      step.delete('notes');
      continue;
    }
    step.set('notes', doc.createNode(lines));
  }
  for (const name of Object.keys(notes)) if (!names.includes(name)) problems.push(`▶ \`${name}\` is not a step of the deck`);
  return { text: doc.toString({ lineWidth: 0, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN' }), problems };
}

function slidesFiles(paths) {
  const out = [];
  const walk = (p) => {
    if (statSync(p).isDirectory()) for (const name of readdirSync(p).sort()) walk(join(p, name));
    else if (p.endsWith('.slides.md')) out.push(p);
  };
  for (const p of paths) walk(p);
  return out;
}

function main(args) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const paths = args.length ? args : [resolve(root, DEFAULT_DIR)];
  for (const p of paths) if (!existsSync(p)) throw new Error(`${p} does not exist`);
  let failed = false;
  for (const file of slidesFiles(paths)) {
    const { deck, notes } = parsePresenterNotes(readFileSync(file, 'utf8'));
    if (!deck) continue; // a .slides.md without a deck yet
    const target = join(root, 'content', 'decks', deck.locale, `${deck.id}.yaml`);
    const where = relative(root, target);
    if (!existsSync(target)) {
      console.log(`✗ ${deck.id}: ${where} does not exist (named by ${file})`);
      failed = true;
      continue;
    }
    const before = readFileSync(target, 'utf8');
    const { text, problems } = applyNotes(before, notes);
    if (problems.length) {
      failed = true;
      console.log(`✗ ${deck.id}: ${problems.join('; ')}`);
    }
    if (text !== before) writeFileSync(target, text);
    console.log(`${text !== before ? '✎' : '·'} ${deck.id}: ${Object.keys(notes).length} steps → ${where}${text !== before ? '' : ' (unchanged)'}`);
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
