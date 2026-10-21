import type { CardSpec, Element, Tone } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 1.2, "Picking the first one" (FS-0010): the layout. The words (each step's time and cue,
// every line on screen, the card headings) are in content/decks/<locale>/1-2.yaml; this file places
// them on the stage by id. Built from the script's "On screen" list and stage directions; each step
// is one click while recording. The diagram is two separate scores per candidate against one
// baseline: today's desk, errors included, priced in a bar across the top. Case numbers are the
// running case's and are tagged synthetic; the real market sits apart, each line with its source.

const STEPS = [
  'recap',
  'promise',
  'ideas',
  'perfection',
  'today',
  'idea',
  'example',
  'twoq',
  'never',
  'handling',
  'fraud',
  'denials',
  'wait',
  'market',
  'slow',
  'cards',
  'aValue',
  'ticks',
  'b',
  'c',
  'first',
  'move',
  'who',
  'know',
  'canvas',
  'mark',
  'takeaway',
  'swap',
] as const;
type Step = (typeof STEPS)[number];

type TextOpts = Partial<Element> & { size?: number; anchor?: 'start' | 'middle' | 'end'; wrap?: number };

const hand = (id: string, x: number, y: number, text: string, opts: TextOpts = {}): Element => {
  const { size = 40, anchor, wrap, tone, in: at = 0, out } = opts;
  return { id, tone, in: at, out, shape: { kind: 'text', x, y, text, size, font: 'hand', anchor, wrap } };
};

const sans = (id: string, x: number, y: number, text: string, opts: TextOpts = {}): Element => {
  const { size = 32, anchor, wrap, tone, in: at = 0, out } = opts;
  return { id, tone, in: at, out, shape: { kind: 'text', x, y, text, size, font: 'sans', anchor, wrap } };
};

const episode = episodeByNumber('1.2') ?? missing('episode 1.2 is missing from lib/episodes/part-1.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout12: DeckLayout<Step> = {
  id: '1-2',
  episode: '1.2',
  steps: STEPS,
  build,
};

type Level = 'high' | 'medium' | 'low';
const BAR: Record<Level, { w: number; tone: Tone }> = {
  high: { w: 250, tone: 'accent' },
  medium: { w: 160, tone: 'muted' },
  low: { w: 70, tone: 'warn' },
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // One candidate card: a box with its title, then a value bar and a feasibility bar, side by side
  // and never added up. Each bar arrives at its own step.
  const candidate = (key: 'a' | 'b' | 'c', x0: number, value: Level, feas: Level, inValue: number, inFeas: number): Element[] => {
    const out = S.canvas;
    const row = (kind: 'value' | 'feas', level: Level, y: number, at: number): Element[] => [
      sans(`${key}-${kind}-label`, x0 + 20, y, w.text(`${key}-${kind}-label`), { size: 22, tone: 'muted', in: at, out }),
      { id: `${key}-${kind}-bar`, tone: BAR[level].tone, in: at, out, shape: { kind: 'box', x: x0 + 160, y: y - 18, w: BAR[level].w, h: 24, fill: true } },
      sans(`${key}-${kind}-level`, x0 + 172 + BAR[level].w, y, w.text(`${key}-${kind}-level`), { size: 20, tone: 'muted', in: at, out }),
    ];
    return [
      { id: `${key}-box`, in: S.cards, out, shape: { kind: 'box', x: x0, y: 380, w: 520, h: 300 } },
      hand(`${key}-title`, x0 + 20, 425, w.text(`${key}-title`), { size: 32, wrap: 480, in: S.cards, out }),
      ...row('value', value, 530, inValue),
      ...row('feas', feas, 580, inFeas),
    ];
  };

  return {
    cards: [
      {
        key: 'takeaway',
        title: w.title,
        subtitle: w.text('takeaway-subtitle'),
        source: `Episode ${episode.number}`,
        inline: [
          { label: copy.takeaway.idea, value: episode.takeaway.idea },
          { label: copy.takeaway.move, value: episode.takeaway.move },
          { label: copy.takeaway.monday, value: episode.takeaway.monday },
          { label: copy.takeaway.download, value: episode.takeaway.download },
        ],
      },
      {
        key: 'canvas-blank',
        ...w.card('canvas-blank'),
        source: 'parts/1-frame-the-decision/use-case-canvas.md',
        heading: '4 · Value and feasibility',
        rows: ['Money or time saved against the baseline', 'Errors avoided against the baseline', 'What the customer or user notices'],
      },
      {
        key: 'canvas-claims',
        ...w.card('canvas-claims'),
        source: 'parts/1-frame-the-decision/use-case-canvas.claims.md',
        heading: '4 · Value and feasibility',
        rows: ['A · Fast-track small home-contents claims', 'B · A chatbot answering "where is my claim?"', 'C · Fraud scoring on every claim, large ones included'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.ideas }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.ideas })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: the list of ideas, judged against the wrong thing.
      hand('hook', 120, 230, w.text('hook'), { size: 56, in: S.ideas, out: S.idea }),
      { id: 'idea-chatbot', tone: 'muted', in: S.ideas, out: S.idea, shape: { kind: 'tag', x: 160, y: 360, text: w.text('idea-chatbot') } },
      { id: 'idea-copilot', tone: 'muted', in: S.ideas, out: S.idea, shape: { kind: 'tag', x: 380, y: 360, text: w.text('idea-copilot') } },
      { id: 'idea-fraud', tone: 'muted', in: S.ideas, out: S.idea, shape: { kind: 'tag', x: 800, y: 360, text: w.text('idea-fraud') } },
      { id: 'idea-email', tone: 'muted', in: S.ideas, out: S.idea, shape: { kind: 'tag', x: 160, y: 450, text: w.text('idea-email') } },
      { id: 'idea-demo', tone: 'muted', in: S.ideas, out: S.idea, shape: { kind: 'tag', x: 560, y: 450, text: w.text('idea-demo') } },
      { id: 'demo-ring', tone: 'warn', in: S.ideas, out: S.idea, shape: { kind: 'ellipse', x: 540, y: 416, w: 470, h: 68 } },
      hand('perfection', 120, 620, w.text('perfection'), { size: 46, tone: 'muted', in: S.perfection, out: S.idea }),
      hand('today', 120, 740, w.text('today'), { size: 50, tone: 'accent', in: S.today, out: S.idea }),

      // The idea: one baseline bar across the top, and two questions kept apart.
      hand('title-idea', 120, 160, w.text('title-idea'), { size: 56, in: S.idea, out: S.handling }),
      { id: 'bar', in: S.idea, out: S.canvas, shape: { kind: 'box', x: 120, y: 220, w: 1640, h: 100 } },
      hand('baseline-label', 150, 285, w.text('baseline-label'), { size: 36, tone: 'muted', in: S.idea, out: S.handling }),
      sans('example-1', 120, 420, w.text('example-1'), { size: 30, wrap: 1250, in: S.example, out: S.handling }),
      sans('example-2', 120, 520, w.text('example-2'), { size: 30, wrap: 1250, in: S.example, out: S.handling }),
      hand('value-q', 120, 620, w.text('value-q'), { size: 44, tone: 'accent', in: S.twoq, out: S.handling }),
      hand('feas-q', 760, 620, w.text('feas-q'), { size: 44, tone: 'accent', in: S.twoq, out: S.handling }),
      hand('never', 120, 700, w.text('never'), { size: 40, tone: 'warn', in: S.never, out: S.handling }),

      // In the case: the bar fills with today's desk, priced. The real market sits under it, apart.
      hand('title-case', 120, 160, w.text('title-case'), { size: 56, in: S.handling, out: S.cards }),
      { id: 'baseline-tag', tone: 'muted', in: S.handling, out: S.canvas, shape: { kind: 'tag', x: 1585, y: 190, text: w.text('baseline-tag') } },
      { id: 'seg-handling-box', tone: 'accent', in: S.handling, out: S.canvas, shape: { kind: 'box', x: 130, y: 230, w: 680, h: 80 } },
      hand('seg-handling', 470, 282, w.text('seg-handling'), { size: 30, anchor: 'middle', tone: 'accent', in: S.handling, out: S.canvas }),
      { id: 'seg-fraud-box', tone: 'warn', in: S.fraud, out: S.canvas, shape: { kind: 'box', x: 820, y: 230, w: 340, h: 80 } },
      hand('seg-fraud', 990, 282, w.text('seg-fraud'), { size: 30, anchor: 'middle', tone: 'warn', in: S.fraud, out: S.canvas }),
      { id: 'seg-denials-box', tone: 'warn', in: S.denials, out: S.canvas, shape: { kind: 'box', x: 1170, y: 230, w: 320, h: 80 } },
      hand('seg-denials', 1330, 282, w.text('seg-denials'), { size: 30, anchor: 'middle', tone: 'warn', in: S.denials, out: S.canvas }),
      { id: 'seg-wait-box', tone: 'muted', in: S.wait, out: S.canvas, shape: { kind: 'box', x: 1500, y: 230, w: 250, h: 80 } },
      { id: 'clock', tone: 'muted', in: S.wait, out: S.canvas, shape: { kind: 'clock', x: 1535, y: 270, r: 20 } },
      hand('seg-wait', 1565, 282, w.text('seg-wait'), { size: 30, tone: 'muted', in: S.wait, out: S.canvas }),
      { id: 'real-tag', tone: 'muted', in: S.market, out: S.cards, shape: { kind: 'tag', x: 120, y: 385, text: w.text('real-tag') } },
      sans('real-fraud', 120, 450, w.text('real-fraud'), { size: 30, in: S.market, out: S.cards }),
      sans('real-fraud-source', 120, 482, w.text('real-fraud-source'), { size: 20, tone: 'muted', in: S.market, out: S.cards }),
      sans('real-complaints', 120, 550, w.text('real-complaints'), { size: 30, in: S.market, out: S.cards }),
      sans('real-complaints-source', 120, 582, w.text('real-complaints-source'), { size: 20, tone: 'muted', in: S.market, out: S.cards }),
      sans('real-belgium', 120, 650, w.text('real-belgium'), { size: 30, in: S.slow, out: S.cards }),
      sans('real-belgium-source', 120, 682, w.text('real-belgium-source'), { size: 20, tone: 'muted', in: S.slow, out: S.cards }),

      // Three candidates, two bars each.
      hand('title-cards', 120, 160, w.text('title-cards'), { size: 56, in: S.cards, out: S.move }),
      ...candidate('a', 120, 'high', 'high', S.aValue, S.ticks),
      ...candidate('b', 680, 'medium', 'high', S.b, S.b),
      ...candidate('c', 1240, 'high', 'low', S.c, S.c),
      hand('ticks-1', 120, 745, w.text('ticks-1'), { size: 32, tone: 'accent', in: S.ticks, out: S.move }),
      hand('ticks-2', 120, 795, w.text('ticks-2'), { size: 32, tone: 'accent', in: S.ticks, out: S.move }),
      hand('first', 150, 650, w.text('first'), { size: 40, tone: 'accent', in: S.first, out: S.canvas }),
      { id: 'first-ring', tone: 'accent', in: S.first, out: S.canvas, shape: { kind: 'ellipse', x: 132, y: 608, w: 120, h: 58 } },
      hand('b-why', 700, 650, w.text('b-why'), { size: 28, tone: 'muted', in: S.first, out: S.canvas }),
      hand('c-why', 1260, 650, w.text('c-why'), { size: 28, tone: 'muted', in: S.first, out: S.canvas }),

      // The move, who, and how you'll know: under the cards.
      hand('title-move', 120, 160, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      hand('move-1', 120, 830, w.text('move-1'), { size: 36, in: S.move, out: S.canvas }),
      hand('move-2', 120, 880, w.text('move-2'), { size: 36, in: S.move, out: S.canvas }),
      hand('move-3', 120, 930, w.text('move-3'), { size: 36, in: S.move, out: S.canvas }),
      hand('who', 120, 990, w.text('who'), { size: 30, tone: 'warn', in: S.who, out: S.canvas }),
      hand('know', 120, 1045, w.text('know'), { size: 36, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
