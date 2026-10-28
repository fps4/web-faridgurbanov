// The episode deck model (FS-0010, ADR-0010). An episode is recorded over diagrams that build
// step by step while the talking head speaks, and closes on a card.
// A deck is data: elements on a 1920×1080 stage, each with the step it appears at (and, optionally,
// the step it leaves at). The player draws an element in a sketch style when its step arrives.
// Framework-free and unit-tested per AGENTS.md; the renderer lives in components/deck/.

export const STAGE = { w: 1920, h: 1080 } as const;

/**
 * The corner kept clear for the talking head, bottom right. Nothing on any step may overlap it;
 * the deck test enforces that, so the camera never covers a label.
 */
export const CAMERA = { x: 1440, y: 700, w: 480, h: 380 } as const;

/** One ink, one accent, one warning, a muted grey and a highlighter. Every deck uses the same set. */
export type Tone = 'ink' | 'accent' | 'warn' | 'muted' | 'marker';

export type Shape =
  | { kind: 'box'; x: number; y: number; w: number; h: number; fill?: boolean }
  | {
      kind: 'text';
      x: number;
      y: number;
      text: string;
      size?: number;
      /** `hand` for annotations and labels drawn on the diagram; `sans` for quotes and sources. */
      font?: 'hand' | 'sans';
      anchor?: 'start' | 'middle' | 'end';
      /** Wrap at this width (px); lines are split on spaces. */
      wrap?: number;
    }
  | { kind: 'arrow'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'line'; points: [number, number][] }
  | { kind: 'ellipse'; x: number; y: number; w: number; h: number }
  | { kind: 'seat'; x: number; y: number }
  | { kind: 'clock'; x: number; y: number; r: number }
  | { kind: 'tag'; x: number; y: number; text: string }
  | {
      kind: 'card';
      /** A key into the deck's `cards`. */
      card: string;
      x: number;
      y: number;
      w: number;
      h: number;
      /** Rows (by index) highlighted from a step on: { step: rows }. Later entries replace earlier. */
      highlight?: Record<number, number[]>;
    };

export interface Element {
  id: string;
  shape: Shape;
  tone?: Tone;
  /** The step it appears at (0-based). */
  in: number;
  /** The step it leaves at; visible while in ≤ step < out. */
  out?: number;
}

export interface Step {
  /** The step's name in the layout and the words file, e.g. 'retrain'; the wiki's `▶` block names it too. */
  name: string;
  /** Cumulative time in the script, e.g. '0:50'. */
  at: string;
  // No presenter notes: they stay in the wiki's `.slides.md`, which the presenter view reads under
  // `npm run dev` (scripts/notes-server.mjs), so the published deck carries none.
}

/** A card's content: a title, a subtitle and labelled rows, as the episode's closing card is. */
export interface CardSpec {
  key: string;
  title: string;
  subtitle: string;
  rows: { label: string; value: string }[];
  /** Footer source line, e.g. 'Episode 3.1'. */
  source: string;
  /** Shown on the card, e.g. 'fictional'. */
  tag?: string;
}

export interface Deck {
  /** Route slug under /<locale>/deck, e.g. '1-1'. */
  id: string;
  /** The language the deck is written in. A locale without its own deck shows the English one. */
  locale: 'en' | 'nl';
  episode: string;
  title: string;
  steps: Step[];
  elements: Element[];
  cards: CardSpec[];
  /** The step that shows the episode's main diagram, for a page figure. */
  figure?: number;
}

export function visibleAt(el: Element, step: number): boolean {
  return el.in <= step && (el.out === undefined || step < el.out);
}

/** Rows highlighted on a card at a step: the latest `highlight` entry at or before the step. */
export function highlightAt(shape: Extract<Shape, { kind: 'card' }>, step: number): number[] {
  if (!shape.highlight) return [];
  const keys = Object.keys(shape.highlight)
    .map(Number)
    .filter((k) => k <= step)
    .sort((a, b) => a - b);
  const last = keys.at(-1);
  return last === undefined ? [] : shape.highlight[last];
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Wrap text on spaces to a width, using the same rough glyph width the renderer assumes. */
export function wrapText(text: string, size: number, width?: number, font: 'hand' | 'sans' = 'hand'): string[] {
  if (!width) return [text];
  const perLine = Math.max(1, Math.floor(width / (size * GLYPH[font])));
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > perLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Average glyph width as a share of the font size, per face: the handwriting face (Caveat) runs
 * narrow. Slightly generous, so a bounding box errs large.
 */
const GLYPH = { hand: 0.42, sans: 0.52 } as const;

/** A tag's pill width for its text, shared by the renderer and the bounds. */
export function tagWidth(text: string): number {
  return text.length * 15 + 40;
}
export const LINE_HEIGHT = 1.2;

/** An approximate bounding box per shape, for the camera-corner check. */
export function bounds(shape: Shape): Box {
  switch (shape.kind) {
    case 'box':
    case 'ellipse':
    case 'card':
      return { x: shape.x, y: shape.y, w: shape.w, h: shape.h };
    case 'arrow': {
      const x = Math.min(shape.x1, shape.x2);
      const y = Math.min(shape.y1, shape.y2);
      return { x, y, w: Math.abs(shape.x2 - shape.x1), h: Math.abs(shape.y2 - shape.y1) };
    }
    case 'line': {
      const xs = shape.points.map((p) => p[0]);
      const ys = shape.points.map((p) => p[1]);
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    case 'seat':
      return { x: shape.x - 40, y: shape.y - 50, w: 80, h: 120 };
    case 'clock':
      return { x: shape.x - shape.r, y: shape.y - shape.r, w: 2 * shape.r, h: 2 * shape.r };
    case 'tag':
      return { x: shape.x, y: shape.y - 22, w: tagWidth(shape.text), h: 44 };
    case 'text': {
      const size = shape.size ?? 40;
      const font = shape.font ?? 'hand';
      const lines = wrapText(shape.text, size, shape.wrap, font);
      const w = Math.max(...lines.map((l) => l.length)) * size * GLYPH[font];
      const h = lines.length * size * LINE_HEIGHT;
      const x = shape.anchor === 'middle' ? shape.x - w / 2 : shape.anchor === 'end' ? shape.x - w : shape.x;
      return { x, y: shape.y - size, w, h };
    }
  }
}

export function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/**
 * What is wrong with a deck, as sentences; [] when it is fine. The rules are the format's:
 * every click changes something on screen, nothing sits under the camera, no text sits on other
 * text, every card exists.
 */
export function deckProblems(deck: Deck): string[] {
  const problems: string[] = [];
  const n = deck.steps.length;
  const ids = new Set<string>();
  const cardKeys = new Set(deck.cards.map((c) => c.key));

  for (const el of deck.elements) {
    if (ids.has(el.id)) problems.push(`duplicate element id "${el.id}"`);
    ids.add(el.id);
    if (el.in < 0 || el.in >= n) problems.push(`"${el.id}" appears at step ${el.in}, outside 0–${n - 1}`);
    if (el.out !== undefined && (el.out <= el.in || el.out > n)) problems.push(`"${el.id}" leaves at ${el.out}, before it appears or after the end`);
    if (overlaps(bounds(el.shape), CAMERA)) problems.push(`"${el.id}" overlaps the camera corner`);
    if (el.shape.kind === 'card' && !cardKeys.has(el.shape.card)) problems.push(`"${el.id}" names unknown card "${el.shape.card}"`);
  }

  // Two pieces of text on top of each other is always a mistake (a leaver that forgot to leave).
  const texts = deck.elements.filter((el) => el.shape.kind === 'text');
  for (let step = 0; step < n; step++) {
    const shown = texts.filter((el) => visibleAt(el, step));
    for (let i = 0; i < shown.length; i++)
      for (let j = i + 1; j < shown.length; j++)
        if (overlaps(bounds(shown[i].shape), bounds(shown[j].shape)))
          problems.push(`step ${step}: "${shown[i].id}" and "${shown[j].id}" overlap`);
  }

  for (let step = 1; step < n; step++) {
    const changes = deck.elements.some(
      (el) =>
        el.in === step ||
        el.out === step ||
        (el.shape.kind === 'card' && el.shape.highlight !== undefined && step in el.shape.highlight),
    );
    if (!changes) problems.push(`step ${step} (${deck.steps[step].at}) changes nothing on screen`);
  }
  return problems;
}

/**
 * The step that shows the episode's diagram: the one the layout names, or else the last one before
 * the first card arrives (or the last step, in a deck without cards). A page that shows the deck as
 * a figure draws it at this step, so the figure and the episode are the same drawing.
 */
export function diagramStep(deck: Deck): number {
  if (deck.figure !== undefined) return deck.figure;
  const cardSteps = deck.elements.filter((el) => el.shape.kind === 'card').map((el) => el.in);
  return cardSteps.length ? Math.max(0, Math.min(...cardSteps) - 1) : deck.steps.length - 1;
}
