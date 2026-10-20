import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 8.2, "Is review our bottleneck?" (FS-0010): the layout. The words (each step's time and
// cue, every line on screen, the card headings and the readout's rows) are in
// content/decks/<locale>/8-2.yaml; this file places them on the stage by id. Built from the script's
// "On screen" list and stage directions; each step is one click while recording. The diagram is a
// pipe from left to right: a person, the agents they start, the changes, the bucket where changes
// wait, and the narrow tap of human review. The queue and clock figures are illustrative; the
// launch-date label is the only case element. Real figures (I10, D2) carry their source.

const STEPS = [
  'recap',
  'promise',
  'see',
  'agents',
  'why',
  'changes',
  'bucket',
  'tap',
  'fills',
  'launch',
  'study',
  'dora',
  'yours',
  'move',
  'wait',
  'queue',
  'size',
  'compare',
  'risk',
  'who',
  'know',
  'shrinks',
  'download',
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

const episode = episodeByNumber('8.2') ?? missing('episode 8.2 is missing from lib/episodes/part-8.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout82: DeckLayout<Step> = {
  id: '8-2',
  episode: '8.2',
  steps: STEPS,
  build,
};

/** The agents fan out from one person, one above the other. */
const AGENT_Y = [300, 400, 500, 600];

/** Changes waiting in the bucket: two at first, the rest when it fills. */
const WAITING: { x: number; y: number; at: 'bucket' | 'fills' }[] = [
  { x: 760, y: 590, at: 'bucket' },
  { x: 830, y: 590, at: 'bucket' },
  { x: 900, y: 590, at: 'fills' },
  { x: 770, y: 540, at: 'fills' },
  { x: 840, y: 540, at: 'fills' },
  { x: 905, y: 540, at: 'fills' },
  { x: 800, y: 490, at: 'fills' },
  { x: 870, y: 490, at: 'fills' },
];

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const agents: Element[] = AGENT_Y.flatMap((y, i) => [
    { id: `fan-${i + 1}`, tone: 'muted', in: S.why, out: S.who, shape: { kind: 'arrow', x1: 245, y1: 470, x2: 352, y2: y + 35 } },
    { id: `agent-ring-${i + 1}`, tone: 'accent', in: S.why, out: S.who, shape: { kind: 'ellipse', x: 360, y, w: 150, h: 70 } },
    hand(`agent-${i + 1}`, 435, y + 46, w.text(`agent-${i + 1}`), { size: 30, anchor: 'middle', tone: 'accent', in: S.why, out: S.who }),
    { id: `flow-${i + 1}`, tone: 'muted', in: S.changes, out: S.who, shape: { kind: 'arrow', x1: 518, y1: y + 35, x2: 722, y2: 560 } },
  ]);

  const waiting: Element[] = WAITING.map(({ x, y, at }, i) => ({
    id: `change-${i + 1}`,
    tone: at === 'fills' ? 'warn' : 'ink',
    in: S[at],
    out: S.who,
    shape: { kind: 'box', x, y, w: 50, h: 36, fill: true },
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
        key: 'readout',
        ...w.card('readout'),
        source: 'parts/8-building-with-agents/readout-assistant.md',
        inline: [1, 2, 3].map((n) => ({ label: w.text(`r${n}-label`), value: w.text(`r${n}`) })),
      },
      {
        key: 'experiment',
        ...w.card('experiment'),
        source: 'parts/8-building-with-agents/experiment-card.md',
        heading: 'Experiment card',
        rows: ['The change', 'Teams for comparison', 'Time box', 'What would make us stop early'],
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.see }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.see })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see.
      hand('title-see', 120, 170, w.text('title-see'), { size: 60, in: S.see, out: S.yours }),
      hand('agents-line', 120, 880, w.text('agents-line'), { size: 40, tone: 'muted', in: S.agents, out: S.why }),

      // Why: a person, the agents, the changes, the bucket, the narrow tap.
      { id: 'person', in: S.why, out: S.who, shape: { kind: 'seat', x: 200, y: 470 } },
      ...agents,
      hand('change-label', 540, 250, w.text('change-label'), { size: 30, tone: 'muted', in: S.changes, out: S.who }),
      sans('pr-label', 540, 282, w.text('pr-label'), { size: 20, tone: 'muted', in: S.changes, out: S.who }),
      { id: 'bucket', in: S.bucket, out: S.who, shape: { kind: 'line', points: [[720, 360], [740, 640], [960, 640], [980, 360]] } },
      ...waiting,
      hand('queue-label', 850, 700, w.text('queue-label'), { size: 40, anchor: 'middle', in: S.bucket, out: S.who }),
      { id: 'tap-top', tone: 'warn', in: S.tap, out: S.who, shape: { kind: 'line', points: [[980, 560], [1100, 600]] } },
      { id: 'tap-bottom', tone: 'warn', in: S.tap, out: S.who, shape: { kind: 'line', points: [[970, 640], [1100, 620]] } },
      hand('tap-label', 1040, 700, w.text('tap-label'), { size: 34, tone: 'warn', in: S.tap, out: S.who }),
      { id: 'to-live', in: S.tap, out: S.who, shape: { kind: 'arrow', x1: 1110, y1: 610, x2: 1270, y2: 610 } },
      hand('live', 1290, 625, w.text('live'), { size: 44, in: S.tap, out: S.who }),
      hand('waiting', 850, 410, w.text('waiting'), { size: 40, anchor: 'middle', tone: 'warn', in: S.fills, out: S.who }),
      { id: 'clock', tone: 'warn', in: S.fills, out: S.who, shape: { kind: 'clock', x: 1120, y: 470, r: 34 } },
      hand('clock-label', 1170, 485, w.text('clock-label'), { size: 34, tone: 'warn', in: S.fills, out: S.who }),
      { id: 'illustrative', tone: 'muted', in: S.fills, out: S.who, shape: { kind: 'tag', x: 1100, y: 390, text: w.text('illustrative') } },
      { id: 'launch', tone: 'warn', in: S.launch, out: S.who, shape: { kind: 'tag', x: 700, y: 300, text: w.text('launch') } },
      sans('study', 120, 800, w.text('study'), { size: 28, wrap: 1250, in: S.study, out: S.move }),
      sans('study-source', 120, 905, w.text('study-source'), { size: 20, tone: 'muted', in: S.study, out: S.move }),
      sans('dora', 120, 970, w.text('dora'), { size: 28, wrap: 1250, in: S.dora, out: S.move }),
      sans('dora-source', 120, 1035, w.text('dora-source'), { size: 20, tone: 'muted', in: S.dora, out: S.move }),
      hand('title-yours', 120, 170, w.text('title-yours'), { size: 60, in: S.yours, out: S.move }),

      // The move: three numbers written on the diagram.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.who }),
      sans('move-line', 120, 820, w.text('move-line'), { size: 28, in: S.move, out: S.who }),
      hand('n1', 1040, 760, w.text('n1'), { size: 30, tone: 'accent', in: S.wait, out: S.who }),
      hand('n2', 760, 760, w.text('n2'), { size: 30, tone: 'accent', in: S.queue, out: S.who }),
      hand('n3', 280, 720, w.text('n3'), { size: 30, tone: 'accent', in: S.size, out: S.who }),
      hand('compare', 120, 900, w.text('compare'), { size: 38, in: S.compare, out: S.who }),
      sans('risk', 120, 980, w.text('risk'), { size: 24, tone: 'muted', in: S.risk, out: S.who }),

      // Who and how you'll know: the readout, then the experiment card beside it.
      hand('who-title', 100, 130, w.text('who-title'), { size: 52, in: S.who, out: S.know }),
      { id: 'card-readout', in: S.who, out: S.takeaway, shape: { kind: 'card', card: 'readout', x: 100, y: 180, w: 640, h: 780 } },
      hand('know-title', 100, 130, w.text('know-title'), { size: 52, in: S.know, out: S.takeaway }),
      { id: 'card-experiment', in: S.know, out: S.takeaway, shape: { kind: 'card', card: 'experiment', x: 780, y: 180, w: 640, h: 780, highlight: { [S.download]: [0, 1, 3] } } },
      hand('know-line', 100, 1010, w.text('know-line'), { size: 36, tone: 'accent', in: S.shrinks, out: S.takeaway }),

      // The close.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
