import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 2.1, "Start at the bottom of the ladder" (FS-0010): the layout. The words (each step's
// time and cue, every line on screen, the card headings) are in content/decks/<locale>/2-1.yaml;
// this file places them on the stage by id. Built from the script's "On screen" list and stage
// directions; each step is one click while recording. The diagram is the approach ladder: rule ·
// classical model · foundation model through an API · adapted model, after Zinkevich's Rules of
// Machine Learning, with the claims product placed on three of its rungs. Case numbers are the
// running case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'rule',
  'classical',
  'foundation',
  'adapted',
  'bars',
  'climb',
  'zinkevich',
  'stack',
  'slice',
  'cost',
  'baseline',
  'rest',
  'language',
  'top',
  'car',
  'see',
  'eiopa',
  'move',
  'steps',
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

const episode = episodeByNumber('2.1') ?? missing('episode 2.1 is missing from lib/episodes/part-2.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout21: DeckLayout<Step> = {
  id: '2-1',
  episode: '2.1',
  steps: STEPS,
  build,
};

// The ladder: four rungs between two rails, bottom up. Each rung is a box with its name; beside it,
// four bars (data · cost per use · effort to explain · skills) that grow with the rung.
const RUNG = { x: 150, w: 500, h: 100 } as const;
const RUNG_Y = { rule: 850, classical: 680, foundation: 510, adapted: 340 } as const;
const BAR = { x: 690, w: 36, gap: 48, unit: 20 } as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const rungs: [keyof typeof RUNG_Y, Step, number][] = [
    ['rule', 'rule', 1],
    ['classical', 'classical', 2],
    ['foundation', 'foundation', 3],
    ['adapted', 'adapted', 4],
  ];

  const ladder: Element[] = rungs.flatMap(([name, at, level]) => {
    const y = RUNG_Y[name];
    // The top rung greys out once the case shows nobody needs it; its box and label are swapped for
    // muted copies at that step.
    const leaves = name === 'adapted' ? S.top : S.canvas;
    return [
      { id: `rung-${name}`, in: S[at], out: leaves, shape: { kind: 'box', x: RUNG.x, y, w: RUNG.w, h: RUNG.h } },
      hand(`label-${name}`, RUNG.x + RUNG.w / 2, y + 62, w.text(`label-${name}`), { size: 32, anchor: 'middle', in: S[at], out: leaves }),
      ...[0, 1, 2, 3].map(
        (i): Element => ({
          id: `bar-${name}-${i + 1}`,
          tone: 'accent',
          in: S.bars,
          out: S.canvas,
          shape: { kind: 'box', x: BAR.x + i * BAR.gap, y: y + RUNG.h - level * BAR.unit, w: BAR.w, h: level * BAR.unit, fill: true },
        }),
      ),
    ];
  });

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
        key: 'ladder-blank',
        ...w.card('ladder-blank'),
        source: 'parts/2-choose-the-approach/approach-ladder.md',
        heading: 'Side 1 · The ladder',
        rows: ['4 · Adapted model', '3 · Foundation model through an API', '2 · Classical model', '1 · Rule'],
      },
      {
        key: 'ladder-claims',
        ...w.card('ladder-claims'),
        source: 'parts/2-choose-the-approach/approach-ladder.claims.md',
        heading: 'Side 2 · The claims product',
        rows: [
          'Small simple claims (glass, single item < €300, no claim in 3 years)',
          'Score: not genuine or not covered?',
          'Read the claim and photos; find the policy and its conditions version',
          'Draft the letter',
        ],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.rule }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.rule })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: the ladder, bottom up, and what each rung up costs.
      hand('title-idea', 120, 140, w.text('title-idea'), { size: 56, in: S.rule, out: S.stack }),
      { id: 'rail-left', in: S.rule, out: S.canvas, shape: { kind: 'line', points: [[140, 980], [140, 320]] } },
      { id: 'rail-right', in: S.rule, out: S.canvas, shape: { kind: 'line', points: [[660, 980], [660, 320]] } },
      ...ladder,
      sans('bars-legend', BAR.x, 328, w.text('bars-legend'), { size: 22, tone: 'muted', in: S.bars, out: S.canvas }),
      { id: 'climb-arrow', tone: 'accent', in: S.climb, out: S.canvas, shape: { kind: 'arrow', x1: 95, y1: 950, x2: 95, y2: 360 } },
      { id: 'climb-tag', tone: 'warn', in: S.climb, out: S.canvas, shape: { kind: 'tag', x: 690, y: 815, text: w.text('climb-tag') } },
      sans('quote', 690, 220, w.text('quote'), { size: 28, wrap: 1150, in: S.zinkevich, out: S.canvas }),
      sans('quote-source', 690, 258, w.text('quote-source'), { size: 20, tone: 'muted', in: S.zinkevich, out: S.canvas }),

      // In the case: the stack of claims, the rule's slice, the rest, the language steps.
      hand('title-case', 120, 140, w.text('title-case'), { size: 56, in: S.stack, out: S.move }),
      { id: 'stack-3', tone: 'muted', in: S.stack, out: S.rest, shape: { kind: 'box', x: 980, y: 355, w: 300, h: 100 } },
      { id: 'stack-2', tone: 'muted', in: S.stack, out: S.rest, shape: { kind: 'box', x: 970, y: 365, w: 300, h: 100 } },
      { id: 'stack-1', in: S.stack, out: S.rest, shape: { kind: 'box', x: 960, y: 375, w: 300, h: 100 } },
      hand('stack-label', 1110, 420, w.text('stack-label'), { size: 32, anchor: 'middle', wrap: 280, in: S.stack, out: S.rest }),
      { id: 'stack-tag', tone: 'muted', in: S.stack, out: S.rest, shape: { kind: 'tag', x: 1290, y: 425, text: w.text('stack-tag') } },
      { id: 'slice-arrow', tone: 'accent', in: S.slice, out: S.rest, shape: { kind: 'arrow', x1: 1060, y1: 485, x2: 1035, y2: 840 } },
      { id: 'slice', tone: 'accent', in: S.slice, out: S.canvas, shape: { kind: 'box', x: 940, y: 850, w: 190, h: 100 } },
      hand('slice-label', 1035, 912, w.text('slice-label'), { size: 32, anchor: 'middle', tone: 'accent', in: S.slice, out: S.canvas }),
      hand('saved', 1150, 885, w.text('saved'), { size: 30, tone: 'accent', in: S.cost, out: S.canvas }),
      hand('wrong', 1150, 930, w.text('wrong'), { size: 30, tone: 'warn', in: S.cost, out: S.canvas }),
      hand('baseline', 940, 1000, w.text('baseline'), { size: 30, tone: 'accent', in: S.baseline, out: S.canvas }),
      hand('rest', 940, 722, w.text('rest'), { size: 32, tone: 'accent', in: S.rest, out: S.canvas }),
      hand('rest-score', 940, 762, w.text('rest-score'), { size: 28, in: S.rest, out: S.canvas }),
      { id: 'box-read', tone: 'accent', in: S.language, out: S.canvas, shape: { kind: 'box', x: 940, y: 510, w: 150, h: 100 } },
      hand('read', 1015, 545, w.text('read'), { size: 24, anchor: 'middle', wrap: 140, in: S.language, out: S.canvas }),
      { id: 'box-clause', tone: 'accent', in: S.language, out: S.canvas, shape: { kind: 'box', x: 1100, y: 510, w: 150, h: 100 } },
      hand('clause', 1175, 555, w.text('clause'), { size: 24, anchor: 'middle', wrap: 140, in: S.language, out: S.canvas }),
      { id: 'box-letter', tone: 'accent', in: S.language, out: S.canvas, shape: { kind: 'box', x: 1260, y: 510, w: 150, h: 100 } },
      hand('letter', 1335, 555, w.text('letter'), { size: 24, anchor: 'middle', wrap: 140, in: S.language, out: S.canvas }),
      hand('proposes', 940, 650, w.text('proposes'), { size: 28, tone: 'accent', in: S.language, out: S.canvas }),
      { id: 'rung-adapted-grey', tone: 'muted', in: S.top, out: S.canvas, shape: { kind: 'box', x: RUNG.x, y: RUNG_Y.adapted, w: RUNG.w, h: RUNG.h } },
      hand('label-adapted-grey', RUNG.x + RUNG.w / 2, RUNG_Y.adapted + 62, w.text('label-adapted-grey'), { size: 32, anchor: 'middle', tone: 'muted', in: S.top, out: S.canvas }),
      hand('not-yet', 940, 400, w.text('not-yet'), { size: 32, tone: 'muted', in: S.top, out: S.canvas }),
      hand('car', 1460, 520, w.text('car'), { size: 28, tone: 'muted', wrap: 400, in: S.car, out: S.see }),

      // What you see in your organisation, and the move.
      hand('see', 1460, 380, w.text('see'), { size: 34, tone: 'warn', wrap: 400, in: S.see, out: S.canvas }),
      sans('eiopa', 1460, 500, w.text('eiopa'), { size: 26, wrap: 400, in: S.eiopa, out: S.canvas }),
      sans('eiopa-source', 1460, 600, w.text('eiopa-source'), { size: 20, tone: 'muted', wrap: 400, in: S.eiopa, out: S.canvas }),
      hand('title-move', 120, 140, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      { id: 'bracket', tone: 'accent', in: S.steps, out: S.canvas, shape: { kind: 'line', points: [[1415, 510], [1430, 510], [1430, 950], [1415, 950]] } },
      hand('three-rungs', 1460, 680, w.text('three-rungs'), { size: 30, tone: 'accent', in: S.steps, out: S.canvas }),
      sans('who', 120, 1040, w.text('who'), { size: 24, in: S.who, out: S.know }),
      hand('know', 120, 1040, w.text('know'), { size: 30, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'ladder-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'ladder-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
