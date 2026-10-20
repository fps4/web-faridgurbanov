import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 4.1, "An AI system in one picture" (FS-0010): the layout. The words are in
// content/decks/<locale>/4-1.yaml; this file places them on the stage by id. The diagram is the nine
// layers of the reference architecture, after Sculley et al. (our drawing): a model and a chat window
// first, then nine bands with the model small inside one, each band named and filled with the claims
// fast track as it is spoken, the lock on identity, the decision log, and owner tags, some blank.
// Case numbers are the running case's and are tagged synthetic.

const STEPS = [
  'recap',
  'promise',
  'model',
  'google',
  'nine',
  'channel',
  'orchestration',
  'modelAccess',
  'knowledge',
  'tools',
  'identity',
  'approval',
  'evaluation',
  'observability',
  'limit',
  'log',
  'whatYouSee',
  'draw',
  'owners',
  'blank',
  'shared',
  'retailer',
  'reuse',
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

const episode = episodeByNumber('4.1') ?? missing('episode 4.1 is missing from lib/episodes/part-4.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout41: DeckLayout<Step> = {
  id: '4-1',
  episode: '4.1',
  steps: STEPS,
  build,
};

/** The nine bands: left edge, width, top of band i (0-based), height. */
const BAND = { x: 120, w: 1280, h: 84 } as const;
const bandY = (i: number) => 170 + 94 * i;
/** The right column, above the camera corner. */
const COL = 1440;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // Each band is named, and filled with the case, at its own step.
  const layerStep: Step[] = ['channel', 'orchestration', 'modelAccess', 'knowledge', 'tools', 'identity', 'approval', 'evaluation', 'observability'];
  const bands: Element[] = layerStep.flatMap((step, i) => {
    const y = bandY(i);
    const n = i + 1;
    return [
      { id: `band-${n}`, in: S.google, out: S.canvas, shape: { kind: 'box', x: BAND.x, y, w: BAND.w, h: BAND.h } },
      hand(`layer-${n}`, 150, y + 54, w.text(`layer-${n}`), { size: 32, in: S[step], out: S.canvas }),
      sans(`case-${n}`, 620, y + 36, w.text(`case-${n}`), { size: 22, wrap: 510, tone: n === 6 ? 'warn' : 'accent', in: S[step], out: S.canvas }),
    ];
  });

  // Owner tags on the right of each band: named in accent, blank in red.
  const blankOwners = [4, 8, 9];
  const owners: Element[] = Array.from({ length: 9 }, (_, i) => {
    const n = i + 1;
    return {
      id: `owner-${n}`,
      tone: blankOwners.includes(n) ? 'warn' : 'accent',
      in: S.owners,
      out: S.canvas,
      shape: { kind: 'tag', x: 1150, y: bandY(i) + 42, text: w.text(`owner-${n}`) },
    } satisfies Element;
  });
  const rings: Element[] = blankOwners.map((n) => ({
    id: `ring-${n}`,
    tone: 'warn',
    in: S.blank,
    out: S.canvas,
    shape: { kind: 'ellipse', x: 1132, y: bandY(n - 1) + 10, w: 166, h: 64 },
  }));
  // Built once: model access, identity, logging.
  const shared: Element[] = [3, 6, 9].map((n) => ({
    id: `shared-${n}`,
    tone: 'accent',
    in: S.shared,
    out: S.canvas,
    shape: { kind: 'line', points: [[106, bandY(n - 1) + 6], [106, bandY(n - 1) + BAND.h - 6]] },
  }));

  const ledgerRows: Element[] = [1, 2, 3, 4, 5].map((n) =>
    sans(`ledger-${n}`, COL + 30, 420 + 40 * n, w.text(`ledger-${n}`), { size: 22, in: S.observability, out: S.draw }),
  );

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
        key: 'arch-blank',
        ...w.card('arch-blank'),
        source: 'parts/4-make-it-run/reference-architecture.md',
        heading: 'The legend',
        rows: ['3', '5', '6', '7', '9'],
      },
      {
        key: 'arch-claims',
        ...w.card('arch-claims'),
        source: 'parts/4-make-it-run/reference-architecture.claims.md',
        heading: 'Two lines that carry the design',
        rows: ['Rule version, or model version', 'Score', 'Threshold version', 'Conditions version', 'Amount and outcome'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.model }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.model })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: a model and a chat window.
      hand('title-model', 120, 150, w.text('title-model'), { size: 52, in: S.model, out: S.google }),
      { id: 'model-box', in: S.model, out: S.google, shape: { kind: 'box', x: 640, y: 360, w: 440, h: 260 } },
      hand('model', 860, 510, w.text('model'), { size: 72, anchor: 'middle', in: S.model, out: S.google }),
      { id: 'chat-box', tone: 'muted', in: S.model, out: S.google, shape: { kind: 'box', x: 1180, y: 400, w: 320, h: 220 } },
      { id: 'chat-1', tone: 'muted', in: S.model, out: S.google, shape: { kind: 'line', points: [[1210, 450], [1440, 450]] } },
      { id: 'chat-2', tone: 'muted', in: S.model, out: S.google, shape: { kind: 'line', points: [[1250, 510], [1470, 510]] } },
      { id: 'chat-3', tone: 'muted', in: S.model, out: S.google, shape: { kind: 'line', points: [[1210, 570], [1400, 570]] } },
      hand('chat-label', 1340, 385, w.text('chat-label'), { size: 32, anchor: 'middle', tone: 'muted', in: S.model, out: S.google }),

      // The nine bands, with the model small inside Model access.
      hand('title-small', 120, 130, w.text('title-small'), { size: 44, in: S.google, out: S.nine }),
      sans('credit', 1860, 130, w.text('credit'), { size: 20, tone: 'muted', anchor: 'end', in: S.google, out: S.draw }),
      ...bands,
      { id: 'model-ring', tone: 'accent', in: S.google, out: S.canvas, shape: { kind: 'ellipse', x: 420, y: bandY(2) + 12, w: 130, h: 60 } },
      hand('model-small', 485, bandY(2) + 50, w.text('model-small'), { size: 26, anchor: 'middle', tone: 'accent', in: S.google, out: S.canvas }),
      hand('title-nine', 120, 130, w.text('title-nine'), { size: 44, in: S.nine, out: S.whatYouSee }),

      // Identity: the lock and the cap.
      { id: 'lock-shackle', tone: 'warn', in: S.identity, out: S.canvas, shape: { kind: 'ellipse', x: 571, y: bandY(5) + 18, w: 24, h: 30 } },
      { id: 'lock-body', tone: 'warn', in: S.identity, out: S.canvas, shape: { kind: 'box', x: 566, y: bandY(5) + 34, w: 34, h: 26, fill: true } },
      { id: 'cap-tag', tone: 'muted', in: S.identity, out: S.canvas, shape: { kind: 'tag', x: 1600, y: 70, text: w.text('cap-tag') } },

      // Observability: the ledger, one row per claim.
      { id: 'ledger', in: S.observability, out: S.draw, shape: { kind: 'box', x: COL, y: 375, w: 420, h: 300 } },
      hand('ledger-title', COL + 20, 415, w.text('ledger-title'), { size: 28, in: S.observability, out: S.draw }),
      ...ledgerRows,

      // Two lines that carry the design.
      sans('injection', COL, 195, w.text('injection'), { size: 22, wrap: 420, tone: 'warn', in: S.limit, out: S.draw }),
      hand('limit', COL, 268, w.text('limit'), { size: 30, wrap: 420, tone: 'accent', in: S.limit, out: S.draw }),
      hand('log-line', COL, 350, w.text('log-line'), { size: 28, tone: 'accent', in: S.log, out: S.draw }),

      // What you see: the questions that arrive late.
      hand('title-late', 120, 130, w.text('title-late'), { size: 44, tone: 'warn', in: S.whatYouSee, out: S.draw }),
      { id: 'ask-security', tone: 'warn', in: S.whatYouSee, out: S.owners, shape: { kind: 'tag', x: 1150, y: bandY(5) + 42, text: w.text('ask-security') } },
      { id: 'ask-audit', tone: 'warn', in: S.whatYouSee, out: S.owners, shape: { kind: 'tag', x: 1150, y: bandY(8) + 42, text: w.text('ask-audit') } },

      // The move: an owner on every layer, the shared layers built once.
      hand('title-draw', 120, 130, w.text('title-draw'), { size: 44, in: S.draw, out: S.know }),
      ...owners,
      ...rings,
      hand('blank-text', COL, 220, w.text('blank-text'), { size: 32, wrap: 420, tone: 'warn', in: S.blank, out: S.shared }),
      ...shared,
      hand('shared-text', COL, 220, w.text('shared-text'), { size: 32, wrap: 420, tone: 'accent', in: S.shared, out: S.canvas }),
      sans('retailer', COL, 380, w.text('retailer'), { size: 24, wrap: 420, tone: 'muted', in: S.retailer, out: S.canvas }),
      hand('reuse', COL, 560, w.text('reuse'), { size: 30, wrap: 420, tone: 'accent', in: S.reuse, out: S.canvas }),
      { id: 'owner-ring', tone: 'warn', in: S.who, out: S.canvas, shape: { kind: 'ellipse', x: 1132, y: bandY(6) + 10, w: 290, h: 64 } },
      hand('who', COL, 650, w.text('who'), { size: 28, wrap: 420, in: S.who, out: S.canvas }),
      hand('title-know', 120, 130, w.text('title-know'), { size: 40, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 48, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'arch-blank', x: 100, y: 180, w: 640, h: 760, highlight: { [S.mark]: [1, 2] } } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'arch-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2, 3, 4] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
