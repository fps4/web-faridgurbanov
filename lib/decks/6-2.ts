import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 6.2, "You already have this obligation" (FS-0010): the layout. The words are in
// content/decks/<locale>/6-2.yaml; this file places them on the stage by id. Built from the script's
// "On screen" list and stage directions; each step is one click while recording. The diagram is a
// change moving through request → implement → approve → live, with a wall in front of "approve"
// (EU DORA's independence rule); coding agents pile changes up against it; two signatures sit above
// the flow; then the control map with its three layers lit.

const STEPS = [
  'recap',
  'promise',
  'policy',
  'inforce',
  'idea',
  'source',
  'scope',
  'agents',
  'pile',
  'bias',
  'bold',
  'signatures',
  'link',
  'move',
  'identity',
  'approval',
  'record',
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

const episode = episodeByNumber('6.2') ?? missing('episode 6.2 is missing from lib/episodes/part-6.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout62: DeckLayout<Step> = {
  id: '6-2',
  episode: '6.2',
  steps: STEPS,
  build,
};

/** The nine layers from Part 4, top to bottom, as on the control map. */
const LAYERS = [
  'layer-channel',
  'layer-orchestration',
  'layer-model',
  'layer-knowledge',
  'layer-tools',
  'layer-identity',
  'layer-approval',
  'layer-evaluation',
  'layer-observability',
] as const;
const layerY = (i: number) => 220 + i * 80;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // request → implement → approve → live, one row across the middle.
  const FLOW = [
    { id: 'flow-request', x: 120, w: 300 },
    { id: 'flow-implement', x: 520, w: 300 },
    { id: 'flow-approve', x: 980, w: 300 },
    { id: 'flow-live', x: 1400, w: 260 },
  ] as const;
  const flow: Element[] = FLOW.flatMap((b) => [
    { id: `box-${b.id}`, in: S.idea, out: S.move, shape: { kind: 'box', x: b.x, y: 520, w: b.w, h: 120 } },
    hand(b.id, b.x + b.w / 2, 595, w.text(b.id), { size: 40, anchor: 'middle', in: S.idea, out: S.move }),
  ]);

  // Three coding agents under "implement", each with an arrow up into it.
  const agents: Element[] = [470, 580, 690].flatMap((x, i) => [
    { id: `box-agent-${i + 1}`, tone: 'accent', in: S.agents, out: S.move, shape: { kind: 'box', x, y: 680, w: 90, h: 50 } },
    hand(`agent-${i + 1}`, x + 45, 714, w.text(`agent-${i + 1}`), { size: 26, anchor: 'middle', tone: 'accent', in: S.agents, out: S.move }),
    { id: `arrow-agent-${i + 1}`, tone: 'accent', in: S.agents, out: S.move, shape: { kind: 'arrow', x1: x + 45, y1: 676, x2: 600 + i * 70, y2: 646 } },
  ]);

  // The pile of changes in front of the wall.
  const pile: Element[] = [490, 464, 438].map((y, i) => ({
    id: `pile-${i + 1}`,
    tone: 'warn',
    in: S.pile,
    out: S.signatures,
    shape: { kind: 'box', x: 860, y, w: 55, h: 22 },
  }));

  // The control map: nine layers, three of them lit one by one.
  const layers: Element[] = LAYERS.flatMap((id, i) => [
    { id: `box-${id}`, tone: 'muted', in: S.move, out: S.canvas, shape: { kind: 'box', x: 120, y: layerY(i), w: 500, h: 68 } },
    hand(id, 145, layerY(i) + 45, w.text(id), { size: 30, in: S.move, out: S.canvas }),
  ]);
  const lit = (id: string, layer: (typeof LAYERS)[number], at: number, q: string): Element[] => {
    const i = LAYERS.indexOf(layer);
    return [
      { id, tone: 'accent', in: at, out: S.canvas, shape: { kind: 'box', x: 110, y: layerY(i) - 8, w: 520, h: 84 } },
      hand(q, 680, layerY(i) + 45, w.text(q), { size: 30, wrap: 700, tone: 'accent', in: at, out: S.canvas }),
    ];
  };

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
        key: 'map-blank',
        ...w.card('map-blank'),
        source: 'parts/6-risk-and-governance/control-map.md',
        heading: '3. The map',
        rows: ['Identity and permissions', 'Human approval', 'Observability and cost'],
      },
      {
        key: 'map-claims',
        ...w.card('map-claims'),
        source: 'parts/6-risk-and-governance/control-map.claims.md',
        heading: '3. The map',
        rows: ['Identity and permissions', 'Human approval', 'Observability and cost'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 790, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.policy }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.policy })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: the new AI policy, while the rule is already in force.
      hand('title-policy', 120, 170, w.text('title-policy'), { size: 60, in: S.policy, out: S.idea }),
      { id: 'box-policy-ask', in: S.policy, out: S.idea, shape: { kind: 'box', x: 160, y: 330, w: 440, h: 120 } },
      hand('policy-ask', 380, 402, w.text('policy-ask'), { size: 38, anchor: 'middle', in: S.policy, out: S.idea }),
      { id: 'arrow-policy-1', in: S.policy, out: S.idea, shape: { kind: 'arrow', x1: 612, y1: 390, x2: 708, y2: 390 } },
      { id: 'box-policy-group', in: S.policy, out: S.idea, shape: { kind: 'box', x: 720, y: 330, w: 440, h: 120 } },
      hand('policy-group', 940, 402, w.text('policy-group'), { size: 38, anchor: 'middle', in: S.policy, out: S.idea }),
      { id: 'arrow-policy-2', in: S.policy, out: S.idea, shape: { kind: 'arrow', x1: 1172, y1: 390, x2: 1268, y2: 390 } },
      { id: 'box-policy-draft', in: S.policy, out: S.idea, shape: { kind: 'box', x: 1280, y: 330, w: 440, h: 120 } },
      hand('policy-draft', 1500, 402, w.text('policy-draft'), { size: 38, anchor: 'middle', in: S.policy, out: S.idea }),
      hand('inforce', 160, 620, w.text('inforce'), { size: 52, tone: 'accent', in: S.inforce, out: S.idea }),

      // The idea: the change flow and the wall in front of "approve".
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 56, in: S.idea, out: S.bold }),
      ...flow,
      { id: 'arrow-flow-1', in: S.idea, out: S.move, shape: { kind: 'arrow', x1: 432, y1: 580, x2: 508, y2: 580 } },
      { id: 'arrow-flow-2', in: S.idea, out: S.move, shape: { kind: 'arrow', x1: 832, y1: 580, x2: 968, y2: 580 } },
      { id: 'arrow-flow-3', in: S.idea, out: S.move, shape: { kind: 'arrow', x1: 1292, y1: 580, x2: 1388, y2: 580 } },
      { id: 'wall', tone: 'warn', in: S.idea, out: S.move, shape: { kind: 'line', points: [[930, 450], [930, 720]] } },
      hand('wall-label', 930, 765, w.text('wall-label'), { size: 32, anchor: 'middle', tone: 'warn', in: S.idea, out: S.move }),
      sans('dora-source', 120, 830, w.text('dora-source'), { size: 22, tone: 'muted', in: S.source, out: S.move }),
      sans('dora-quote', 120, 890, w.text('dora-quote'), { size: 24, wrap: 1250, in: S.source, out: S.move }),
      { id: 'scope', tone: 'accent', in: S.scope, out: S.signatures, shape: { kind: 'tag', x: 120, y: 270, text: w.text('scope') } },

      // On the case: agents fan in, changes pile up, the click is weak evidence.
      ...agents,
      { id: 'arrow-flow-2b', tone: 'warn', in: S.pile, out: S.move, shape: { kind: 'arrow', x1: 832, y1: 555, x2: 968, y2: 555 } },
      { id: 'arrow-flow-2c', tone: 'warn', in: S.pile, out: S.move, shape: { kind: 'arrow', x1: 832, y1: 605, x2: 968, y2: 605 } },
      ...pile,
      hand('pile', 850, 440, w.text('pile'), { size: 28, anchor: 'end', tone: 'warn', in: S.pile, out: S.signatures }),
      hand('bias', 1000, 330, w.text('bias'), { size: 34, wrap: 700, tone: 'warn', in: S.bias, out: S.signatures }),
      sans('bias-source', 1000, 430, w.text('bias-source'), { size: 20, tone: 'muted', in: S.bias, out: S.signatures }),
      hand('bold', 120, 170, w.text('bold'), { size: 44, tone: 'accent', in: S.bold, out: S.move }),

      // Two signatures above the flow, and the record that ties them.
      { id: 'box-sig-business', tone: 'accent', in: S.signatures, out: S.move, shape: { kind: 'box', x: 120, y: 290, w: 760, h: 150 } },
      hand('sig-business', 140, 345, w.text('sig-business'), { size: 32, wrap: 700, in: S.signatures, out: S.move }),
      { id: 'sig-business-tag', tone: 'muted', in: S.signatures, out: S.move, shape: { kind: 'tag', x: 680, y: 418, text: w.text('sig-business-tag') } },
      { id: 'box-sig-change', tone: 'warn', in: S.signatures, out: S.move, shape: { kind: 'box', x: 980, y: 290, w: 700, h: 150 } },
      hand('sig-change', 1000, 345, w.text('sig-change'), { size: 32, wrap: 640, in: S.signatures, out: S.move }),
      { id: 'link-line', tone: 'accent', in: S.link, out: S.move, shape: { kind: 'line', points: [[440, 440], [440, 478], [1440, 478], [1440, 505]] } },
      hand('release', 1460, 508, w.text('release'), { size: 30, tone: 'accent', in: S.link, out: S.move }),

      // The move: the control map, three questions on three layers.
      hand('title-move', 120, 170, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      ...layers,
      ...lit('lit-identity', 'layer-identity', S.identity, 'q-identity'),
      ...lit('lit-approval', 'layer-approval', S.approval, 'q-approval'),
      ...lit('lit-observability', 'layer-observability', S.record, 'q-record'),
      sans('obligation', 120, 975, w.text('obligation'), { size: 20, tone: 'muted', in: S.identity, out: S.canvas }),
      hand('who', 680, 290, w.text('who'), { size: 32, wrap: 740, tone: 'warn', in: S.who, out: S.canvas }),
      hand('know', 120, 1045, w.text('know'), { size: 38, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'map-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'map-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
