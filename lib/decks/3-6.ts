import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.6, "Thresholds and operating points" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-6.yaml; this file places them on the stage by id. The episode follows the
// wiki script (publishing/ai-product-design/episodes/03-data/06-thresholds-and-operating-points.slides.md):
// what the episode promises, the threshold nobody chose, Epic's sepsis model at the threshold the
// vendor recommends (Wong et al. 2021), Werkmora's question, the guide's fraud table built row by row
// with Elkan's threshold and a cost that moves, two thresholds with a person in between (Kaiser
// Permanente, Escobar et al. 2020, as the contrast), and Werkmora's service level per item group.
// The fraud table is the guide's; Werkmora's costs and service levels are fictional.

const STEPS = [
  'title',
  'promise',
  'usual',
  'epic',
  'burden',
  'werkmora',
  'table',
  'rowb',
  'total',
  'step',
  'elkan',
  'moves',
  'two',
  'band',
  'kaiser',
  'forecast',
  'levels',
  'owner',
  'june',
  'takeaway',
  'next',
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

function missing(message: string): never {
  throw new Error(message);
}

const episode = episodeByNumber('3.6') ?? missing('episode 3.6 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.6 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.6 needs its closing card');

// Score → threshold → action: the small pipeline the usual answer leaves to a default.
const FLOW: { key: string; x: number; w: number }[] = [
  { key: 'score', x: 120, w: 220 },
  { key: 'threshold', x: 460, w: 280 },
  { key: 'action', x: 860, w: 220 },
];

// Epic at the recommended threshold: three numbers side by side (Wong et al. 2021, Results).
const STATS: { key: string; x: number; tone?: 'warn' }[] = [
  { key: 'alerted', x: 280 },
  { key: 'right', x: 700 },
  { key: 'missed', x: 1120, tone: 'warn' },
];

// The fraud table: one column per figure, as the guide's table has them. The first four arrive with
// the rows; the three cost columns arrive with the totals.
const COLS = { threshold: 120, flagged: 420, caught: 620, precision: 800, missed: 1020, reviews: 1280, total: 1500 } as const;
const COUNTS = ['flagged', 'caught', 'precision'] as const;
const COSTS = ['missed', 'reviews', 'total'] as const;
const ROW_Y = { a: 420, b: 510 } as const;

// Werkmora's service levels: item group, one unit short, one unit too many, the level (fictional).
const LEVEL_COLS = { group: 120, short: 520, excess: 720, level: 960 } as const;
const GROUPS = [
  { key: 'plants', y: 560 },
  { key: 'hoses', y: 630 },
] as const;

export const layout36: DeckLayout<Step> = {
  id: '3-6',
  episode: '3.6',
  steps: STEPS,
  figure: 'moves',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const flow: Element[] = FLOW.flatMap(({ key, x, w: width }) => [
    { id: `flow-${key}`, tone: key === 'threshold' ? 'accent' : undefined, in: S.usual, out: S.epic, shape: { kind: 'box', x, y: 200, w: width, h: 80 } },
    hand(`flow-${key}-label`, x + width / 2, 252, w.text(`flow-${key}`), { size: 36, anchor: 'middle', in: S.usual, out: S.epic }),
  ]);

  const stats: Element[] = STATS.flatMap(({ key, x, tone }) => [
    hand(`stat-${key}`, x, 430, w.text(`stat-${key}`), { size: 110, anchor: 'middle', tone, in: S.epic, out: S.werkmora }),
    sans(`stat-${key}-label`, x, 500, w.text(`stat-${key}-label`), { size: 28, anchor: 'middle', wrap: 340, in: S.epic, out: S.werkmora }),
  ]);

  // A row of the fraud table: its name and counts at one step, its costs at the totals.
  const row = (r: 'a' | 'b', at: number): Element[] => [
    hand(`${r}-name`, COLS.threshold, ROW_Y[r], w.text(`${r}-name`), { size: 44, in: at, out: S.two }),
    ...COUNTS.map((c) => hand(`${r}-${c}`, COLS[c], ROW_Y[r], w.text(`${r}-${c}`), { size: 44, in: at, out: S.two })),
    ...COSTS.map((c) =>
      hand(`${r}-${c}`, COLS[c], ROW_Y[r], w.text(`${r}-${c}`), { size: 44, tone: c === 'total' ? 'accent' : undefined, in: S.total, out: S.two }),
    ),
  ];

  const levels: Element[] = GROUPS.flatMap(({ key, y }) => [
    hand(key, LEVEL_COLS.group, y, w.text(key), { size: 40, in: S.levels, out: S.takeaway }),
    hand(`${key}-short`, LEVEL_COLS.short, y, w.text(`${key}-short`), { size: 40, in: S.levels, out: S.takeaway }),
    hand(`${key}-excess`, LEVEL_COLS.excess, y, w.text(`${key}-excess`), { size: 40, in: S.levels, out: S.takeaway }),
    hand(`${key}-level`, LEVEL_COLS.level, y, w.text(`${key}-level`), { size: 40, tone: 'accent', in: S.levels, out: S.takeaway }),
  ]);

  return {
    cards: [
      {
        key: 'takeaway',
        title: w.title,
        subtitle: w.text('takeaway-subtitle'),
        source: `Episode ${episode.number}`,
        rows: [
          { label: copy.takeaway.idea, value: takeaway.idea },
          { label: copy.takeaway.move, value: takeaway.move },
          { label: copy.takeaway.monday, value: takeaway.monday },
        ],
      },
    ],
    elements: [
      // The title card.
      sans('episode', 120, 360, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 520, w.title, { size: 112, out: S.promise }),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // In this episode: what the viewer leaves with, said first.
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.usual }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.usual }),
      ),

      // The usual answer: the threshold between score and action is left to a default.
      ...flow,
      { id: 'flow-arrow-1', in: S.usual, out: S.epic, shape: { kind: 'arrow', x1: 340, y1: 240, x2: 460, y2: 240 } },
      { id: 'flow-arrow-2', in: S.usual, out: S.epic, shape: { kind: 'arrow', x1: 740, y1: 240, x2: 860, y2: 240 } },
      hand('question', 120, 420, w.text('question'), { size: 80, tone: 'accent', in: S.usual, out: S.epic }),
      hand('usual-default', 120, 540, w.text('usual-default'), { size: 52, in: S.usual, out: S.epic }),
      hand('usual-precision', 120, 620, w.text('usual-precision'), { size: 52, in: S.usual, out: S.epic }),
      { id: 'usual-tag', tone: 'muted', in: S.usual, out: S.epic, shape: { kind: 'tag', x: 120, y: 720, text: w.text('usual-tag') } },

      // Epic's sepsis model at the threshold the vendor recommends, then the workload it gives.
      hand('title-epic', 120, 160, w.text('title-epic'), { size: 52, in: S.epic, out: S.werkmora }),
      sans('epic-what', 120, 230, w.text('epic-what'), { size: 26, tone: 'muted', in: S.epic, out: S.werkmora }),
      ...stats,
      hand('burden', 120, 680, w.text('burden'), { size: 48, tone: 'accent', in: S.burden, out: S.werkmora }),
      hand('burden-note', 120, 750, w.text('burden-note'), { size: 36, tone: 'muted', in: S.burden, out: S.werkmora }),
      sans('epic-credit', 120, 900, w.text('epic-credit'), { size: 22, tone: 'muted', in: S.epic, out: S.werkmora }),

      // Werkmora in two lines, and the question we answer at the end.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.table }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.table, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 260, w.text('werkmora'), { size: 30, wrap: 1300, in: S.werkmora, out: S.table }),
      sans('werkmora-forecast', 120, 330, w.text('werkmora-forecast'), { size: 30, wrap: 1300, in: S.werkmora, out: S.table }),
      hand('werkmora-ask', 120, 500, w.text('werkmora-ask'), { size: 56, tone: 'accent', in: S.werkmora, out: S.table }),

      // The guide's fraud table: row A, row B, then the costs, the reason, Elkan's threshold and a cost that moves.
      hand('title-fraud', 120, 160, w.text('title-fraud'), { size: 52, in: S.table, out: S.two }),
      sans('fraud-setup', 120, 240, w.text('fraud-setup'), { size: 28, in: S.table, out: S.two }),
      ...(['threshold', ...COUNTS] as const).map((c) =>
        sans(`col-${c}`, COLS[c], 330, w.text(`col-${c}`), { size: 24, tone: 'muted', in: S.table, out: S.two }),
      ),
      ...COSTS.map((c) => sans(`col-${c}`, COLS[c], 330, w.text(`col-${c}`), { size: 24, tone: 'muted', in: S.total, out: S.two })),
      { id: 'rule', tone: 'muted', in: S.table, out: S.two, shape: { kind: 'line', points: [[120, 350], [1700, 350]] } },
      ...row('a', S.table),
      ...row('b', S.rowb),
      { id: 'mark-precision', tone: 'accent', in: S.rowb, out: S.two, shape: { kind: 'ellipse', x: 770, y: 460, w: 140, h: 70 } },
      hand('b-looks', 800, 560, w.text('b-looks'), { size: 30, tone: 'accent', in: S.rowb, out: S.two }),
      { id: 'mark-total', tone: 'warn', in: S.total, out: S.two, shape: { kind: 'ellipse', x: 1470, y: 460, w: 200, h: 70 } },
      hand('ratio', 1020, 610, w.text('ratio'), { size: 40, tone: 'warn', in: S.total, out: S.two }),
      sans('step-line', 120, 700, w.text('step-line'), { size: 30, wrap: 1250, in: S.step, out: S.two }),
      sans('assumptions', 120, 750, w.text('assumptions'), { size: 22, tone: 'muted', in: S.step, out: S.two }),
      hand('elkan', 120, 840, w.text('elkan'), { size: 40, tone: 'accent', in: S.elkan, out: S.two }),
      sans('elkan-credit', 120, 890, w.text('elkan-credit'), { size: 22, tone: 'muted', in: S.elkan, out: S.two }),
      hand('moves', 120, 970, w.text('moves'), { size: 36, in: S.moves, out: S.two }),
      hand('decision', 120, 1040, w.text('decision'), { size: 44, tone: 'accent', in: S.moves, out: S.two }),

      // Two thresholds on the score line, the band between them with its price and capacity, then Kaiser.
      hand('title-two', 120, 160, w.text('title-two'), { size: 52, in: S.two, out: S.forecast }),
      sans('two-credit', 120, 230, w.text('two-credit'), { size: 22, tone: 'muted', in: S.two, out: S.forecast }),
      { id: 'band', tone: 'marker', in: S.two, out: S.forecast, shape: { kind: 'box', x: 600, y: 340, w: 400, h: 120, fill: true } },
      { id: 'axis', in: S.two, out: S.forecast, shape: { kind: 'arrow', x1: 200, y1: 460, x2: 1320, y2: 460 } },
      { id: 'tick-low-line', tone: 'accent', in: S.two, out: S.forecast, shape: { kind: 'line', points: [[600, 330], [600, 480]] } },
      { id: 'tick-high-line', tone: 'accent', in: S.two, out: S.forecast, shape: { kind: 'line', points: [[1000, 330], [1000, 480]] } },
      sans('axis-label', 1340, 470, w.text('axis-label'), { size: 24, tone: 'muted', in: S.two, out: S.forecast }),
      hand('region-through', 400, 415, w.text('region-through'), { size: 36, anchor: 'middle', in: S.two, out: S.forecast }),
      hand('region-person', 800, 415, w.text('region-person'), { size: 36, anchor: 'middle', tone: 'accent', in: S.two, out: S.forecast }),
      hand('region-act', 1160, 415, w.text('region-act'), { size: 36, anchor: 'middle', in: S.two, out: S.forecast }),
      sans('tick-low', 600, 515, w.text('tick-low'), { size: 24, anchor: 'middle', tone: 'muted', in: S.two, out: S.forecast }),
      sans('tick-high', 1000, 515, w.text('tick-high'), { size: 24, anchor: 'middle', tone: 'muted', in: S.two, out: S.forecast }),
      hand('band-price', 120, 610, w.text('band-price'), { size: 38, in: S.band, out: S.forecast }),
      hand('band-capacity', 120, 670, w.text('band-capacity'), { size: 38, in: S.band, out: S.forecast }),
      sans('band-wide', 120, 730, w.text('band-wide'), { size: 24, tone: 'muted', in: S.band, out: S.forecast }),
      hand('kaiser', 120, 830, w.text('kaiser'), { size: 38, tone: 'accent', in: S.kaiser, out: S.forecast }),
      sans('kaiser-body', 120, 890, w.text('kaiser-body'), { size: 26, wrap: 1250, in: S.kaiser, out: S.forecast }),
      sans('kaiser-credit', 120, 990, w.text('kaiser-credit'), { size: 22, tone: 'muted', in: S.kaiser, out: S.forecast }),

      // Werkmora's threshold: the service level per item group, who decides it, and the row that changes.
      hand('title-service', 120, 160, w.text('title-service'), { size: 56, in: S.forecast, out: S.takeaway }),
      { id: 'service-tag', tone: 'muted', in: S.forecast, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('service-tag') } },
      sans('service-what', 120, 250, w.text('service-what'), { size: 28, wrap: 1300, in: S.forecast, out: S.takeaway }),
      hand('service-short', 120, 350, w.text('service-short'), { size: 36, tone: 'warn', in: S.forecast, out: S.takeaway }),
      hand('service-excess', 120, 405, w.text('service-excess'), { size: 36, tone: 'warn', in: S.forecast, out: S.takeaway }),
      ...(Object.keys(LEVEL_COLS) as (keyof typeof LEVEL_COLS)[]).map((c) =>
        sans(`col-${c}`, LEVEL_COLS[c], 490, w.text(`col-${c}`), { size: 24, tone: 'muted', in: S.levels, out: S.takeaway }),
      ),
      sans('level-rule', 1160, 490, w.text('level-rule'), { size: 22, tone: 'muted', in: S.levels, out: S.takeaway }),
      ...levels,
      hand('owner', 120, 740, w.text('owner'), { size: 40, tone: 'accent', in: S.owner, out: S.takeaway }),
      sans('owner-table', 120, 795, w.text('owner-table'), { size: 24, wrap: 1250, in: S.owner, out: S.takeaway }),
      sans('owner-band', 120, 870, w.text('owner-band'), { size: 24, in: S.owner, out: S.takeaway }),
      hand('june', 120, 960, w.text('june'), { size: 36, wrap: 1250, in: S.june, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
