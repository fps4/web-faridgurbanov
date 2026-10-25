import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.10, "Feedback loops" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-10.yaml; this file places them on the stage by id. The episode follows the
// wiki script (publishing/ai-product-design/episodes/03-data/10-feedback-loops.slides.md): what the
// episode promises, the "we retrain, so it improves" belief, Werkmora's forecast drawn as a loop with
// the empty shelf in it, direct and hidden loops (Sculley et al. 2015), the trap's three shapes,
// Yahoo!'s recorded random traffic as the measured fix (Li et al. 2010), the three countermeasures
// with DUO's random sample, outcomes captured from day one, and who owns each piece. No live loop has
// been measured in the research, and the screen says so; Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'retrain',
  'werkmora',
  'shelf',
  'learns',
  'direct',
  'hidden',
  'showed',
  'fraud',
  'same',
  'yahoo',
  'random',
  'explore',
  'log',
  'control',
  'duo',
  'outcomes',
  'close',
  'law',
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

const episode = episodeByNumber('3.10') ?? missing('episode 3.10 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.10 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.10 needs its closing card');

// Werkmora's loop, clockwise from the top: the forecast's own output comes back as its training data.
const NODES: { key: string; x: number; y: number; w: number }[] = [
  { key: 'forecast', x: 400, y: 300, w: 280 },
  { key: 'order', x: 760, y: 450, w: 260 },
  { key: 'shelf', x: 640, y: 700, w: 360 },
  { key: 'sales', x: 160, y: 700, w: 260 },
  { key: 'training', x: 100, y: 450, w: 300 },
];
const LINKS: [number, number, number, number][] = [
  [680, 345, 820, 450],
  [890, 540, 840, 700],
  [640, 745, 420, 745],
  [260, 700, 250, 540],
  [300, 450, 400, 365],
];

// The trap's three shapes, one row per click.
const SHAPES = [
  { key: 'recommender', step: 'showed', y: 300 },
  { key: 'fraud', step: 'fraud', y: 470 },
  { key: 'forecast', step: 'same', y: 680 },
] as const;

// The three countermeasures, one row per click, each with Werkmora's answer.
const COUNTER = [
  { key: 'explore', y: 290 },
  { key: 'log', y: 440 },
  { key: 'control', y: 610 },
] as const;

// The outcomes Werkmora captures from the first night, one box each.
const OUTCOMES = ['stockout', 'waste', 'override'] as const;

// Who owns which piece of the loop.
const OWNERS = ['log', 'stock', 'control'] as const;

export const layout310: DeckLayout<Step> = {
  id: '3-10',
  episode: '3.10',
  steps: STEPS,
  figure: 'hidden',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const nodes: Element[] = NODES.flatMap(({ key, x, y, w: width }) => [
    { id: `node-${key}-box`, in: S.werkmora, out: S.showed, shape: { kind: 'box', x, y, w: width, h: 90 } },
    hand(`node-${key}`, x + 24, y + 58, w.text(`node-${key}`), { size: 34, in: S.werkmora, out: S.showed }),
  ]);
  const links: Element[] = LINKS.map(([x1, y1, x2, y2], i) => ({
    id: `link-${i + 1}`,
    in: S.werkmora,
    out: S.showed,
    shape: { kind: 'arrow', x1, y1, x2, y2 },
  }));

  const shapes: Element[] = SHAPES.flatMap(({ key, step, y }) => [
    hand(`shape-${key}`, 120, y, w.text(`shape-${key}`), { size: 44, tone: 'accent', in: S[step], out: S.yahoo }),
    sans(`shape-${key}-body`, 560, y, w.text(`shape-${key}-body`), { size: 28, wrap: 860, in: S[step], out: S.yahoo }),
  ]);

  const counter: Element[] = COUNTER.flatMap(({ key, y }) => [
    hand(`c-${key}`, 120, y, w.text(`c-${key}`), { size: 44, tone: 'accent', in: S[key], out: S.outcomes }),
    sans(`c-${key}-werkmora`, 480, y, w.text(`c-${key}-werkmora`), { size: 28, wrap: 920, in: S[key], out: S.outcomes }),
  ]);

  const outcomes: Element[] = OUTCOMES.flatMap((key, i) => {
    const x = 120 + i * 440;
    return [
      { id: `out-${key}-box`, in: S.outcomes, out: S.close, shape: { kind: 'box', x, y: 400, w: 400, h: 230 } },
      hand(`out-${key}`, x + 24, 460, w.text(`out-${key}`), { size: 38, tone: 'accent', in: S.outcomes, out: S.close }),
      sans(`out-${key}-body`, x + 24, 530, w.text(`out-${key}-body`), { size: 26, wrap: 350, in: S.outcomes, out: S.close }),
    ];
  });

  const owners: Element[] = OWNERS.flatMap((key, i) => {
    const y = 290 + i * 100;
    return [
      hand(`own-${key}`, 120, y, w.text(`own-${key}`), { size: 40, tone: 'accent', in: S.close, out: S.takeaway }),
      sans(`own-${key}-body`, 520, y, w.text(`own-${key}-body`), { size: 30, wrap: 860, in: S.close, out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.retrain }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.retrain }),
      ),

      // The usual belief: retraining on live data keeps the model improving.
      hand('belief', 120, 380, w.text('belief'), { size: 72, wrap: 1300, tone: 'accent', in: S.retrain, out: S.werkmora }),
      { id: 'belief-tag', tone: 'muted', in: S.retrain, out: S.werkmora, shape: { kind: 'tag', x: 120, y: 560, text: w.text('belief-tag') } },
      hand('belief-made', 120, 680, w.text('belief-made'), { size: 48, wrap: 1250, in: S.retrain, out: S.werkmora }),

      // Werkmora's forecast drawn as a loop; the right-hand column changes per click.
      hand('title-loop', 120, 160, w.text('title-loop'), { size: 56, in: S.werkmora, out: S.showed }),
      sans('werkmora-line', 120, 240, w.text('werkmora-line'), { size: 30, wrap: 1700, in: S.werkmora, out: S.showed }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.showed, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      ...nodes,
      ...links,

      // The empty shelf: the label records sales, and the next model learns them as demand.
      { id: 'mark-shelf', tone: 'warn', in: S.shelf, out: S.showed, shape: { kind: 'ellipse', x: 610, y: 670, w: 420, h: 150 } },
      hand('shelf-empty', 660, 850, w.text('shelf-empty'), { size: 30, tone: 'warn', in: S.shelf, out: S.showed }),
      hand('shelf-text', 1080, 330, w.text('shelf-text'), { size: 44, wrap: 720, tone: 'accent', in: S.shelf, out: S.direct }),
      sans('shelf-chain', 1080, 450, w.text('shelf-chain'), { size: 26, wrap: 720, in: S.shelf, out: S.direct }),
      { id: 'link-learn', tone: 'warn', in: S.learns, out: S.showed, shape: { kind: 'arrow', x1: 300, y1: 450, x2: 400, y2: 365 } },
      hand('learn-mark', 110, 400, w.text('learn-mark'), { size: 30, tone: 'warn', in: S.learns, out: S.showed }),
      hand('learns', 1080, 580, w.text('learns'), { size: 34, wrap: 720, tone: 'accent', in: S.learns, out: S.direct }),

      // The names for it: a direct loop, and a hidden one through the markdown tool.
      hand('loop-direct', 1080, 330, w.text('loop-direct'), { size: 48, wrap: 720, tone: 'accent', in: S.direct, out: S.showed }),
      sans('sculley-credit', 1080, 450, w.text('sculley-credit'), { size: 22, wrap: 720, tone: 'muted', in: S.direct, out: S.showed }),
      hand('loop-hidden', 1080, 590, w.text('loop-hidden'), { size: 40, wrap: 720, tone: 'accent', in: S.hidden, out: S.showed }),
      { id: 'node-markdown-box', tone: 'warn', in: S.hidden, out: S.showed, shape: { kind: 'box', x: 160, y: 900, w: 300, h: 80 } },
      { id: 'link-markdown', tone: 'warn', in: S.hidden, out: S.showed, shape: { kind: 'arrow', x1: 290, y1: 900, x2: 290, y2: 790 } },
      hand('node-markdown', 184, 952, w.text('node-markdown'), { size: 34, tone: 'warn', in: S.hidden, out: S.showed }),

      // One trap, three shapes; and what the research does and does not show.
      hand('title-shapes', 120, 160, w.text('title-shapes'), { size: 56, in: S.showed, out: S.yahoo }),
      ...shapes,
      sans('labels-credit', 560, 585, w.text('labels-credit'), { size: 22, wrap: 860, tone: 'muted', in: S.fraud, out: S.yahoo }),
      hand('plainly', 120, 820, w.text('plainly'), { size: 34, wrap: 1250, in: S.same, out: S.yahoo }),
      sans('sim-credit', 120, 920, w.text('sim-credit'), { size: 22, wrap: 1250, tone: 'muted', in: S.same, out: S.yahoo }),

      // Yahoo!: most traffic gets the best guess, a small share is random, and it is all recorded.
      hand('title-yahoo', 120, 160, w.text('title-yahoo'), { size: 56, in: S.yahoo, out: S.explore }),
      sans('yahoo-what', 120, 245, w.text('yahoo-what'), { size: 28, wrap: 1300, in: S.yahoo, out: S.explore }),
      { id: 'traffic-best', in: S.yahoo, out: S.explore, shape: { kind: 'box', x: 120, y: 300, w: 1040, h: 100 } },
      { id: 'traffic-random', tone: 'warn', in: S.yahoo, out: S.explore, shape: { kind: 'box', x: 1180, y: 300, w: 120, h: 100, fill: true } },
      hand('label-best', 640, 362, w.text('label-best'), { size: 36, anchor: 'middle', in: S.yahoo, out: S.explore }),
      hand('label-random', 1240, 450, w.text('label-random'), { size: 32, anchor: 'middle', tone: 'warn', in: S.yahoo, out: S.explore }),
      { id: 'arrow-log', in: S.yahoo, out: S.explore, shape: { kind: 'arrow', x1: 700, y1: 400, x2: 700, y2: 500 } },
      { id: 'log', in: S.yahoo, out: S.explore, shape: { kind: 'box', x: 120, y: 500, w: 1180, h: 90 } },
      sans('log-label', 150, 555, w.text('log-label'), { size: 28, wrap: 1120, in: S.yahoo, out: S.explore }),
      sans('yahoo-credit', 120, 880, w.text('yahoo-credit'), { size: 22, wrap: 1250, tone: 'muted', in: S.yahoo, out: S.explore }),
      { id: 'arrow-offline', tone: 'accent', in: S.random, out: S.explore, shape: { kind: 'arrow', x1: 700, y1: 590, x2: 700, y2: 660 } },
      { id: 'offline', tone: 'accent', in: S.random, out: S.explore, shape: { kind: 'box', x: 120, y: 660, w: 1180, h: 90 } },
      hand('offline-label', 150, 718, w.text('offline-label'), { size: 36, tone: 'accent', in: S.random, out: S.explore }),
      sans('yahoo-quote', 120, 820, w.text('yahoo-quote'), { size: 26, wrap: 1250, in: S.random, out: S.explore }),
      hand('lift', 1400, 380, w.text('lift'), { size: 96, tone: 'accent', in: S.random, out: S.explore }),
      sans('lift-label', 1400, 450, w.text('lift-label'), { size: 26, wrap: 440, in: S.random, out: S.explore }),

      // Three countermeasures, each with Werkmora's answer; DUO's random sample under them.
      hand('title-counter', 120, 160, w.text('title-counter'), { size: 56, in: S.explore, out: S.outcomes }),
      { id: 'counter-tag', tone: 'muted', in: S.explore, out: S.outcomes, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('counter-tag') } },
      ...counter,
      { id: 'duo', tone: 'warn', in: S.duo, out: S.outcomes, shape: { kind: 'box', x: 120, y: 760, w: 1250, h: 210 } },
      hand('duo-head', 150, 815, w.text('duo-head'), { size: 36, tone: 'warn', in: S.duo, out: S.outcomes }),
      sans('duo-body', 150, 870, w.text('duo-body'), { size: 26, wrap: 1180, in: S.duo, out: S.outcomes }),
      sans('duo-credit', 150, 925, w.text('duo-credit'), { size: 22, wrap: 1180, tone: 'muted', in: S.duo, out: S.outcomes }),

      // Outcomes captured from day one: three at Werkmora.
      hand('title-outcomes', 120, 160, w.text('title-outcomes'), { size: 56, in: S.outcomes, out: S.close }),
      { id: 'outcomes-tag', tone: 'muted', in: S.outcomes, out: S.close, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('outcomes-tag') } },
      sans('outcomes-what', 120, 250, w.text('outcomes-what'), { size: 30, wrap: 1250, in: S.outcomes, out: S.close }),
      sans('outcomes-credit', 120, 335, w.text('outcomes-credit'), { size: 22, tone: 'muted', in: S.outcomes, out: S.close }),
      ...outcomes,
      hand('outcomes-log', 120, 740, w.text('outcomes-log'), { size: 44, wrap: 1250, tone: 'accent', in: S.outcomes, out: S.close }),

      // Who owns the loop, what a month shows, and the law that names the same trap.
      hand('title-close', 120, 160, w.text('title-close'), { size: 56, in: S.close, out: S.takeaway }),
      { id: 'close-tag', tone: 'muted', in: S.close, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('close-tag') } },
      ...owners,
      hand('month', 120, 630, w.text('month'), { size: 36, wrap: 1250, in: S.close, out: S.takeaway }),
      hand('law', 120, 800, w.text('law'), { size: 34, wrap: 1250, tone: 'accent', in: S.law, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
