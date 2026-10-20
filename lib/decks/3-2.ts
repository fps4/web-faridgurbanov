import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.2, "A demo is not evidence" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-2.yaml; this file places them on the stage by id. The diagram is a gate
// between the demo and live, and the scorecard that opens it: four columns (desk, rule, pay
// everything, model), the past decisions with their two biased labels, the verified set, the two
// fields written after the decision, and the loop that re-runs it on every change. Case numbers are
// the running case's and are tagged synthetic; the photo case is real and kept apart.

const STEPS = [
  'recap',
  'promise',
  'demo',
  'gate',
  'idea',
  'confident',
  'sheet',
  'desk',
  'rule',
  'payall',
  'empty',
  'pile',
  'labels',
  'verified',
  'fields',
  'photo',
  'move',
  'prices',
  'baselines',
  'bar',
  'loop',
  'commit',
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

const episode = episodeByNumber('3.2') ?? missing('episode 3.2 is missing from lib/episodes/part-3.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout32: DeckLayout<Step> = {
  id: '3-2',
  episode: '3.2',
  steps: STEPS,
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // The demo: five claims, five green ticks.
  const demo: Element[] = [1, 2, 3, 4, 5].flatMap((n, i) => {
    const y = 345 + i * 55;
    return [
      sans(`demo-claim-${n}`, 150, y, w.text(`demo-claim-${n}`), { size: 26, in: S.demo }),
      { id: `tick-${n}`, tone: 'accent', in: S.demo, shape: { kind: 'line', points: [[370, y - 12], [382, y], [404, y - 26]] } },
    ];
  });

  // The scorecard: four columns, filled one by one; the model's stays empty.
  const columns = [
    { key: 'desk', x: 680, at: S.desk },
    { key: 'rule', x: 860, at: S.rule },
    { key: 'payall', x: 1040, at: S.payall },
  ] as const;
  const sheet: Element[] = [
    ...columns.flatMap((c) => [
      { id: `col-${c.key}`, in: S.sheet, shape: { kind: 'box', x: c.x, y: 470, w: 170, h: 300 } } as Element,
      hand(`head-${c.key}`, c.x + 85, 512, w.text(`head-${c.key}`), { size: 28, anchor: 'middle', in: S.sheet }),
      sans(`cell-${c.key}`, c.x + 12, 560, w.text(`cell-${c.key}`), { size: 22, wrap: 150, in: c.at }),
    ]),
    { id: 'col-model', tone: 'accent', in: S.sheet, shape: { kind: 'box', x: 1220, y: 470, w: 170, h: 300 } },
    hand('head-model', 1305, 512, w.text('head-model'), { size: 28, anchor: 'middle', tone: 'accent', in: S.sheet }),
    hand('cell-model', 1305, 660, w.text('cell-model'), { size: 96, anchor: 'middle', tone: 'accent', in: S.empty }),
  ];

  // Every diagram element leaves when the download arrives, unless it says otherwise.
  const diagram = (
    [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.demo }),
      ...episode.promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.demo }),
      ),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: the demo, five green ticks, and a gate to live.
      hand('title-see', 120, 160, w.text('title-see'), { size: 56, in: S.demo, out: S.idea }),
      { id: 'demo-screen', in: S.demo, shape: { kind: 'box', x: 120, y: 240, w: 320, h: 380 } },
      hand('demo-label', 280, 290, w.text('demo-label'), { size: 40, anchor: 'middle', in: S.demo }),
      ...demo,
      { id: 'gate-post-1', in: S.gate, shape: { kind: 'box', x: 480, y: 260, w: 20, h: 360 } },
      { id: 'gate-post-2', in: S.gate, shape: { kind: 'box', x: 620, y: 260, w: 20, h: 360 } },
      { id: 'gate-bar-1', tone: 'warn', in: S.gate, out: S.know, shape: { kind: 'line', points: [[500, 380], [620, 380]] } },
      { id: 'gate-bar-2', tone: 'warn', in: S.gate, out: S.know, shape: { kind: 'line', points: [[500, 500], [620, 500]] } },
      hand('gate-label', 560, 238, w.text('gate-label'), { size: 30, anchor: 'middle', in: S.gate }),
      { id: 'live-box', in: S.gate, shape: { kind: 'box', x: 680, y: 260, w: 720, h: 120 } },
      hand('live', 710, 335, w.text('live'), { size: 44, in: S.gate }),
      { id: 'live-tag', tone: 'muted', in: S.gate, shape: { kind: 'tag', x: 1220, y: 320, text: w.text('live-tag') } },

      // The idea: compared to what? Output that looks right lowers your guard.
      hand('title-idea', 120, 160, w.text('title-idea'), { size: 56, in: S.idea, out: S.sheet }),
      hand('confident', 120, 700, w.text('confident'), { size: 44, tone: 'warn', in: S.confident, out: S.sheet }),
      sans('credit-perry', 1780, 110, w.text('credit-perry'), { size: 22, tone: 'muted', anchor: 'end', in: S.confident, out: S.sheet }),

      // On the case: the scorecard, in euros, before anything is built.
      hand('title-case', 120, 160, w.text('title-case'), { size: 56, in: S.sheet, out: S.move }),
      hand('sheet-title', 680, 445, w.text('sheet-title'), { size: 34, in: S.sheet }),
      { id: 'sheet-tag', tone: 'muted', in: S.desk, shape: { kind: 'tag', x: 1220, y: 440, text: w.text('sheet-tag') } },
      ...sheet,

      // Past decisions, biased twice, and the verified set.
      { id: 'pile-1', tone: 'muted', in: S.pile, shape: { kind: 'box', x: 120, y: 680, w: 300, h: 56 } },
      { id: 'pile-2', tone: 'muted', in: S.pile, shape: { kind: 'box', x: 132, y: 692, w: 300, h: 56 } },
      { id: 'pile-3', tone: 'muted', in: S.pile, shape: { kind: 'box', x: 144, y: 704, w: 300, h: 56 } },
      hand('pile-label', 170, 744, w.text('pile-label'), { size: 32, in: S.pile }),
      sans('credit-lakkaraju', 1780, 110, w.text('credit-lakkaraju'), { size: 22, tone: 'muted', anchor: 'end', in: S.pile, out: S.fields }),
      { id: 'label-paid', tone: 'warn', in: S.labels, shape: { kind: 'tag', x: 120, y: 805, text: w.text('label-paid') } },
      { id: 'label-fraud', tone: 'warn', in: S.labels, shape: { kind: 'tag', x: 120, y: 865, text: w.text('label-fraud') } },
      { id: 'verified-box', tone: 'accent', in: S.verified, shape: { kind: 'box', x: 680, y: 800, w: 520, h: 80 } },
      hand('verified', 700, 852, w.text('verified'), { size: 30, tone: 'accent', in: S.verified }),
      { id: 'verified-tag', tone: 'muted', in: S.verified, shape: { kind: 'tag', x: 1220, y: 840, text: w.text('verified-tag') } },

      // The two fields written after the decision.
      sans('field-adjuster', 120, 950, w.text('field-adjuster'), { size: 26, in: S.fields }),
      sans('field-referral', 380, 950, w.text('field-referral'), { size: 26, in: S.fields }),
      { id: 'strike-adjuster', tone: 'warn', in: S.fields, shape: { kind: 'line', points: [[115, 941], [355, 941]] } },
      { id: 'strike-referral', tone: 'warn', in: S.fields, shape: { kind: 'line', points: [[375, 941], [574, 941]] } },
      hand('fields-after', 120, 1000, w.text('fields-after'), { size: 28, tone: 'warn', in: S.fields }),
      sans('credit-kaufman', 1780, 110, w.text('credit-kaufman'), { size: 22, tone: 'muted', anchor: 'end', in: S.fields, out: S.move }),

      // A real case, kept apart from the synthetic numbers.
      { id: 'photo-box', in: S.photo, out: S.move, shape: { kind: 'box', x: 1460, y: 260, w: 420, h: 230 } },
      hand('photo', 1480, 305, w.text('photo'), { size: 28, wrap: 390, in: S.photo, out: S.move }),
      sans('photo-source', 1480, 470, w.text('photo-source'), { size: 18, tone: 'muted', in: S.photo, out: S.move }),

      // The move: agree it all before the work, then re-run it on every change.
      hand('title-move', 120, 160, w.text('title-move'), { size: 56, in: S.move, out: S.know }),
      hand('move-1', 1460, 300, w.text('move-1'), { size: 28, in: S.move, out: S.canvas }),
      hand('move-2', 1460, 350, w.text('move-2'), { size: 28, in: S.prices, out: S.canvas }),
      hand('move-3', 1460, 400, w.text('move-3'), { size: 28, in: S.baselines, out: S.canvas }),
      hand('move-4', 1460, 450, w.text('move-4'), { size: 28, in: S.bar, out: S.canvas }),
      { id: 'loop', tone: 'accent', in: S.loop, shape: { kind: 'line', points: [[1392, 530], [1430, 530], [1430, 640], [1410, 640]] } },
      { id: 'loop-head', tone: 'accent', in: S.loop, shape: { kind: 'arrow', x1: 1410, y1: 640, x2: 1394, y2: 640 } },
      hand('rerun', 1460, 560, w.text('rerun'), { size: 34, tone: 'accent', in: S.loop }),
      sans('rerun-list', 1460, 610, w.text('rerun-list'), { size: 24, wrap: 420, in: S.loop }),
      hand('commit', 120, 1055, w.text('commit'), { size: 34, tone: 'accent', in: S.commit, out: S.canvas }),

      // Who owns what.
      { id: 'owner-sheet', tone: 'warn', in: S.who, shape: { kind: 'tag', x: 1460, y: 493, text: w.text('owner-sheet') } },
      { id: 'owner-verified', tone: 'warn', in: S.who, shape: { kind: 'tag', x: 680, y: 925, text: w.text('owner-verified') } },
      sans('owner-engineering', 1460, 676, w.text('owner-engineering'), { size: 22, tone: 'warn', in: S.who }),

      // How you'll know: the gate opens only when the model beats the desk and the rule.
      hand('title-know', 120, 160, w.text('title-know'), { size: 56, tone: 'accent', in: S.know }),
      { id: 'gate-open-1', tone: 'accent', in: S.know, shape: { kind: 'line', points: [[500, 380], [555, 300]] } },
      { id: 'gate-open-2', tone: 'accent', in: S.know, shape: { kind: 'line', points: [[500, 500], [555, 420]] } },
      { id: 'gate-through', tone: 'accent', in: S.know, shape: { kind: 'arrow', x1: 530, y1: 590, x2: 690, y2: 390 } },
    ] as Element[]
  ).map((el) => (el.out === undefined && el.in > S.promise ? { ...el, out: S.canvas } : el));

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
        key: 'scorecard-blank',
        ...w.card('scorecard-blank'),
        source: 'parts/3-data-and-evaluation/scorecard.md',
        heading: '6. The verified set',
        rows: ['Size', 'Cost, and which budget', 'Fields removed because they are written after the decision'],
      },
      {
        key: 'scorecard-claims',
        ...w.card('scorecard-claims'),
        source: 'parts/3-data-and-evaluation/scorecard.claims.md',
        heading: '6. The verified set',
        rows: ['Size', 'Cost, and which budget', 'Fields removed'],
        tag: 'synthetic',
      },
    ],
    elements: [
      ...diagram,

      // The download, and the close.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'scorecard-blank', x: 100, y: 180, w: 640, h: 760 } },
      {
        id: 'card-claims',
        in: S.canvas,
        out: S.takeaway,
        shape: { kind: 'card', card: 'scorecard-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 2] } },
      },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
