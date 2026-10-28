import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.1, "Data requirements" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-1.yaml; this file places them on the stage by id. The episode follows the
// wiki presenter notes (publishing/ai-product-design/episodes/03-data/01-data-requirements.slides.md): what the
// episode promises, a row count as the answer to "enough data?" and what the EU AI Act asks instead, a frontier
// model's error by language as the case, three use cases (retail, insurance, manufacturing) with their sources
// and owners, the six questions asked of each source, a learning curve for "enough", and the card. The error
// rates are the o1 System Card's (Table 17); the learning curves are fictional.

const STEPS = [
  'title',
  'promise',
  'rows',
  'act',
  'headline',
  'languages',
  'retail',
  'retail-sources',
  'retail-gap',
  'insurance',
  'insurance-sources',
  'insurance-found',
  'manufacturing',
  'manufacturing-sources',
  'manufacturing-cost',
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

// Error by language, as a bar chart: the tallest bar (Yoruba, 24.6%) is the full height.
const BAR_BASE = 820;
const bar = (pct: number) => Math.round((520 * pct) / 24.6);
const LANGUAGES = [
  { key: 'english', pct: 7.7, x: 260 },
  { key: 'swahili', pct: 14.6, x: 560 },
  { key: 'yoruba', pct: 24.6, x: 860 },
] as const;

// Three use cases, one slide each, three clicks: what it predicts and one number; its sources, each with
// its owner; one more fact (for insurance, fraud found vs not found by country, Insurance Europe 2019, pp. 6–7).
const INDUSTRIES = ['retail', 'insurance', 'manufacturing'] as const;
const FRAUD = ['denmark', 'slovenia', 'ireland', 'france'] as const;
// How many sources each use case lists, drawn two to a row on the right.
const SOURCE_COUNT = { retail: 9, insurance: 8, manufacturing: 8 } as const;
const EXTRA = { retail: 'retail-gap', insurance: 'insurance-found', manufacturing: 'manufacturing-cost' } as const;

// The six questions, one row each, in the order they are asked.
const QUESTIONS = ['content', 'labels', 'volume', 'coverage', 'freshness', 'rights'] as const;

// The learning curve: training examples along the bottom (in thousands), model error up the side.
const X = (thousands: number) => Math.round(200 + 18 * thousands);
const Y = (error: number) => Math.round(880 - 17 * (error - 20));
const BIG: [number, number][] = [[10, 38], [15, 34.5], [20, 31.5], [30, 28.5], [40, 26.6], [50, 26], [60, 25.7]];
const SMALL: [number, number][] = [[10, 46], [15, 43.2], [20, 41], [30, 38], [40, 35.5], [50, 33.2], [60, 31]];
const curve = (points: [number, number][]) => points.map(([n, e]) => [X(n), Y(e)] as [number, number]);

export const layout31: DeckLayout<Step> = {
  id: '3-1',
  episode: '3.1',
  steps: STEPS,
  figure: 'rights',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const languages: Element[] = LANGUAGES.flatMap(({ key, pct, x }) => {
    const h = bar(pct);
    const tone = key === 'yoruba' ? 'warn' : undefined;
    return [
      { id: `bar-${key}`, tone, in: S.languages, out: S.retail, shape: { kind: 'box', x, y: BAR_BASE - h, w: 220, h, fill: true } },
      hand(`value-${key}`, x + 110, BAR_BASE - h - 30, w.text(`value-${key}`), { size: 56, anchor: 'middle', tone, in: S.languages, out: S.retail }),
      sans(`label-${key}`, x + 110, 870, w.text(`label-${key}`), { size: 26, anchor: 'middle', in: S.languages, out: S.retail }),
    ];
  });

  const industries: Element[] = INDUSTRIES.flatMap((key, i) => {
    const show = { in: S[key], out: i < INDUSTRIES.length - 1 ? S[INDUSTRIES[i + 1]] : S.content };
    const sources = { in: S[`${key}-sources`], out: show.out };
    const extra = { in: S[EXTRA[key]], out: show.out };
    return [
      hand(`case-${key}`, 120, 160, w.text(`case-${key}`), { size: 56, ...show }),
      sans(`case-${key}-predicts`, 120, 250, w.text(`case-${key}-predicts`), { size: 34, wrap: 700, ...show }),
      hand(`case-${key}-stat`, 120, 440, w.text(`case-${key}-stat`), { size: 120, tone: 'warn', ...show }),
      sans(`case-${key}-stat-what`, 120, 500, w.text(`case-${key}-stat-what`), { size: 26, tone: 'muted', wrap: 680, ...show }),
      hand(`sources-${key}`, 880, 250, w.text('sources-heading'), { size: 34, tone: 'muted', ...sources }),
      ...Array.from({ length: SOURCE_COUNT[key] }, (_, i) => i + 1).flatMap((n) => {
        const x = 880 + ((n - 1) % 2) * 270;
        const y = 290 + Math.floor((n - 1) / 2) * 88;
        return [
          { id: `source-${key}-${n}`, ...sources, shape: { kind: 'box', x, y, w: 250, h: 76 } } as Element,
          hand(`source-${key}-${n}-label`, x + 16, y + 34, w.text(`source-${key}-${n}`), { size: 28, ...sources }),
          sans(`source-${key}-${n}-owner`, x + 16, y + 62, w.text(`source-${key}-${n}-owner`), { size: 18, tone: 'muted', ...sources }),
        ];
      }),
      ...(key === 'insurance'
        ? [
            hand('fraud-title', 120, 620, w.text('fraud-title'), { size: 34, tone: 'accent', ...extra }),
            ...FRAUD.flatMap((country, j) => {
              const y = 690 + j * 62;
              return [
                sans(`fraud-${country}`, 120, y, w.text(`fraud-${country}`), { size: 26, ...extra }),
                sans(`fraud-${country}-amounts`, 360, y, w.text(`fraud-${country}-amounts`), { size: 22, tone: 'muted', ...extra }),
                hand(`fraud-${country}-share`, 820, y, w.text(`fraud-${country}-share`), { size: 38, anchor: 'end', tone: 'warn', ...extra }),
              ];
            }),
            sans('fraud-credit', 120, 950, w.text('fraud-credit'), { size: 20, tone: 'muted', ...extra }),
          ]
        : [
            hand(`case-${key}-extra`, 120, 660, w.text(`case-${key}-extra`), { size: 40, tone: 'accent', wrap: 700, ...extra }),
            sans(`case-${key}-extra-source`, 120, 800, w.text(`case-${key}-extra-source`), { size: 20, tone: 'muted', wrap: 700, ...extra }),
          ]),
    ];
  });

  const questions: Element[] = QUESTIONS.flatMap((key, i) => {
    const y = 260 + i * 110;
    return [
      hand(`q-${key}`, 120, y, `${i + 1}  ${w.text(`q-${key}`)}`, { size: 44, tone: 'accent', in: S[key], out: S.magic }),
      sans(`q-${key}-example`, 470, y, w.text(`q-${key}-example`), { size: 28, wrap: 920, in: S[key], out: S.magic }),
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

      // The question, the usual answer, and what the EU AI Act asks instead.
      hand('question', 120, 360, w.text('question'), { size: 80, tone: 'accent', in: S.rows, out: S.headline }),
      hand('answer', 120, 540, w.text('answer'), { size: 52, in: S.rows, out: S.headline }),
      { id: 'answer-tag', tone: 'muted', in: S.rows, out: S.headline, shape: { kind: 'tag', x: 120, y: 660, text: w.text('answer-tag') } },
      hand('act', 120, 800, w.text('act'), { size: 38, tone: 'accent', wrap: 1250, in: S.act, out: S.headline }),

      // One headline number on the usual benchmark, then the same questions by language, on the same scale.
      hand('title-headline', 120, 160, w.text('title-headline'), { size: 52, in: S.headline, out: S.languages }),
      sans('mmlu', 120, 235, w.text('mmlu'), { size: 28, tone: 'muted', wrap: 1250, in: S.headline, out: S.languages }),
      { id: 'baseline', in: S.headline, out: S.retail, shape: { kind: 'line', points: [[200, BAR_BASE], [1100, BAR_BASE]] } },
      { id: 'bar-all', in: S.headline, out: S.languages, shape: { kind: 'box', x: 260, y: BAR_BASE - bar(7.7), w: 820, h: bar(7.7), fill: true } },
      hand('value-all', 670, BAR_BASE - bar(7.7) - 30, w.text('value-all'), { size: 56, anchor: 'middle', in: S.headline, out: S.languages }),
      sans('label-all', 670, 870, w.text('label-all'), { size: 26, anchor: 'middle', in: S.headline, out: S.languages }),
      hand('english-only', 1180, 580, w.text('english-only'), { size: 36, wrap: 560, in: S.headline, out: S.languages }),
      hand('title-languages', 120, 160, w.text('title-languages'), { size: 52, in: S.languages, out: S.retail }),
      ...languages,
      // Speakers against share of the open web: many people, few pages.
      ...(['yoruba', 'swahili', 'english'] as const).map((key, i) =>
        hand(`web-${key}`, 1180, 560 + i * 48, w.text(`web-${key}`), { size: 32, tone: key === 'english' ? 'muted' : 'accent', in: S.languages, out: S.retail }),
      ),
      sans('languages-what', 200, 950, w.text('languages-what'), { size: 24, tone: 'muted', in: S.languages, out: S.retail }),
      sans('languages-credit', 200, 995, w.text('languages-credit'), { size: 22, tone: 'muted', wrap: 1180, in: S.headline, out: S.retail }),

      // Three use cases, one slide each.
      ...industries,
      hand('sources-owners', 120, 1010, w.text('sources-owners'), { size: 40, tone: 'accent', in: S['manufacturing-sources'], out: S.content }),

      // The six questions, one row per click, each with an example from one of the three use cases.
      hand('title-six', 120, 160, w.text('title-six'), { size: 56, in: S.content, out: S.magic }),
      ...questions,
      { id: 'clearview', tone: 'warn', in: S.fine, out: S.magic, shape: { kind: 'box', x: 1470, y: 280, w: 360, h: 330 } },
      hand('clearview-amount', 1650, 380, w.text('clearview-amount'), { size: 64, anchor: 'middle', tone: 'warn', in: S.fine, out: S.magic }),
      sans('clearview-who', 1490, 440, w.text('clearview-who'), { size: 24, wrap: 330, in: S.fine, out: S.magic }),
      hand('clearview-line', 1490, 580, w.text('clearview-line'), { size: 34, tone: 'accent', in: S.fine, out: S.magic }),

      // "Enough" is measured: a learning curve on a pilot set.
      hand('title-enough', 120, 160, w.text('title-enough'), { size: 56, in: S.magic, out: S.takeaway }),
      sans('no-magic', 120, 240, w.text('no-magic'), { size: 28, wrap: 1250, in: S.magic, out: S.takeaway }),
      { id: 'axis-x', in: S.curve, out: S.takeaway, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 1320, y2: 880 } },
      { id: 'axis-y', in: S.curve, out: S.takeaway, shape: { kind: 'arrow', x1: 200, y1: 880, x2: 200, y2: 320 } },
      hand('axis-y-label', 220, 340, w.text('axis-y-label'), { size: 30, tone: 'muted', in: S.curve, out: S.takeaway }),
      hand('axis-x-label', 760, 965, w.text('axis-x-label'), { size: 30, anchor: 'middle', tone: 'muted', in: S.curve, out: S.takeaway }),
      ...([10, 20, 40, 60] as const).map((m) =>
        sans(`tick-${m}`, X(m), 918, w.text(`tick-${m}`), { size: 24, anchor: 'middle', tone: 'muted', in: S.curve, out: S.takeaway }),
      ),
      { id: 'curve-tag', tone: 'muted', in: S.curve, out: S.takeaway, shape: { kind: 'tag', x: 1340, y: 300, text: w.text('curve-tag') } },
      { id: 'curve-big', tone: 'accent', in: S.curve, out: S.takeaway, shape: { kind: 'line', points: curve(BIG) } },
      hand('label-big', 900, 830, w.text('label-big'), { size: 30, tone: 'accent', in: S.curve, out: S.takeaway }),
      { id: 'knee', tone: 'warn', in: S.flat, out: S.takeaway, shape: { kind: 'ellipse', x: X(40) - 60, y: Y(26.6) - 38, w: 120, h: 76 } },
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
