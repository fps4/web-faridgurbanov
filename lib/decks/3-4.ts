import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.4, "Splits and validation" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-4.yaml; this file places them on the stage by id. The episode follows the
// wiki script (publishing/ai-product-design/episodes/03-data/04-splits-and-validation.slides.md): what
// the episode promises, "we held out 20% at random" as the usual check, the pneumonia model that also
// learned the hospital (Zech et al. 2018) as the case, Werkmora's random-split pilot, the split as a
// copy of production (random, time, group), cross-validation and its two rules, the test set spent
// once, and Werkmora's split written down. The Zech numbers are the paper's; the Werkmora timeline is
// fictional.

const STEPS = [
  'title',
  'promise',
  'random',
  'zech',
  'hospital',
  'outside',
  'werkmora',
  'simulate',
  'split-random',
  'split-time',
  'backtest',
  'split-group',
  'shortcuts',
  'cv',
  'cv-rules',
  'three-sets',
  'spent',
  'plan',
  'sealed',
  'page',
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

const episode = episodeByNumber('3.4') ?? missing('episode 3.4 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.4 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.4 needs its closing card');

// The three hospital systems in Zech et al., with the accuracy a network had in telling them apart.
const HOSPITALS = [
  { key: 'nih', x: 120 },
  { key: 'sinai', x: 400 },
  { key: 'indiana', x: 680 },
] as const;

// AUC bars measured up from 0.5 (chance), on a baseline at y = 880.
const AUC = (auc: number) => Math.round((auc - 0.5) * 1000);

// Werkmora's pilot: twenty rows in time order, a random 20% of them in the test.
const PILOT_TEST = new Set([2, 7, 11, 16]);

// The three splits, one row each: label on the left, a strip of rows, the condition on the right.
const ROW = { random: 420, time: 590, group: 760 } as const;
const STRIP_X = 400;
const CONDITION_X = 1030;

// Cross-validation: five folds, five rounds; round r holds out fold r.
const FOLDS = 5;

// Werkmora's timeline: months from January 2024, 40 px each.
const MONTH = (m: number) => 160 + 40 * m;
const AXIS_Y = 520;

export const layout34: DeckLayout<Step> = {
  id: '3-4',
  episode: '3.4',
  steps: STEPS,
  figure: 'shortcuts',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const hospitals: Element[] = HOSPITALS.flatMap(({ key, x }) => [
    { id: `hospital-${key}`, in: S.zech, out: S.werkmora, shape: { kind: 'box', x, y: 330, w: 240, h: 80 } },
    hand(`hospital-${key}-label`, x + 20, 382, w.text(`hospital-${key}`), { size: 32, in: S.zech, out: S.werkmora }),
    hand(`acc-${key}`, x + 120, 560, w.text(`acc-${key}`), { size: 44, anchor: 'middle', tone: 'accent', in: S.hospital, out: S.werkmora }),
  ]);

  const pilot: Element[] = Array.from({ length: 20 }, (_, i) => ({
    id: `pilot-row-${i + 1}`,
    tone: PILOT_TEST.has(i) ? ('warn' as const) : undefined,
    in: S.werkmora,
    out: S.simulate,
    shape: { kind: 'box' as const, x: 120 + i * 62, y: 400, w: 50, h: 50, fill: PILOT_TEST.has(i) },
  }));

  // A strip of ten rows for a split; `test` marks the ones held out.
  const strip = (key: string, y: number, test: (i: number) => boolean, at: number): Element[] =>
    Array.from({ length: 10 }, (_, i) => ({
      id: `${key}-row-${i + 1}`,
      tone: test(i) ? ('warn' as const) : undefined,
      in: at,
      out: S.cv,
      shape: { kind: 'box' as const, x: STRIP_X + i * 60, y, w: 48, h: 48, fill: test(i) },
    }));

  // The group split: three stores of three rows; the last store is held out whole.
  const groups: Element[] = [0, 1, 2].flatMap((g) => {
    const x0 = STRIP_X + g * 200;
    return [
      { id: `group-${g + 1}`, tone: g === 2 ? 'warn' : undefined, in: S['split-group'], out: S.cv, shape: { kind: 'box', x: x0 - 8, y: ROW.group - 8, w: 174, h: 64 } },
      ...[0, 1, 2].map(
        (i): Element => ({
          id: `group-${g + 1}-row-${i + 1}`,
          tone: g === 2 ? 'warn' : undefined,
          in: S['split-group'],
          out: S.cv,
          shape: { kind: 'box', x: x0 + i * 56, y: ROW.group, w: 46, h: 48, fill: g === 2 },
        }),
      ),
    ];
  });

  const folds: Element[] = Array.from({ length: FOLDS * FOLDS }, (_, k) => {
    const r = Math.floor(k / FOLDS);
    const c = k % FOLDS;
    return {
      id: `fold-${r + 1}-${c + 1}`,
      tone: r === c ? ('accent' as const) : undefined,
      in: S.cv,
      out: S['three-sets'],
      shape: { kind: 'box' as const, x: 120 + c * 130, y: 300 + r * 72, w: 120, h: 56, fill: r === c },
    };
  });

  // Weekly cut-offs through spring 2025 (March to June), drawn every two weeks.
  const cutoffs: Element[] = Array.from({ length: 9 }, (_, i) => {
    const x = MONTH(14) + i * 20;
    return { id: `cutoff-${i + 1}`, tone: 'accent', in: S.plan, out: S.takeaway, shape: { kind: 'line', points: [[x, AXIS_Y - 34], [x, AXIS_Y]] } };
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.random }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.random }),
      ),

      // The usual check.
      hand('quote', 120, 380, w.text('quote'), { size: 72, wrap: 1250, tone: 'accent', in: S.random, out: S.zech }),
      hand('quote-how', 120, 600, w.text('quote-how'), { size: 44, in: S.random, out: S.zech }),
      { id: 'quote-tag', tone: 'muted', in: S.random, out: S.zech, shape: { kind: 'tag', x: 120, y: 700, text: w.text('quote-tag') } },

      // Zech et al. (2018): three hospital systems, the hospital as a clue, inside and outside.
      hand('title-zech', 120, 160, w.text('title-zech'), { size: 52, in: S.zech, out: S.werkmora }),
      sans('zech-what', 120, 250, w.text('zech-what'), { size: 28, wrap: 820, in: S.zech, out: S.werkmora }),
      ...hospitals,
      hand('which-hospital', 120, 480, w.text('which-hospital'), { size: 34, wrap: 820, in: S.hospital, out: S.werkmora }),
      sans('prevalence', 120, 640, w.text('prevalence'), { size: 26, wrap: 820, in: S.hospital, out: S.werkmora }),
      { id: 'auc-baseline', in: S.outside, out: S.werkmora, shape: { kind: 'line', points: [[1000, 880], [1400, 880]] } },
      { id: 'bar-inside', tone: 'accent', in: S.outside, out: S.werkmora, shape: { kind: 'box', x: 1010, y: 880 - AUC(0.931), w: 150, h: AUC(0.931), fill: true } },
      { id: 'bar-outside', tone: 'warn', in: S.outside, out: S.werkmora, shape: { kind: 'box', x: 1230, y: 880 - AUC(0.815), w: 150, h: AUC(0.815), fill: true } },
      sans('axis-auc', 1000, 330, w.text('axis-auc'), { size: 22, tone: 'muted', in: S.outside, out: S.werkmora }),
      hand('value-inside', 1085, 880 - AUC(0.931) - 24, w.text('value-inside'), { size: 48, anchor: 'middle', tone: 'accent', in: S.outside, out: S.werkmora }),
      hand('value-outside', 1305, 880 - AUC(0.815) - 24, w.text('value-outside'), { size: 48, anchor: 'middle', tone: 'warn', in: S.outside, out: S.werkmora }),
      sans('label-inside', 1085, 925, w.text('label-inside'), { size: 24, anchor: 'middle', in: S.outside, out: S.werkmora }),
      sans('label-outside', 1305, 925, w.text('label-outside'), { size: 24, anchor: 'middle', in: S.outside, out: S.werkmora }),
      hand('zech-line', 120, 790, w.text('zech-line'), { size: 36, wrap: 820, tone: 'accent', in: S.outside, out: S.werkmora }),
      sans('zech-credit', 120, 930, w.text('zech-credit'), { size: 22, tone: 'muted', in: S.zech, out: S.werkmora }),

      // Werkmora's pilot: a random 20% of rows in time order.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.simulate }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.simulate, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 250, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.simulate }),
      ...pilot,
      sans('strip-label', 120, 500, w.text('strip-label'), { size: 24, tone: 'muted', in: S.werkmora, out: S.simulate }),
      hand('strip-test', 900, 500, w.text('strip-test'), { size: 32, tone: 'warn', in: S.werkmora, out: S.simulate }),
      sans('werkmora-why', 120, 620, w.text('werkmora-why'), { size: 28, wrap: 1250, in: S.werkmora, out: S.simulate }),
      hand('werkmora-line', 120, 760, w.text('werkmora-line'), { size: 44, tone: 'accent', in: S.werkmora, out: S.simulate }),

      // The split is a copy of production: what will be new, then one row per kind of split.
      hand('title-splits', 120, 160, w.text('title-splits'), { size: 56, in: S.simulate, out: S.cv }),
      hand('ask', 120, 260, w.text('ask'), { size: 44, wrap: 1250, tone: 'accent', in: S.simulate, out: S.cv }),
      sans('new-things', 120, 330, w.text('new-things'), { size: 28, in: S.simulate, out: S.cv }),

      hand('split-random', 120, ROW.random + 40, w.text('split-random'), { size: 44, tone: 'accent', in: S['split-random'], out: S.cv }),
      ...strip('random', ROW.random, (i) => i === 2 || i === 7, S['split-random']),
      sans('split-random-when', CONDITION_X, ROW.random + 20, w.text('split-random-when'), { size: 26, wrap: 380, in: S['split-random'], out: S.cv }),

      hand('split-time', 120, ROW.time + 40, w.text('split-time'), { size: 44, tone: 'accent', in: S['split-time'], out: S.cv }),
      sans('split-time-default', 120, ROW.time + 80, w.text('split-time-default'), { size: 22, tone: 'muted', in: S['split-time'], out: S.cv }),
      ...strip('time', ROW.time, (i) => i >= 8, S['split-time']),
      { id: 'time-cut', tone: 'warn', in: S['split-time'], out: S.cv, shape: { kind: 'line', points: [[STRIP_X + 8 * 60 - 6, ROW.time - 14], [STRIP_X + 8 * 60 - 6, ROW.time + 62]] } },
      sans('split-time-when', CONDITION_X, ROW.time + 20, w.text('split-time-when'), { size: 26, wrap: 380, in: S['split-time'], out: S.backtest }),
      // A backtest moves the cut-off back and repeats; the earlier cut-offs are drawn muted.
      ...[5, 6, 7].map(
        (i): Element => ({
          id: `time-cut-${i}`,
          tone: 'muted',
          in: S.backtest,
          out: S.cv,
          shape: { kind: 'line', points: [[STRIP_X + i * 60 - 6, ROW.time - 14], [STRIP_X + i * 60 - 6, ROW.time + 62]] },
        }),
      ),
      sans('split-time-backtest', CONDITION_X, ROW.time + 20, w.text('split-time-backtest'), { size: 26, wrap: 380, in: S.backtest, out: S.cv }),

      hand('split-group', 120, ROW.group + 40, w.text('split-group'), { size: 44, tone: 'accent', in: S['split-group'], out: S.cv }),
      ...groups,
      sans('group-note', STRIP_X, ROW.group + 90, w.text('group-note'), { size: 22, tone: 'muted', in: S['split-group'], out: S.cv }),
      sans('split-group-when', CONDITION_X, ROW.group + 20, w.text('split-group-when'), { size: 26, wrap: 380, in: S['split-group'], out: S.cv }),

      hand('shortcuts', 120, 965, w.text('shortcuts'), { size: 34, tone: 'warn', in: S.shortcuts, out: S.cv }),
      sans('splits-credit', 120, 1035, w.text('splits-credit'), { size: 20, tone: 'muted', in: S['split-random'], out: S.cv }),

      // Cross-validation: five rounds, one fold held out in each; then its two rules.
      hand('title-cv', 120, 160, w.text('title-cv'), { size: 56, in: S.cv, out: S['three-sets'] }),
      ...folds,
      hand('cv-fold', 120, 710, w.text('cv-fold'), { size: 28, tone: 'muted', in: S.cv, out: S['three-sets'] }),
      hand('cv-what', 820, 330, w.text('cv-what'), { size: 40, wrap: 580, in: S.cv, out: S['three-sets'] }),
      sans('cv-why', 820, 450, w.text('cv-why'), { size: 28, wrap: 580, in: S.cv, out: S['three-sets'] }),
      hand('rule-structure', 820, 570, w.text('rule-structure'), { size: 34, wrap: 580, tone: 'accent', in: S['cv-rules'], out: S['three-sets'] }),
      sans('rule-structure-do', 820, 620, w.text('rule-structure-do'), { size: 26, wrap: 580, in: S['cv-rules'], out: S['three-sets'] }),
      hand('rule-tune', 820, 710, w.text('rule-tune'), { size: 34, wrap: 580, tone: 'accent', in: S['cv-rules'], out: S['three-sets'] }),
      sans('rule-tune-do', 820, 760, w.text('rule-tune-do'), { size: 26, wrap: 580, in: S['cv-rules'], out: S['three-sets'] }),
      sans('cv-credit', 820, 850, w.text('cv-credit'), { size: 22, tone: 'muted', wrap: 580, in: S['cv-rules'], out: S['three-sets'] }),

      // Three sets, three jobs; every look at the test set leaks back into the choices.
      hand('title-spent', 120, 160, w.text('title-spent'), { size: 56, in: S['three-sets'], out: S.plan }),
      { id: 'set-train-box', in: S['three-sets'], out: S.plan, shape: { kind: 'box', x: 120, y: 300, w: 600, h: 150 } },
      { id: 'set-validation-box', in: S['three-sets'], out: S.plan, shape: { kind: 'box', x: 760, y: 300, w: 300, h: 150 } },
      { id: 'set-test-box', tone: 'warn', in: S['three-sets'], out: S.plan, shape: { kind: 'box', x: 1100, y: 300, w: 300, h: 150 } },
      hand('set-train', 150, 360, w.text('set-train'), { size: 40, in: S['three-sets'], out: S.plan }),
      hand('set-validation', 790, 360, w.text('set-validation'), { size: 40, in: S['three-sets'], out: S.plan }),
      hand('set-test', 1130, 360, w.text('set-test'), { size: 40, tone: 'warn', in: S['three-sets'], out: S.plan }),
      sans('job-train', 150, 410, w.text('job-train'), { size: 24, wrap: 540, in: S['three-sets'], out: S.plan }),
      sans('job-validation', 790, 410, w.text('job-validation'), { size: 24, wrap: 250, in: S['three-sets'], out: S.plan }),
      sans('job-test', 1130, 410, w.text('job-test'), { size: 24, wrap: 260, in: S['three-sets'], out: S.plan }),
      { id: 'leak-path', tone: 'warn', in: S.spent, out: S.plan, shape: { kind: 'line', points: [[1250, 450], [1250, 600], [910, 600]] } },
      { id: 'leak-arrow', tone: 'warn', in: S.spent, out: S.plan, shape: { kind: 'arrow', x1: 910, y1: 600, x2: 910, y2: 450 } },
      hand('leak', 940, 650, w.text('leak'), { size: 32, tone: 'warn', in: S.spent, out: S.plan }),
      hand('spent-line', 120, 780, w.text('spent-line'), { size: 40, wrap: 1250, tone: 'accent', in: S.spent, out: S.plan }),
      sans('spent-quote', 120, 920, w.text('spent-quote'), { size: 24, wrap: 1250, tone: 'muted', in: S.spent, out: S.plan }),

      // Werkmora, done right: a backtest through spring 2025, spring 2026 sealed, one page.
      hand('title-plan', 120, 160, w.text('title-plan'), { size: 56, in: S.plan, out: S.takeaway }),
      { id: 'plan-tag', tone: 'muted', in: S.plan, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('plan-tag') } },
      { id: 'timeline', in: S.plan, out: S.takeaway, shape: { kind: 'arrow', x1: 120, y1: AXIS_Y, x2: 1400, y2: AXIS_Y } },
      ...([2024, 2025, 2026] as const).map((year, i) =>
        sans(`year-${year}`, MONTH(12 * i), AXIS_Y + 50, w.text(`year-${year}`), { size: 26, tone: 'muted', in: S.plan, out: S.takeaway }),
      ),
      ...cutoffs,
      hand('backtest-label', 640, 440, w.text('backtest-label'), { size: 32, tone: 'accent', in: S.plan, out: S.takeaway }),
      sans('backtest-what', 120, 660, w.text('backtest-what'), { size: 26, wrap: 1250, in: S.plan, out: S.page }),
      { id: 'sealed', tone: 'warn', in: S.sealed, out: S.takeaway, shape: { kind: 'box', x: MONTH(26), y: AXIS_Y - 50, w: MONTH(30) - MONTH(26), h: 100, fill: true } },
      hand('sealed-label', 1120, 440, w.text('sealed-label'), { size: 32, tone: 'warn', in: S.sealed, out: S.takeaway }),
      sans('sealed-what', 120, 760, w.text('sealed-what'), { size: 26, wrap: 1250, in: S.sealed, out: S.page }),
      sans('stores-what', 120, 850, w.text('stores-what'), { size: 26, wrap: 1250, in: S.sealed, out: S.page }),
      hand('page-head', 120, 680, w.text('page-head'), { size: 40, wrap: 1250, tone: 'accent', in: S.page, out: S.takeaway }),
      sans('page-owner', 120, 820, w.text('page-owner'), { size: 28, wrap: 1250, in: S.page, out: S.takeaway }),
      hand('compare', 120, 940, w.text('compare'), { size: 34, wrap: 1250, in: S.page, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
