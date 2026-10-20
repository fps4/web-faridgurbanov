import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.1, "The threshold is a business decision" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-1.yaml; this file places them on the stage by id. The diagram is the
// threshold chart: claim amount along the bottom, the chance a claim is fraudulent or not covered up
// the side, the curve €23 ÷ amount below which a claim is paid automatically, the €1,000 cap, and the
// four priced mistakes beside it (after Elkan, cost-sensitive decisions). Case numbers are the
// running case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'score',
  'decision',
  'money',
  'fraud',
  'uncovered',
  'handler',
  'denied',
  'axes',
  'curve',
  'dots',
  'tv',
  'wall',
  'moves',
  'accuracy',
  'euros',
  'notebook',
  'move',
  'never',
  'line',
  'sign',
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

const episode = episodeByNumber('3.1') ?? missing('episode 3.1 is missing from lib/episodes/part-3.ts');

function missing(message: string): never {
  throw new Error(message);
}

// The chart: €0–€2,500 along the bottom, 0–30% up the side.
const X = (amount: number) => Math.round(200 + 0.44 * amount);
const Y = (percent: number) => Math.round(880 - 20.5 * percent);
const CURVE = [77, 90, 110, 130, 150, 175, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000];

export const layout31: DeckLayout<Step> = {
  id: '3-1',
  episode: '3.1',
  steps: STEPS,
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];
  const rows = ['The rule', 'Why this line', 'Hard limits regardless of score', 'Signed by (business owner)'];

  // The four priced mistakes, one box each, in the right-hand column.
  const mistakes: Element[] = (['fraud', 'uncovered', 'handler', 'denied'] as const).flatMap((key, i) => {
    const y = 260 + i * 110;
    return [
      { id: `box-${key}`, in: S[key], out: S.canvas, shape: { kind: 'box', x: 1360, y, w: 420, h: 95 } },
      hand(`label-${key}`, 1380, y + 40, w.text(`label-${key}`), { size: 32, in: S[key], out: S.canvas }),
      hand(`price-${key}`, 1380, y + 80, w.text(`price-${key}`), { size: 30, tone: 'accent', in: S[key], out: S.canvas }),
    ];
  });

  const dots: Element[] = [
    { id: 'dot-150', tone: 'accent', in: S.dots, out: S.canvas, shape: { kind: 'ellipse', x: X(150) - 9, y: Y(15.3) - 9, w: 18, h: 18 } },
    hand('dot-150-label', 285, 560, w.text('dot-150-label'), { size: 28, in: S.dots, out: S.canvas }),
    { id: 'dot-400', tone: 'accent', in: S.dots, out: S.canvas, shape: { kind: 'ellipse', x: X(400) - 9, y: Y(5.75) - 9, w: 18, h: 18 } },
    hand('dot-400-label', 395, 735, w.text('dot-400-label'), { size: 28, in: S.dots, out: S.canvas }),
    { id: 'dot-1000', tone: 'accent', in: S.dots, out: S.canvas, shape: { kind: 'ellipse', x: X(1000) - 9, y: Y(2.3) - 9, w: 18, h: 18 } },
    hand('dot-1000-label', 655, 860, w.text('dot-1000-label'), { size: 28, in: S.dots, out: S.canvas }),
  ];

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
        heading: '5. The threshold',
        rows,
      },
      {
        key: 'scorecard-claims',
        ...w.card('scorecard-claims'),
        source: 'parts/3-data-and-evaluation/scorecard.claims.md',
        heading: '5. The threshold',
        rows: ['The rule', 'What it means', 'Hard limits regardless of score', 'Signed by (business owner)'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.score }),
      ...episode.promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.score }),
      ),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: a score, a decision, a question about money.
      hand('title-idea', 120, 160, w.text('title-idea'), { size: 56, in: S.score, out: S.fraud }),
      { id: 'claim-card', in: S.score, out: S.axes, shape: { kind: 'box', x: 200, y: 300, w: 440, h: 240 } },
      hand('claim', 420, 405, w.text('claim'), { size: 64, anchor: 'middle', in: S.score, out: S.axes }),
      sans('claim-kind', 420, 475, w.text('claim-kind'), { size: 26, anchor: 'middle', tone: 'muted', in: S.score, out: S.axes }),
      { id: 'dial', tone: 'accent', in: S.score, out: S.axes, shape: { kind: 'ellipse', x: 760, y: 280, w: 280, h: 280 } },
      hand('dial-value', 900, 450, w.text('dial-value'), { size: 96, anchor: 'middle', tone: 'accent', in: S.score, out: S.axes }),
      sans('dial-label', 900, 510, w.text('dial-label'), { size: 26, anchor: 'middle', tone: 'muted', in: S.score, out: S.axes }),
      sans('score-meaning', 760, 620, w.text('score-meaning'), { size: 28, wrap: 600, in: S.score, out: S.axes }),
      { id: 'arrow-pay', in: S.decision, out: S.fraud, shape: { kind: 'arrow', x1: 1060, y1: 380, x2: 1180, y2: 335 } },
      hand('pay', 1200, 350, w.text('pay'), { size: 40, in: S.decision, out: S.fraud }),
      { id: 'arrow-look', in: S.decision, out: S.fraud, shape: { kind: 'arrow', x1: 1060, y1: 460, x2: 1180, y2: 520 } },
      hand('look', 1200, 535, w.text('look'), { size: 40, in: S.decision, out: S.fraud }),
      hand('money', 120, 800, w.text('money'), { size: 44, tone: 'accent', in: S.money, out: S.axes }),
      sans('credit', 1780, 110, w.text('credit'), { size: 22, tone: 'muted', anchor: 'end', in: S.money, out: S.canvas }),

      // On the case: four ways to be wrong, each with a price.
      hand('title-case', 120, 160, w.text('title-case'), { size: 56, in: S.fraud, out: S.accuracy }),
      { id: 'mistakes-tag', tone: 'muted', in: S.fraud, out: S.canvas, shape: { kind: 'tag', x: 1360, y: 222, text: w.text('mistakes-tag') } },
      ...mistakes,

      // The chart: the axes, the curve €23 ÷ amount, three dots, the cap.
      { id: 'axis-x', in: S.axes, out: S.canvas, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 1320, y2: 880 } },
      { id: 'axis-y', in: S.axes, out: S.canvas, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 200, y2: 250 } },
      hand('axis-y-label', 200, 230, w.text('axis-y-label'), { size: 30, tone: 'muted', in: S.axes, out: S.canvas }),
      sans('axis-y-formal', 700, 230, w.text('axis-y-formal'), { size: 20, tone: 'muted', in: S.axes, out: S.canvas }),
      sans('tick-30', 185, Y(30) + 8, w.text('tick-30'), { size: 24, anchor: 'end', tone: 'muted', in: S.axes, out: S.canvas }),
      sans('tick-0', 185, 888, w.text('tick-0'), { size: 24, anchor: 'end', tone: 'muted', in: S.axes, out: S.canvas }),
      sans('tick-1000', X(1000), 920, w.text('tick-1000'), { size: 24, anchor: 'middle', tone: 'muted', in: S.axes, out: S.canvas }),
      sans('tick-2500', X(2500), 920, w.text('tick-2500'), { size: 24, anchor: 'middle', tone: 'muted', in: S.axes, out: S.canvas }),
      hand('axis-x-label', 900, 925, w.text('axis-x-label'), { size: 30, anchor: 'middle', tone: 'muted', in: S.axes, out: S.canvas }),
      {
        id: 'curve',
        tone: 'accent',
        in: S.curve,
        out: S.canvas,
        shape: { kind: 'line', points: CURVE.map((a) => [X(a), Y(Math.min(30, (23 / a) * 100))] as [number, number]) },
      },
      hand('area-pay', 360, 860, w.text('area-pay'), { size: 30, tone: 'accent', in: S.curve, out: S.canvas }),
      hand('area-look', 300, 420, w.text('area-look'), { size: 34, tone: 'muted', in: S.curve, out: S.canvas }),
      hand('rule', 680, 330, w.text('rule'), { size: 36, tone: 'accent', in: S.curve, out: S.canvas }),
      ...dots,
      { id: 'dot-tv', tone: 'warn', in: S.tv, out: S.canvas, shape: { kind: 'ellipse', x: X(400) - 11, y: Y(4) - 11, w: 22, h: 22 } },
      hand('dot-tv-label', 352, 812, w.text('dot-tv-label'), { size: 28, tone: 'warn', anchor: 'end', in: S.tv, out: S.canvas }),
      { id: 'wall', tone: 'warn', in: S.wall, out: S.canvas, shape: { kind: 'line', points: [[X(1000), 880], [X(1000), 255]] } },
      hand('cap', 680, 400, w.text('cap'), { size: 32, tone: 'warn', in: S.wall, out: S.canvas }),
      hand('moves', 680, 470, w.text('moves'), { size: 40, in: S.moves, out: S.accuracy }),

      // What you see: one accuracy number, then euros.
      hand('title-see', 120, 160, w.text('title-see'), { size: 56, in: S.accuracy, out: S.move }),
      hand('accuracy', 720, 560, w.text('accuracy'), { size: 96, in: S.accuracy, out: S.move }),
      sans('pay-everything', 720, 620, w.text('pay-everything'), { size: 26, wrap: 580, in: S.accuracy, out: S.move }),
      { id: 'strike', tone: 'warn', in: S.euros, out: S.move, shape: { kind: 'line', points: [[710, 520], [1215, 505]] } },
      hand('count-euros', 720, 700, w.text('count-euros'), { size: 36, tone: 'accent', in: S.euros, out: S.move }),
      { id: 'arrow-euros', tone: 'accent', in: S.euros, out: S.move, shape: { kind: 'arrow', x1: 1040, y1: 690, x2: 1345, y2: 620 } },
      sans('notebook', 720, 755, w.text('notebook'), { size: 24, tone: 'muted', in: S.notebook, out: S.move }),

      // The move, in four lines under the chart.
      hand('title-move', 120, 160, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      hand('move-1', 120, 1000, w.text('move-1'), { size: 32, in: S.move, out: S.know }),
      hand('move-2', 120, 1050, w.text('move-2'), { size: 32, in: S.never, out: S.know }),
      { id: 'never-tag', tone: 'warn', in: S.never, out: S.canvas, shape: { kind: 'tag', x: 1640, y: 615, text: w.text('never-tag') } },
      hand('move-3', 760, 1000, w.text('move-3'), { size: 32, in: S.line, out: S.know }),
      hand('move-4', 760, 1050, w.text('move-4'), { size: 32, in: S.sign, out: S.know }),

      // Who: the signature on the chart.
      { id: 'signature-line', in: S.who, out: S.canvas, shape: { kind: 'line', points: [[720, 560], [1260, 560]] } },
      hand('signature', 730, 610, w.text('signature'), { size: 36, tone: 'warn', in: S.who, out: S.canvas }),
      hand('know', 120, 1020, w.text('know'), { size: 36, tone: 'accent', wrap: 1300, in: S.know, out: S.canvas }),

      // The download, and the close.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'scorecard-blank', x: 100, y: 180, w: 640, h: 760 } },
      {
        id: 'card-claims',
        in: S.canvas,
        out: S.takeaway,
        shape: { kind: 'card', card: 'scorecard-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 3] } },
      },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
