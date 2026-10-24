import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.2, "Labels" (FS-0010): the layout. The words are in content/decks/<locale>/3-2.yaml;
// this file places them on the stage by id. The episode follows the wiki presenter notes
// (publishing/ai-product-design/episodes/03-data/02-labels.slides.md): what the episode promises,
// the belief that labels are free, Obermeyer et al. (2019) as the case (cost used as the label for
// health need), Werkmora's label, the five label sources as a staircase of cost, the two checks
// (agreement with a small agreed reference, after Krause et al. 2018; a guideline), labels that come
// late or only for some cases, and Werkmora's label specification. Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'free',
  'cost',
  'sicker',
  'fix',
  'werkmora',
  'existing',
  'implicit',
  'rules',
  'assisted',
  'expert',
  'agree',
  'adjudicate',
  'guideline',
  'late',
  'partial',
  'censored',
  'flag',
  'waste',
  'spec',
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

const episode = episodeByNumber('3.2') ?? missing('episode 3.2 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.2 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.2 needs its closing card');

// The five label sources, cheapest first: one step of the staircase per click, rising with cost.
// Each one's weakness is written top left while it is the one being talked about.
const SOURCES = ['existing', 'implicit', 'rules', 'assisted', 'expert'] as const;

// Werkmora's three labels, one row per click; the label specification closes the scene.
const ROWS = [
  { key: 'demand', step: 'censored' },
  { key: 'stockout', step: 'flag' },
  { key: 'waste', step: 'waste' },
] as const;

// Cases at prediction time; only the ones somebody checks ever get a label.
const CASES = 8;
const CHECKED = [2, 6];

export const layout32: DeckLayout<Step> = {
  id: '3-2',
  episode: '3.2',
  steps: STEPS,
  figure: 'expert',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const stairs: Element[] = SOURCES.flatMap((key, i) => {
    const x = 120 + i * 250;
    const y = 800 - i * 100;
    const until = SOURCES[i + 1] ?? 'agree';
    return [
      { id: `stair-${key}`, tone: i === 0 ? 'accent' : undefined, in: S[key], out: S.agree, shape: { kind: 'box', x, y, w: 240, h: 90 } },
      hand(`src-${key}`, x + 15, y + 56, w.text(`src-${key}`), { size: 30, in: S[key], out: S.agree }),
      hand(`src-${key}-head`, 120, 270, w.text(`src-${key}-head`), { size: 44, tone: 'accent', in: S[key], out: S[until] }),
      sans(`src-${key}-body`, 120, 340, w.text(`src-${key}-body`), { size: 28, wrap: 760, in: S[key], out: S[until] }),
    ];
  });

  const cases: Element[] = Array.from({ length: CASES }, (_, i) => ({
    id: `case-${i + 1}`,
    tone: CHECKED.includes(i) ? 'accent' : 'muted',
    in: S.partial,
    out: S.censored,
    shape: { kind: 'box', x: 120 + i * 110, y: 680, w: 80, h: 60, fill: CHECKED.includes(i) },
  }));

  const rows: Element[] = ROWS.flatMap(({ key, step }, i) => {
    const y = 280 + i * 150;
    return [
      hand(`row-${key}`, 120, y, w.text(`row-${key}`), { size: 40, tone: 'accent', in: S[step], out: S.takeaway }),
      sans(`row-${key}-body`, 420, y, w.text(`row-${key}-body`), { size: 28, wrap: 1000, in: S[step], out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.free }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.free }),
      ),

      // The usual belief: the outcome is in the database, so the labels are free.
      hand('belief', 120, 380, w.text('belief'), { size: 80, tone: 'accent', wrap: 1250, in: S.free, out: S.cost }),
      sans('belief-examples', 120, 600, w.text('belief-examples'), { size: 30, wrap: 1250, in: S.free, out: S.cost }),
      { id: 'belief-tag', tone: 'muted', in: S.free, out: S.cost, shape: { kind: 'tag', x: 120, y: 700, text: w.text('belief-tag') } },

      // Obermeyer et al. (2019): the label wanted, the label used, the gap, and the label that fixed it.
      hand('title-cost', 120, 160, w.text('title-cost'), { size: 52, in: S.cost, out: S.werkmora }),
      { id: 'box-need', in: S.cost, out: S.werkmora, shape: { kind: 'box', x: 120, y: 250, w: 560, h: 120 } },
      hand('need', 150, 325, w.text('need'), { size: 40, in: S.cost, out: S.werkmora }),
      { id: 'box-cost', tone: 'warn', in: S.cost, out: S.werkmora, shape: { kind: 'box', x: 840, y: 250, w: 560, h: 120 } },
      hand('cost', 870, 325, w.text('cost'), { size: 40, in: S.cost, out: S.werkmora }),
      sans('cost-credit', 120, 975, w.text('cost-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.cost, out: S.werkmora }),
      hand('neq', 760, 335, w.text('neq'), { size: 72, anchor: 'middle', tone: 'warn', in: S.sicker, out: S.werkmora }),
      hand('gap-amount', 120, 540, w.text('gap-amount'), { size: 96, tone: 'warn', in: S.sicker, out: S.werkmora }),
      sans('gap-what', 120, 610, w.text('gap-what'), { size: 26, wrap: 640, in: S.sicker, out: S.werkmora }),
      hand('gap-result', 120, 730, w.text('gap-result'), { size: 36, wrap: 640, in: S.sicker, out: S.werkmora }),
      { id: 'box-fix', tone: 'accent', in: S.fix, out: S.werkmora, shape: { kind: 'box', x: 840, y: 450, w: 560, h: 220 } },
      hand('fix-label', 870, 525, w.text('fix-label'), { size: 40, in: S.fix, out: S.werkmora }),
      hand('fix-result', 870, 625, w.text('fix-result'), { size: 56, tone: 'accent', in: S.fix, out: S.werkmora }),

      // Werkmora and its label, with the trap from episode 3.1.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.existing }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.existing, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 240, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.existing }),
      { id: 'label-box', tone: 'accent', in: S.werkmora, out: S.existing, shape: { kind: 'box', x: 120, y: 380, w: 1000, h: 120 } },
      hand('label-box-text', 150, 455, w.text('label-box'), { size: 44, in: S.werkmora, out: S.existing }),
      hand('label-trap', 120, 620, w.text('label-trap'), { size: 40, tone: 'warn', in: S.werkmora, out: S.existing }),

      // Five sources, cheapest first: the staircase, and the current one's weakness top left.
      hand('title-sources', 120, 160, w.text('title-sources'), { size: 56, in: S.existing, out: S.agree }),
      hand('cheapest', 120, 940, w.text('cheapest'), { size: 28, tone: 'muted', in: S.existing, out: S.agree }),
      hand('dearest', 1120, 370, w.text('dearest'), { size: 28, tone: 'muted', in: S.expert, out: S.agree }),
      ...stairs,

      // Two checks: agreement, a small agreed reference (Krause et al. 2018, on the right), a guideline.
      hand('title-checks', 120, 160, w.text('title-checks'), { size: 56, in: S.agree, out: S.late }),
      hand('check-agree', 120, 270, w.text('check-agree'), { size: 44, tone: 'accent', in: S.agree, out: S.late }),
      sans('check-agree-body', 120, 330, w.text('check-agree-body'), { size: 28, wrap: 780, in: S.agree, out: S.late }),
      hand('check-reference', 160, 480, w.text('check-reference'), { size: 40, tone: 'accent', in: S.adjudicate, out: S.late }),
      sans('check-reference-body', 160, 540, w.text('check-reference-body'), { size: 28, wrap: 740, in: S.adjudicate, out: S.late }),
      { id: 'krause-big-box', in: S.adjudicate, out: S.late, shape: { kind: 'box', x: 960, y: 250, w: 440, h: 200 } },
      hand('krause-big', 990, 330, w.text('krause-big'), { size: 40, in: S.adjudicate, out: S.late }),
      sans('krause-big-what', 990, 400, w.text('krause-big-what'), { size: 24, tone: 'muted', in: S.adjudicate, out: S.late }),
      { id: 'krause-small-box', tone: 'accent', in: S.adjudicate, out: S.late, shape: { kind: 'box', x: 960, y: 490, w: 160, h: 110 } },
      hand('krause-small', 975, 560, w.text('krause-small'), { size: 44, tone: 'accent', in: S.adjudicate, out: S.late }),
      sans('krause-small-what', 1140, 520, w.text('krause-small-what'), { size: 22, wrap: 260, in: S.adjudicate, out: S.late }),
      hand('krause-auc', 960, 680, w.text('krause-auc'), { size: 44, tone: 'accent', in: S.adjudicate, out: S.late }),
      sans('krause-credit', 960, 740, w.text('krause-credit'), { size: 22, tone: 'muted', wrap: 440, in: S.adjudicate, out: S.late }),
      hand('check-guideline', 120, 690, w.text('check-guideline'), { size: 44, tone: 'accent', in: S.guideline, out: S.late }),
      sans('check-guideline-body', 120, 750, w.text('check-guideline-body'), { size: 28, wrap: 780, in: S.guideline, out: S.late }),

      // Late labels: a timeline from prediction to label, then the cases that never get one.
      hand('title-late', 120, 160, w.text('title-late'), { size: 56, in: S.late, out: S.censored }),
      { id: 'late-clock', tone: 'muted', in: S.late, out: S.censored, shape: { kind: 'clock', x: 750, y: 290, r: 40 } },
      { id: 'late-line', in: S.late, out: S.censored, shape: { kind: 'arrow', x1: 160, y1: 420, x2: 1360, y2: 420 } },
      { id: 'late-tick-predict', in: S.late, out: S.censored, shape: { kind: 'line', points: [[200, 395], [200, 445]] } },
      { id: 'late-tick-label', tone: 'accent', in: S.late, out: S.censored, shape: { kind: 'line', points: [[1300, 395], [1300, 445]] } },
      hand('late-predict', 200, 500, w.text('late-predict'), { size: 36, anchor: 'middle', in: S.late, out: S.censored }),
      hand('late-label', 1300, 500, w.text('late-label'), { size: 36, anchor: 'middle', tone: 'accent', in: S.late, out: S.censored }),
      hand('late-gap', 750, 385, w.text('late-gap'), { size: 36, anchor: 'middle', tone: 'muted', in: S.late, out: S.censored }),
      sans('late-examples', 120, 590, w.text('late-examples'), { size: 28, wrap: 1200, in: S.late, out: S.censored }),
      ...cases,
      hand('partial', 120, 810, w.text('partial'), { size: 36, tone: 'accent', in: S.partial, out: S.censored }),
      sans('partial-credit', 120, 870, w.text('partial-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.partial, out: S.censored }),
      hand('plan-both', 120, 960, w.text('plan-both'), { size: 40, tone: 'accent', in: S.partial, out: S.censored }),

      // Werkmora's labels, one row per click, and the specification that holds them.
      hand('title-spec', 120, 160, w.text('title-spec'), { size: 56, in: S.censored, out: S.takeaway }),
      { id: 'spec-tag', tone: 'muted', in: S.censored, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('spec-tag') } },
      ...rows,
      { id: 'spec-box', tone: 'accent', in: S.spec, out: S.takeaway, shape: { kind: 'box', x: 100, y: 720, w: 1300, h: 150 } },
      hand('spec', 120, 790, w.text('spec'), { size: 40, tone: 'accent', wrap: 1250, in: S.spec, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
