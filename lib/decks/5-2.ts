import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 5.2, "Automation is a dial" (FS-0010): the layout. The words (each step's time and cue,
// every line on screen, the card headings) are in content/decks/<locale>/5-2.yaml; this file places
// them on the stage by id. Built from the script's "On screen" list and stage directions; each step
// is one click while recording. The diagram is the claims flow as six boxes with a dial under each
// (automatic · suggestion · person decides), the needles set one by one, who approves under each;
// then the 99% warning and the seeded-error week. After Parasuraman & Riley, and Parasuraman &
// Manzey. Case numbers are the running case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'switch',
  'crossout',
  'trust',
  'strip',
  'read',
  'coverage',
  'small',
  'other',
  'denial',
  'fraud',
  'rule',
  'eiopa',
  'seen',
  'counter',
  'bias',
  'move',
  'levels',
  'seeded',
  'count',
  'tell',
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

const episode = episodeByNumber('5.2') ?? missing('episode 5.2 is missing from lib/episodes/part-5.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout52: DeckLayout<Step> = {
  id: '5-2',
  episode: '5.2',
  steps: STEPS,
  build,
};

/** The six steps of the strip: where each box sits, the step that sets its needle, and the level. */
const STRIP: { x: number; at: Step; level: 'automatic' | 'suggestion' | 'person' }[] = [
  { x: 100, at: 'read', level: 'automatic' },
  { x: 390, at: 'coverage', level: 'suggestion' },
  { x: 680, at: 'small', level: 'automatic' },
  { x: 970, at: 'other', level: 'suggestion' },
  { x: 1260, at: 'denial', level: 'person' },
  { x: 1550, at: 'fraud', level: 'person' },
];

const BOX = { y: 280, w: 260, h: 140 };
const DIAL = { y: 540, r: 60 };
/** Needle angle per level, in degrees: left for automatic, up for a suggestion, right for a person. */
const ANGLE = { automatic: 155, suggestion: 90, person: 25 } as const;
const TONE = { automatic: 'accent', suggestion: 'ink', person: 'warn' } as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];
  const rows = ['Which step is tested', 'What the seeded items are', 'Who knows', 'Catch rate agreed before the week'];

  const strip: Element[] = STRIP.flatMap(({ x, at, level }, i) => {
    const n = i + 1;
    const cx = x + BOX.w / 2;
    const arc: [number, number][] = [180, 150, 120, 90, 60, 30, 0].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return [Math.round(cx + DIAL.r * Math.cos(a)), Math.round(DIAL.y - DIAL.r * Math.sin(a))];
    });
    const a = (ANGLE[level] * Math.PI) / 180;
    const tip: [number, number] = [Math.round(cx + DIAL.r * 0.8 * Math.cos(a)), Math.round(DIAL.y - DIAL.r * 0.8 * Math.sin(a))];
    return [
      { id: `box-${n}`, in: S.strip, out: S.canvas, shape: { kind: 'box', x, y: BOX.y, w: BOX.w, h: BOX.h } },
      hand(`step-${n}`, cx, 345, w.text(`step-${n}`), { size: 34, anchor: 'middle', wrap: 230, in: S.strip, out: S.canvas }),
      { id: `dial-${n}`, tone: 'muted', in: S.strip, out: S.canvas, shape: { kind: 'line', points: arc } },
      { id: `needle-${n}`, tone: TONE[level], in: S[at], out: S.canvas, shape: { kind: 'line', points: [[cx, DIAL.y], tip] } },
      hand(`level-${n}`, cx, 590, w.text(`level-${n}`), { size: 30, anchor: 'middle', tone: TONE[level], in: S[at], out: S.canvas }),
      sans(`approver-${n}`, cx, 630, w.text(`approver-${n}`), { size: 20, anchor: 'middle', wrap: 240, tone: 'muted', in: S[at], out: S.canvas }),
    ];
  });

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
        key: 'test-blank',
        ...w.card('test-blank'),
        source: 'parts/5-design-for-people/automation-and-failure-card.md',
        heading: 'Test with errors in',
        rows,
      },
      {
        key: 'test-claims',
        ...w.card('test-claims'),
        source: 'parts/5-design-for-people/automation-and-failure-card.claims.md',
        heading: 'Test with errors in',
        rows,
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.switch }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.switch })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: the switch, crossed out; a dial instead; calibrated trust.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.switch, out: S.strip }),
      { id: 'switch-box', in: S.switch, out: S.strip, shape: { kind: 'box', x: 640, y: 380, w: 400, h: 140 } },
      { id: 'switch-knob', tone: 'accent', in: S.switch, out: S.strip, shape: { kind: 'ellipse', x: 655, y: 395, w: 110, h: 110 } },
      hand('sw-left', 610, 465, w.text('sw-left'), { size: 36, anchor: 'end', in: S.switch, out: S.strip }),
      hand('sw-right', 1070, 465, w.text('sw-right'), { size: 36, in: S.switch, out: S.strip }),
      { id: 'cross-1', tone: 'warn', in: S.crossout, out: S.strip, shape: { kind: 'line', points: [[620, 360], [1060, 540]] } },
      { id: 'cross-2', tone: 'warn', in: S.crossout, out: S.strip, shape: { kind: 'line', points: [[620, 540], [1060, 360]] } },
      hand('not-switch', 840, 610, w.text('not-switch'), { size: 44, anchor: 'middle', tone: 'warn', in: S.crossout, out: S.strip }),
      hand('dial-line', 120, 760, w.text('dial-line'), { size: 64, tone: 'accent', in: S.crossout, out: S.strip }),
      sans('trust', 120, 860, w.text('trust'), { size: 30, wrap: 1250, in: S.trust, out: S.strip }),
      sans('credit', 1760, 260, w.text('credit'), { size: 22, tone: 'muted', anchor: 'end', in: S.trust, out: S.strip }),

      // In the case: six steps, a dial under each, the needles set one by one.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.strip, out: S.move }),
      { id: 'cap-tag', tone: 'muted', in: S.strip, out: S.canvas, shape: { kind: 'tag', x: 700, y: 252, text: w.text('cap-tag') } },
      ...strip,
      hand('rule', 100, 770, w.text('rule'), { size: 38, wrap: 1250, tone: 'accent', in: S.rule, out: S.seen }),
      sans('eiopa', 100, 880, w.text('eiopa'), { size: 26, in: S.eiopa, out: S.seen }),
      sans('eiopa-source', 100, 920, w.text('eiopa-source'), { size: 18, tone: 'muted', in: S.eiopa, out: S.seen }),

      // What you see: the 99% counter is a warning, and automation bias.
      hand('seen', 100, 770, w.text('seen'), { size: 38, tone: 'warn', in: S.seen, out: S.move }),
      { id: 'counter-box', tone: 'warn', in: S.counter, out: S.move, shape: { kind: 'box', x: 100, y: 810, w: 440, h: 130 } },
      hand('agree', 320, 885, w.text('agree'), { size: 50, anchor: 'middle', tone: 'warn', in: S.counter, out: S.move }),
      { id: 'warn-sign', tone: 'warn', in: S.counter, out: S.move, shape: { kind: 'line', points: [[570, 930], [620, 830], [670, 930], [570, 930]] } },
      hand('warn-mark', 620, 915, w.text('warn-mark'), { size: 50, anchor: 'middle', tone: 'warn', in: S.counter, out: S.move }),
      { id: 'agree-tag', tone: 'muted', in: S.counter, out: S.move, shape: { kind: 'tag', x: 700, y: 880, text: w.text('agree-tag') } },
      sans('bias', 100, 990, w.text('bias'), { size: 26, wrap: 1300, in: S.bias, out: S.move }),
      sans('bias-source', 100, 1062, w.text('bias-source'), { size: 18, tone: 'muted', in: S.bias, out: S.move }),

      // The move: levels and approvers, the locked steps, then the seeded week.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.canvas }),
      hand('move-1', 100, 760, w.text('move-1'), { size: 38, in: S.levels, out: S.who }),
      { id: 'locked-5', tone: 'warn', in: S.levels, out: S.canvas, shape: { kind: 'tag', x: 1325, y: 672, text: w.text('locked-5') } },
      { id: 'locked-6', tone: 'warn', in: S.levels, out: S.canvas, shape: { kind: 'tag', x: 1615, y: 672, text: w.text('locked-6') } },
      hand('move-2', 100, 830, w.text('move-2'), { size: 38, tone: 'accent', in: S.seeded, out: S.who }),
      { id: 'stack-1', tone: 'muted', in: S.seeded, out: S.canvas, shape: { kind: 'box', x: 120, y: 870, w: 180, h: 90 } },
      { id: 'stack-2', tone: 'muted', in: S.seeded, out: S.canvas, shape: { kind: 'box', x: 135, y: 885, w: 180, h: 90 } },
      { id: 'stack-3', in: S.seeded, out: S.canvas, shape: { kind: 'box', x: 150, y: 900, w: 180, h: 90 } },
      { id: 'dot-1', tone: 'warn', in: S.seeded, out: S.canvas, shape: { kind: 'ellipse', x: 290, y: 912, w: 24, h: 24 } },
      { id: 'dot-2', tone: 'warn', in: S.seeded, out: S.canvas, shape: { kind: 'ellipse', x: 290, y: 950, w: 24, h: 24 } },
      sans('stack-label', 120, 1030, w.text('stack-label'), { size: 20, tone: 'muted', in: S.seeded, out: S.canvas }),
      { id: 'arrow-queue', in: S.seeded, out: S.canvas, shape: { kind: 'arrow', x1: 350, y1: 935, x2: 470, y2: 935 } },
      { id: 'queue-box', in: S.seeded, out: S.canvas, shape: { kind: 'box', x: 480, y: 870, w: 340, h: 130 } },
      hand('queue-label', 650, 935, w.text('queue-label'), { size: 34, anchor: 'middle', in: S.seeded, out: S.canvas }),
      sans('queue-note', 650, 975, w.text('queue-note'), { size: 20, anchor: 'middle', tone: 'muted', in: S.seeded, out: S.canvas }),
      { id: 'queue-tag', tone: 'muted', in: S.seeded, out: S.canvas, shape: { kind: 'tag', x: 480, y: 1045, text: w.text('queue-tag') } },
      hand('caught', 880, 920, w.text('caught'), { size: 40, tone: 'accent', in: S.count, out: S.canvas }),
      sans('agreed', 880, 975, w.text('agreed'), { size: 22, in: S.count, out: S.canvas }),
      sans('tell', 880, 1020, w.text('tell'), { size: 22, wrap: 520, tone: 'muted', in: S.tell, out: S.canvas }),
      hand('who', 100, 760, w.text('who'), { size: 36, wrap: 1300, tone: 'warn', in: S.who, out: S.know }),
      hand('know', 100, 760, w.text('know'), { size: 36, wrap: 1300, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'test-blank', x: 100, y: 170, w: 640, h: 820 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'test-claims', x: 780, y: 170, w: 640, h: 820, highlight: { [S.mark]: [1, 3] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
