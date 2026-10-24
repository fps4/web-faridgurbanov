import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.12, "What it costs" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-12.yaml; this file places them on the stage by id. The episode follows the
// wiki prep (publishing/ai-product-design/episodes/03-data/12-what-it-costs.md): what the episode
// promises, the cloud bill as the usual answer, Strubell et al. (2019) as the case (one training run
// against the full R&D), Werkmora's cost lines one row per click with the research next to each, the
// line the guide leaves out (being wrong, with Zillow's Q3 2021 write-down), which line is the
// biggest for a small forecast and for a big model at volume, and the one page with owners. The
// Strubell, Zillow and Google numbers are the sources'; Werkmora's drivers and bars are fictional.

const STEPS = [
  'title',
  'promise',
  'bill',
  'run',
  'rnd',
  'lesson',
  'werkmora',
  'data',
  'labels',
  'training',
  'inference',
  'people',
  'debt',
  'wrong',
  'zillow',
  'small',
  'big',
  'page',
  'paydown',
  'cheap',
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

const episode = episodeByNumber('3.12') ?? missing('episode 3.12 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.12 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.12 needs its closing card');

// Strubell et al. (2019), Table 4, on one linear scale: the upper bound of each range against the full
// R&D's $350k at 520 px. The first two bars are a few pixels high, which is the point.
const STRUBELL = [
  { key: 'run', x: 220, h: 4, step: 'run' },
  { key: 'tune', x: 600, h: 8, step: 'rnd' },
  { key: 'full', x: 980, h: 520, step: 'rnd' },
] as const;
const BASE = 820;

// The cost lines, one row per click, in the order the script names them: the guide's five (data and
// labelling as two rows), then the one the research adds.
const LINES = ['data', 'labels', 'training', 'inference', 'people', 'debt', 'wrong'] as const;
const lineY = (i: number) => 300 + i * 85;

// Sculley et al.'s debt types, listed in the right-hand panel on the maintenance row.
const DEBT: { key: string; y: number }[] = [
  { key: 'cace', y: 330 },
  { key: 'data', y: 410 },
  { key: 'loops', y: 455 },
  { key: 'glue', y: 500 },
  { key: 'config', y: 545 },
  { key: 'world', y: 590 },
];

// Which line is the biggest: Werkmora's order without amounts (fictional), and Google's energy split.
const SMALL_BARS = [
  { key: 'people', x: 150, h: 360, tone: 'accent' },
  { key: 'data', x: 320, h: 290, tone: 'accent' },
  { key: 'experiments', x: 490, h: 200, tone: 'ink' },
  { key: 'inference', x: 660, h: 30, tone: 'muted' },
] as const;
const BIG_BARS = [
  { key: 'inference', x: 1000, h: 360, tone: 'accent' },
  { key: 'training', x: 1210, h: 240, tone: 'ink' },
] as const;
const FLOOR = 780;

// The one page: two example rows under four columns.
const COLUMNS = [
  { key: 'line', x: 150 },
  { key: 'driver', x: 470 },
  { key: 'owner', x: 850 },
  { key: 'grows', x: 1130 },
] as const;
const ROWS = [
  { key: 'weather', y: 450 },
  { key: 'inference', y: 540 },
] as const;

export const layout312: DeckLayout<Step> = {
  id: '3-12',
  episode: '3.12',
  steps: STEPS,
  figure: 'zillow',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const strubell: Element[] = STRUBELL.flatMap(({ key, x, h, step }) => [
    { id: `bar-${key}`, tone: key === 'full' ? 'warn' : 'ink', in: S[step], out: S.werkmora, shape: { kind: 'box', x, y: BASE - h, w: 200, h, fill: true } },
    hand(`value-${key}`, x + 100, key === 'full' ? BASE - h - 30 : BASE - 30, w.text(`value-${key}`), {
      size: 48,
      anchor: 'middle',
      tone: key === 'full' ? 'warn' : 'ink',
      in: S[step],
      out: S.werkmora,
    }),
    sans(`label-${key}`, x + 100, 870, w.text(`label-${key}`), { size: 26, anchor: 'middle', wrap: 320, in: S[step], out: S.werkmora }),
  ]);

  const lines: Element[] = LINES.flatMap((key, i) => [
    hand(`line-${key}`, 120, lineY(i), w.text(`line-${key}`), { size: 40, tone: key === 'wrong' ? 'warn' : 'accent', in: S[key], out: S.small }),
    sans(`line-${key}-werkmora`, 540, lineY(i), w.text(`line-${key}-werkmora`), { size: 26, wrap: 860, in: S[key], out: S.small }),
  ]);

  const debt: Element[] = DEBT.map(({ key, y }) =>
    sans(`debt-${key}`, 1460, y, w.text(`debt-${key}`), { size: 24, wrap: 380, in: S.debt, out: S.wrong }),
  );

  const smallBars: Element[] = SMALL_BARS.flatMap(({ key, x, h, tone }) => [
    { id: `bar-small-${key}`, tone, in: S.small, out: S.page, shape: { kind: 'box', x, y: FLOOR - h, w: 130, h, fill: true } },
    sans(`bar-${key}`, x + 65, 825, w.text(`bar-${key}`), { size: 24, anchor: 'middle', in: S.small, out: S.page }),
  ]);

  const bigBars: Element[] = BIG_BARS.flatMap(({ key, x, h, tone }) => [
    { id: `bar-big-${key}-box`, tone, in: S.big, out: S.page, shape: { kind: 'box', x, y: FLOOR - h, w: 150, h, fill: true } },
    sans(`bar-big-${key}`, x + 75, 825, w.text(`bar-big-${key}`), { size: 24, anchor: 'middle', in: S.big, out: S.page }),
  ]);

  const columns: Element[] = COLUMNS.map(({ key, x }) =>
    sans(`col-${key}`, x, 385, w.text(`col-${key}`), { size: 24, tone: 'muted', in: S.page, out: S.takeaway }),
  );

  const rows: Element[] = ROWS.flatMap(({ key, y }) => [
    hand(`row-${key}`, 150, y, w.text(`row-${key}`), { size: 32, tone: 'accent', in: S.page, out: S.takeaway }),
    hand(`row-${key}-driver`, 470, y, w.text(`row-${key}-driver`), { size: 32, in: S.page, out: S.takeaway }),
    hand(`row-${key}-owner`, 850, y, w.text(`row-${key}-owner`), { size: 32, in: S.page, out: S.takeaway }),
    hand(`row-${key}-grows`, 1130, y, w.text(`row-${key}-grows`), { size: 32, wrap: 230, in: S.page, out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.bill }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.bill }),
      ),

      // The question, and the usual answer.
      hand('question', 120, 380, w.text('question'), { size: 80, tone: 'accent', in: S.bill, out: S.run }),
      hand('answer', 120, 520, w.text('answer'), { size: 52, in: S.bill, out: S.run }),
      { id: 'answer-tag', tone: 'muted', in: S.bill, out: S.run, shape: { kind: 'tag', x: 120, y: 640, text: w.text('answer-tag') } },

      // Strubell et al.: one training run, one tuning, the full R&D, on one scale.
      hand('title-strubell', 120, 160, w.text('title-strubell'), { size: 52, in: S.run, out: S.werkmora }),
      { id: 'strubell-base', in: S.run, out: S.werkmora, shape: { kind: 'line', points: [[160, BASE], [1240, BASE]] } },
      ...strubell,
      sans('strubell-credit', 160, 975, w.text('strubell-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.run, out: S.werkmora }),
      hand('lesson', 1300, 330, w.text('lesson'), { size: 44, tone: 'accent', wrap: 520, in: S.lesson, out: S.werkmora }),
      sans('lesson-only', 1300, 470, w.text('lesson-only'), { size: 28, wrap: 520, in: S.lesson, out: S.werkmora }),

      // Werkmora and the board's question.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.data }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.data, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 260, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.data }),
      hand('board', 120, 480, w.text('board'), { size: 52, tone: 'accent', in: S.werkmora, out: S.data }),
      hand('first-answer', 120, 600, w.text('first-answer'), { size: 40, wrap: 1250, in: S.werkmora, out: S.data }),

      // The cost lines: one row per click on the left, the research for that row on the right.
      hand('title-lines', 120, 160, w.text('title-lines'), { size: 56, in: S.data, out: S.small }),
      { id: 'lines-tag', tone: 'muted', in: S.data, out: S.small, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('lines-tag') } },
      ...lines,
      sans('labels-quote', 1460, 300, w.text('labels-quote'), { size: 26, wrap: 380, in: S.labels, out: S.training }),
      sans('labels-credit', 1460, 400, w.text('labels-credit'), { size: 20, tone: 'muted', wrap: 380, in: S.labels, out: S.training }),
      sans('labels-tool', 1460, 470, w.text('labels-tool'), { size: 24, wrap: 380, in: S.labels, out: S.training }),
      sans('labels-tool-credit', 1460, 590, w.text('labels-tool-credit'), { size: 20, tone: 'muted', wrap: 380, in: S.labels, out: S.training }),
      hand('training-note', 1460, 300, w.text('training-note'), { size: 40, tone: 'accent', wrap: 380, in: S.training, out: S.inference }),
      hand('inference-note', 1460, 300, w.text('inference-note'), { size: 40, tone: 'accent', wrap: 380, in: S.inference, out: S.people }),
      { id: 'arrow-inference', tone: 'accent', in: S.inference, out: S.people, shape: { kind: 'arrow', x1: 1500, y1: 380, x2: 1420, y2: lineY(3) - 10 } },
      sans('people-quote', 1460, 300, w.text('people-quote'), { size: 26, wrap: 380, in: S.people, out: S.debt }),
      sans('people-credit', 1460, 400, w.text('people-credit'), { size: 20, tone: 'muted', wrap: 380, in: S.people, out: S.debt }),
      hand('debt-title', 1460, 280, w.text('debt-title'), { size: 36, tone: 'accent', in: S.debt, out: S.wrong }),
      ...debt,
      sans('debt-credit', 1460, 640, w.text('debt-credit'), { size: 20, tone: 'muted', wrap: 380, in: S.debt, out: S.wrong }),

      // The line the guide leaves out: Zillow's Q3 2021 write-down in a box on the right.
      { id: 'zillow-box', tone: 'warn', in: S.zillow, out: S.small, shape: { kind: 'box', x: 1460, y: 250, w: 400, h: 420 } },
      hand('zillow-amount', 1660, 330, w.text('zillow-amount'), { size: 56, anchor: 'middle', tone: 'warn', in: S.zillow, out: S.small }),
      sans('zillow-what', 1480, 390, w.text('zillow-what'), { size: 24, wrap: 360, in: S.zillow, out: S.small }),
      sans('zillow-quote', 1480, 470, w.text('zillow-quote'), { size: 22, wrap: 360, in: S.zillow, out: S.small }),
      sans('zillow-credit', 1480, 620, w.text('zillow-credit'), { size: 20, tone: 'muted', wrap: 360, in: S.zillow, out: S.small }),

      // Which line is the biggest: a small forecast on the left, a big model at volume on the right.
      hand('title-biggest', 120, 160, w.text('title-biggest'), { size: 56, in: S.small, out: S.page }),
      hand('small-title', 120, 270, w.text('small-title'), { size: 40, in: S.small, out: S.page }),
      { id: 'small-tag', tone: 'muted', in: S.small, out: S.page, shape: { kind: 'tag', x: 120, y: 340, text: w.text('small-tag') } },
      { id: 'small-floor', in: S.small, out: S.page, shape: { kind: 'line', points: [[120, FLOOR], [820, FLOOR]] } },
      ...smallBars,
      hand('big-title', 960, 270, w.text('big-title'), { size: 40, in: S.big, out: S.page }),
      { id: 'big-tag', tone: 'warn', in: S.big, out: S.page, shape: { kind: 'tag', x: 960, y: 340, text: w.text('big-tag') } },
      { id: 'big-floor', in: S.big, out: S.page, shape: { kind: 'line', points: [[960, FLOOR], [1400, FLOOR]] } },
      ...bigBars,
      sans('big-credit', 960, 880, w.text('big-credit'), { size: 22, tone: 'muted', wrap: 460, in: S.big, out: S.page }),
      sans('bloomz', 960, 960, w.text('bloomz'), { size: 24, wrap: 460, in: S.big, out: S.page }),

      // The close: one page of lines with drivers and owners, the debt as work, the model as the cheap part.
      hand('title-close', 120, 160, w.text('title-close'), { size: 56, in: S.page, out: S.takeaway }),
      sans('close-what', 120, 250, w.text('close-what'), { size: 30, wrap: 1250, in: S.page, out: S.takeaway }),
      { id: 'sheet', in: S.page, out: S.takeaway, shape: { kind: 'box', x: 120, y: 330, w: 1250, h: 290 } },
      { id: 'sheet-rule', tone: 'muted', in: S.page, out: S.takeaway, shape: { kind: 'line', points: [[140, 405], [1350, 405]] } },
      ...columns,
      ...rows,
      sans('owners', 120, 680, w.text('owners'), { size: 26, wrap: 1250, in: S.page, out: S.takeaway }),
      hand('paydown', 120, 800, w.text('paydown'), { size: 40, tone: 'accent', wrap: 1250, in: S.paydown, out: S.takeaway }),
      sans('paydown-credit', 120, 910, w.text('paydown-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.paydown, out: S.takeaway }),
      hand('cheap', 1460, 300, w.text('cheap'), { size: 44, tone: 'accent', wrap: 400, in: S.cheap, out: S.takeaway }),
      sans('value-case', 1460, 480, w.text('value-case'), { size: 26, wrap: 400, in: S.cheap, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
