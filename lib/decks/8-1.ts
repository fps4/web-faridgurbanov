import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 8.1, "It doesn't ask. It guesses." (FS-0010): the layout. The words (each step's time and
// cue, every line on screen, the card headings) are in content/decks/<locale>/8-1.yaml; this file
// places them on the stage by id. Built from the script's "On screen" list and stage directions;
// each step is one click while recording. The diagram is the brief as a card and what comes out of
// the agent: a one-line brief, an agent, a finished-looking box that turns into a question mark, then
// the card grown into the four-part brief with the six ways it fails along its edge. The insurer is
// fictional; the only case numbers are the €1,000 cap and €1,000.01.

const STEPS = [
  'recap',
  'promise',
  'brief',
  'agent',
  'built',
  'moved',
  'dora',
  'case',
  'twice',
  'cap',
  'down',
  'iban',
  'facts',
  'see',
  'move',
  'user',
  'constraint',
  'criteria',
  'metric',
  'slots',
  'scale',
  'systems',
  'error',
  'never',
  'measure',
  'data',
  'bubble',
  'who',
  'know',
  'download',
  'mark',
  'checklist',
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

const episode = episodeByNumber('8.1') ?? missing('episode 8.1 is missing from lib/episodes/part-8.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout81: DeckLayout<Step> = {
  id: '8-1',
  episode: '8.1',
  steps: STEPS,
  build,
};

/** The six ways a brief fails, as slots along the brief's edge: each lights up when it is named. */
const SLOTS = [
  ['slot-scale', 'scale'],
  ['slot-systems', 'systems'],
  ['slot-error', 'error'],
  ['slot-never', 'never'],
  ['slot-metric', 'measure'],
  ['slot-data', 'data'],
] as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const slots: Element[] = SLOTS.flatMap(([id, step], i) => {
    const y = 290 + i * 80;
    return [
      { id, tone: 'muted', in: S.slots, out: S[step], shape: { kind: 'tag', x: 1060, y, text: w.text(id) } },
      { id: `${id}-lit`, tone: 'accent', in: S[step], out: S.download, shape: { kind: 'tag', x: 1060, y, text: w.text(id) } },
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
        key: 'brief-blank',
        ...w.card('brief-blank'),
        source: 'parts/8-building-with-agents/brief-template.md',
        heading: '2. Constraint',
        rows: ['Scale', 'Systems it touches', 'What must never happen twice, or out of order', 'Rules about the data'],
      },
      {
        key: 'brief-claims',
        ...w.card('brief-claims'),
        source: 'parts/8-building-with-agents/brief-template.claims.md',
        heading: '2. Constraint',
        rows: ['Scale', 'Timing', 'What must never happen twice, or out of order'],
        tag: 'synthetic',
      },
      {
        key: 'checklist',
        ...w.card('checklist'),
        source: 'parts/8-building-with-agents/six-failure-checklist.md',
        heading: 'The six ways a brief fails',
        rows: ['1', '2', '3', '4', '5', '6'],
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.brief }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.brief })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: a one-line brief, the agent, a finished-looking result.
      sans('brief-label', 120, 280, w.text('brief-label'), { size: 24, tone: 'muted', in: S.brief, out: S.move }),
      { id: 'brief-box', in: S.brief, out: S.move, shape: { kind: 'box', x: 120, y: 300, w: 420, h: 200 } },
      hand('brief-text', 330, 390, w.text('brief-text'), { size: 40, anchor: 'middle', wrap: 380, in: S.brief, out: S.move }),
      hand('asked', 120, 580, w.text('asked'), { size: 36, tone: 'muted', in: S.brief, out: S.agent }),
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 64, in: S.agent, out: S.case }),
      { id: 'arrow-in', in: S.agent, out: S.move, shape: { kind: 'arrow', x1: 552, y1: 400, x2: 700, y2: 400 } },
      { id: 'agent-ring', tone: 'accent', in: S.agent, out: S.move, shape: { kind: 'ellipse', x: 712, y: 340, w: 200, h: 120 } },
      hand('agent-label', 812, 412, w.text('agent-label'), { size: 44, anchor: 'middle', tone: 'accent', in: S.agent, out: S.move }),
      { id: 'arrow-out', in: S.built, out: S.move, shape: { kind: 'arrow', x1: 924, y1: 400, x2: 1068, y2: 400 } },
      { id: 'built-box', in: S.built, out: S.move, shape: { kind: 'box', x: 1080, y: 300, w: 320, h: 200 } },
      hand('built-label', 1240, 370, w.text('built-label'), { size: 44, anchor: 'middle', in: S.built, out: S.move }),
      hand('tick', 1240, 465, w.text('tick'), { size: 72, anchor: 'middle', tone: 'accent', in: S.built, out: S.case }),
      hand('looks-finished', 1240, 560, w.text('looks-finished'), { size: 34, anchor: 'middle', tone: 'muted', in: S.built, out: S.case }),
      hand('moved', 120, 700, w.text('moved'), { size: 40, tone: 'accent', wrap: 1250, in: S.moved, out: S.case }),
      sans('dora', 120, 860, w.text('dora'), { size: 30, wrap: 1250, in: S.dora, out: S.case }),
      sans('dora-source', 120, 950, w.text('dora-source'), { size: 22, tone: 'muted', in: S.dora, out: S.case }),

      // On the case: four things an agent could build from that one line.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.case, out: S.move }),
      hand('question', 1240, 465, w.text('question'), { size: 72, anchor: 'middle', tone: 'warn', in: S.case, out: S.move }),
      hand('f-twice', 960, 580, w.text('f-twice'), { size: 34, tone: 'warn', in: S.twice, out: S.move }),
      hand('f-cap', 960, 640, w.text('f-cap'), { size: 34, tone: 'warn', in: S.cap, out: S.move }),
      hand('f-down', 960, 700, w.text('f-down'), { size: 34, tone: 'warn', in: S.down, out: S.move }),
      hand('f-iban', 960, 760, w.text('f-iban'), { size: 34, tone: 'warn', in: S.iban, out: S.move }),
      hand('facts', 120, 700, w.text('facts'), { size: 40, tone: 'accent', wrap: 780, in: S.facts, out: S.move }),
      hand('see', 120, 880, w.text('see'), { size: 38, wrap: 1250, in: S.see, out: S.move }),

      // The move: the card grows into the four-part brief.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.download }),
      { id: 'fictional', tone: 'muted', in: S.move, out: S.download, shape: { kind: 'tag', x: 760, y: 150, text: w.text('fictional') } },
      { id: 'brief-frame', in: S.move, out: S.download, shape: { kind: 'box', x: 120, y: 240, w: 900, h: 580 } },
      hand('b-user', 150, 285, w.text('b-user'), { size: 38, tone: 'accent', in: S.user, out: S.download }),
      sans('v-user', 150, 328, w.text('v-user'), { size: 24, wrap: 840, in: S.user, out: S.download }),
      { id: 'band-1', in: S.constraint, out: S.download, shape: { kind: 'line', points: [[120, 385], [1020, 385]] } },
      hand('b-constraint', 150, 425, w.text('b-constraint'), { size: 38, tone: 'accent', in: S.constraint, out: S.download }),
      sans('v-constraint', 150, 470, w.text('v-constraint'), { size: 24, wrap: 840, in: S.constraint, out: S.download }),
      { id: 'band-2', in: S.criteria, out: S.download, shape: { kind: 'line', points: [[120, 530], [1020, 530]] } },
      hand('b-criteria', 150, 570, w.text('b-criteria'), { size: 38, tone: 'accent', in: S.criteria, out: S.download }),
      sans('v-criteria', 150, 615, w.text('v-criteria'), { size: 24, wrap: 840, in: S.criteria, out: S.download }),
      { id: 'band-3', in: S.metric, out: S.download, shape: { kind: 'line', points: [[120, 675], [1020, 675]] } },
      hand('b-metric', 150, 715, w.text('b-metric'), { size: 38, tone: 'accent', in: S.metric, out: S.download }),
      sans('v-metric', 150, 760, w.text('v-metric'), { size: 24, wrap: 840, in: S.metric, out: S.download }),

      // The six ways a brief fails, along the card's edge; then the agent's question.
      hand('slots-label', 1060, 250, w.text('slots-label'), { size: 30, tone: 'muted', in: S.slots, out: S.download }),
      ...slots,
      { id: 'bubble', tone: 'accent', in: S.bubble, out: S.download, shape: { kind: 'ellipse', x: 1050, y: 760, w: 380, h: 130 } },
      hand('bubble-text', 1240, 815, w.text('bubble-text'), { size: 30, anchor: 'middle', wrap: 320, tone: 'accent', in: S.bubble, out: S.download }),
      hand('who', 120, 900, w.text('who'), { size: 36, wrap: 900, in: S.who, out: S.download }),
      hand('know', 120, 1030, w.text('know'), { size: 38, tone: 'accent', in: S.know, out: S.download }),

      // The download: the brief, blank and filled in; then the checklist takes the blank's place.
      hand('download-title', 100, 130, w.text('download-title'), { size: 52, in: S.download, out: S.checklist }),
      { id: 'card-blank', in: S.download, out: S.checklist, shape: { kind: 'card', card: 'brief-blank', x: 100, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 2] } } },
      { id: 'card-claims', in: S.download, out: S.takeaway, shape: { kind: 'card', card: 'brief-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 2] } } },
      hand('checklist-title', 100, 130, w.text('checklist-title'), { size: 52, in: S.checklist, out: S.takeaway }),
      { id: 'card-checklist', in: S.checklist, out: S.takeaway, shape: { kind: 'card', card: 'checklist', x: 100, y: 180, w: 640, h: 780 } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
