import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.11, "People and roles" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-11.yaml; this file places them on the stage by id. The episode follows the
// wiki notes (publishing/ai-product-design/episodes/03-data/11-people-and-roles.slides.md): what the
// episode promises, "two data scientists = an AI team", the poaching model whose experts came late
// (Sambasivan et al. 2021) on a project timeline, Werkmora's forecast as "the data team's project",
// the guide's seven roles as seven decisions with Werkmora's names, the guide next to Kreuzberger et
// al.'s MLOps roles and what neither names, who can switch the model off, and the one-page list.
// One case (poaching), Michigan in one line for the power to stop; Werkmora is fictional.

const STEPS = [
  'title',
  'promise',
  'team',
  'poaching',
  'late',
  'werkmora',
  'product',
  'domain',
  'builders',
  'designer',
  'legal',
  'overlap',
  'compare',
  'integrator',
  'frontline',
  'stop',
  'switch',
  'page',
  'month',
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

const episode = episodeByNumber('3.11') ?? missing('episode 3.11 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.11 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.11 needs its closing card');

// The case's project timeline, left to right; the experts sit only at data collection and trouble.
const TIMELINE: { key: string; x: number }[] = [
  { key: 'problem', x: 190 },
  { key: 'data', x: 470 },
  { key: 'model', x: 760 },
  { key: 'deploy', x: 1000 },
  { key: 'trouble', x: 1240 },
];
const TIMELINE_Y = 640;

// Werkmora in three lines, the reminder every module repeats; the fourth line is how the business sees it.
const FACTS = ['company', 'forecast', 'team'] as const;

// The guide's seven roles, one row each, and the click that brings each row in. The three builders
// arrive together.
const ROLES: { key: string; step: Step }[] = [
  { key: 'product', step: 'product' },
  { key: 'domain', step: 'domain' },
  { key: 'ds', step: 'builders' },
  { key: 'mle', step: 'builders' },
  { key: 'de', step: 'builders' },
  { key: 'designer', step: 'designer' },
  { key: 'legal', step: 'legal' },
];
const ROW_Y = (i: number) => 330 + i * 88;

// The research beside the table, right of it and above the camera, one note at a time.
const NOTES = [
  { key: 'domain', step: 'domain', until: 'builders' },
  { key: 'builders', step: 'builders', until: 'designer' },
] as const;

// The two lists side by side. Shared roles in ink, roles only one list has in the accent. The MLOps
// list is reordered so its two integration roles sit together at the bottom.
const GUIDE: { key: string; own: boolean }[] = [
  { key: 'product', own: false },
  { key: 'domain', own: true },
  { key: 'ds', own: false },
  { key: 'mle', own: false },
  { key: 'de', own: false },
  { key: 'designer', own: true },
  { key: 'legal', own: true },
];
const MLOPS: { key: string; own: boolean }[] = [
  { key: 'business', own: false },
  { key: 'ds', own: false },
  { key: 'de', own: false },
  { key: 'mle', own: false },
  { key: 'devops', own: true },
  { key: 'architect', own: true },
  { key: 'software', own: true },
];
const LIST_Y = (i: number) => 340 + i * 60;

// Werkmora's rule for the switch: who, and when.
const SWITCH = ['director', 'night', 'channel'] as const;

// The one page: a label and a name per row.
const PAGE = ['owner', 'threshold', 'data', 'domain', 'front', 'engineering', 'legal', 'stop'] as const;

export const layout311: DeckLayout<Step> = {
  id: '3-11',
  episode: '3.11',
  steps: STEPS,
  figure: 'overlap',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const timeline: Element[] = TIMELINE.flatMap(({ key, x }) => [
    { id: `tick-${key}`, in: S.late, out: S.werkmora, shape: { kind: 'line', points: [[x, TIMELINE_Y - 14], [x, TIMELINE_Y + 14]] } },
    hand(`tl-${key}`, x, TIMELINE_Y + 60, w.text(`tl-${key}`), { size: 32, anchor: 'middle', tone: 'muted', in: S.late, out: S.werkmora }),
  ]);

  const facts: Element[] = FACTS.map((key, i) =>
    hand(`fact-${key}`, 120, 290 + i * 90, w.text(`fact-${key}`), { size: 40, wrap: 1300, in: S.werkmora, out: S.product }),
  );

  const roles: Element[] = ROLES.flatMap(({ key, step }, i) => {
    const y = ROW_Y(i);
    return [
      hand(`role-${key}`, 120, y, w.text(`role-${key}`), { size: 36, tone: 'accent', in: S[step], out: S.compare }),
      sans(`decides-${key}`, 470, y, w.text(`decides-${key}`), { size: 24, wrap: 470, in: S[step], out: S.compare }),
      sans(`werkmora-${key}`, 990, y, w.text(`werkmora-${key}`), { size: 24, wrap: 430, in: S[step], out: S.compare }),
    ];
  });

  const notes: Element[] = NOTES.flatMap(({ key, step, until }) => [
    sans(`note-${key}`, 1460, 330, w.text(`note-${key}`), { size: 26, wrap: 400, in: S[step], out: S[until] }),
    sans(`credit-${key}`, 1460, 520, w.text(`credit-${key}`), { size: 22, wrap: 400, tone: 'muted', in: S[step], out: S[until] }),
  ]);

  const lists: Element[] = [
    ...GUIDE.map(({ key, own }, i) =>
      hand(`guide-${key}`, 120, LIST_Y(i), w.text(`guide-${key}`), { size: 34, tone: own ? 'accent' : 'ink', in: S.compare, out: S.stop }),
    ),
    ...MLOPS.map(({ key, own }, i) =>
      hand(`mlops-${key}`, 600, LIST_Y(i), w.text(`mlops-${key}`), { size: 34, tone: own ? 'accent' : 'ink', in: S.compare, out: S.stop }),
    ),
  ];

  const switches: Element[] = SWITCH.flatMap((key, i) => {
    const y = 640 + i * 80;
    return [
      hand(`switch-${key}`, 120, y, w.text(`switch-${key}`), { size: 36, tone: 'accent', in: S.switch, out: S.page }),
      sans(`switch-${key}-what`, 560, y, w.text(`switch-${key}-what`), { size: 28, wrap: 840, in: S.switch, out: S.page }),
    ];
  });

  const page: Element[] = PAGE.flatMap((key, i) => {
    const y = 300 + i * 62;
    return [
      hand(`page-${key}`, 160, y, w.text(`page-${key}`), { size: 34, tone: 'accent', in: S.page, out: S.takeaway }),
      sans(`page-${key}-what`, 520, y, w.text(`page-${key}-what`), { size: 26, wrap: 820, in: S.page, out: S.takeaway }),
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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.team }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.team }),
      ),

      // The usual belief: roles are job titles in the data team.
      hand('question', 120, 400, w.text('question'), { size: 72, wrap: 1300, tone: 'accent', in: S.team, out: S.poaching }),
      { id: 'question-tag', tone: 'muted', in: S.team, out: S.poaching, shape: { kind: 'tag', x: 120, y: 600, text: w.text('question-tag') } },

      // The case: what happened, then where the experts sat on the project's timeline.
      hand('title-case', 120, 160, w.text('title-case'), { size: 52, in: S.poaching, out: S.werkmora }),
      sans('case-what', 120, 250, w.text('case-what'), { size: 30, wrap: 1300, in: S.poaching, out: S.werkmora }),
      hand('case-after', 120, 360, w.text('case-after'), { size: 40, wrap: 1300, tone: 'warn', in: S.poaching, out: S.werkmora }),
      sans('case-credit', 120, 980, w.text('case-credit'), { size: 22, tone: 'muted', in: S.poaching, out: S.werkmora }),
      { id: 'timeline', in: S.late, out: S.werkmora, shape: { kind: 'arrow', x1: 130, y1: TIMELINE_Y, x2: 1380, y2: TIMELINE_Y } },
      ...timeline,
      { id: 'seat-data', in: S.late, out: S.werkmora, shape: { kind: 'seat', x: 470, y: 545 } },
      { id: 'seat-trouble', in: S.late, out: S.werkmora, shape: { kind: 'seat', x: 1240, y: 545 } },
      { id: 'mark-start', tone: 'warn', in: S.late, out: S.werkmora, shape: { kind: 'ellipse', x: 110, y: 500, w: 160, h: 110 } },
      hand('late-start', 190, 570, w.text('late-start'), { size: 34, anchor: 'middle', tone: 'warn', in: S.late, out: S.werkmora }),
      sans('late-quote', 120, 820, w.text('late-quote'), { size: 26, wrap: 1300, in: S.late, out: S.werkmora }),

      // Werkmora in a few lines, and how the business sees the forecast.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.product }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.product, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      ...facts,
      hand('fact-seen', 120, 620, w.text('fact-seen'), { size: 48, wrap: 1300, tone: 'warn', in: S.werkmora, out: S.product }),

      // Seven roles as seven decisions: one row per click, Werkmora's names on the right.
      hand('title-roles', 120, 160, w.text('title-roles'), { size: 56, in: S.product, out: S.compare }),
      sans('col-role', 120, 250, w.text('col-role'), { size: 24, tone: 'muted', in: S.product, out: S.compare }),
      sans('col-decides', 470, 250, w.text('col-decides'), { size: 24, tone: 'muted', in: S.product, out: S.compare }),
      sans('col-werkmora', 990, 250, w.text('col-werkmora'), { size: 24, tone: 'muted', in: S.product, out: S.compare }),
      { id: 'roles-tag', tone: 'muted', in: S.product, out: S.compare, shape: { kind: 'tag', x: 1160, y: 242, text: w.text('roles-tag') } },
      ...roles,
      ...notes,
      { id: 'overlap-bracket', tone: 'accent', in: S.overlap, out: S.compare, shape: { kind: 'line', points: [[100, 290], [80, 290], [80, 880], [100, 880]] } },
      hand('overlap', 1460, 330, w.text('overlap'), { size: 40, wrap: 400, tone: 'accent', in: S.overlap, out: S.compare }),
      sans('credit-overlap', 1460, 450, w.text('credit-overlap'), { size: 22, wrap: 400, tone: 'muted', in: S.overlap, out: S.compare }),

      // The guide next to the MLOps roles; the integrator circled; what neither list names.
      hand('title-compare', 120, 160, w.text('title-compare'), { size: 56, in: S.compare, out: S.stop }),
      hand('list-guide', 120, 270, w.text('list-guide'), { size: 36, in: S.compare, out: S.stop }),
      hand('list-mlops', 600, 270, w.text('list-mlops'), { size: 36, in: S.compare, out: S.stop }),
      ...lists,
      hand('compare-line', 1060, 340, w.text('compare-line'), { size: 34, wrap: 360, in: S.compare, out: S.stop }),
      { id: 'mark-integrator', tone: 'warn', in: S.integrator, out: S.stop, shape: { kind: 'ellipse', x: 570, y: 600, w: 380, h: 130 } },
      hand('integrator', 1060, 530, w.text('integrator'), { size: 34, wrap: 360, tone: 'accent', in: S.integrator, out: S.stop }),
      sans('credit-integrator', 1060, 700, w.text('credit-integrator'), { size: 22, wrap: 360, tone: 'muted', in: S.integrator, out: S.stop }),
      { id: 'neither-box', tone: 'warn', in: S.frontline, out: S.stop, shape: { kind: 'box', x: 100, y: 790, w: 1300, h: 160 } },
      hand('neither', 130, 850, w.text('neither'), { size: 40, tone: 'warn', in: S.frontline, out: S.stop }),
      sans('neither-werkmora', 130, 912, w.text('neither-werkmora'), { size: 26, wrap: 1240, in: S.frontline, out: S.stop }),

      // Who can switch it off: Michigan in one line, then Werkmora's rule.
      hand('title-stop', 120, 160, w.text('title-stop'), { size: 56, in: S.stop, out: S.page }),
      sans('michigan', 120, 260, w.text('michigan'), { size: 30, wrap: 1300, in: S.stop, out: S.page }),
      hand('michigan-ask', 120, 380, w.text('michigan-ask'), { size: 36, wrap: 1300, tone: 'accent', in: S.stop, out: S.page }),
      sans('michigan-credit', 120, 470, w.text('michigan-credit'), { size: 22, tone: 'muted', in: S.stop, out: S.page }),
      hand('title-switch', 120, 560, w.text('title-switch'), { size: 44, in: S.switch, out: S.page }),
      { id: 'switch-tag', tone: 'muted', in: S.switch, out: S.page, shape: { kind: 'tag', x: 600, y: 548, text: w.text('switch-tag') } },
      ...switches,

      // The close: one page for the forecast, and what it changed a month later.
      hand('title-close', 120, 160, w.text('title-close'), { size: 56, in: S.page, out: S.takeaway }),
      { id: 'page-tag', tone: 'muted', in: S.page, out: S.takeaway, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('page-tag') } },
      { id: 'page-sheet', in: S.page, out: S.takeaway, shape: { kind: 'box', x: 120, y: 230, w: 1260, h: 580 } },
      ...page,
      hand('month', 120, 900, w.text('month'), { size: 36, wrap: 1300, tone: 'accent', in: S.month, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
