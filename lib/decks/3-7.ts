import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.7, "Baselines" (FS-0010): the layout. The words are in content/decks/<locale>/3-7.yaml;
// this file places them on the stage by id. The episode follows the wiki script
// (publishing/ai-product-design/episodes/03-data/07-baselines.slides.md): what the episode promises,
// a "40% more accurate" claim with nothing to compare it with, COMPAS against simple baselines as the
// case, Werkmora's three baselines on one test, one model with three claims, when to ship the
// heuristic, and the baseline that keeps running after launch. The COMPAS numbers are the paper's
// (Dressel & Farid 2018, Tables 1–2); Werkmora's numbers are fictional.

const STEPS = [
  'title',
  'promise',
  'claim',
  'than-what',
  'compas',
  'crowd',
  'two-features',
  'werkmora',
  'trivial',
  'heuristic',
  'today',
  'same-data',
  'm4',
  'table',
  'claims',
  'ship',
  'qualifiers',
  'keep',
  'owners',
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

const episode = episodeByNumber('3.7') ?? missing('episode 3.7 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.7 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.7 needs its closing card');

// COMPAS and its baselines: accuracy in percent, one bar each, in the order the script brings them.
const COMPAS_BASE = 820;
const COMPAS_BARS = [
  { key: 'compas', accuracy: 65.4, x: 240, step: 'compas', tone: 'ink' },
  { key: 'person', accuracy: 62.1, x: 460, step: 'crowd', tone: 'muted' },
  { key: 'crowd', accuracy: 67.0, x: 680, step: 'crowd', tone: 'accent' },
  { key: 'two', accuracy: 66.8, x: 900, step: 'two-features', tone: 'accent' },
] as const;

// The three baselines, one row per click: the name, the question it answers, Werkmora's version.
const BASELINES = ['trivial', 'heuristic', 'today'] as const;

// One model, three claims: WAPE on last spring, worst first (fictional). The model is the last row.
const WAPE_SCALE = 16;
const ROWS = [
  { key: 'naive', wape: 45 },
  { key: 'erp', wape: 38 },
  { key: 'rule', wape: 35 },
  { key: 'model', wape: 30 },
] as const;

// The three things that make "ship the heuristic" safe advice.
const QUALIFIERS = ['simple', 'fair', 'cost'] as const;

export const layout37: DeckLayout<Step> = {
  id: '3-7',
  episode: '3.7',
  steps: STEPS,
  figure: 'claims',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const bars: Element[] = COMPAS_BARS.flatMap(({ key, accuracy, x, step, tone }) => {
    const h = Math.round(7 * accuracy);
    const top = COMPAS_BASE - h;
    return [
      { id: `bar-${key}`, tone, in: S[step], out: S.werkmora, shape: { kind: 'box', x, y: top, w: 160, h, fill: true } },
      hand(`value-${key}`, x + 80, top - 20, w.text(`value-${key}`), { size: 48, anchor: 'middle', tone, in: S[step], out: S.werkmora }),
      sans(`label-${key}`, x + 80, 870, w.text(`label-${key}`), { size: 24, anchor: 'middle', in: S[step], out: S.werkmora }),
    ];
  });

  const baselines: Element[] = BASELINES.flatMap((key, i) => {
    const y = 290 + i * 140;
    return [
      hand(`b-${key}`, 120, y, w.text(`b-${key}`), { size: 44, tone: 'accent', in: S[key], out: S.table }),
      hand(`b-${key}-asks`, 120, y + 45, w.text(`b-${key}-asks`), { size: 30, tone: 'muted', in: S[key], out: S.table }),
      sans(`b-${key}-werkmora`, 480, y, w.text(`b-${key}-werkmora`), { size: 28, wrap: 900, in: S[key], out: S.table }),
    ];
  });

  const rows: Element[] = ROWS.flatMap(({ key, wape }, i) => {
    const top = 300 + i * 110;
    const len = WAPE_SCALE * wape;
    const tone = key === 'model' ? 'accent' : 'ink';
    const row: Element[] = [
      sans(`row-${key}`, 120, top + 42, w.text(`row-${key}`), { size: 28, in: S.table, out: S.ship }),
      { id: `wape-bar-${key}`, tone, in: S.table, out: S.ship, shape: { kind: 'box', x: 600, y: top, w: len, h: 60, fill: true } },
      hand(`wape-${key}`, 600 + len + 20, top + 45, w.text(`wape-${key}`), { size: 40, tone, in: S.table, out: S.ship }),
    ];
    // Each baseline row gets the model's gain against it; the model's own row does not.
    if (key !== 'model')
      row.push(hand(`gain-${key}`, 1460, top + 45, w.text(`gain-${key}`), { size: 36, tone: 'accent', in: S.claims, out: S.ship }));
    return row;
  });

  const qualifiers: Element[] = QUALIFIERS.map((key, i) =>
    hand(`q-${key}`, 120, 580 + i * 80, w.text(`q-${key}`), { size: 36, in: S.qualifiers, out: S.keep }),
  );

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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.claim }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.claim }),
      ),

      // The usual claim: a score with nothing next to it.
      hand('claim', 120, 360, w.text('claim'), { size: 80, tone: 'accent', in: S.claim, out: S.compas }),
      { id: 'claim-tag', tone: 'muted', in: S.claim, out: S.compas, shape: { kind: 'tag', x: 120, y: 460, text: w.text('claim-tag') } },
      hand('than-what', 120, 600, w.text('than-what'), { size: 64, in: S['than-what'], out: S.compas }),
      sans('score-alone', 120, 690, w.text('score-alone'), { size: 30, wrap: 1250, in: S['than-what'], out: S.compas }),

      // COMPAS against simple baselines, on the same defendants.
      hand('title-compas', 120, 160, w.text('title-compas'), { size: 52, in: S.compas, out: S.werkmora }),
      { id: 'compas-base', in: S.compas, out: S.werkmora, shape: { kind: 'line', points: [[200, COMPAS_BASE], [1100, COMPAS_BASE]] } },
      ...bars,
      sans('compas-what', 1180, 300, w.text('compas-what'), { size: 26, wrap: 600, in: S.compas, out: S.werkmora }),
      hand('crowd-note', 1180, 470, w.text('crowd-note'), { size: 34, wrap: 600, in: S.crowd, out: S.werkmora }),
      hand('two-note', 1180, 600, w.text('two-note'), { size: 38, tone: 'accent', wrap: 560, in: S['two-features'], out: S.werkmora }),
      sans('compas-credit', 200, 940, w.text('compas-credit'), { size: 22, tone: 'muted', wrap: 1200, in: S.compas, out: S.werkmora }),

      // Werkmora and its pilot model.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.trivial }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.table, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 260, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.trivial }),
      hand('pilot', 120, 460, w.text('pilot'), { size: 48, tone: 'accent', in: S.werkmora, out: S.trivial }),

      // Three baselines, one row per click, then the one test they all run on.
      hand('title-three', 120, 160, w.text('title-three'), { size: 56, in: S.trivial, out: S.table }),
      ...baselines,
      { id: 'same-box', tone: 'accent', in: S['same-data'], out: S.table, shape: { kind: 'box', x: 100, y: 670, w: 1320, h: 90 } },
      hand('same-data', 130, 728, w.text('same-data'), { size: 32, in: S['same-data'], out: S.table }),
      sans('m4', 120, 850, w.text('m4'), { size: 26, wrap: 1280, in: S.m4, out: S.table }),
      sans('m4-credit', 120, 950, w.text('m4-credit'), { size: 22, tone: 'muted', in: S.m4, out: S.table }),

      // One model, three claims: the same WAPE against each baseline.
      hand('title-claims', 120, 160, w.text('title-claims'), { size: 56, in: S.table, out: S.ship }),
      { id: 'table-tag', tone: 'muted', in: S.table, out: S.ship, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('table-tag') } },
      sans('table-axis', 600, 260, w.text('table-axis'), { size: 24, tone: 'muted', in: S.table, out: S.ship }),
      ...rows,
      sans('who', 120, 800, w.text('who'), { size: 28, wrap: 1250, in: S.claims, out: S.ship }),
      sans('table-credit', 120, 950, w.text('table-credit'), { size: 22, tone: 'muted', in: S.claims, out: S.ship }),

      // When to ship the heuristic, and the three words in that rule.
      hand('title-ship', 120, 160, w.text('title-ship'), { size: 56, in: S.ship, out: S.keep }),
      hand('rule', 120, 290, w.text('rule'), { size: 44, tone: 'accent', wrap: 1250, in: S.ship, out: S.keep }),
      sans('zinkevich', 120, 470, w.text('zinkevich'), { size: 24, tone: 'muted', wrap: 1280, in: S.ship, out: S.keep }),
      ...qualifiers,
      sans('christodoulou', 120, 880, w.text('christodoulou'), { size: 22, tone: 'muted', wrap: 1280, in: S.qualifiers, out: S.keep }),

      // After launch: the baseline keeps running, as the fallback and the yardstick.
      hand('title-keep', 120, 160, w.text('title-keep'), { size: 56, in: S.keep, out: S.takeaway }),
      { id: 'keep-tag', tone: 'muted', in: S.keep, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('keep-tag') } },
      { id: 'box-baseline', tone: 'accent', in: S.keep, out: S.takeaway, shape: { kind: 'box', x: 120, y: 300, w: 420, h: 110 } },
      hand('box-baseline-label', 150, 368, w.text('box-baseline'), { size: 34, tone: 'accent', in: S.keep, out: S.takeaway }),
      { id: 'arrow-fallback', in: S.keep, out: S.takeaway, shape: { kind: 'arrow', x1: 540, y1: 330, x2: 760, y2: 295 } },
      { id: 'box-fallback', in: S.keep, out: S.takeaway, shape: { kind: 'box', x: 760, y: 240, w: 560, h: 110 } },
      hand('box-fallback-label', 790, 308, w.text('box-fallback'), { size: 32, in: S.keep, out: S.takeaway }),
      { id: 'arrow-trigger', in: S.keep, out: S.takeaway, shape: { kind: 'arrow', x1: 540, y1: 380, x2: 760, y2: 470 } },
      { id: 'box-trigger', in: S.keep, out: S.takeaway, shape: { kind: 'box', x: 760, y: 400, w: 560, h: 150 } },
      hand('box-trigger-label', 790, 455, w.text('box-trigger'), { size: 30, wrap: 500, in: S.keep, out: S.takeaway }),
      hand('parallel', 120, 650, w.text('parallel'), { size: 36, wrap: 1250, in: S.keep, out: S.takeaway }),
      sans('write-down', 120, 770, w.text('write-down'), { size: 30, wrap: 1250, in: S.owners, out: S.takeaway }),
      sans('owners', 120, 870, w.text('owners'), { size: 28, wrap: 1250, in: S.owners, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
