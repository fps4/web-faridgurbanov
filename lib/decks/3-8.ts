import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.8, "Non-functional requirements" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-8.yaml; this file places them on the stage by id. The episode follows the
// wiki notes (publishing/ai-product-design/episodes/03-data/08-non-functional-requirements.slides.md):
// what the episode promises, a requirements page with only an accuracy line, the CJEU's
// Dun & Bradstreet Austria ruling (with SCHUFA) as the case, Werkmora and the nine requirements,
// then the nine in three scenes (speed and cost on a batch timeline, the data boundary, cadence and
// fallback), and the one-page sheet with an owner per row. Booking.com's latency number is the
// prep's online contrast; Werkmora's times, volumes and owners are fictional (company.md §7.1).

const STEPS = [
  'title',
  'promise',
  'usual',
  'golive',
  'refused',
  'court',
  'logged',
  'werkmora',
  'nine',
  'latency',
  'window',
  'throughput',
  'cost',
  'boundary',
  'provider',
  'explain',
  'cadence',
  'down',
  'unsure',
  'sheet',
  'badnight',
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

const episode = episodeByNumber('3.8') ?? missing('episode 3.8 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.8 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.8 needs its closing card');

// The guide's nine requirements, in its order: a 3×3 grid when they are named, the rows of the sheet
// at the close.
const NFRS = ['latency', 'batch', 'throughput', 'cost', 'where', 'privacy', 'explain', 'cadence', 'fallback'] as const;

// The questions that turn up at go-live, next to a page that only has an accuracy line.
const QUESTIONS = ['fast', 'cost', 'leave', 'why', 'down'] as const;

// The nightly batch window: hours along a line, from midnight (x = 160) to the 06:00 cut-off.
const H = (hour: number) => Math.round(160 + 200 * hour);
const TIMELINE_Y = 690;
const MARKS: { key: string; hour: number; tone?: 'warn' }[] = [
  { key: 'weather', hour: 0 },
  { key: 'sales', hour: 0.5 },
  { key: 'orders', hour: 5 },
  { key: 'cutoff', hour: 6, tone: 'warn' },
];

export const layout38: DeckLayout<Step> = {
  id: '3-8',
  episode: '3.8',
  steps: STEPS,
  figure: 'cost',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // The empty requirements page: one accuracy line, then blank ruled lines.
  const ruled: Element[] = [480, 550, 620, 690].map((y, i) => ({
    id: `usual-ruled-${i + 1}`,
    tone: 'muted',
    in: S.usual,
    out: S.refused,
    shape: { kind: 'line', points: [[160, y], [840, y]] },
  }));

  const questions: Element[] = QUESTIONS.map((key, i) =>
    hand(`ask-${key}`, 980, 320 + i * 80, w.text(`ask-${key}`), { size: 40, tone: 'warn', in: S.golive, out: S.refused }),
  );

  // The nine, named once as a grid.
  const grid: Element[] = NFRS.flatMap((key, i) => {
    const x = 120 + (i % 3) * 420;
    const y = 440 + Math.floor(i / 3) * 115;
    return [
      { id: `grid-${key}`, in: S.nine, out: S.latency, shape: { kind: 'box', x, y, w: 380, h: 90 } },
      hand(`grid-${key}-label`, x + 24, y + 58, w.text(`nfr-${key}`), { size: 34, in: S.nine, out: S.latency }),
    ];
  });

  // The batch window: the run as a filled bar, the other moments as marks above the line.
  const hours: Element[] = [0, 1, 2, 3, 4, 5, 6].map((h) =>
    sans(`hour-${h}`, H(h), TIMELINE_Y + 50, w.text(`hour-${h}`), { size: 22, anchor: 'middle', tone: 'muted', in: S.window, out: S.boundary }),
  );
  const marks: Element[] = MARKS.flatMap(({ key, hour, tone }) => [
    { id: `mark-${key}`, tone, in: S.window, out: S.boundary, shape: { kind: 'arrow', x1: H(hour), y1: 650, x2: H(hour), y2: TIMELINE_Y - 5 } },
    hand(`mark-${key}-label`, H(hour), 625, w.text(`mark-${key}`), { size: 28, anchor: 'middle', tone, in: S.window, out: S.boundary }),
  ]);

  // The one-page sheet: requirement, Werkmora's value, owner.
  const sheet: Element[] = NFRS.flatMap((key, i) => {
    const y = 300 + i * 60;
    return [
      hand(`sheet-${key}`, 120, y, w.text(`nfr-${key}`), { size: 30, tone: 'accent', in: S.sheet, out: S.takeaway }),
      sans(`sheet-${key}-value`, 460, y, w.text(`sheet-${key}-value`), { size: 24, in: S.sheet, out: S.takeaway }),
      sans(`sheet-${key}-owner`, 1130, y, w.text(`sheet-${key}-owner`), { size: 22, tone: 'muted', in: S.sheet, out: S.takeaway }),
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

      // The usual page: accuracy only. The other questions arrive at go-live.
      hand('title-usual', 120, 160, w.text('title-usual'), { size: 56, in: S.usual, out: S.refused }),
      { id: 'usual-page', in: S.usual, out: S.refused, shape: { kind: 'box', x: 120, y: 260, w: 760, h: 520 } },
      hand('usual-head', 160, 330, w.text('usual-head'), { size: 40, in: S.usual, out: S.refused }),
      sans('usual-line', 160, 410, w.text('usual-line'), { size: 32, in: S.usual, out: S.refused }),
      ...ruled,
      ...questions,
      { id: 'golive-tag', tone: 'warn', in: S.golive, out: S.refused, shape: { kind: 'tag', x: 980, y: 730, text: w.text('golive-tag') } },

      // The case: a €10 contract refused on a score, and what the court said a reason must be.
      hand('title-case', 120, 160, w.text('title-case'), { size: 56, in: S.refused, out: S.werkmora }),
      hand('refused-amount', 120, 330, w.text('refused-amount'), { size: 96, tone: 'warn', in: S.refused, out: S.werkmora }),
      sans('refused-what', 120, 410, w.text('refused-what'), { size: 30, wrap: 1250, in: S.refused, out: S.werkmora }),
      hand('court-quote', 120, 550, w.text('court-quote'), { size: 44, tone: 'accent', wrap: 1250, in: S.court, out: S.werkmora }),
      hand('court-not', 120, 680, w.text('court-not'), { size: 38, wrap: 1250, in: S.court, out: S.werkmora }),
      sans('schufa', 120, 820, w.text('schufa'), { size: 26, wrap: 1250, in: S.court, out: S.werkmora }),
      sans('court-credit', 120, 890, w.text('court-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.refused, out: S.werkmora }),
      { id: 'logged-box', tone: 'accent', in: S.logged, out: S.werkmora, shape: { kind: 'box', x: 1460, y: 260, w: 380, h: 400 } },
      hand('logged-title', 1490, 330, w.text('logged-title'), { size: 36, tone: 'accent', in: S.logged, out: S.werkmora }),
      sans('logged-what', 1490, 400, w.text('logged-what'), { size: 26, wrap: 320, in: S.logged, out: S.werkmora }),

      // Werkmora in a few seconds, then the nine requirements as a grid.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.latency }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.latency, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 240, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.latency }),
      hand('werkmora-req', 120, 380, w.text('werkmora-req'), { size: 40, tone: 'accent', in: S.werkmora, out: S.latency }),
      ...grid,
      hand('nine-caption', 120, 870, w.text('nine-caption'), { size: 40, tone: 'accent', in: S.nine, out: S.latency }),

      // Speed, volume and cost: the online price of latency, then Werkmora's batch window.
      hand('title-speed', 120, 160, w.text('title-speed'), { size: 56, in: S.latency, out: S.boundary }),
      hand('latency-title', 120, 260, w.text('latency-title'), { size: 44, tone: 'accent', in: S.latency, out: S.boundary }),
      sans('booking', 120, 330, w.text('booking'), { size: 30, wrap: 1250, in: S.latency, out: S.boundary }),
      sans('booking-credit', 120, 420, w.text('booking-credit'), { size: 22, tone: 'muted', in: S.latency, out: S.boundary }),
      hand('window-title', 120, 540, w.text('window-title'), { size: 44, tone: 'accent', in: S.window, out: S.boundary }),
      { id: 'speed-tag', tone: 'muted', in: S.window, out: S.boundary, shape: { kind: 'tag', x: 1000, y: 525, text: w.text('speed-tag') } },
      { id: 'timeline', in: S.window, out: S.boundary, shape: { kind: 'line', points: [[H(0), TIMELINE_Y], [H(6), TIMELINE_Y]] } },
      { id: 'run', tone: 'accent', in: S.window, out: S.boundary, shape: { kind: 'box', x: H(1), y: TIMELINE_Y - 25, w: H(4) - H(1), h: 50, fill: true } },
      hand('run-label', H(2.5), 625, w.text('run-label'), { size: 28, anchor: 'middle', tone: 'accent', in: S.window, out: S.boundary }),
      ...marks,
      ...hours,
      hand('throughput', 120, 840, w.text('throughput'), { size: 34, in: S.throughput, out: S.boundary }),
      hand('cost', 120, 920, w.text('cost'), { size: 34, in: S.cost, out: S.boundary }),
      sans('cost-credit', 120, 980, w.text('cost-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.cost, out: S.boundary }),

      // The data boundary: what runs inside, what comes in, and what a prompt could carry out.
      hand('title-bounds', 120, 160, w.text('title-bounds'), { size: 56, in: S.boundary, out: S.cadence }),
      { id: 'bounds-tag', tone: 'muted', in: S.boundary, out: S.cadence, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('bounds-tag') } },
      { id: 'boundary', tone: 'muted', in: S.boundary, out: S.cadence, shape: { kind: 'box', x: 120, y: 250, w: 900, h: 510 } },
      hand('boundary-label', 150, 300, w.text('boundary-label'), { size: 30, tone: 'muted', in: S.boundary, out: S.cadence }),
      { id: 'box-inputs', in: S.boundary, out: S.cadence, shape: { kind: 'box', x: 160, y: 340, w: 310, h: 90 } },
      hand('box-inputs-label', 180, 398, w.text('box-inputs'), { size: 32, in: S.boundary, out: S.cadence }),
      { id: 'box-lakehouse', tone: 'accent', in: S.boundary, out: S.cadence, shape: { kind: 'box', x: 560, y: 340, w: 320, h: 90 } },
      hand('box-lakehouse-label', 580, 398, w.text('box-lakehouse'), { size: 32, tone: 'accent', in: S.boundary, out: S.cadence }),
      { id: 'box-erp', in: S.boundary, out: S.cadence, shape: { kind: 'box', x: 560, y: 580, w: 320, h: 90 } },
      hand('box-erp-label', 580, 638, w.text('box-erp'), { size: 32, in: S.boundary, out: S.cadence }),
      { id: 'arrow-inputs', in: S.boundary, out: S.cadence, shape: { kind: 'arrow', x1: 470, y1: 385, x2: 560, y2: 385 } },
      { id: 'arrow-erp', in: S.boundary, out: S.cadence, shape: { kind: 'arrow', x1: 720, y1: 430, x2: 720, y2: 580 } },
      { id: 'box-weather', in: S.boundary, out: S.cadence, shape: { kind: 'box', x: 1100, y: 340, w: 300, h: 90 } },
      hand('box-weather-label', 1120, 398, w.text('box-weather'), { size: 32, in: S.boundary, out: S.cadence }),
      { id: 'arrow-weather', in: S.boundary, out: S.cadence, shape: { kind: 'arrow', x1: 1100, y1: 385, x2: 880, y2: 385 } },
      sans('weather-licence', 1250, 470, w.text('weather-licence'), { size: 22, anchor: 'middle', tone: 'muted', in: S.boundary, out: S.cadence }),
      hand('boundary-line', 120, 840, w.text('boundary-line'), { size: 34, in: S.boundary, out: S.cadence }),
      { id: 'box-provider', tone: 'warn', in: S.provider, out: S.cadence, shape: { kind: 'box', x: 1100, y: 580, w: 300, h: 90 } },
      hand('box-provider-label', 1120, 638, w.text('box-provider'), { size: 32, tone: 'warn', in: S.provider, out: S.cadence }),
      { id: 'arrow-provider', tone: 'warn', in: S.provider, out: S.cadence, shape: { kind: 'arrow', x1: 880, y1: 625, x2: 1100, y2: 625 } },
      hand('prompt-label', 950, 670, w.text('prompt-label'), { size: 28, anchor: 'middle', tone: 'warn', in: S.provider, out: S.cadence }),
      sans('schrems', 120, 910, w.text('schrems'), { size: 26, wrap: 1250, in: S.provider, out: S.cadence }),
      { id: 'explain-box', tone: 'accent', in: S.explain, out: S.cadence, shape: { kind: 'box', x: 1460, y: 260, w: 380, h: 400 } },
      hand('explain-q', 1490, 330, w.text('explain-q'), { size: 40, tone: 'accent', in: S.explain, out: S.cadence }),
      sans('explain-a', 1490, 400, w.text('explain-a'), { size: 26, wrap: 320, in: S.explain, out: S.cadence }),
      sans('explain-why', 1490, 570, w.text('explain-why'), { size: 22, tone: 'muted', wrap: 320, in: S.explain, out: S.cadence }),

      // Over time and on a bad night: the retrain rule, then the two fallbacks side by side.
      hand('title-time', 120, 160, w.text('title-time'), { size: 56, in: S.cadence, out: S.sheet }),
      { id: 'time-tag', tone: 'muted', in: S.cadence, out: S.sheet, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('time-tag') } },
      hand('cadence-title', 120, 260, w.text('cadence-title'), { size: 44, tone: 'accent', in: S.cadence, out: S.sheet }),
      sans('cadence', 120, 330, w.text('cadence'), { size: 30, wrap: 1250, in: S.cadence, out: S.sheet }),
      hand('fallback-title', 120, 470, w.text('fallback-title'), { size: 44, tone: 'accent', in: S.down, out: S.sheet }),
      { id: 'box-down', tone: 'warn', in: S.down, out: S.sheet, shape: { kind: 'box', x: 120, y: 510, w: 600, h: 260 } },
      hand('down-label', 150, 570, w.text('down-label'), { size: 40, tone: 'warn', in: S.down, out: S.sheet }),
      sans('down-what', 150, 630, w.text('down-what'), { size: 28, wrap: 540, in: S.down, out: S.sheet }),
      hand('retry', 120, 830, w.text('retry'), { size: 32, tone: 'warn', in: S.down, out: S.sheet }),
      { id: 'box-unsure', in: S.unsure, out: S.sheet, shape: { kind: 'box', x: 780, y: 510, w: 600, h: 260 } },
      hand('unsure-label', 810, 570, w.text('unsure-label'), { size: 40, in: S.unsure, out: S.sheet }),
      sans('unsure-what', 810, 630, w.text('unsure-what'), { size: 28, wrap: 540, in: S.unsure, out: S.sheet }),
      sans('law', 120, 900, w.text('law'), { size: 24, tone: 'muted', wrap: 1250, in: S.unsure, out: S.sheet }),

      // The close: one page with a number and an owner per row, then the bad nights to test.
      hand('title-sheet', 120, 160, w.text('title-sheet'), { size: 56, in: S.sheet, out: S.takeaway }),
      { id: 'sheet-tag', tone: 'muted', in: S.sheet, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('sheet-tag') } },
      sans('col-value', 460, 240, w.text('col-value'), { size: 22, tone: 'muted', in: S.sheet, out: S.takeaway }),
      sans('col-owner', 1130, 240, w.text('col-owner'), { size: 22, tone: 'muted', in: S.sheet, out: S.takeaway }),
      ...sheet,
      hand('badnight-test', 1470, 300, w.text('badnight-test'), { size: 32, tone: 'accent', wrap: 360, in: S.badnight, out: S.takeaway }),
      sans('badnight-watch', 1470, 520, w.text('badnight-watch'), { size: 24, wrap: 360, in: S.badnight, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
