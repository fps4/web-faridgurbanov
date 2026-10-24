import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.5, "Choosing metrics" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-5.yaml; this file places them on the stage by id. The episode follows the
// wiki script (publishing/ai-product-design/episodes/03-data/05-choosing-metrics.slides.md): what the
// episode promises, "95% accurate" as the usual single number, Booking.com as the case (offline gain
// against business gain), Werkmora's decision and its two forecast metrics, the guide's table of
// metrics and traps, per slice, the three levels with owners, a short note for agents, and the close.
// The Booking.com and QRISK2 numbers are the papers'; the cloud on the Booking.com axes is a
// schematic, not their data; everything about Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'usual',
  'booking',
  'nocorr',
  'health',
  'werkmora',
  'decision',
  'forecast',
  'classify',
  'rare',
  'calibration',
  'regression',
  'ranking',
  'slice',
  'levels',
  'owners',
  'month',
  'summary',
  'agents',
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

const episode = episodeByNumber('3.5') ?? missing('episode 3.5 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.5 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.5 needs its closing card');

// The guide's table, one row per task, each arriving at its click (ranking and generation together).
const ROWS: { key: string; step: Step }[] = [
  { key: 'classify', step: 'classify' },
  { key: 'rare', step: 'rare' },
  { key: 'calibration', step: 'calibration' },
  { key: 'regression', step: 'regression' },
  { key: 'ranking', step: 'ranking' },
  { key: 'generation', step: 'ranking' },
];

// The slices Werkmora reports per, as boxes fed by the overall number.
const DIMS = ['store', 'country', 'group', 'speed'] as const;

// The three levels of metric, top to bottom.
const LEVELS = ['business', 'model', 'guardrail'] as const;

// An agent's run: three steps and the state it ends in.
const CHAIN = ['agent-step-1', 'agent-step-2', 'agent-step-3', 'agent-end'] as const;

export const layout35: DeckLayout<Step> = {
  id: '3-5',
  episode: '3.5',
  steps: STEPS,
  figure: 'owners',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const rows: Element[] = ROWS.flatMap(({ key, step }, i) => {
    const y = 340 + i * 100;
    return [
      hand(`task-${key}`, 120, y, w.text(`task-${key}`), { size: 38, tone: 'accent', in: S[step], out: S.slice }),
      sans(`metric-${key}`, 470, y, w.text(`metric-${key}`), { size: 26, wrap: 420, in: S[step], out: S.slice }),
      sans(`trap-${key}`, 920, y, w.text(`trap-${key}`), { size: 26, wrap: 500, tone: 'warn', in: S[step], out: S.slice }),
    ];
  });

  const dims: Element[] = DIMS.flatMap((key, i) => {
    const y = 230 + i * 120;
    return [
      { id: `dim-${key}`, in: S.slice, out: S.levels, shape: { kind: 'box', x: 620, y, w: 520, h: 90 } },
      hand(`dim-${key}-label`, 650, y + 58, w.text(`dim-${key}`), { size: 32, in: S.slice, out: S.levels }),
      { id: `arrow-${key}`, in: S.slice, out: S.levels, shape: { kind: 'arrow', x1: 480, y1: 305, x2: 620, y2: y + 45 } },
    ];
  });

  const levels: Element[] = LEVELS.flatMap((key, i) => {
    const y = 300 + i * 150;
    return [
      hand(`level-${key}`, 120, y, w.text(`level-${key}`), { size: 44, tone: 'accent', in: S.levels, out: S.agents }),
      sans(`level-${key}-metrics`, 420, y, w.text(`level-${key}-metrics`), { size: 28, wrap: 560, in: S.levels, out: S.agents }),
      sans(`level-${key}-owner`, 1020, y, w.text(`level-${key}-owner`), { size: 26, wrap: 400, in: S.owners, out: S.agents }),
    ];
  });

  const chain: Element[] = CHAIN.flatMap((key, i) => {
    const x = 120 + i * 300;
    const last = i === CHAIN.length - 1;
    return [
      { id: `box-${key}`, tone: last ? 'accent' : undefined, in: S.agents, out: S.takeaway, shape: { kind: 'box', x, y: 440, w: 220, h: 90 } },
      hand(`${key}`, x + 110, 498, w.text(key), { size: 34, anchor: 'middle', tone: last ? 'accent' : undefined, in: S.agents, out: S.takeaway }),
      ...(last ? [] : [{ id: `arrow-${key}`, in: S.agents, out: S.takeaway, shape: { kind: 'arrow' as const, x1: x + 220, y1: 485, x2: x + 300, y2: 485 } }]),
    ];
  });

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

      // The usual single number.
      hand('quote', 120, 400, w.text('quote'), { size: 120, tone: 'accent', in: S.usual, out: S.booking }),
      hand('usual', 120, 560, w.text('usual'), { size: 52, in: S.usual, out: S.booking }),
      { id: 'usual-tag', tone: 'muted', in: S.usual, out: S.booking, shape: { kind: 'tag', x: 120, y: 680, text: w.text('usual-tag') } },

      // Booking.com: offline gain on one axis, business gain on the other, and no relation.
      hand('title-booking', 120, 160, w.text('title-booking'), { size: 52, in: S.booking, out: S.werkmora }),
      { id: 'axis-x', in: S.booking, out: S.werkmora, shape: { kind: 'arrow', x1: 200, y1: 820, x2: 900, y2: 820 } },
      { id: 'axis-y', in: S.booking, out: S.werkmora, shape: { kind: 'arrow', x1: 200, y1: 820, x2: 200, y2: 300 } },
      hand('axis-x-label', 550, 880, w.text('axis-x-label'), { size: 30, anchor: 'middle', tone: 'muted', in: S.booking, out: S.werkmora }),
      hand('axis-y-label', 220, 320, w.text('axis-y-label'), { size: 30, tone: 'muted', in: S.booking, out: S.werkmora }),
      sans('booking-what', 1000, 300, w.text('booking-what'), { size: 28, wrap: 820, in: S.booking, out: S.werkmora }),
      sans('booking-pairs', 1000, 410, w.text('booking-pairs'), { size: 28, wrap: 820, in: S.booking, out: S.werkmora }),
      sans('booking-credit', 120, 1010, w.text('booking-credit'), { size: 22, tone: 'muted', in: S.booking, out: S.werkmora }),
      { id: 'cloud', tone: 'accent', in: S.nocorr, out: S.werkmora, shape: { kind: 'ellipse', x: 300, y: 470, w: 520, h: 220 } },
      { id: 'cloud-tag', tone: 'muted', in: S.nocorr, out: S.werkmora, shape: { kind: 'tag', x: 680, y: 400, text: w.text('cloud-tag') } },
      hand('pearson', 1000, 540, w.text('pearson'), { size: 72, tone: 'warn', in: S.nocorr, out: S.werkmora }),
      sans('ci', 1000, 600, w.text('ci'), { size: 28, in: S.nocorr, out: S.werkmora }),
      hand('health', 1000, 690, w.text('health'), { size: 38, wrap: 430, tone: 'accent', in: S.health, out: S.werkmora }),
      sans('proxy', 120, 950, w.text('proxy'), { size: 26, wrap: 1280, in: S.health, out: S.werkmora }),

      // Werkmora: one number, then the decision it serves and the two errors around it.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.classify }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.classify, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 240, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.classify }),
      hand('one-number', 120, 360, w.text('one-number'), { size: 52, in: S.werkmora, out: S.classify }),
      hand('decision', 120, 470, w.text('decision'), { size: 44, tone: 'accent', in: S.decision, out: S.classify }),
      { id: 'bias-axis', in: S.decision, out: S.classify, shape: { kind: 'line', points: [[200, 620], [1300, 620]] } },
      { id: 'bias-tick', in: S.decision, out: S.classify, shape: { kind: 'line', points: [[750, 595], [750, 645]] } },
      hand('under', 200, 590, w.text('under'), { size: 34, tone: 'warn', in: S.decision, out: S.classify }),
      hand('over', 1300, 590, w.text('over'), { size: 34, anchor: 'end', tone: 'warn', in: S.decision, out: S.classify }),
      sans('zero', 750, 690, w.text('zero'), { size: 24, anchor: 'middle', tone: 'muted', in: S.decision, out: S.classify }),
      sans('wape', 120, 790, w.text('wape'), { size: 28, wrap: 1280, in: S.forecast, out: S.classify }),
      sans('bias', 120, 850, w.text('bias'), { size: 28, wrap: 1280, in: S.forecast, out: S.classify }),
      sans('mape', 120, 910, w.text('mape'), { size: 28, wrap: 1280, tone: 'warn', in: S.forecast, out: S.classify }),

      // The guide's table, row by row; the calibration example in a box on the right.
      hand('title-table', 120, 160, w.text('title-table'), { size: 52, in: S.classify, out: S.slice }),
      sans('col-task', 120, 260, w.text('col-task'), { size: 24, tone: 'muted', in: S.classify, out: S.slice }),
      sans('col-metric', 470, 260, w.text('col-metric'), { size: 24, tone: 'muted', in: S.classify, out: S.slice }),
      sans('col-trap', 920, 260, w.text('col-trap'), { size: 24, tone: 'muted', in: S.classify, out: S.slice }),
      ...rows,
      { id: 'qrisk', tone: 'accent', in: S.calibration, out: S.regression, shape: { kind: 'box', x: 1460, y: 240, w: 420, h: 420 } },
      hand('qrisk-title', 1480, 300, w.text('qrisk-title'), { size: 34, in: S.calibration, out: S.regression }),
      sans('qrisk-auroc', 1480, 360, w.text('qrisk-auroc'), { size: 24, wrap: 380, in: S.calibration, out: S.regression }),
      hand('qrisk-flagged', 1670, 490, w.text('qrisk-flagged'), { size: 64, anchor: 'middle', tone: 'warn', in: S.calibration, out: S.regression }),
      sans('qrisk-per', 1480, 550, w.text('qrisk-per'), { size: 24, wrap: 380, in: S.calibration, out: S.regression }),
      sans('qrisk-credit', 1480, 640, w.text('qrisk-credit'), { size: 20, tone: 'muted', in: S.calibration, out: S.regression }),
      sans('table-credit', 120, 980, w.text('table-credit'), { size: 22, tone: 'muted', in: S.regression, out: S.slice }),

      // Per slice: the overall number splits four ways.
      hand('title-slice', 120, 160, w.text('title-slice'), { size: 56, in: S.slice, out: S.levels }),
      { id: 'slice-tag', tone: 'muted', in: S.slice, out: S.levels, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('slice-tag') } },
      { id: 'overall', tone: 'accent', in: S.slice, out: S.levels, shape: { kind: 'box', x: 120, y: 260, w: 360, h: 90 } },
      hand('overall-label', 150, 318, w.text('overall'), { size: 36, tone: 'accent', in: S.slice, out: S.levels }),
      ...dims,
      hand('series', 1200, 270, w.text('series'), { size: 34, wrap: 600, in: S.slice, out: S.levels }),
      sans('weighted', 1200, 380, w.text('weighted'), { size: 26, wrap: 620, in: S.slice, out: S.levels }),
      hand('column', 1200, 540, w.text('column'), { size: 34, wrap: 600, tone: 'accent', in: S.slice, out: S.levels }),

      // Three levels, then their owners, then what a month of slices and guardrails shows.
      hand('title-levels', 120, 160, w.text('title-levels'), { size: 56, in: S.levels, out: S.agents }),
      { id: 'levels-tag', tone: 'muted', in: S.levels, out: S.agents, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('levels-tag') } },
      sans('col-owner', 1020, 240, w.text('col-owner'), { size: 24, tone: 'muted', in: S.owners, out: S.agents }),
      ...levels,
      { id: 'mark-guardrail', tone: 'warn', in: S.month, out: S.summary, shape: { kind: 'ellipse', x: 380, y: 525, w: 650, h: 195 } },
      hand('month', 120, 790, w.text('month'), { size: 36, wrap: 1250, tone: 'warn', in: S.month, out: S.summary }),
      hand('summary', 120, 800, w.text('summary'), { size: 40, wrap: 1250, tone: 'accent', in: S.summary, out: S.agents }),
      sans('health-again', 120, 930, w.text('health-again'), { size: 28, wrap: 1250, in: S.summary, out: S.agents }),

      // And for agents: the unit is the task, over several steps and every run.
      hand('title-agents', 120, 160, w.text('title-agents'), { size: 56, in: S.agents, out: S.takeaway }),
      hand('agents-unit', 120, 330, w.text('agents-unit'), { size: 64, tone: 'accent', in: S.agents, out: S.takeaway }),
      ...chain,
      hand('agents-check', 120, 660, w.text('agents-check'), { size: 44, in: S.agents, out: S.takeaway }),
      sans('agents-next', 120, 780, w.text('agents-next'), { size: 28, tone: 'muted', in: S.agents, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
