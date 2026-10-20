import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 2.2, "Assistant, workflow, agent" (FS-0010): the layout. The words (each step's time and
// cue, every line on screen, the card headings) are in content/decks/<locale>/2-2.yaml; this file
// places them on the stage by id. Built from the script's "On screen" list and stage directions;
// each step is one click while recording. The diagram is one word split into three columns
// (assistant · workflow · agent, four rows each), the workflow/agent line after Schluntz & Zhang,
// then the claims product drawn under the same three headings, with the payment step locked.

const STEPS = [
  'recap',
  'promise',
  'word',
  'split',
  'assistant',
  'workflow',
  'agent',
  'line',
  'pipe',
  'letter',
  'euro',
  'lock',
  'control',
  'vendor',
  'questions',
  'see',
  'move',
  'layer',
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

const episode = episodeByNumber('2.2') ?? missing('episode 2.2 is missing from lib/episodes/part-2.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout22: DeckLayout<Step> = {
  id: '2-2',
  episode: '2.2',
  steps: STEPS,
  build,
};

// Three columns of the same width; four rows under each header, named once in the right margin.
const COLUMNS = [
  { name: 'assistant', x: 120, size: 44 },
  { name: 'workflow', x: 560, size: 36 },
  { name: 'agent', x: 1000, size: 44 },
] as const;
const COL_W = 400;
const ROWS = [
  { name: 'does', y: 385 },
  { name: 'acts', y: 470 },
  { name: 'wrong', y: 555 },
  { name: 'control', y: 640 },
] as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // Each column arrives at its own step; the columns leave when the case takes over the space, and
  // the case labels its parts with the same three words.
  const columns: Element[] = COLUMNS.flatMap(({ name, x, size }) => [
    { id: `head-box-${name}`, in: S.split, out: S.pipe, shape: { kind: 'box', x, y: 200, w: COL_W, h: 90 } },
    hand(`head-${name}`, x + COL_W / 2, 262, w.text(`head-${name}`), { size, anchor: 'middle', in: S.split, out: S.pipe }),
    ...ROWS.map(({ name: row, y }) =>
      hand(`${name}-${row}`, x + 15, y, w.text(`${name}-${row}`), { size: 28, wrap: 370, in: S[name], out: S.pipe }),
    ),
  ]);
  const legend: Element[] = ROWS.map(({ name, y }) =>
    sans(`row-${name}`, 1460, y, w.text(`row-${name}`), { size: 22, tone: 'muted', in: S.assistant, out: S.pipe }),
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
        key: 'glossary-en',
        ...w.card('glossary-en'),
        source: 'parts/2-choose-the-approach/glossary-cards.md',
        heading: 'The three words',
        rows: ['1', '2', '3', '4'],
      },
      {
        key: 'glossary-nl',
        ...w.card('glossary-nl'),
        source: 'parts/2-choose-the-approach/glossary-cards.nl.md',
        heading: 'De drie woorden',
        rows: ['1', '2', '3', '4'],
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.word }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.word })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: one word, then three columns with four rows each.
      hand('word', 760, 600, w.text('word'), { size: 160, anchor: 'middle', tone: 'warn', in: S.word, out: S.split }),
      hand('title-idea', 120, 140, w.text('title-idea'), { size: 56, in: S.split, out: S.pipe }),
      ...columns,
      ...legend,

      // One small figure per column: a person at a desk; a pipe with one AI box; AI reaching into systems.
      { id: 'figure-person', tone: 'muted', in: S.assistant, out: S.pipe, shape: { kind: 'seat', x: 320, y: 790 } },
      { id: 'figure-pipe', tone: 'muted', in: S.workflow, out: S.pipe, shape: { kind: 'line', points: [[590, 800], [930, 800]] } },
      { id: 'figure-ai-box', tone: 'accent', in: S.workflow, out: S.pipe, shape: { kind: 'box', x: 725, y: 770, w: 70, h: 60, fill: true } },
      hand('ai-box', 760, 812, w.text('ai-box'), { size: 32, anchor: 'middle', in: S.workflow, out: S.pipe }),
      { id: 'figure-agent', tone: 'accent', in: S.agent, out: S.pipe, shape: { kind: 'ellipse', x: 1030, y: 760, w: 80, h: 80 } },
      hand('ai-agent', 1070, 812, w.text('ai-agent'), { size: 32, anchor: 'middle', in: S.agent, out: S.pipe }),
      ...[740, 800, 860].flatMap((y, i): Element[] => [
        { id: `figure-reach-${i + 1}`, tone: 'accent', in: S.agent, out: S.pipe, shape: { kind: 'arrow', x1: 1112, y1: 800, x2: 1240, y2: y } },
        { id: `figure-system-${i + 1}`, tone: 'muted', in: S.agent, out: S.pipe, shape: { kind: 'box', x: 1245, y: y - 20, w: 130, h: 40 } },
      ]),

      // The line between workflow and agent, after Schluntz & Zhang.
      { id: 'line', tone: 'warn', in: S.line, out: S.pipe, shape: { kind: 'line', points: [[980, 190], [980, 900]] } },
      hand('path-fixed', 760, 950, w.text('path-fixed'), { size: 30, anchor: 'middle', tone: 'warn', in: S.line, out: S.pipe }),
      hand('path-own', 1200, 950, w.text('path-own'), { size: 30, anchor: 'middle', tone: 'warn', in: S.line, out: S.pipe }),
      sans('credit', 980, 1010, w.text('credit'), { size: 20, tone: 'muted', anchor: 'middle', in: S.line, out: S.pipe }),

      // In the case: the claims pipe under the same three headings.
      hand('title-case', 120, 140, w.text('title-case'), { size: 56, in: S.pipe, out: S.see }),
      { id: 'case-tag', tone: 'muted', in: S.pipe, out: S.canvas, shape: { kind: 'tag', x: 120, y: 340, text: w.text('case-tag') } },
      hand('workflow-label', 500, 490, w.text('workflow-label'), { size: 28, tone: 'accent', in: S.pipe, out: S.canvas }),
      { id: 'pipe-box-rule', in: S.pipe, out: S.canvas, shape: { kind: 'box', x: 500, y: 520, w: 140, h: 80 } },
      hand('pipe-rule', 570, 570, w.text('pipe-rule'), { size: 28, anchor: 'middle', in: S.pipe, out: S.canvas }),
      { id: 'pipe-arrow-1', in: S.pipe, out: S.canvas, shape: { kind: 'arrow', x1: 644, y1: 560, x2: 696, y2: 560 } },
      { id: 'pipe-box-coverage', in: S.pipe, out: S.canvas, shape: { kind: 'box', x: 700, y: 520, w: 190, h: 80 } },
      hand('pipe-coverage', 795, 570, w.text('pipe-coverage'), { size: 28, anchor: 'middle', in: S.pipe, out: S.canvas }),
      { id: 'pipe-arrow-2', in: S.pipe, out: S.canvas, shape: { kind: 'arrow', x1: 894, y1: 560, x2: 936, y2: 560 } },
      { id: 'pipe-box-score', in: S.pipe, out: S.canvas, shape: { kind: 'box', x: 940, y: 520, w: 140, h: 80 } },
      hand('pipe-score', 1010, 570, w.text('pipe-score'), { size: 28, anchor: 'middle', in: S.pipe, out: S.canvas }),
      { id: 'pipe-arrow-3', in: S.pipe, out: S.canvas, shape: { kind: 'arrow', x1: 1084, y1: 560, x2: 1126, y2: 560 } },
      { id: 'pipe-box-route', in: S.pipe, out: S.canvas, shape: { kind: 'box', x: 1130, y: 520, w: 140, h: 80 } },
      hand('pipe-route', 1200, 570, w.text('pipe-route'), { size: 28, anchor: 'middle', in: S.pipe, out: S.canvas }),

      // The letter drafter: an assistant beside the handler.
      hand('letter-label', 120, 470, w.text('letter-label'), { size: 28, tone: 'accent', in: S.letter, out: S.canvas }),
      { id: 'letter-handler', tone: 'muted', in: S.letter, out: S.canvas, shape: { kind: 'seat', x: 230, y: 570 } },
      { id: 'letter-envelope', tone: 'accent', in: S.letter, out: S.canvas, shape: { kind: 'box', x: 290, y: 530, w: 90, h: 60 } },
      { id: 'letter-flap', tone: 'accent', in: S.letter, out: S.canvas, shape: { kind: 'line', points: [[290, 530], [335, 565], [380, 530]] } },
      hand('handler', 230, 690, w.text('handler'), { size: 26, anchor: 'middle', tone: 'muted', in: S.letter, out: S.canvas }),

      // The payment: where the workflow acts by itself, and its lock.
      { id: 'pipe-arrow-4', tone: 'warn', in: S.euro, out: S.canvas, shape: { kind: 'arrow', x1: 1274, y1: 560, x2: 1316, y2: 560 } },
      { id: 'euro-ring', tone: 'warn', in: S.euro, out: S.canvas, shape: { kind: 'ellipse', x: 1320, y: 515, w: 90, h: 90 } },
      hand('euro', 1365, 578, w.text('euro'), { size: 56, anchor: 'middle', tone: 'warn', in: S.euro, out: S.canvas }),
      hand('acts-here', 1300, 470, w.text('acts-here'), { size: 28, tone: 'warn', in: S.euro, out: S.canvas }),
      { id: 'lock-shackle', tone: 'warn', in: S.lock, out: S.canvas, shape: { kind: 'ellipse', x: 1347, y: 615, w: 36, h: 40 } },
      { id: 'lock-body', tone: 'warn', in: S.lock, out: S.canvas, shape: { kind: 'box', x: 1340, y: 638, w: 50, h: 40, fill: true } },
      hand('lock-cap', 1460, 560, w.text('lock-cap'), { size: 30, tone: 'warn', in: S.lock, out: S.canvas }),
      hand('lock-who', 1460, 600, w.text('lock-who'), { size: 30, tone: 'warn', in: S.lock, out: S.canvas }),
      hand('lock-denial', 1460, 640, w.text('lock-denial'), { size: 30, tone: 'warn', in: S.lock, out: S.canvas }),
      hand('control', 120, 790, w.text('control'), { size: 40, tone: 'accent', in: S.control, out: S.canvas }),

      // The vendor's triage module, from outside: the agent questions first.
      { id: 'vendor-box', tone: 'muted', in: S.vendor, out: S.canvas, shape: { kind: 'box', x: 120, y: 840, w: 820, h: 130 } },
      hand('vendor', 145, 890, w.text('vendor'), { size: 30, wrap: 780, in: S.vendor, out: S.canvas }),
      hand('vendor-mark', 975, 950, w.text('vendor-mark'), { size: 96, tone: 'warn', in: S.vendor, out: S.canvas }),
      hand('questions', 1040, 880, w.text('questions'), { size: 28, wrap: 390, tone: 'warn', in: S.questions, out: S.canvas }),

      // What you see in your organisation, and the move.
      hand('title-see', 120, 140, w.text('title-see'), { size: 44, in: S.see, out: S.move }),
      { id: 'tag-suite', tone: 'muted', in: S.see, out: S.move, shape: { kind: 'tag', x: 1460, y: 220, text: w.text('tag-suite') } },
      { id: 'tag-chatbot', tone: 'muted', in: S.see, out: S.move, shape: { kind: 'tag', x: 1460, y: 270, text: w.text('tag-chatbot') } },
      { id: 'tag-automation', tone: 'muted', in: S.see, out: S.move, shape: { kind: 'tag', x: 1460, y: 320, text: w.text('tag-automation') } },
      hand('title-move', 120, 140, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      hand('layer', 1460, 380, w.text('layer'), { size: 30, tone: 'accent', wrap: 400, in: S.layer, out: S.canvas }),
      hand('who', 1460, 210, w.text('who'), { size: 28, wrap: 400, in: S.who, out: S.know }),
      hand('know', 1460, 210, w.text('know'), { size: 28, tone: 'accent', wrap: 400, in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-en', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'glossary-en', x: 100, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2] } } },
      { id: 'card-nl', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'glossary-nl', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 2] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
