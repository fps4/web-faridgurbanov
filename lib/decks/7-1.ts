import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 7.1, "Buy information before you buy software" (FS-0010): the layout. The words (each
// step's time and cue, every line on screen, the card headings) are in
// content/decks/<locale>/7-1.yaml; this file places them on the stage by id. Built from the script's
// "On screen" list and stage directions; each step is one click while recording. The diagram is four
// stages rising left to right with a gate between each, after Cooper's Stage-Gate: money spent
// under each stage, uncertainty narrowing above them. Case numbers are the running case's and are
// tagged synthetic; the two "≈ €1.1M" figures (35% automatic, and fraud up a quarter) are on
// different steps so they are not read as one.

const STEPS = [
  'recap',
  'promise',
  'pilots',
  'eiopa',
  'nobody',
  'idea',
  'stage1',
  'stage2',
  'stage3',
  'stage4',
  'bars',
  'band',
  'gates',
  'buying',
  'value',
  'net',
  'gate1',
  'go',
  'marker',
  'quarter',
  'forward',
  'move',
  'four',
  'breaks',
  'page',
  'ask',
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

const episode = episodeByNumber('7.1') ?? missing('episode 7.1 is missing from lib/episodes/part-7.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout71: DeckLayout<Step> = {
  id: '7-1',
  episode: '7.1',
  steps: STEPS,
  build,
};

/** The four stages, rising left to right: 300 × 130 each, 100 apart. */
const STAGE_BOXES = [
  { x: 120, y: 640 },
  { x: 520, y: 540 },
  { x: 920, y: 440 },
  { x: 1320, y: 340 },
] as const;

/** The three gates, in the gaps between the stages. */
const GATE_BOXES = [
  { x: 430, y: 552 },
  { x: 830, y: 452 },
  { x: 1230, y: 352 },
] as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];
  const stageSteps = [S.stage1, S.stage2, S.stage3, S.stage4];

  const stages: Element[] = STAGE_BOXES.flatMap(({ x, y }, i) => [
    { id: `box-stage${i + 1}`, in: stageSteps[i], out: S.canvas, shape: { kind: 'box', x, y, w: 300, h: 130 } },
    hand(`label-stage${i + 1}`, x + 150, y + 60, w.text(`label-stage${i + 1}`), { size: 34, anchor: 'middle', wrap: 270, in: stageSteps[i], out: S.canvas }),
  ]);

  const gates: Element[] = GATE_BOXES.flatMap(({ x, y }, i) => [
    { id: `box-gate${i + 1}`, in: S.gates, out: S.canvas, shape: { kind: 'box', x, y, w: 80, h: 100 } },
    hand(`gate${i + 1}-go`, x + 40, y + 30, w.text(`gate${i + 1}-go`), { size: 24, anchor: 'middle', tone: 'accent', in: S.gates, out: S.canvas }),
    hand(`gate${i + 1}-change`, x + 40, y + 60, w.text(`gate${i + 1}-change`), { size: 24, anchor: 'middle', in: S.gates, out: S.canvas }),
    hand(`gate${i + 1}-stop`, x + 40, y + 90, w.text(`gate${i + 1}-stop`), { size: 24, anchor: 'middle', tone: 'warn', in: S.gates, out: S.canvas }),
  ]);

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
        key: 'proposal-blank',
        ...w.card('proposal-blank'),
        source: 'parts/7-process-and-proposal/one-page-proposal.md',
        heading: 'One-page proposal',
        rows: ['To (decides at the gate)', 'From (owns the use case)', 'Date · version of this page', 'Stage asked for'],
      },
      {
        key: 'proposal-claims',
        ...w.card('proposal-claims'),
        source: 'parts/7-process-and-proposal/one-page-proposal.claims.md',
        heading: 'One-page proposal',
        rows: ['To (decides at the gate)', 'From (owns the use case)', 'Date · version of this page', 'Stage asked for'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.pilots }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.pilots })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: pilots that never end, the EIOPA figure, the missing stop rule.
      hand('hook', 120, 230, w.text('hook'), { size: 60, in: S.pilots, out: S.idea }),
      sans('case-once', 120, 330, w.text('case-once'), { size: 34, wrap: 1250, in: S.pilots, out: S.idea }),
      hand('eiopa-figure', 120, 600, w.text('eiopa-figure'), { size: 150, tone: 'accent', in: S.eiopa, out: S.idea }),
      sans('eiopa', 360, 540, w.text('eiopa'), { size: 38, wrap: 1000, in: S.eiopa, out: S.idea }),
      sans('eiopa-source', 360, 690, w.text('eiopa-source'), { size: 22, tone: 'muted', in: S.eiopa, out: S.idea }),
      hand('nobody', 120, 820, w.text('nobody'), { size: 46, tone: 'accent', wrap: 1250, in: S.nobody, out: S.idea }),

      // The idea: four stages, money under them, uncertainty above, a gate between each.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.idea, out: S.value }),
      sans('credit', 1760, 260, w.text('credit'), { size: 22, tone: 'muted', anchor: 'end', in: S.idea, out: S.canvas }),
      ...stages,
      { id: 'bar-stage1', tone: 'muted', in: S.bars, out: S.canvas, shape: { kind: 'box', x: 120, y: 785, w: 60, h: 14, fill: true } },
      { id: 'bar-stage2', tone: 'muted', in: S.bars, out: S.canvas, shape: { kind: 'box', x: 520, y: 685, w: 90, h: 14, fill: true } },
      { id: 'bar-stage3', tone: 'muted', in: S.bars, out: S.canvas, shape: { kind: 'box', x: 920, y: 585, w: 220, h: 14, fill: true } },
      { id: 'bar-stage4', tone: 'muted', in: S.bars, out: S.canvas, shape: { kind: 'line', points: [[1320, 488], [1620, 488]] } },
      hand('money', 195, 800, w.text('money'), { size: 28, tone: 'muted', in: S.bars, out: S.value }),
      { id: 'band-top', tone: 'muted', in: S.band, out: S.value, shape: { kind: 'line', points: [[120, 290], [1620, 310]] } },
      { id: 'band-bottom', tone: 'muted', in: S.band, out: S.value, shape: { kind: 'line', points: [[120, 620], [520, 525], [920, 425], [1320, 325], [1620, 318]] } },
      hand('uncertainty', 150, 360, w.text('uncertainty'), { size: 32, tone: 'muted', in: S.band, out: S.value }),
      ...gates,
      hand('gates-first', 560, 760, w.text('gates-first'), { size: 30, tone: 'accent', in: S.gates, out: S.value }),
      hand('buying', 120, 960, w.text('buying'), { size: 46, tone: 'accent', in: S.buying, out: S.value }),

      // In the case: stage 1 filled in, its gate, and the number that breaks it.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.value, out: S.move }),
      { id: 'ring-stage1', tone: 'accent', in: S.value, out: S.move, shape: { kind: 'box', x: 110, y: 630, w: 320, h: 150 } },
      hand('two-weeks', 270, 750, w.text('two-weeks'), { size: 28, anchor: 'middle', tone: 'accent', in: S.value, out: S.canvas }),
      hand('v-today', 560, 780, w.text('v-today'), { size: 44, in: S.value, out: S.move }),
      { id: 'v-tag', tone: 'muted', in: S.value, out: S.move, shape: { kind: 'tag', x: 1220, y: 765, text: w.text('v-tag') } },
      hand('v-net', 560, 850, w.text('v-net'), { size: 44, in: S.net, out: S.move }),
      { id: 'ring-gate1', tone: 'warn', in: S.gate1, out: S.move, shape: { kind: 'ellipse', x: 412, y: 538, w: 116, h: 128 } },
      hand('g-rule', 560, 930, w.text('g-rule'), { size: 36, wrap: 840, in: S.gate1, out: S.marker }),
      hand('g-go', 560, 1030, w.text('g-go'), { size: 40, tone: 'accent', in: S.go, out: S.marker }),
      hand('m-fraud', 560, 930, w.text('m-fraud'), { size: 44, tone: 'warn', in: S.marker, out: S.move }),
      hand('m-quarter', 560, 1000, w.text('m-quarter'), { size: 36, tone: 'warn', in: S.quarter, out: S.move }),
      hand('f-stage2', 530, 525, w.text('f-stage2'), { size: 28, tone: 'warn', in: S.forward, out: S.move }),
      hand('f-stage3', 930, 425, w.text('f-stage3'), { size: 28, tone: 'warn', in: S.forward, out: S.move }),

      // The move.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.canvas }),
      hand('step-1', 120, 830, w.text('step-1'), { size: 38, in: S.four, out: S.canvas }),
      hand('step-2', 120, 900, w.text('step-2'), { size: 38, in: S.breaks, out: S.canvas }),
      hand('step-3', 120, 970, w.text('step-3'), { size: 38, in: S.page, out: S.canvas }),
      { id: 'ring-stage2', tone: 'accent', in: S.ask, out: S.canvas, shape: { kind: 'box', x: 510, y: 530, w: 320, h: 150 } },
      hand('ask-label', 530, 735, w.text('ask-label'), { size: 30, tone: 'accent', in: S.ask, out: S.canvas }),
      hand('who', 120, 1040, w.text('who'), { size: 34, in: S.who, out: S.know }),
      hand('know', 120, 1040, w.text('know'), { size: 38, tone: 'accent', in: S.know, out: S.canvas }),

      // The download, and the close.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'proposal-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'proposal-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 3] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
