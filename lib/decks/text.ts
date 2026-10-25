import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { DeckTextError, deckTextProblems, type DeckText } from '@/lib/decks/compose';
import type { Locale } from '@/lib/i18n';

// Reads a deck's words from content/decks/<locale>/<id>.yaml (FS-0010). Server-only (node:fs):
// import it from server components and tests, never from a 'use client' module. Read on every call,
// so under `next dev` a refresh shows an edit to the file.

export const DECK_TEXT_ROOT = path.join(process.cwd(), 'content', 'decks');

/** The file a deck's words live in, relative to the repository (for error messages). */
export function deckTextFile(locale: Locale, id: string): string {
  return path.join('content', 'decks', locale, `${id}.yaml`);
}

/** The deck's words in a locale, or undefined when that locale has no file. Throws on a malformed file. */
export function readDeckText(locale: Locale, id: string): DeckText | undefined {
  const full = path.join(DECK_TEXT_ROOT, locale, `${id}.yaml`);
  if (!existsSync(full)) return undefined;
  const file = deckTextFile(locale, id);
  let doc: unknown;
  try {
    doc = parse(readFileSync(full, 'utf8'));
  } catch (err) {
    throw new DeckTextError(file, [`not valid YAML: ${(err as Error).message}`]);
  }
  const problems = deckTextProblems(doc);
  if (problems.length) throw new DeckTextError(file, problems);
  const d = doc as DeckText;
  return { title: d.title, steps: d.steps, text: d.text, cards: d.cards ?? {} };
}
