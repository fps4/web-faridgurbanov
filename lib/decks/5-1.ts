import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 5.1, "Design for the day it is wrong" (FS-0010): the layout. The words (each step's time
// and cue, every line on screen, the card headings) are in content/decks/<locale>/5-1.yaml; this
// file places them on the stage by id. Built from the script's "On screen" list and stage
// directions; each step is one click while recording. The diagram is one claim moving through one
// step, the coverage check, shown two ways (A: a tick and a confidence bar; B: the clause quoted),
// what happens when it is wrong, and where the correction goes. After Amershi et al. and Google PAIR.

const STEPS = [
  'recap',
  'promise',
  'idea',
  'graceful',
  'claim',
  'suggest',
  'optionA',
  'optionB',
  'wrong',
  'explanation',
  'correction',
  'policyholder',
  'ask',
  'seen',
  'ombudsman',
  'move',
  'visible',
  'cheap',
  'teach',
  'check',
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

const episode = episodeByNumber('5.1') ?? missing('episode 5.1 is missing from lib/episodes/part-5.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout51: DeckLayout<Step> = {
  id: '5-1',
  episode: '5.1',
  steps: STEPS,
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];
  const rows = ['1', '2', '3'];

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
        key: 'failure-blank',
        ...w.card('failure-blank'),
        source: 'parts/5-design-for-people/automation-and-failure-card.md',
        heading: 'The day it is wrong',
        rows,
      },
      {
        key: 'failure-claims',
        ...w.card('failure-claims'),
        source: 'parts/5-design-for-people/automation-and-failure-card.claims.md',
        heading: 'The day it is wrong',
        rows: ['1 · Read and link', '2 · Coverage check', '3 · Automatic payment'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.idea }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.idea })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // The idea: it will be wrong for someone today.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.idea, out: S.claim }),
      sans('same-answer', 120, 330, w.text('same-answer'), { size: 32, wrap: 1200, tone: 'muted', in: S.idea, out: S.claim }),
      hand('decided', 120, 480, w.text('decided'), { size: 56, wrap: 1250, tone: 'accent', in: S.graceful, out: S.claim }),
      sans('credit', 1760, 260, w.text('credit'), { size: 22, tone: 'muted', anchor: 'end', in: S.graceful, out: S.claim }),

      // In the case: the claim card.
      hand('title-case', 120, 170, w.text('title-case'), { size: 60, in: S.claim, out: S.move }),
      { id: 'claim-tag', tone: 'muted', in: S.claim, out: S.canvas, shape: { kind: 'tag', x: 120, y: 262, text: w.text('claim-tag') } },
      { id: 'claim-box', in: S.claim, out: S.canvas, shape: { kind: 'box', x: 100, y: 300, w: 300, h: 240 } },
      hand('claim-title', 250, 370, w.text('claim-title'), { size: 44, anchor: 'middle', in: S.claim, out: S.canvas }),
      { id: 'photo-box', tone: 'muted', in: S.claim, out: S.canvas, shape: { kind: 'box', x: 170, y: 395, w: 160, h: 90 } },
      hand('photo', 250, 450, w.text('photo'), { size: 30, anchor: 'middle', tone: 'muted', in: S.claim, out: S.canvas }),
      sans('claim-kind', 250, 520, w.text('claim-kind'), { size: 22, anchor: 'middle', tone: 'muted', in: S.claim, out: S.canvas }),
      { id: 'arrow-1', in: S.suggest, out: S.canvas, shape: { kind: 'arrow', x1: 410, y1: 420, x2: 460, y2: 420 } },
      hand('suggests', 250, 600, w.text('suggests'), { size: 30, anchor: 'middle', tone: 'accent', in: S.suggest, out: S.canvas }),

      // A: a tick and a confidence bar, with no number on it.
      { id: 'box-a', in: S.optionA, out: S.canvas, shape: { kind: 'box', x: 470, y: 300, w: 360, h: 240 } },
      hand('label-a', 500, 350, w.text('label-a'), { size: 44, in: S.optionA, out: S.canvas }),
      hand('a-tick', 650, 420, w.text('a-tick'), { size: 48, anchor: 'middle', tone: 'accent', in: S.optionA, out: S.canvas }),
      { id: 'a-bar', tone: 'muted', in: S.optionA, out: S.canvas, shape: { kind: 'box', x: 540, y: 455, w: 220, h: 26 } },
      { id: 'a-bar-fill', tone: 'accent', in: S.optionA, out: S.canvas, shape: { kind: 'box', x: 540, y: 455, w: 165, h: 26, fill: true } },
      sans('a-bar-label', 650, 515, w.text('a-bar-label'), { size: 20, anchor: 'middle', tone: 'muted', in: S.optionA, out: S.canvas }),

      // B: the clause, quoted, with its edition.
      { id: 'box-b', in: S.optionB, out: S.canvas, shape: { kind: 'box', x: 870, y: 300, w: 400, h: 240 } },
      hand('label-b', 900, 350, w.text('label-b'), { size: 44, in: S.optionB, out: S.canvas }),
      hand('b-clause', 900, 410, w.text('b-clause'), { size: 30, wrap: 360, in: S.optionB, out: S.canvas }),
      sans('b-edition', 900, 520, w.text('b-edition'), { size: 20, tone: 'muted', in: S.optionB, out: S.canvas }),

      // The day it is wrong: B shows it, A does not.
      { id: 'b-wrong-box', tone: 'warn', in: S.wrong, out: S.canvas, shape: { kind: 'box', x: 862, y: 292, w: 416, h: 256 } },
      hand('b-wrong', 1070, 590, w.text('b-wrong'), { size: 34, anchor: 'middle', tone: 'warn', in: S.wrong, out: S.canvas }),
      hand('a-nothing', 650, 590, w.text('a-nothing'), { size: 34, anchor: 'middle', tone: 'muted', in: S.wrong, out: S.canvas }),
      hand('explanation', 1070, 650, w.text('explanation'), { size: 34, anchor: 'middle', tone: 'accent', in: S.explanation, out: S.canvas }),

      // The correction goes into the verified set.
      { id: 'arrow-correction', tone: 'accent', in: S.correction, out: S.canvas, shape: { kind: 'arrow', x1: 960, y1: 670, x2: 900, y2: 790 } },
      { id: 'verified-box', tone: 'accent', in: S.correction, out: S.canvas, shape: { kind: 'box', x: 560, y: 800, w: 380, h: 110 } },
      hand('verified', 750, 862, w.text('verified'), { size: 44, anchor: 'middle', tone: 'accent', in: S.correction, out: S.canvas }),
      sans('verified-note', 750, 895, w.text('verified-note'), { size: 20, anchor: 'middle', tone: 'muted', in: S.correction, out: S.canvas }),
      hand('handler', 880, 730, w.text('handler'), { size: 30, anchor: 'end', tone: 'muted', in: S.correction, out: S.canvas }),
      sans('handler-nl', 880, 765, w.text('handler-nl'), { size: 20, anchor: 'end', tone: 'muted', in: S.correction, out: S.canvas }),

      // The policyholder's side: told it was automatic, one button to a person.
      { id: 'ph-box', in: S.policyholder, out: S.canvas, shape: { kind: 'box', x: 1300, y: 280, w: 420, h: 320 } },
      sans('ph-title', 1330, 325, w.text('ph-title'), { size: 20, tone: 'muted', in: S.policyholder, out: S.canvas }),
      hand('ph-paid', 1510, 400, w.text('ph-paid'), { size: 38, anchor: 'middle', in: S.policyholder, out: S.canvas }),
      { id: 'ph-button-box', tone: 'accent', in: S.policyholder, out: S.canvas, shape: { kind: 'box', x: 1390, y: 440, w: 240, h: 70 } },
      hand('ph-button', 1510, 488, w.text('ph-button'), { size: 36, anchor: 'middle', tone: 'accent', in: S.policyholder, out: S.canvas }),
      sans('ph-day', 1510, 560, w.text('ph-day'), { size: 20, anchor: 'middle', tone: 'muted', in: S.policyholder, out: S.canvas }),
      // Down the left of the camera corner, then into the verified set.
      { id: 'ask-line', tone: 'accent', in: S.ask, out: S.canvas, shape: { kind: 'line', points: [[1420, 605], [1420, 855]] } },
      { id: 'arrow-ask', tone: 'accent', in: S.ask, out: S.canvas, shape: { kind: 'arrow', x1: 1420, y1: 855, x2: 948, y2: 855 } },

      // What you see.
      hand('seen', 100, 965, w.text('seen'), { size: 38, tone: 'warn', in: S.seen, out: S.move }),
      sans('be12', 100, 1012, w.text('be12'), { size: 22, wrap: 1250, in: S.ombudsman, out: S.move }),
      sans('be12-source', 100, 1068, w.text('be12-source'), { size: 18, tone: 'muted', in: S.ombudsman, out: S.move }),

      // The move: three questions across the top, then how to explain.
      hand('title-move', 120, 170, w.text('title-move'), { size: 60, in: S.move, out: S.canvas }),
      hand('q-visible', 470, 252, w.text('q-visible'), { size: 52, tone: 'accent', in: S.visible, out: S.canvas }),
      hand('q-cheap', 720, 252, w.text('q-cheap'), { size: 52, tone: 'accent', in: S.cheap, out: S.canvas }),
      hand('q-teach', 1060, 252, w.text('q-teach'), { size: 52, tone: 'accent', in: S.teach, out: S.canvas }),
      hand('check', 100, 1000, w.text('check'), { size: 36, wrap: 1250, in: S.check, out: S.who }),
      hand('who', 100, 1000, w.text('who'), { size: 36, wrap: 1250, tone: 'warn', in: S.who, out: S.know }),
      hand('know', 100, 1000, w.text('know'), { size: 36, wrap: 1250, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'failure-blank', x: 100, y: 170, w: 640, h: 790 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'failure-claims', x: 780, y: 170, w: 640, h: 790, highlight: { [S.mark]: [1, 2] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
