import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 7.2, "The first quarter" (FS-0010): the layout. The words (each step's time and cue, every
// line on screen, the card headings) are in content/decks/<locale>/7-2.yaml; this file places them on
// the stage by id. Built from the script's "On screen" list and stage directions; each step is one
// click while recording. The diagram is a grid: four roles down, three blocks of weeks across, each
// cell an action with the part it comes from in a small circle, and two gate lines the rows meet at.
// Under it, the insurer's twelve weeks as a bar; case numbers are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'waiting',
  'quarter',
  'grid',
  'col1',
  'col2',
  'col3',
  'gates',
  'case',
  'week1',
  'recheck',
  'gate1',
  'stage2',
  'gate2',
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

const episode = episodeByNumber('7.2') ?? missing('episode 7.2 is missing from lib/episodes/part-7.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout72: DeckLayout<Step> = {
  id: '7-2',
  episode: '7.2',
  steps: STEPS,
  build,
};

/** The grid: a role column, then three blocks of weeks, 320 wide; four rows of 105. */
const GRID = { left: 120, right: 1400, top: 280, row: 105 } as const;
const COLUMNS = [440, 760, 1080] as const;
/** Where a cell's text starts and wraps. Weeks 3–6 start right of the stage-1 gate line (week 3). */
const CELL_TEXT = [
  { x: 455, wrap: 230, circle: 715 },
  { x: 855, wrap: 180, circle: 1040 },
  { x: 1095, wrap: 230, circle: 1355 },
] as const;
const GATE_X = [840, 1400] as const;

/** Each role's row: its id, and the part each of its three cells comes from. */
const ROLES = [
  { id: 'sponsor', parts: [1, 7, 7] },
  { id: 'architecture', parts: [4, 4, 4] },
  { id: 'po', parts: [8, 3, 8] },
  { id: 'engineering', parts: [8, 8, 8] },
] as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];
  const colSteps = [S.col1, S.col2, S.col3];
  const rowY = (i: number) => GRID.top + i * GRID.row;

  const rows: Element[] = ROLES.flatMap((role, i) => {
    const y = rowY(i);
    return [
      { id: `row-${role.id}`, in: S.grid, out: S.canvas, shape: { kind: 'box', x: GRID.left, y, w: GRID.right - GRID.left, h: GRID.row } },
      hand(`role-${role.id}`, 135, y + 40, w.text(`role-${role.id}`), { size: 32, in: S.grid, out: S.canvas }),
      { id: `namebox-${role.id}`, tone: 'accent', in: S.move, out: S.canvas, shape: { kind: 'box', x: 135, y: y + 52, w: 270, h: 40 } },
      hand(`name-${role.id}`, 150, y + 82, w.text(`name-${role.id}`), { size: 26, tone: 'accent', in: S.who, out: S.canvas }),
      ...CELL_TEXT.flatMap((cell, c) => [
        hand(`cell-${role.id}-${c + 1}`, cell.x, y + 38, w.text(`cell-${role.id}-${c + 1}`), { size: 26, wrap: cell.wrap, in: colSteps[c], out: S.canvas }),
        { id: `circle-${role.id}-${c + 1}`, tone: 'muted', in: colSteps[c], out: S.canvas, shape: { kind: 'ellipse', x: cell.circle, y: y + 12, w: 36, h: 36 } } as Element,
        sans(`part-${role.id}-${c + 1}`, cell.circle + 18, y + 37, String(role.parts[c]), { size: 20, anchor: 'middle', tone: 'muted', in: colSteps[c], out: S.canvas }),
      ]),
    ];
  });

  const columns: Element[] = COLUMNS.flatMap((x, c) => [
    { id: `colline-${c + 1}`, in: S.grid, out: S.canvas, shape: { kind: 'line', points: [[x, GRID.top], [x, rowY(4)]] } } as Element,
    hand(`col-${c + 1}`, x + 160, 255, w.text(`col-${c + 1}`), { size: 30, anchor: 'middle', tone: 'muted', in: S.grid, out: S.canvas }),
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
        key: 'plan-blank',
        ...w.card('plan-blank'),
        source: 'parts/7-process-and-proposal/first-quarter-plan.md',
        heading: 'First-quarter plan',
        rows: ['Sponsor', 'Architecture', 'Product Owner', 'Engineering lead'],
      },
      {
        key: 'plan-claims',
        ...w.card('plan-claims'),
        source: 'parts/7-process-and-proposal/first-quarter-plan.claims.md',
        heading: 'First-quarter plan',
        rows: ['Sponsor', 'Decides at the gates', 'Architecture', 'Product Owner', 'Engineering lead'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.waiting }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.waiting })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: everyone waiting for someone.
      hand('hook', 120, 230, w.text('hook'), { size: 60, in: S.waiting, out: S.grid }),
      hand('wait-1', 160, 400, w.text('wait-1'), { size: 44, tone: 'muted', in: S.waiting, out: S.grid }),
      hand('wait-2', 160, 480, w.text('wait-2'), { size: 44, tone: 'muted', in: S.waiting, out: S.grid }),
      hand('wait-3', 160, 560, w.text('wait-3'), { size: 44, tone: 'muted', in: S.waiting, out: S.grid }),
      hand('gone', 160, 680, w.text('gone'), { size: 50, tone: 'warn', in: S.quarter, out: S.grid }),

      // The idea: four rows moving at once; the cells fill one column at a time; two gate lines.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.grid, out: S.case }),
      ...columns,
      ...rows,
      { id: 'gate1-line', tone: 'warn', in: S.gates, out: S.canvas, shape: { kind: 'line', points: [[GATE_X[0], 270], [GATE_X[0], 760]] } },
      { id: 'gate2-line', tone: 'warn', in: S.gates, out: S.canvas, shape: { kind: 'line', points: [[GATE_X[1], 270], [GATE_X[1], 760]] } },
      hand('gate1-label', GATE_X[0] + 10, 735, w.text('gate1-label'), { size: 26, tone: 'warn', in: S.gates, out: S.canvas }),
      hand('gate2-label', GATE_X[1] - 10, 735, w.text('gate2-label'), { size: 26, tone: 'warn', anchor: 'end', in: S.gates, out: S.canvas }),

      // In the case: the twelve weeks as a bar, then what happens in them.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.case, out: S.move }),
      hand('bar-label', 120, 775, w.text('bar-label'), { size: 26, tone: 'muted', in: S.case, out: S.canvas }),
      { id: 'bar-tag', tone: 'muted', in: S.case, out: S.canvas, shape: { kind: 'tag', x: 120, y: 815, text: w.text('bar-tag') } },
      { id: 'bar-week1', tone: 'muted', in: S.case, out: S.canvas, shape: { kind: 'box', x: 440, y: 790, w: 160, h: 50 } },
      { id: 'bar-box-value', tone: 'accent', in: S.case, out: S.canvas, shape: { kind: 'box', x: 600, y: 790, w: 240, h: 50 } },
      hand('bar-value', 720, 823, w.text('bar-value'), { size: 24, anchor: 'middle', tone: 'accent', in: S.case, out: S.canvas }),
      { id: 'bar-box-stage2', tone: 'accent', in: S.case, out: S.canvas, shape: { kind: 'box', x: 840, y: 790, w: 506, h: 50 } },
      hand('bar-stage2', 1093, 823, w.text('bar-stage2'), { size: 24, anchor: 'middle', tone: 'accent', in: S.case, out: S.canvas }),
      { id: 'bar-gate', tone: 'warn', in: S.case, out: S.canvas, shape: { kind: 'box', x: 1346, y: 790, w: 54, h: 50, fill: true } },
      hand('k-week1', 120, 950, w.text('k-week1'), { size: 30, in: S.week1, out: S.stage2 }),
      hand('recheck', 440, 880, w.text('recheck'), { size: 26, tone: 'accent', in: S.recheck, out: S.canvas }),
      hand('k-gate1', 120, 1010, w.text('k-gate1'), { size: 30, in: S.gate1, out: S.gate2 }),
      hand('k-stage2', 120, 950, w.text('k-stage2'), { size: 30, in: S.stage2, out: S.move }),
      hand('k-gate2', 120, 1010, w.text('k-gate2'), { size: 30, in: S.gate2, out: S.move }),

      // The move: a name in every row.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.canvas }),
      hand('move', 120, 960, w.text('move'), { size: 36, tone: 'accent', in: S.move, out: S.canvas }),
      hand('who', 120, 1030, w.text('who'), { size: 32, in: S.who, out: S.know }),
      hand('know', 120, 1030, w.text('know'), { size: 34, tone: 'accent', in: S.know, out: S.canvas }),

      // The download, and the close.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'plan-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'plan-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 2, 3, 4] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
