import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.3, "Data quality and leakage" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-3.yaml; this file places them on the stage by id. The episode follows the
// wiki presenter notes (publishing/ai-product-design/episodes/03-data/03-data-quality-and-leakage.slides.md):
// what the episode promises, "the offline numbers look great", Kaufman et al.'s documented cases
// (INFORMS 2010, IBM's sales leads), Werkmora's pilot, leakage on a timeline with the one rule, the
// quiet kind (Kapoor & Narayanan), training/serving skew, the basic checks per feature, and contracts
// with the producing teams. The AUC and civil-war numbers are the papers'; Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'great',
  'informs',
  'ibm',
  'werkmora',
  'timeline',
  'target',
  'temporal',
  'rule',
  'quiet',
  'checklist',
  'skew',
  'fixes',
  'missing',
  'noisy',
  'imbalance',
  'contracts',
  'meaning',
  'write',
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

const episode = episodeByNumber('3.3') ?? missing('episode 3.3 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.3 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.3 needs its closing card');

// The AUC scale for the INFORMS 2010 challenge: 0.5 (a coin) on the left, 1.0 (perfect) on the right.
const AUC = (v: number) => Math.round(200 + ((v - 0.5) / 0.5) * 1100);
const TICKS = [
  { key: '05', v: 0.5 },
  { key: '09', v: 0.9 },
  { key: '10', v: 1.0 },
] as const;

// The two pipelines that should see the same features: history into training, tonight into scoring.
const PIPES = [
  { from: 'history', to: 'training', y: 300 },
  { from: 'tonight', to: 'scoring', y: 540 },
] as const;

// The basic checks, one row per click, each with Werkmora's answer under it.
const CHECKS = ['missing', 'noisy', 'imbalance'] as const;

// The three contracts to start with, where it hurt, each with its owner.
const CONTRACTS = ['promotions', 'weather', 'stock'] as const;

export const layout33: DeckLayout<Step> = {
  id: '3-3',
  episode: '3.3',
  steps: STEPS,
  figure: 'rule',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const ticks: Element[] = TICKS.map(({ key, v }) =>
    sans(`tick-${key}`, AUC(v), 605, w.text(`tick-${key}`), { size: 24, anchor: 'middle', tone: 'muted', in: S.informs, out: S.werkmora }),
  );

  const pipes: Element[] = PIPES.flatMap(({ from, to, y }) => [
    { id: `box-${from}`, in: S.skew, out: S.missing, shape: { kind: 'box', x: 120, y, w: 460, h: 90 } },
    hand(`box-${from}-label`, 145, y + 58, w.text(`box-${from}`), { size: 34, in: S.skew, out: S.missing }),
    { id: `arrow-${from}`, in: S.skew, out: S.missing, shape: { kind: 'arrow', x1: 580, y1: y + 45, x2: 680, y2: y + 45 } },
    { id: `box-${to}`, in: S.skew, out: S.missing, shape: { kind: 'box', x: 680, y, w: 300, h: 90 } },
    hand(`box-${to}-label`, 705, y + 58, w.text(`box-${to}`), { size: 34, in: S.skew, out: S.missing }),
  ]);

  const checks: Element[] = CHECKS.flatMap((key, i) => {
    const y = 290 + i * 190;
    return [
      hand(`row-${key}`, 120, y, w.text(`row-${key}`), { size: 44, tone: 'accent', in: S[key], out: S.contracts }),
      sans(`row-${key}-body`, 470, y, w.text(`row-${key}-body`), { size: 28, wrap: 880, in: S[key], out: S.contracts }),
      hand(`row-${key}-werkmora`, 470, y + 75, w.text(`row-${key}-werkmora`), { size: 32, in: S[key], out: S.contracts }),
    ];
  });

  const contracts: Element[] = CONTRACTS.flatMap((key, i) => {
    const x = 120 + i * 420;
    return [
      { id: `contract-${key}-box`, in: S.contracts, out: S.takeaway, shape: { kind: 'box', x, y: 260, w: 380, h: 130 } },
      hand(`contract-${key}`, x + 24, 315, w.text(`contract-${key}`), { size: 38, tone: 'accent', in: S.contracts, out: S.takeaway }),
      sans(`contract-${key}-owner`, x + 24, 362, w.text(`contract-${key}-owner`), { size: 24, wrap: 340, in: S.contracts, out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.great }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.great }),
      ),

      // The usual belief, then the case: INFORMS 2010 on an AUC scale, and IBM's website text.
      hand('hook', 120, 220, w.text('hook'), { size: 72, tone: 'accent', in: S.great, out: S.werkmora }),
      sans('auc-what', 120, 330, w.text('auc-what'), { size: 28, in: S.informs, out: S.werkmora }),
      { id: 'auc-axis', in: S.informs, out: S.werkmora, shape: { kind: 'line', points: [[AUC(0.5), 560], [AUC(1.0), 560]] } },
      ...ticks,
      sans('auc-axis-label', 640, 605, w.text('auc-axis-label'), { size: 24, anchor: 'middle', tone: 'muted', in: S.informs, out: S.werkmora }),
      { id: 'auc-band', tone: 'warn', in: S.informs, out: S.werkmora, shape: { kind: 'box', x: AUC(0.9), y: 540, w: AUC(1.0) - AUC(0.9), h: 40, fill: true } },
      hand('auc-teams', AUC(0.9), 515, w.text('auc-teams'), { size: 40, tone: 'warn', in: S.informs, out: S.werkmora }),
      hand('auc-best', AUC(0.9), 455, w.text('auc-best'), { size: 32, tone: 'warn', in: S.informs, out: S.werkmora }),
      hand('auc-why', 120, 700, w.text('auc-why'), { size: 44, in: S.informs, out: S.werkmora }),
      { id: 'ibm-box', in: S.ibm, out: S.werkmora, shape: { kind: 'box', x: 120, y: 770, w: 1200, h: 180 } },
      hand('ibm-title', 150, 830, w.text('ibm-title'), { size: 38, in: S.ibm, out: S.werkmora }),
      sans('ibm-body', 150, 890, w.text('ibm-body'), { size: 28, wrap: 1140, in: S.ibm, out: S.werkmora }),
      sans('kaufman-credit', 120, 1010, w.text('kaufman-credit'), { size: 22, tone: 'muted', in: S.informs, out: S.werkmora }),

      // Werkmora's pilot, and the question nobody asked yet.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.timeline }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.timeline, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 260, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.timeline }),
      sans('werkmora-pilot', 120, 400, w.text('werkmora-pilot'), { size: 30, wrap: 1250, in: S.werkmora, out: S.timeline }),
      hand('werkmora-question', 120, 600, w.text('werkmora-question'), { size: 72, tone: 'accent', in: S.werkmora, out: S.timeline }),

      // Leakage on a timeline: the moment of prediction, what may be used, the two kinds, the rule.
      hand('title-leak', 120, 160, w.text('title-leak'), { size: 56, in: S.timeline, out: S.quiet }),
      { id: 'leak-tag', tone: 'muted', in: S.timeline, out: S.quiet, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('leak-tag') } },
      { id: 'time-axis', in: S.timeline, out: S.quiet, shape: { kind: 'arrow', x1: 120, y1: 520, x2: 1380, y2: 520 } },
      sans('time-label', 1380, 565, w.text('time-label'), { size: 24, anchor: 'end', tone: 'muted', in: S.timeline, out: S.quiet }),
      { id: 'now-line', tone: 'accent', in: S.timeline, out: S.quiet, shape: { kind: 'line', points: [[760, 300], [760, 600]] } },
      hand('now-label', 760, 285, w.text('now-label'), { size: 36, anchor: 'middle', tone: 'accent', in: S.timeline, out: S.quiet }),
      hand('known', 180, 480, w.text('known'), { size: 34, in: S.timeline, out: S.quiet }),
      hand('after', 800, 480, w.text('after'), { size: 34, tone: 'warn', in: S.timeline, out: S.quiet }),
      { id: 'arrow-target', tone: 'warn', in: S.target, out: S.quiet, shape: { kind: 'arrow', x1: 1250, y1: 560, x2: 520, y2: 560 } },
      hand('target-title', 120, 640, w.text('target-title'), { size: 38, tone: 'warn', in: S.target, out: S.quiet }),
      sans('target-body', 120, 690, w.text('target-body'), { size: 26, in: S.target, out: S.quiet }),
      { id: 'promo-box', in: S.temporal, out: S.quiet, shape: { kind: 'box', x: 200, y: 330, w: 360, h: 80 } },
      hand('promo-box-label', 225, 382, w.text('promo-box'), { size: 32, in: S.temporal, out: S.quiet }),
      { id: 'arrow-promo', tone: 'warn', in: S.temporal, out: S.quiet, shape: { kind: 'arrow', x1: 990, y1: 370, x2: 570, y2: 370 } },
      hand('promo-late', 1000, 380, w.text('promo-late'), { size: 30, tone: 'warn', in: S.temporal, out: S.quiet }),
      hand('temporal-title', 120, 780, w.text('temporal-title'), { size: 38, tone: 'warn', in: S.temporal, out: S.quiet }),
      sans('temporal-body', 120, 830, w.text('temporal-body'), { size: 26, in: S.temporal, out: S.quiet }),
      hand('rule', 120, 920, w.text('rule'), { size: 40, wrap: 1250, tone: 'accent', in: S.rule, out: S.quiet }),
      sans('rule-werkmora', 120, 1015, w.text('rule-werkmora'), { size: 26, in: S.rule, out: S.quiet }),
      sans('rule-credit', 120, 1058, w.text('rule-credit'), { size: 22, tone: 'muted', in: S.rule, out: S.quiet }),

      // The quiet kind: one civil-war paper's AUC gap before and after the fix, then the checklist.
      hand('title-quiet', 120, 160, w.text('title-quiet'), { size: 56, in: S.quiet, out: S.skew }),
      sans('loud-quiet', 120, 240, w.text('loud-quiet'), { size: 28, in: S.quiet, out: S.skew }),
      { id: 'gap-baseline', in: S.quiet, out: S.skew, shape: { kind: 'line', points: [[200, 820], [860, 820]] } },
      { id: 'bar-before', tone: 'warn', in: S.quiet, out: S.skew, shape: { kind: 'box', x: 250, y: 400, w: 200, h: 420, fill: true } },
      { id: 'bar-after', in: S.quiet, out: S.skew, shape: { kind: 'box', x: 600, y: 790, w: 200, h: 30, fill: true } },
      hand('value-before', 350, 380, w.text('value-before'), { size: 56, anchor: 'middle', tone: 'warn', in: S.quiet, out: S.skew }),
      hand('value-after', 700, 770, w.text('value-after'), { size: 56, anchor: 'middle', in: S.quiet, out: S.skew }),
      sans('label-before', 350, 870, w.text('label-before'), { size: 26, anchor: 'middle', in: S.quiet, out: S.skew }),
      sans('label-after', 700, 870, w.text('label-after'), { size: 26, anchor: 'middle', in: S.quiet, out: S.skew }),
      sans('gap-what', 200, 940, w.text('gap-what'), { size: 24, tone: 'muted', in: S.quiet, out: S.skew }),
      hand('quiet-what', 920, 360, w.text('quiet-what'), { size: 36, wrap: 480, in: S.quiet, out: S.skew }),
      sans('quiet-credit', 920, 500, w.text('quiet-credit'), { size: 22, tone: 'muted', in: S.quiet, out: S.skew }),
      hand('checklist', 920, 600, w.text('checklist'), { size: 34, wrap: 480, tone: 'accent', in: S.checklist, out: S.skew }),

      // Training/serving skew: two pipelines that should see the same thing, and the fixes.
      hand('title-skew', 120, 160, w.text('title-skew'), { size: 56, in: S.skew, out: S.missing }),
      { id: 'skew-tag', tone: 'muted', in: S.skew, out: S.missing, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('skew-tag') } },
      ...pipes,
      hand('skew-neq', 830, 495, w.text('skew-neq'), { size: 72, anchor: 'middle', tone: 'warn', in: S.skew, out: S.missing }),
      sans('skew-kinds', 1060, 330, w.text('skew-kinds'), { size: 26, wrap: 360, in: S.skew, out: S.missing }),
      sans('skew-credit', 1060, 450, w.text('skew-credit'), { size: 22, wrap: 360, tone: 'muted', in: S.skew, out: S.missing }),
      { id: 'fixes-box', tone: 'accent', in: S.fixes, out: S.missing, shape: { kind: 'box', x: 120, y: 720, w: 1200, h: 100 } },
      hand('fixes', 150, 782, w.text('fixes'), { size: 36, in: S.fixes, out: S.missing }),
      sans('fixes-credit', 120, 870, w.text('fixes-credit'), { size: 22, tone: 'muted', in: S.fixes, out: S.missing }),
      hand('issued', 1060, 560, w.text('issued'), { size: 34, wrap: 360, tone: 'accent', in: S.fixes, out: S.missing }),

      // The basic checks, per feature, one row per click.
      hand('title-checks', 120, 160, w.text('title-checks'), { size: 56, in: S.missing, out: S.contracts }),
      { id: 'checks-tag', tone: 'muted', in: S.missing, out: S.contracts, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('checks-tag') } },
      ...checks,
      sans('noisy-credit', 120, 860, w.text('noisy-credit'), { size: 22, tone: 'muted', in: S.noisy, out: S.contracts }),
      sans('imbalance-credit', 120, 900, w.text('imbalance-credit'), { size: 22, tone: 'muted', in: S.imbalance, out: S.contracts }),

      // Contracts with the producing teams, what a schema misses, and what the team writes down.
      hand('title-contracts', 120, 160, w.text('title-contracts'), { size: 56, in: S.contracts, out: S.takeaway }),
      { id: 'contracts-tag', tone: 'muted', in: S.contracts, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('contracts-tag') } },
      ...contracts,
      sans('contract-holds', 120, 470, w.text('contract-holds'), { size: 28, wrap: 1240, in: S.contracts, out: S.takeaway }),
      hand('meaning', 120, 620, w.text('meaning'), { size: 40, wrap: 1250, tone: 'accent', in: S.meaning, out: S.takeaway }),
      sans('three-ways', 120, 760, w.text('three-ways'), { size: 28, wrap: 1250, in: S.meaning, out: S.takeaway }),
      hand('write', 120, 900, w.text('write'), { size: 36, wrap: 1250, in: S.write, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
