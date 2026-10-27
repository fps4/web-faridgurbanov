import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.1, "Data requirements" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-1.yaml; this file places them on the stage by id. The episode follows the
// wiki presenter notes (publishing/ai-product-design/episodes/03-data/01-data-requirements.slides.md): what the
// episode promises, a row count as the answer to "enough data?", Gender Shades as the case, Werkmora's nine sources, the six
// questions asked of each one, a learning curve for "enough", and the card with the EU AI Act beside it. The Gender Shades
// numbers are the paper's (Table 4); the learning curves are Werkmora's and fictional.

const STEPS = [
  'title',
  'promise',
  'rows',
  'shades',
  'balanced',
  'werkmora',
  'sources',
  'content',
  'labels',
  'volume',
  'coverage',
  'freshness',
  'rights',
  'fine',
  'magic',
  'curve',
  'flat',
  'small',
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

const episode = episodeByNumber('3.1') ?? missing('episode 3.1 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.1 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.1 needs its closing card');

// Werkmora's nine sources for the garden forecast, in the order the script names them.
const SOURCES = ['sales', 'orders', 'stock', 'prices', 'stores', 'calendar', 'weather', 'supply', 'returns'] as const;

// The six questions, one row each, in the order they are asked.
const QUESTIONS = ['content', 'labels', 'volume', 'coverage', 'freshness', 'rights'] as const;

// The learning curve: months of history along the bottom, forecast error up the side.
const X = (months: number) => Math.round(200 + 30 * months);
const Y = (error: number) => Math.round(880 - 17 * (error - 20));
const BIG: [number, number][] = [[6, 38], [9, 34.5], [12, 31.5], [18, 28.5], [24, 26.6], [30, 26], [36, 25.7]];
const SMALL: [number, number][] = [[6, 46], [9, 43.2], [12, 41], [18, 38], [24, 35.5], [30, 33.2], [36, 31]];
const curve = (points: [number, number][]) => points.map(([m, e]) => [X(m), Y(e)] as [number, number]);

export const layout31: DeckLayout<Step> = {
  id: '3-1',
  episode: '3.1',
  steps: STEPS,
  figure: 'rights',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const sources: Element[] = SOURCES.flatMap((key, i) => {
    const x = 120 + (i % 3) * 420;
    const y = 340 + Math.floor(i / 3) * 120;
    return [
      { id: `source-${key}`, in: S.sources, out: S.content, shape: { kind: 'box', x, y, w: 380, h: 90 } },
      hand(`source-${key}-label`, x + 24, y + 58, w.text(`source-${key}`), { size: 34, in: S.sources, out: S.content }),
    ];
  });

  const questions: Element[] = QUESTIONS.flatMap((key, i) => {
    const y = 260 + i * 110;
    return [
      hand(`q-${key}`, 120, y, w.text(`q-${key}`), { size: 44, tone: 'accent', in: S[key], out: S.magic }),
      sans(`q-${key}-werkmora`, 470, y, w.text(`q-${key}-werkmora`), { size: 28, wrap: 920, in: S[key], out: S.magic }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.rows }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.rows }),
      ),

      // The question, and the usual answer.
      hand('question', 120, 360, w.text('question'), { size: 80, tone: 'accent', in: S.rows, out: S.shades }),
      hand('answer', 120, 540, w.text('answer'), { size: 52, in: S.rows, out: S.shades }),
      { id: 'answer-tag', tone: 'muted', in: S.rows, out: S.shades, shape: { kind: 'tag', x: 120, y: 660, text: w.text('answer-tag') } },

      // Gender Shades: first the one overall number the usual test sets gave, then the highest error per group on a
      // balanced test set, on the same scale (34.7% is the full bar).
      hand('title-usual', 120, 160, w.text('title-usual'), { size: 52, in: S.shades, out: S.balanced }),
      { id: 'baseline', in: S.shades, out: S.werkmora, shape: { kind: 'line', points: [[200, 820], [1100, 820]] } },
      { id: 'bar-all', in: S.shades, out: S.balanced, shape: { kind: 'box', x: 300, y: 806, w: 620, h: 14, fill: true } },
      hand('value-all', 610, 780, w.text('value-all'), { size: 56, anchor: 'middle', in: S.shades, out: S.balanced }),
      sans('label-all', 610, 870, w.text('label-all'), { size: 26, anchor: 'middle', in: S.shades, out: S.balanced }),
      hand('title-shades', 120, 160, w.text('title-shades'), { size: 52, in: S.balanced, out: S.werkmora }),
      { id: 'bar-women', tone: 'warn', in: S.balanced, out: S.werkmora, shape: { kind: 'box', x: 300, y: 300, w: 220, h: 520, fill: true } },
      { id: 'bar-men', in: S.balanced, out: S.werkmora, shape: { kind: 'box', x: 700, y: 808, w: 220, h: 12, fill: true } },
      hand('value-women', 410, 270, w.text('value-women'), { size: 56, anchor: 'middle', tone: 'warn', in: S.balanced, out: S.werkmora }),
      hand('value-men', 810, 780, w.text('value-men'), { size: 56, anchor: 'middle', in: S.balanced, out: S.werkmora }),
      sans('label-women', 410, 870, w.text('label-women'), { size: 26, anchor: 'middle', in: S.balanced, out: S.werkmora }),
      sans('label-men', 810, 870, w.text('label-men'), { size: 26, anchor: 'middle', in: S.balanced, out: S.werkmora }),
      sans('shades-what', 200, 950, w.text('shades-what'), { size: 24, tone: 'muted', in: S.balanced, out: S.werkmora }),
      sans('shades-credit', 200, 995, w.text('shades-credit'), { size: 22, tone: 'muted', wrap: 1180, in: S.shades, out: S.werkmora }),
      hand('test-sets', 1180, 580, w.text('test-sets'), { size: 36, wrap: 560, in: S.shades, out: S.werkmora }),

      // Werkmora and its nine sources.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.content }),
      sans('werkmora', 120, 240, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.content }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.content, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      ...sources,
      hand('nine-owners', 120, 760, w.text('nine-owners'), { size: 44, tone: 'accent', in: S.sources, out: S.content }),

      // The six questions, one row per click, each with Werkmora's answer.
      hand('title-six', 120, 160, w.text('title-six'), { size: 56, in: S.content, out: S.magic }),
      ...questions,
      { id: 'clearview', tone: 'warn', in: S.fine, out: S.magic, shape: { kind: 'box', x: 1470, y: 280, w: 360, h: 330 } },
      hand('clearview-amount', 1650, 380, w.text('clearview-amount'), { size: 64, anchor: 'middle', tone: 'warn', in: S.fine, out: S.magic }),
      sans('clearview-who', 1490, 440, w.text('clearview-who'), { size: 24, wrap: 330, in: S.fine, out: S.magic }),
      hand('clearview-line', 1490, 580, w.text('clearview-line'), { size: 34, tone: 'accent', in: S.fine, out: S.magic }),

      // "Enough" is measured: a learning curve on a pilot.
      hand('title-enough', 120, 160, w.text('title-enough'), { size: 56, in: S.magic, out: S.takeaway }),
      sans('no-magic', 120, 240, w.text('no-magic'), { size: 28, wrap: 1250, in: S.magic, out: S.takeaway }),
      { id: 'axis-x', in: S.curve, out: S.takeaway, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 1320, y2: 880 } },
      { id: 'axis-y', in: S.curve, out: S.takeaway, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 200, y2: 320 } },
      hand('axis-y-label', 220, 340, w.text('axis-y-label'), { size: 30, tone: 'muted', in: S.curve, out: S.takeaway }),
      hand('axis-x-label', 760, 965, w.text('axis-x-label'), { size: 30, anchor: 'middle', tone: 'muted', in: S.curve, out: S.takeaway }),
      ...([6, 12, 24, 36] as const).map((m) =>
        sans(`tick-${m}`, X(m), 918, w.text(`tick-${m}`), { size: 24, anchor: 'middle', tone: 'muted', in: S.curve, out: S.takeaway }),
      ),
      { id: 'curve-tag', tone: 'muted', in: S.curve, out: S.takeaway, shape: { kind: 'tag', x: 1340, y: 300, text: w.text('curve-tag') } },
      { id: 'curve-big', tone: 'accent', in: S.curve, out: S.takeaway, shape: { kind: 'line', points: curve(BIG) } },
      hand('label-big', 900, 830, w.text('label-big'), { size: 30, tone: 'accent', in: S.curve, out: S.takeaway }),
      { id: 'knee', tone: 'warn', in: S.flat, out: S.takeaway, shape: { kind: 'ellipse', x: X(24) - 60, y: Y(26.6) - 38, w: 120, h: 76 } },
      hand('flat', 1340, 420, w.text('flat'), { size: 32, wrap: 440, in: S.flat, out: S.takeaway }),
      { id: 'curve-small', in: S.small, out: S.takeaway, shape: { kind: 'line', points: curve(SMALL) } },
      hand('label-small', 900, 560, w.text('label-small'), { size: 30, in: S.small, out: S.takeaway }),
      hand('groups', 1340, 600, w.text('groups'), { size: 34, tone: 'accent', wrap: 440, in: S.small, out: S.takeaway }),

      // The episode in one card, the law that asks the same beside it, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('law', 1400, 300, w.text('law'), { size: 34, wrap: 440, tone: 'accent', in: S.takeaway }),
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
