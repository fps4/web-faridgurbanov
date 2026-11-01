import { describe, expect, it } from 'vitest';
import { CAMERA, bounds, deckProblems, diagramStep, highlightAt, overlaps, visibleAt, wrapText, type Deck } from '@/lib/deck';
import { allDecks, deckById, deckFor, deckTextFiles, layouts } from '@/lib/decks';
import { composeDeck, deckTextProblems, DeckTextError, type DeckLayout, type DeckText } from '@/lib/decks/compose';
import { decks as storylineDecks } from '@/lib/storyline';
import { noteBlockProblems, noteBlocks, noteLines, parsePresenterNotes, replaceNoteBlock } from '@/lib/decks/presenter-notes.mjs';
import { notesProblems } from '@/scripts/presenter-notes.mjs';

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
    steps: [{ name: 'a', at: '0:00' }, { name: 'b', at: '0:10' }],
    cards: [],
    elements: [{ id: 'a', in: 0, shape: { kind: 'box', x: 0, y: 0, w: 10, h: 10 } }],
    ...over,
  });

  it('finds the finished diagram before the first card', () => {
    const deck = tiny({
      steps: [{ name: 'a', at: '0:00' }, { name: 'b', at: '0:10' }, { name: 'c', at: '0:20' }],
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
    steps: { a: { at: '0:00' }, b: { at: '0:10' } },
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
    expect(deck.steps).toEqual([{ name: 'a', at: '0:00' }, { name: 'b', at: '0:10' }]);
    expect(deck.elements.map((e) => (e.shape.kind === 'text' ? e.shape.text : ''))).toEqual(['Hello', 'World']);
  });

  it('lists every mismatch at once', () => {
    expect(problems(words({ text: { one: 'Hello', three: 'extra' } }))).toEqual([
      'text: "two" is missing',
      'text: "three" is not used by the layout',
    ]);
    expect(problems(words({ steps: { a: { at: '0:00' }, c: { at: '0:10' } } }))).toEqual([
      'steps: "b" is missing',
      'steps: "c" is not a step in the layout',
    ]);
    expect(problems(words({ steps: { b: { at: '0:10' }, a: { at: '0:00' } } }))).toEqual([
      "steps: keep the layout's order (a, b)",
    ]);
  });

  it('rejects a file without the deck shape', () => {
    expect(deckTextProblems({ title: 'T', steps: { a: { at: 22 } }, text: { one: '' } })).toEqual([
      'steps: "a" at: write the time in quotes, like "1:05"',
      'text: "one" needs words',
    ]);
    expect(deckTextProblems('just a line')).toEqual(['the file is not a mapping of title, steps, text and cards']);
    // Everything in the words file ships with the site: presenter notes there are refused.
    expect(deckTextProblems({ title: 'T', steps: { a: { at: '0:00', notes: ['one line'] } }, text: {} })).toEqual([
      'steps: "a" notes: the presenter notes stay in the wiki\'s .slides.md, not here',
    ]);
  });
});

describe('presenter notes (lib/decks/presenter-notes.mjs)', () => {
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
    '**Main idea**',
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

  it('keeps each block as written, without the labels and blank lines around it', () => {
    expect(noteBlocks(md).map(({ step, raw }) => [step, raw])).toEqual([
      ['a', '- **The thought.**\n- A fact that runs\n  on to a second line.\n- → the bridge'],
      ['b', '- Only one.'],
    ]);
    expect(noteLines('- one\n  two\n\n- three')).toEqual(['one two', 'three']);
  });

  it('replaces one block and leaves the rest of the file as it was', () => {
    for (const { step, raw } of noteBlocks(md)) expect(replaceNoteBlock(md, step, raw)).toBe(md);
    const edited = replaceNoteBlock(md, 'a', '- **New thought.**  \n- → on\n\n');
    expect(edited).toBe(md.replace('- **The thought.**\n- A fact that runs\n  on to a second line.\n- → the bridge', '- **New thought.**\n- → on'));
    expect(parsePresenterNotes(edited).notes).toEqual({ a: ['**New thought.**', '→ on'], b: ['Only one.'] });
  });

  it('adds a block for a step without one after the step before it', () => {
    const added = replaceNoteBlock(md, 'c', '- Third.', 'a');
    expect(Object.keys(parsePresenterNotes(added).notes)).toEqual(['a', 'c', 'b']);
    expect(added).toContain('- → the bridge\n\n▶ `c`\n- Third.\n\n**Main idea**');
    expect(() => replaceNoteBlock(md, 'c', '- Third.')).toThrow('no ▶ `c` block');
  });

  it('refuses text that would not read back as the same notes', () => {
    expect(noteBlockProblems('- one\n  more\n\n- two')).toEqual([]);
    expect(noteBlockProblems('')).toEqual(['write at least one line starting with "- "']);
    expect(noteBlockProblems('intro\n- one')).toEqual([
      'start with a "- " bullet',
      'line 1: start with "- ", or indent two spaces to continue the line above',
    ]);
    expect(noteBlockProblems('- one\n▶ `b`')).toEqual(['line 2: start with "- ", or indent two spaces to continue the line above']);
  });

  it('checks the ▶ blocks against the steps (npm run notes:check)', () => {
    expect(notesProblems(['a', 'c'], { a: ['**One.**'], b: ['Two.'] })).toEqual([
      'step "c" has no ▶ block in the presenter notes',
      '▶ `b` is not a step of the deck',
    ]);
    expect(notesProblems(['a'], { a: ['x'] })).toEqual([]);
  });
});
