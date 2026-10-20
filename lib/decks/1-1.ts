import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 1.1, "Fund one decision, not more seats" (FS-0010): the layout. The words (each step's
// time and cue, every line on screen, the card headings) are in content/decks/<locale>/1-1.yaml;
// this file places them on the stage by id. Built from the script's "On screen" list and stage
// directions; each step is one click while recording. The diagram is the anatomy of a decision:
// prediction → judgement → action, after Agrawal, Gans & Goldfarb. Case numbers are the running
// case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'seats',
  'dnb',
  'gap',
  'idea',
  'prediction',
  'judgement',
  'action',
  'scarce',
  'opportunity',
  'decision',
  'predictions',
  'grow',
  'candidate',
  'move',
  'name',
  'labels',
  'useCase',
  'fund',
  'copilots',
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

const episode = episodeByNumber('1.1') ?? missing('episode 1.1 is missing from lib/storyline.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout11: DeckLayout<Step> = {
  id: '1-1',
  episode: '1.1',
  steps: STEPS,
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const seats: Element[] = [220, 420, 620, 820, 1020, 1220].map((x, i) => ({
    id: `seat-${i + 1}`,
    tone: 'muted',
    in: S.seats,
    out: S.idea,
    shape: { kind: 'seat', x, y: 470 },
  }));

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
        key: 'canvas-blank',
        ...w.card('canvas-blank'),
        source: 'parts/1-frame-the-decision/use-case-canvas.md',
        heading: '1 · The decision',
        rows: ['The decision', 'The prediction it lacks', 'The judgement', 'The action'],
      },
      {
        key: 'canvas-claims',
        ...w.card('canvas-claims'),
        source: 'parts/1-frame-the-decision/use-case-canvas.claims.md',
        heading: '1 · The decision',
        rows: ['The decision', 'The prediction it lacks', 'The judgement', 'The action'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.seats }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.seats })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: seats, the DNB figure, the gap.
      hand('hook', 120, 230, w.text('hook'), { size: 60, wrap: 1500, in: S.seats, out: S.idea }),
      ...seats,
      hand('per-person', 720, 620, w.text('per-person'), { anchor: 'middle', tone: 'muted', in: S.seats, out: S.idea }),
      sans('dnb', 120, 760, w.text('dnb'), { size: 34, wrap: 1200, in: S.dnb, out: S.idea }),
      sans('dnb-source', 120, 860, w.text('dnb-source'), { size: 22, tone: 'muted', in: S.dnb, out: S.idea }),
      hand('gap', 120, 960, w.text('gap'), { size: 46, tone: 'accent', wrap: 1250, in: S.gap, out: S.idea }),

      // The idea: prediction → judgement → action.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.idea, out: S.decision }),
      sans('credit', 1760, 260, w.text('credit'), { size: 22, tone: 'muted', anchor: 'end', in: S.idea, out: S.canvas }),
      { id: 'box-prediction', in: S.prediction, out: S.grow, shape: { kind: 'box', x: 160, y: 300, w: 440, h: 220 } },
      hand('label-prediction', 380, 370, w.text('label-prediction'), { size: 48, anchor: 'middle', in: S.prediction, out: S.canvas }),
      { id: 'arrow-1', in: S.judgement, out: S.canvas, shape: { kind: 'arrow', x1: 612, y1: 410, x2: 728, y2: 410 } },
      { id: 'box-judgement', in: S.judgement, out: S.canvas, shape: { kind: 'box', x: 740, y: 300, w: 440, h: 220 } },
      hand('label-judgement', 960, 370, w.text('label-judgement'), { size: 48, anchor: 'middle', in: S.judgement, out: S.canvas }),
      { id: 'arrow-2', in: S.action, out: S.canvas, shape: { kind: 'arrow', x1: 1192, y1: 410, x2: 1308, y2: 410 } },
      { id: 'box-action', in: S.action, out: S.canvas, shape: { kind: 'box', x: 1320, y: 300, w: 440, h: 220 } },
      hand('label-action', 1540, 370, w.text('label-action'), { size: 48, anchor: 'middle', in: S.action, out: S.canvas }),
      hand('cheaper', 380, 590, w.text('cheaper'), { size: 36, anchor: 'middle', tone: 'accent', in: S.scarce, out: S.grow }),
      { id: 'scarce-line', in: S.scarce, out: S.grow, tone: 'warn', shape: { kind: 'line', points: [[760, 545], [1740, 545]] } },
      hand('scarce', 1250, 590, w.text('scarce'), { size: 36, anchor: 'middle', tone: 'warn', in: S.scarce, out: S.grow }),
      sans('opportunity', 120, 800, w.text('opportunity'), { size: 32, wrap: 1250, in: S.opportunity, out: S.move }),

      // In the case.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.decision, out: S.move }),
      hand('fill-action', 1540, 440, w.text('fill-action'), { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.decision, out: S.canvas }),
      hand('fill-prediction', 380, 440, w.text('fill-prediction'), { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.predictions, out: S.canvas }),
      hand('fill-judgement', 960, 440, w.text('fill-judgement'), { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.predictions, out: S.canvas }),
      { id: 'box-prediction-big', tone: 'accent', in: S.grow, out: S.canvas, shape: { kind: 'box', x: 120, y: 280, w: 500, h: 260 } },
      { id: 'clock', tone: 'accent', in: S.grow, out: S.canvas, shape: { kind: 'clock', x: 175, y: 228, r: 34 } },
      hand('forty', 225, 242, w.text('forty'), { size: 40, tone: 'accent', in: S.grow, out: S.canvas }),
      { id: 'forty-tag', tone: 'muted', in: S.grow, out: S.canvas, shape: { kind: 'tag', x: 620, y: 230, text: w.text('forty-tag') } },
      hand('candidate', 370, 610, w.text('candidate'), { size: 40, anchor: 'middle', tone: 'accent', in: S.candidate, out: S.move }),

      // The move.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.canvas }),
      hand('step-1', 120, 820, w.text('step-1'), { size: 38, in: S.name, out: S.canvas }),
      { id: 'tag-owner', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 160, y: 615, text: w.text('tag-owner') } },
      { id: 'tag-data', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 480, y: 615, text: w.text('tag-data') } },
      { id: 'tag-budget', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 800, y: 615, text: w.text('tag-budget') } },
      { id: 'tag-result', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 1120, y: 615, text: w.text('tag-result') } },
      hand('step-2', 120, 890, w.text('step-2'), { size: 38, in: S.labels, out: S.canvas }),
      { id: 'bracket', tone: 'accent', in: S.useCase, out: S.canvas, shape: { kind: 'line', points: [[160, 650], [160, 668], [1230, 668], [1230, 650]] } },
      hand('use-case', 1250, 685, w.text('use-case'), { size: 40, tone: 'accent', in: S.useCase, out: S.canvas }),
      hand('step-3', 120, 960, w.text('step-3'), { size: 38, in: S.fund, out: S.canvas }),
      sans('copilots', 120, 1040, w.text('copilots'), { size: 26, tone: 'muted', in: S.copilots, out: S.know }),
      { id: 'owner-ring', tone: 'warn', in: S.who, out: S.canvas, shape: { kind: 'ellipse', x: 138, y: 583, w: 160, h: 64 } },
      hand('head-of-claims', 160, 572, w.text('head-of-claims'), { size: 36, tone: 'warn', in: S.who, out: S.canvas }),
      hand('know', 120, 1040, w.text('know'), { size: 38, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 3] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}

