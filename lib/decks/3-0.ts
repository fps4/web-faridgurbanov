import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.0, the intro to "Data and model requirements" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-0.yaml; this file places them on the stage by id. The episode follows the
// wiki prep (publishing/ai-product-design/episodes/03-data/00-intro.md): what the episode promises,
// Werkmora and its garden forecast, the usual "which algorithm?" picture, the small box in a large
// diagram (after Sculley et al. 2015, Fig. 1), the three mental models marked on that diagram, and
// how the module walks it. One case only (Amazon, Reuters 2018); Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'werkmora',
  'forecast',
  'usual',
  'box',
  'around',
  'requirements',
  'spec',
  'amazon',
  'scores',
  'start',
  'map',
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

const episode = episodeByNumber('3.0') ?? missing('episode 3.0 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.0 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.0 needs its closing card');

// Four lines on Werkmora, the 20-second introduction every module repeats.
const FACTS = ['made-up', 'sector', 'stores', 'season'] as const;

// The boxes around the model, as the guide names them, left of the right-hand column.
const AROUND: { key: string; x: number; y: number; w: number }[] = [
  { key: 'data', x: 120, y: 300, w: 260 },
  { key: 'labels', x: 120, y: 600, w: 260 },
  { key: 'evaluation', x: 720, y: 300, w: 280 },
  { key: 'serving', x: 720, y: 600, w: 280 },
  { key: 'monitoring', x: 370, y: 790, w: 360 },
];

// The three mental models, one at a time in the right-hand column, each marked on the diagram.
const MODELS = [
  { key: 'spec', step: 'spec', until: 'scores' },
  { key: 'scores', step: 'scores', until: 'start' },
  { key: 'start', step: 'start', until: 'map' },
] as const;

// How the module walks the diagram: one row per part, with its episodes.
const PARTS = ['before', 'after', 'time', 'around'] as const;

export const layout30: DeckLayout<Step> = {
  id: '3-0',
  episode: '3.0',
  steps: STEPS,
  figure: 'start',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const facts: Element[] = FACTS.map((key, i) =>
    hand(`fact-${key}`, 120, 280 + i * 70, w.text(`fact-${key}`), { size: 38, wrap: 1250, in: S.werkmora, out: S.usual }),
  );

  const around: Element[] = AROUND.flatMap(({ key, x, y, w: width }) => [
    { id: `box-${key}`, in: S.around, out: S.map, shape: { kind: 'box', x, y, w: width, h: 90 } },
    hand(`box-${key}-label`, x + 30, y + 58, w.text(`box-${key}`), { size: 36, in: S.around, out: S.map }),
  ]);

  const models: Element[] = MODELS.flatMap(({ key, step, until }) => [
    hand(`mm-${key}`, 1080, 300, w.text(`mm-${key}`), { size: 48, wrap: 740, tone: 'accent', in: S[step], out: S[until] }),
    sans(`mm-${key}-body`, 1080, 420, w.text(`mm-${key}-body`), { size: 28, wrap: 720, in: S[step], out: S[until] }),
  ]);

  const parts: Element[] = PARTS.flatMap((key, i) => {
    const y = 300 + i * 120;
    return [
      hand(`part-${key}`, 120, y, w.text(`part-${key}`), { size: 44, tone: 'accent', in: S.map, out: S.takeaway }),
      sans(`part-${key}-episodes`, 560, y, w.text(`part-${key}-episodes`), { size: 28, wrap: 860, in: S.map, out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.werkmora }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.werkmora }),
      ),

      // Werkmora in twenty seconds, then this module's use of it.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.usual }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.usual, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      ...facts,
      { id: 'forecast', tone: 'accent', in: S.forecast, out: S.usual, shape: { kind: 'box', x: 120, y: 600, w: 1250, h: 270 } },
      hand('forecast-title', 150, 670, w.text('forecast-title'), { size: 44, tone: 'accent', in: S.forecast, out: S.usual }),
      sans('forecast-what', 150, 745, w.text('forecast-what'), { size: 30, wrap: 1180, in: S.forecast, out: S.usual }),
      sans('forecast-success', 150, 825, w.text('forecast-success'), { size: 30, wrap: 1180, in: S.forecast, out: S.usual }),

      // The usual picture: the algorithm is the project.
      hand('question', 120, 380, w.text('question'), { size: 80, tone: 'accent', in: S.usual, out: S.box }),
      hand('usual', 120, 520, w.text('usual'), { size: 52, in: S.usual, out: S.box }),
      sans('pilot', 120, 640, w.text('pilot'), { size: 28, wrap: 1250, in: S.usual, out: S.box }),

      // The small box, then the large diagram around it.
      hand('title-diagram', 120, 160, w.text('title-diagram'), { size: 56, in: S.box, out: S.map }),
      { id: 'box-model', tone: 'accent', in: S.box, out: S.map, shape: { kind: 'box', x: 470, y: 455, w: 160, h: 80, fill: true } },
      hand('box-model-label', 550, 505, w.text('box-model'), { size: 34, anchor: 'middle', in: S.box, out: S.map }),
      ...around,
      { id: 'arrow-data', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 380, y1: 345, x2: 470, y2: 480 } },
      { id: 'arrow-labels', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 380, y1: 645, x2: 470, y2: 515 } },
      { id: 'arrow-evaluation', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 630, y1: 480, x2: 720, y2: 345 } },
      { id: 'arrow-serving', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 630, y1: 515, x2: 720, y2: 645 } },
      { id: 'arrow-monitoring', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 860, y1: 690, x2: 730, y2: 835 } },
      { id: 'arrow-outcomes', in: S.around, out: S.map, shape: { kind: 'arrow', x1: 370, y1: 835, x2: 250, y2: 690 } },
      sans('diagram-credit', 120, 985, w.text('diagram-credit'), { size: 22, tone: 'muted', wrap: 1200, in: S.around, out: S.map }),
      hand('requirements', 1080, 330, w.text('requirements'), { size: 44, wrap: 720, tone: 'accent', in: S.requirements, out: S.spec }),

      // The three mental models: the words on the right, a mark on the diagram that stays.
      ...models,
      { id: 'mark-spec', tone: 'warn', in: S.spec, out: S.map, shape: { kind: 'ellipse', x: 95, y: 275, w: 310, h: 440 } },
      sans('amazon', 1080, 580, w.text('amazon'), { size: 26, wrap: 720, in: S.amazon, out: S.scores }),
      sans('amazon-credit', 1080, 690, w.text('amazon-credit'), { size: 22, tone: 'muted', in: S.amazon, out: S.scores }),
      { id: 'box-decision', tone: 'warn', in: S.scores, out: S.map, shape: { kind: 'box', x: 440, y: 600, w: 220, h: 80 } },
      { id: 'arrow-decision', tone: 'warn', in: S.scores, out: S.map, shape: { kind: 'arrow', x1: 550, y1: 535, x2: 550, y2: 600 } },
      hand('box-decision-label', 550, 652, w.text('box-decision'), { size: 34, anchor: 'middle', tone: 'warn', in: S.scores, out: S.map }),
      hand('mm-scores-werkmora', 1080, 580, w.text('mm-scores-werkmora'), { size: 34, wrap: 720, tone: 'accent', in: S.scores, out: S.start }),
      { id: 'mark-start', tone: 'warn', in: S.start, out: S.map, shape: { kind: 'ellipse', x: 340, y: 765, w: 420, h: 140 } },
      hand('mm-start-werkmora', 1080, 580, w.text('mm-start-werkmora'), { size: 34, wrap: 720, tone: 'accent', in: S.start, out: S.map }),

      // How the module walks the diagram.
      hand('title-map', 120, 160, w.text('title-map'), { size: 56, in: S.map, out: S.takeaway }),
      ...parts,

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
