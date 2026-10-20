import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deckProblems, isInline } from '@/lib/deck';
import { composeDeck, type DeckLayout } from '@/lib/decks/compose';
import { deckTextFile, readDeckText } from '@/lib/decks/text';
import { pickRows, tableUnder } from '@/lib/kit-tables';
import { episodeByNumber } from '@/lib/storyline';

// TEMPORARY, for building the episode decks: checks one deck before it is registered in
// lib/decks/index.ts. Run with `DECK=2-1 npx vitest run lib/decks/check-one.test.ts`.
const id = process.env.DECK;

describe.runIf(id)(`deck ${id}`, () => {
  it('composes, follows the format, shows real kit rows, keeps times in order', async () => {
    const mod = (await import(`./${id}.ts`)) as Record<string, unknown>;
    const layout = Object.values(mod).find((v) => (v as DeckLayout)?.id === id) as DeckLayout | undefined;
    expect(layout, `lib/decks/${id}.ts exports no layout with id '${id}'`).toBeDefined();
    const words = readDeckText('en', id!);
    expect(words, `${deckTextFile('en', id!)} is missing`).toBeDefined();
    const deck = composeDeck(layout!, words!, 'en', deckTextFile('en', id!));
    expect(deckProblems(deck)).toEqual([]);
    for (const card of deck.cards) {
      if (isInline(card)) continue;
      const md = readFileSync(join(process.cwd(), 'content', 'kit', card.source), 'utf8');
      expect(pickRows(tableUnder(md, card.heading), card.rows), `${card.key}: rows under "${card.heading}"`).toHaveLength(card.rows.length);
    }
    const seconds = deck.steps.map((s) => s.at.split(':').map(Number)).map(([m, s]) => m * 60 + s);
    expect([...seconds].sort((a, b) => a - b)).toEqual(seconds);
    const ep = episodeByNumber(deck.episode);
    expect(ep?.deck, `lib/episodes: episode ${deck.episode} needs deck: '${id}'`).toBe(id);
  });
});
