import type { CardSpec, Element, Tone } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 4.2, "Why pilots stay pilots" (FS-0010): the layout. The words are in
// content/decks/<locale>/4-2.yaml; this file places them on the stage by id. The diagram is 4.1's nine
// layers, reused: a pilot-scope circle around the one band a pilot covers, then eight gate markers on
// the bands they test, then the claims case coloured gate by gate (pass in blue, work in red). The two
// real figures carry their source lines; case numbers are the running case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'timeline',
  'eiopa',
  'dnb',
  'scope',
  'otherEight',
  'notAsked',
  'move',
  'gate1',
  'gate2',
  'gate3',
  'gate4',
  'gate5',
  'gate6',
  'gate7',
  'gate8',
  'rule',
  'case',
  'c1',
  'c3',
  'c4',
  'c5',
  'c6',
  'c7',
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

const episode = episodeByNumber('4.2') ?? missing('episode 4.2 is missing from lib/episodes/part-4.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout42: DeckLayout<Step> = {
  id: '4-2',
  episode: '4.2',
  steps: STEPS,
  build,
};

/** The nine bands, as in 4.1: left edge, width, top of band i (0-based), height. */
const BAND = { x: 120, w: 1280, h: 84 } as const;
const bandY = (i: number) => 170 + 94 * i;
/** The right column, above the camera corner. */
const COL = 1440;

/**
 * Each gate: the band it tests (0-based), the step it is placed at, and on the claims case the step
 * it is coloured at and whether it passes.
 */
const GATES: { n: number; band: number; placed: Step; coloured: Step; pass: boolean }[] = [
  { n: 1, band: 3, placed: 'gate1', coloured: 'c1', pass: false },
  { n: 2, band: 5, placed: 'gate2', coloured: 'case', pass: true },
  { n: 3, band: 4, placed: 'gate3', coloured: 'c3', pass: false },
  { n: 4, band: 7, placed: 'gate4', coloured: 'c4', pass: true },
  { n: 5, band: 8, placed: 'gate5', coloured: 'c5', pass: true },
  { n: 6, band: 6, placed: 'gate6', coloured: 'c6', pass: false },
  { n: 7, band: 1, placed: 'gate7', coloured: 'c7', pass: false },
  { n: 8, band: 2, placed: 'gate8', coloured: 'case', pass: false },
];

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const bands: Element[] = Array.from({ length: 9 }, (_, i) => {
    const n = i + 1;
    return [
      { id: `band-${n}`, in: S.scope, out: S.canvas, shape: { kind: 'box', x: BAND.x, y: bandY(i), w: BAND.w, h: BAND.h } } satisfies Element,
      hand(`layer-${n}`, 150, bandY(i) + 54, w.text(`layer-${n}`), { size: 32, in: S.scope, out: S.canvas }),
    ];
  }).flat();

  const gates: Element[] = GATES.flatMap(({ n, band, placed, coloured, pass }) => {
    const y = bandY(band);
    const tone: Tone = pass ? 'accent' : 'warn';
    return [
      { id: `gate-${n}-ring`, in: S[placed], out: S.canvas, shape: { kind: 'ellipse', x: 1150, y: y + 14, w: 56, h: 56 } } satisfies Element,
      hand(`gate-${n}-n`, 1178, y + 54, w.text(`gate-${n}-n`), { size: 32, anchor: 'middle', in: S[placed], out: S.canvas }),
      hand(`gate-${n}`, 1220, y + 52, w.text(`gate-${n}`), { size: 26, in: S[placed], out: S.canvas }),
      { id: `gate-${n}-state`, tone, in: S[coloured], out: S.canvas, shape: { kind: 'ellipse', x: 1146, y: y + 10, w: 64, h: 64 } } satisfies Element,
      hand(`status-${n}`, 620, y + 52, w.text(`status-${n}`), { size: 26, tone, in: S[coloured], out: S.canvas }),
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
        key: 'gates-blank',
        ...w.card('gates-blank'),
        source: 'parts/4-make-it-run/readiness-scorecard.md',
        heading: 'The eight gates',
        rows: ['1', '3', '6', '7', '8'],
      },
      {
        key: 'gates-claims',
        ...w.card('gates-claims'),
        source: 'parts/4-make-it-run/readiness-scorecard.claims.md',
        heading: 'Decision',
        rows: ['Gates passed', 'Gates with budgeted work', 'Gates that stop it', 'Decision'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.timeline }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.timeline })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: six months later, still a pilot; the two real figures.
      hand('title-hook', 120, 150, w.text('title-hook'), { size: 52, in: S.timeline, out: S.scope }),
      { id: 'timeline', tone: 'muted', in: S.timeline, out: S.scope, shape: { kind: 'arrow', x1: 160, y1: 270, x2: 1700, y2: 270 } },
      hand('tl-pilot', 160, 245, w.text('tl-pilot'), { size: 36, in: S.timeline, out: S.scope }),
      hand('tl-six', 930, 245, w.text('tl-six'), { size: 36, anchor: 'middle', tone: 'muted', in: S.timeline, out: S.scope }),
      hand('tl-still', 1700, 245, w.text('tl-still'), { size: 36, anchor: 'end', tone: 'warn', in: S.timeline, out: S.scope }),
      { id: 'demo-box', tone: 'muted', in: S.timeline, out: S.scope, shape: { kind: 'box', x: 160, y: 330, w: 520, h: 300 } },
      hand('demo', 420, 500, w.text('demo'), { size: 44, anchor: 'middle', tone: 'muted', in: S.timeline, out: S.scope }),
      sans('eiopa', 760, 400, w.text('eiopa'), { size: 34, wrap: 900, in: S.eiopa, out: S.scope }),
      sans('eiopa-source', 760, 490, w.text('eiopa-source'), { size: 20, tone: 'muted', in: S.eiopa, out: S.scope }),
      sans('dnb', 760, 590, w.text('dnb'), { size: 34, wrap: 900, in: S.dnb, out: S.scope }),
      sans('dnb-source', 760, 680, w.text('dnb-source'), { size: 20, tone: 'muted', in: S.dnb, out: S.scope }),

      // Why: the nine layers, and the one band a pilot covers.
      hand('title-scope', 120, 130, w.text('title-scope'), { size: 44, in: S.scope, out: S.move }),
      ...bands,
      { id: 'scope-ring', tone: 'warn', in: S.scope, out: S.move, shape: { kind: 'ellipse', x: 100, y: bandY(2) - 12, w: 1320, h: 108 } },
      hand('scope-label', COL, 410, w.text('scope-label'), { size: 30, tone: 'warn', in: S.scope, out: S.move }),
      hand('other-eight', COL, 480, w.text('other-eight'), { size: 32, wrap: 420, tone: 'accent', in: S.otherEight, out: S.move }),
      hand('not-asked', COL, 580, w.text('not-asked'), { size: 30, wrap: 420, in: S.notAsked, out: S.move }),

      // The move: eight gates, and the rule.
      hand('title-move', 120, 130, w.text('title-move'), { size: 44, in: S.move, out: S.case }),
      ...gates,
      hand('rule', COL, 220, w.text('rule'), { size: 34, wrap: 420, tone: 'warn', in: S.rule, out: S.case }),
      sans('no-third', COL, 350, w.text('no-third'), { size: 22, wrap: 420, tone: 'muted', in: S.rule, out: S.case }),

      // On the case.
      hand('title-case', 120, 130, w.text('title-case'), { size: 44, in: S.case, out: S.know }),
      { id: 'sum-tag', tone: 'muted', in: S.c5, out: S.canvas, shape: { kind: 'tag', x: 1600, y: 70, text: w.text('sum-tag') } },
      hand('who-1', COL, 220, w.text('who-1'), { size: 30, wrap: 420, in: S.who, out: S.canvas }),
      hand('who-2', COL, 330, w.text('who-2'), { size: 30, wrap: 420, tone: 'warn', in: S.who, out: S.canvas }),
      hand('title-know', 120, 130, w.text('title-know'), { size: 44, tone: 'accent', in: S.know, out: S.canvas }),
      sans('record', COL, 450, w.text('record'), { size: 24, wrap: 420, tone: 'muted', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'gates-blank', x: 100, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2, 3, 4] } } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'gates-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 3] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
