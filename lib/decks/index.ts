import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { Deck } from '@/lib/deck';
import { layout30 } from '@/lib/decks/3-0';
import { layout31 } from '@/lib/decks/3-1';
import { composeDeck, type DeckLayout } from '@/lib/decks/compose';
import { DECK_TEXT_ROOT, deckTextFile, readDeckText } from '@/lib/decks/text';
import { locales, type Locale } from '@/lib/i18n';

// Every episode deck, by route slug (FS-0010). A deck is a layout here plus its words in
// content/decks/<locale>/<id>.yaml; an episode in lib/storyline.ts with a `deck` names one of these,
// and lib/decks.test.ts checks the lists agree. Server-only: the words are read from disk on every
// call, so under `next dev` an edit to the YAML shows on the next refresh.

export const layouts: DeckLayout[] = [layout30, layout31];

function layoutById(id: string): DeckLayout | undefined {
  return layouts.find((l) => l.id === id);
}

function build(layout: DeckLayout, locale: Locale): Deck | undefined {
  const words = readDeckText(locale, layout.id);
  return words ? composeDeck(layout, words, locale, deckTextFile(locale, layout.id)) : undefined;
}

/** The English deck for an episode: the one every locale falls back to. */
export function deckById(id: string): Deck | undefined {
  const layout = layoutById(id);
  return layout ? build(layout, 'en') : undefined;
}

/**
 * The deck to record in a locale: that locale's own words when it has a file, otherwise the English
 * deck (the same fallback the content pages use, ADR-0002). `isFallback` tells the player to say so.
 */
export function deckFor(locale: Locale, id: string): { deck: Deck; isFallback: boolean } | undefined {
  const layout = layoutById(id);
  if (!layout) return undefined;
  const own = build(layout, locale);
  if (own) return { deck: own, isFallback: false };
  const en = build(layout, 'en');
  return en ? { deck: en, isFallback: locale !== 'en' } : undefined;
}

/** Every deck that has words, in every locale. */
export function allDecks(): Deck[] {
  return layouts.flatMap((l) => locales.map((loc) => build(l, loc)).filter((d): d is Deck => d !== undefined));
}

/** The YAML files under content/decks/, as { locale, id }, so a test can flag one with no layout. */
export function deckTextFiles(): { locale: string; id: string }[] {
  return readdirSync(DECK_TEXT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(path.join(DECK_TEXT_ROOT, d.name))
        .filter((f) => f.endsWith('.yaml'))
        .map((f) => ({ locale: d.name, id: f.replace(/\.yaml$/, '') })),
    );
}
