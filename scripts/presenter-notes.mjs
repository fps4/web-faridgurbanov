#!/usr/bin/env node
// Checks the presenter notes against the decks (FS-0010). Farid writes the notes in the wiki, one
// `▶ \`step\`` block per click in each episode's `<nn>-<slug>.slides.md`; under `npm run dev` the
// presenter view reads and edits them there through the notes server (scripts/notes-server.mjs).
// Nothing is copied into the deck, so the published site carries no notes. This checks that every
// step of a deck has a block with at least one line and every block names a step.
//
//   npm run notes:check                                       # every .slides.md under the wiki's publishing/
//   npm run notes:check -- ../wiki/…/03-data/00-intro.slides.md   # one or more files or folders
//
// A .slides.md names its deck in the front matter (`deck: … /en/deck/3-0 …`). Exit 1 when a file
// names a deck without a words file, or the steps and the ▶ blocks do not match.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { parsePresenterNotes } from '../lib/decks/presenter-notes.mjs';

const DEFAULT_DIR = '../wiki/publishing';

/**
 * The mismatches between a deck's steps and the ▶ blocks, as sentences; [] when they match.
 * @param {string[]} steps
 * @param {Record<string, string[]>} notes
 */
export function notesProblems(steps, notes) {
  const problems = [];
  for (const name of steps) if (!notes[name]?.length) problems.push(`step "${name}" has no ▶ block in the presenter notes`);
  for (const name of Object.keys(notes)) if (!steps.includes(name)) problems.push(`▶ \`${name}\` is not a step of the deck`);
  return problems;
}

function slidesFiles(paths) {
  const out = [];
  const walk = (p) => {
    if (statSync(p).isDirectory()) {
      for (const name of readdirSync(p).sort()) if (name !== 'archive') walk(join(p, name));
    } else if (p.endsWith('.slides.md')) out.push(p);
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
    const words = join(root, 'content', 'decks', deck.locale, `${deck.id}.yaml`);
    if (!existsSync(words)) {
      console.log(`✗ ${deck.id}: ${relative(root, words)} does not exist (named by ${file})`);
      failed = true;
      continue;
    }
    const problems = notesProblems(Object.keys(parse(readFileSync(words, 'utf8'))?.steps ?? {}), notes);
    if (problems.length) failed = true;
    console.log(`${problems.length ? '✗' : '✓'} ${deck.id}: ${Object.keys(notes).length} ▶ blocks${problems.length ? `; ${problems.join('; ')}` : ''}`);
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
