import { describe, expect, it } from 'vitest';
import { CAMERA, bounds, deckProblems, diagramStep, highlightAt, overlaps, visibleAt, wrapText, type Deck } from '@/lib/deck';
import { allDecks, deckById, deckFor, deckTextFiles, layouts } from '@/lib/decks';
import { composeDeck, deckTextProblems, DeckTextError, type DeckLayout, type DeckText } from '@/lib/decks/compose';
import { decks as storylineDecks } from '@/lib/storyline';
import { applyNotes, parsePresenterNotes } from '@/scripts/presenter-notes.mjs';

// The deck format's rules (FS-0010): every click changes something, nothing sits under the
// camera, and no text sits on other text.

describe.each(allDecks().map((d) => [d.id, d] as const))('deck %s', (_id, deck) => {
  it('follows the format', () => {
    expect(deckProblems(deck)).toEqual([]);
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
  it('every words file under content/decks/ has a layout', () => {
    for (const { id } of deckTextFiles()) expect(layouts.map((l) => l.id)).toContain(id);
  });

  it('every episode with a deck names one that exists', () => {
    for (const { episode } of storylineDecks()) expect(deckById(episode.deck)?.episode).toBe(episode.number);
  });

  it('falls back to the English deck in a locale without its own', () => {
    expect(deckFor('nl', '3-1')).toEqual({ deck: deckById('3-1'), isFallback: true });
    expect(deckFor('en', '3-1')?.isFallback).toBe(false);
    expect(deckFor('en', 'nope')).toBeUndefined();
  });
});

describe('deck rules', () => {
  const tiny = (over: Partial<Deck> = {}): Deck => ({
    id: 'x',
    locale: 'en',
    episode: '0.0',
    title: 'x',
    steps: [{ at: '0:00', notes: ['a'] }, { at: '0:10', notes: ['b'] }],
    cards: [],
    elements: [{ id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 10, h: 10 } }],
    ...over,
  });

  it('finds the finished diagram before the first card', () => {
    const deck = tiny({
      steps: [{ at: '0:00', notes: ['a'] }, { at: '0:10', notes: ['b'] }, { at: '0:20', notes: ['c'] }],
      elements: [
        { id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 1, h: 1 } },
        { id: 'k', in: 2, shape: { kind: 'card', card: 'c', x: 0, y: 0, w: 1, h: 1 } },
      ],
    });
    expect(diagramStep(deck)).toBe(1);
    expect(diagramStep(tiny())).toBe(1);
    expect(diagramStep({ ...deck, figure: 0 })).toBe(0);
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

  it('flags text on top of text', () => {
    const deck = tiny({
      elements: [
        { id: 'a', in: 0, shape: { kind: 'text', x: 0, y: 100, text: 'hello world', size: 40 } },
        { id: 'b', in: 1, shape: { kind: 'text', x: 10, y: 110, text: 'again', size: 40 } },
      ],
    });
    expect(deckProblems(deck)).toEqual(['step 1: "a" and "b" overlap']);
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

describe('deck words (content/decks/<locale>/<id>.yaml)', () => {
  const layout: DeckLayout<'a' | 'b'> = {
    id: 't',
    episode: '0.0',
    steps: ['a', 'b'],
    build: (w, S) => ({
      cards: [],
      elements: [
        { id: 'one', in: S.a, shape: { kind: 'text', x: 0, y: 100, text: w.text('one') } },
        { id: 'two', in: S.b, shape: { kind: 'text', x: 0, y: 300, text: w.text('two') } },
      ],
    }),
  };
  const words = (over: Partial<DeckText> = {}): DeckText => ({
    title: 'T',
    steps: { a: { at: '0:00', notes: ['first'] }, b: { at: '0:10', notes: ['second'] } },
    text: { one: 'Hello', two: 'World' },
    cards: {},
    ...over,
  });
  const problems = (w: DeckText) => {
    try {
      composeDeck(layout, w, 'en', 'f.yaml');
      return [];
    } catch (err) {
      return (err as DeckTextError).problems;
    }
  };

  it('places the words by id and the steps in the layout order', () => {
    const deck = composeDeck(layout, words(), 'en', 'f.yaml');
    expect(deck.steps.map((s) => s.notes)).toEqual([['first'], ['second']]);
    expect(deck.elements.map((e) => (e.shape.kind === 'text' ? e.shape.text : ''))).toEqual(['Hello', 'World']);
  });

  it('lists every mismatch at once', () => {
    expect(problems(words({ text: { one: 'Hello', three: 'extra' } }))).toEqual([
      'text: "two" is missing',
      'text: "three" is not used by the layout',
    ]);
    expect(problems(words({ steps: { a: { at: '0:00', notes: ['x'] }, c: { at: '0:10', notes: ['y'] } } }))).toEqual([
      'steps: "b" is missing',
      'steps: "c" is not a step in the layout',
    ]);
    expect(problems(words({ steps: { b: { at: '0:10', notes: ['y'] }, a: { at: '0:00', notes: ['x'] } } }))).toEqual([
      "steps: keep the layout's order (a, b)",
    ]);
  });

  it('rejects a file without the deck shape', () => {
    expect(deckTextProblems({ title: 'T', steps: { a: { at: 22, notes: ['x'] } }, text: { one: '' } })).toEqual([
      'steps: "a" at: write the time in quotes, like "1:05"',
      'text: "one" needs words',
    ]);
    expect(deckTextProblems('just a line')).toEqual(['the file is not a mapping of title, steps, text and cards']);
    expect(deckTextProblems({ title: 'T', steps: { a: { at: '0:00', notes: 'one line' } }, text: {} })).toEqual([
      'steps: "a" notes: a list of lines (copied from the wiki by `npm run notes`)',
    ]);
  });
});

describe('presenter notes (scripts/presenter-notes.mjs)', () => {
  const md = [
    '---',
    'deck: web-faridgurbanov — /en/deck/3-9 (content/decks/en/3-9.yaml)',
    '---',
    '## Presenter notes',
    '',
    '**Intro**',
    '',
    '▶ `a`',
    '- **The thought.**',
    '- A fact that runs',
    '  on to a second line.',
    '- → the bridge',
    '',
    '▶ `b`',
    '- Only one.',
    '',
    '## Slides',
    '- not a note',
  ].join('\n');

  it('reads the deck and one list of lines per ▶ block', () => {
    expect(parsePresenterNotes(md)).toEqual({
      deck: { locale: 'en', id: '3-9' },
      notes: { a: ['**The thought.**', 'A fact that runs on to a second line.', '→ the bridge'], b: ['Only one.'] },
    });
  });

  it('writes notes under each step, keeping comments, and reports mismatches', () => {
    const yaml = '# words\nsteps:\n  a:\n    at: "0:00"\n    notes:\n      - "Old."\n  c:\n    at: "0:10"\n    notes:\n      - "Say c."\n';
    const { text, problems } = applyNotes(yaml, { a: ['**One.**'], b: ['Two.'] });
    expect(text).toBe('# words\nsteps:\n  a:\n    at: "0:00"\n    notes:\n      - "**One.**"\n  c:\n    at: "0:10"\n');
    expect(problems).toEqual(['step "c" has no ▶ block in the presenter notes', '▶ `b` is not a step of the deck']);
  });
});
