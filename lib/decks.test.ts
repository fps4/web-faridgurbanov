import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAMERA, bounds, deckProblems, diagramStep, highlightAt, overlaps, visibleAt, wrapText, type Deck } from '@/lib/deck';
import { allDecks, deckById } from '@/lib/decks';
import { pickRows, tableUnder } from '@/lib/kit-tables';
import { decks as storylineDecks } from '@/lib/storyline';

// The deck format's rules (FS-0010): every click changes something, nothing sits under the
// camera, and an artifact slide shows rows that exist in the kit snapshot (content/kit/), so a
// slide cannot drift from the download it points to.

const kitFile = (path: string) => readFileSync(join(process.cwd(), 'content', 'kit', path), 'utf8');

describe.each(allDecks.map((d) => [d.id, d] as const))('deck %s', (_id, deck) => {
  it('follows the format', () => {
    expect(deckProblems(deck)).toEqual([]);
  });

  it('shows only kit rows that exist in the snapshot', () => {
    for (const card of deck.cards) {
      const rows = pickRows(tableUnder(kitFile(card.source), card.heading), card.rows);
      expect(rows).toHaveLength(card.rows.length);
    }
  });

  it('keeps its step times in order', () => {
    const seconds = deck.steps.map((s) => {
      const [m, sec] = s.at.split(':').map(Number);
      return m * 60 + sec;
    });
    expect([...seconds].sort((a, b) => a - b)).toEqual(seconds);
  });
});

describe('the storyline and the decks agree', () => {
  it('every episode with a deck names one that exists', () => {
    for (const { episode } of storylineDecks()) expect(deckById(episode.deck)?.episode).toBe(episode.number);
  });
});

describe('deck rules', () => {
  const tiny = (over: Partial<Deck> = {}): Deck => ({
    id: 'x',
    episode: '0.0',
    title: 'x',
    steps: [{ at: '0:00', cue: 'a' }, { at: '0:10', cue: 'b' }],
    cards: [],
    elements: [{ id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 10, h: 10 } }],
    ...over,
  });

  it('finds the finished diagram before the first card', () => {
    const deck = tiny({
      steps: [{ at: '0:00', cue: 'a' }, { at: '0:10', cue: 'b' }, { at: '0:20', cue: 'c' }],
      elements: [
        { id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 1, h: 1 } },
        { id: 'k', in: 2, shape: { kind: 'card', card: 'c', x: 0, y: 0, w: 1, h: 1 } },
      ],
    });
    expect(diagramStep(deck)).toBe(1);
    expect(diagramStep(tiny())).toBe(1);
  });

  it('flags a step that changes nothing', () => {
    expect(deckProblems(tiny())).toEqual(['step 1 (0:10) changes nothing on screen']);
  });

  it('flags an element under the camera', () => {
    const deck = tiny({
      elements: [
        { id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 10, h: 10 } },
        { id: 'b', in: 1, shape: { kind: 'box', x: CAMERA.x + 10, y: CAMERA.y + 10, w: 50, h: 50 } },
      ],
    });
    expect(deckProblems(deck)).toEqual(['"b" overlaps the camera corner']);
  });

  it('computes visibility and highlights by step', () => {
    const el = { id: 'a', in: 1, out: 3, shape: { kind: 'box' as const, x: 0, y: 0, w: 1, h: 1 } };
    expect([0, 1, 2, 3].map((s) => visibleAt(el, s))).toEqual([false, true, true, false]);
    const card = { kind: 'card' as const, card: 'c', x: 0, y: 0, w: 1, h: 1, highlight: { 2: [0], 4: [1, 2] } };
    expect([1, 2, 3, 5].map((s) => highlightAt(card, s))).toEqual([[], [0], [0], [1, 2]]);
  });

  it('wraps text on spaces and sizes it', () => {
    expect(wrapText('one two three', 20, 100)).toEqual(['one two', 'three']);
    // The handwriting face is narrower than the sans: 0.42 vs 0.52 of the size per glyph.
    const box = bounds({ kind: 'text', x: 100, y: 100, text: 'abcd', size: 25, anchor: 'middle', font: 'sans' });
    expect(box).toEqual({ x: 74, y: 75, w: 52, h: 30 });
    expect(bounds({ kind: 'text', x: 0, y: 100, text: 'abcde', size: 20 }).w).toBeCloseTo(42);
    expect(overlaps(box, { x: 0, y: 0, w: 90, h: 90 })).toBe(true);
  });
});
