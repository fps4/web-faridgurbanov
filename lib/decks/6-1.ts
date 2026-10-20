import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 6.1, "Risk follows the use, not the model" (FS-0010): the layout. The words are in
// content/decks/<locale>/6-1.yaml; this file places them on the stage by id. Built from the script's
// "On screen" list and stage directions; each step is one click while recording. The diagram is one
// horizontal line, the AI Act's high-risk line: the same model on both sides of it, then the same
// insurer on both sides, then what still applies below it, then the one-page register.

const STEPS = [
  'recap',
  'promise',
  'late',
  'timing',
  'idea',
  'model',
  'tiers',
  'day',
  'case',
  'flow',
  'same',
  'stamp',
  'gdpr',
  'verbond',
  'eiopa',
  'move',
  'r1',
  'r2',
  'r3',
  'r4',
  'r5',
  'r6',
  'r7',
  'r8',
  'every',
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

const episode = episodeByNumber('6.1') ?? missing('episode 6.1 is missing from lib/episodes/part-6.ts');

function missing(message: string): never {
  throw new Error(message);
}

export const layout61: DeckLayout<Step> = {
  id: '6-1',
  episode: '6.1',
  steps: STEPS,
  build,
};

/** The register's eight rows, in the order the script reads them. */
const ROWS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'] as const;

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  // The claims flow below the line: four boxes and the arrows between them.
  const flow: Element[] = (['flow-read', 'flow-coverage', 'flow-score', 'flow-pay'] as const).flatMap((id, i) => {
    const x = 160 + i * 360;
    const parts: Element[] = [
      { id: `box-${id}`, in: S.flow, out: S.move, shape: { kind: 'box', x, y: 590, w: 300, h: 100 } },
      hand(id, x + 150, 652, w.text(id), { size: 34, anchor: 'middle', in: S.flow, out: S.move }),
    ];
    if (i > 0) parts.push({ id: `arrow-${id}`, in: S.flow, out: S.move, shape: { kind: 'arrow', x1: x - 48, y1: 640, x2: x - 12, y2: 640 } });
    return parts;
  });

  // The register: one row per click, each with its owner and its review date.
  const rows: Element[] = ROWS.flatMap((id, i) => {
    const y = 370 + i * 75;
    return [
      hand(id, 150, y, w.text(id), { size: 32, in: S[id], out: S.canvas }),
      hand(`${id}-owner`, 880, y, w.text(`${id}-owner`), { size: 30, tone: 'accent', in: S[id], out: S.canvas }),
      hand(`${id}-review`, 1180, y, w.text(`${id}-review`), { size: 30, tone: 'muted', in: S[id], out: S.canvas }),
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
        key: 'register-blank',
        ...w.card('register-blank'),
        source: 'parts/6-risk-and-governance/risk-register.md',
        heading: '3. The risks',
        rows: ['1', '2', '4', '6'],
      },
      {
        key: 'register-claims',
        ...w.card('register-claims'),
        source: 'parts/6-risk-and-governance/risk-register.claims.md',
        heading: '3. The risks',
        rows: ['1', '2', '4', '6'],
        tag: 'synthetic',
      },
    ],
    elements: [
      // Recap: the title card.
      sans('episode', 120, 200, w.text('episode'), { size: 28, tone: 'muted', out: S.promise }),
      hand('title', 120, 360, w.title, { size: 96, out: S.promise }),
      sans('recap', 120, 520, w.text('recap'), { size: 36, wrap: 1150, out: S.promise }),
      { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: w.text('recap-tag') } },
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.late }),
      ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.late })),
      sans('header', 120, 70, `${episode.number} · ${w.title}`, { size: 24, tone: 'muted', in: S.promise }),

      // What you see: compliance meets the product at go-live.
      hand('title-late', 120, 170, w.text('title-late'), { size: 60, in: S.late, out: S.idea }),
      { id: 'box-late-build', in: S.late, out: S.idea, shape: { kind: 'box', x: 160, y: 330, w: 440, h: 120 } },
      hand('late-build', 380, 402, w.text('late-build'), { size: 38, anchor: 'middle', in: S.late, out: S.idea }),
      { id: 'arrow-late-1', in: S.late, out: S.idea, shape: { kind: 'arrow', x1: 612, y1: 390, x2: 708, y2: 390 } },
      { id: 'box-late-review', in: S.late, out: S.idea, shape: { kind: 'box', x: 720, y: 330, w: 440, h: 120 } },
      hand('late-review', 940, 402, w.text('late-review'), { size: 38, anchor: 'middle', in: S.late, out: S.idea }),
      { id: 'arrow-late-2', in: S.late, out: S.idea, shape: { kind: 'arrow', x1: 1172, y1: 390, x2: 1268, y2: 390 } },
      { id: 'box-late-slip', in: S.late, out: S.idea, shape: { kind: 'box', x: 1280, y: 330, w: 440, h: 120 } },
      hand('late-slip', 1500, 402, w.text('late-slip'), { size: 38, anchor: 'middle', in: S.late, out: S.idea }),
      { id: 'timing-ring', tone: 'warn', in: S.timing, out: S.idea, shape: { kind: 'ellipse', x: 700, y: 305, w: 480, h: 170 } },
      hand('timing', 160, 620, w.text('timing'), { size: 52, tone: 'warn', in: S.timing, out: S.idea }),

      // The idea: the line, and the same model on both sides of it.
      hand('title-idea', 120, 170, w.text('title-idea'), { size: 60, in: S.idea, out: S.move }),
      { id: 'line', in: S.idea, out: S.move, shape: { kind: 'line', points: [[120, 540], [1760, 540]] } },
      hand('line-label', 1760, 520, w.text('line-label'), { size: 34, anchor: 'end', tone: 'warn', in: S.idea, out: S.move }),
      { id: 'box-model-above', in: S.model, out: S.case, shape: { kind: 'box', x: 160, y: 340, w: 160, h: 90 } },
      hand('model-above', 240, 397, w.text('model-above'), { size: 34, anchor: 'middle', in: S.model, out: S.case }),
      hand('applicants', 360, 400, w.text('applicants'), { size: 38, in: S.model, out: S.case }),
      { id: 'box-model-below', in: S.model, out: S.flow, shape: { kind: 'box', x: 160, y: 600, w: 160, h: 90 } },
      hand('model-below', 240, 657, w.text('model-below'), { size: 34, anchor: 'middle', in: S.model, out: S.flow }),
      hand('songs', 360, 660, w.text('songs'), { size: 38, in: S.model, out: S.flow }),
      { id: 'same-model-link', tone: 'muted', in: S.model, out: S.case, shape: { kind: 'line', points: [[240, 430], [240, 600]] } },
      hand('same-model', 260, 515, w.text('same-model'), { size: 30, tone: 'muted', in: S.model, out: S.case }),
      { id: 'tier-prohibited', tone: 'muted', in: S.tiers, out: S.case, shape: { kind: 'tag', x: 120, y: 250, text: w.text('tier-prohibited') } },
      { id: 'tier-high', tone: 'muted', in: S.tiers, out: S.case, shape: { kind: 'tag', x: 340, y: 250, text: w.text('tier-high') } },
      { id: 'tier-transparency', tone: 'muted', in: S.tiers, out: S.case, shape: { kind: 'tag', x: 545, y: 250, text: w.text('tier-transparency') } },
      { id: 'tier-rest', tone: 'muted', in: S.tiers, out: S.case, shape: { kind: 'tag', x: 795, y: 250, text: w.text('tier-rest') } },
      hand('day', 160, 880, w.text('day'), { size: 40, tone: 'accent', in: S.day, out: S.case }),

      // On the case: the same insurer on both sides of the line.
      { id: 'box-health', tone: 'accent', in: S.case, out: S.move, shape: { kind: 'box', x: 160, y: 330, w: 520, h: 110 } },
      hand('health', 420, 400, w.text('health'), { size: 40, anchor: 'middle', tone: 'accent', in: S.case, out: S.move }),
      sans('annex-quote', 720, 360, w.text('annex-quote'), { size: 24, wrap: 1000, in: S.case, out: S.move }),
      sans('annex-source', 720, 440, w.text('annex-source'), { size: 20, tone: 'muted', in: S.case, out: S.move }),
      ...flow,
      { id: 'flow-tag', tone: 'muted', in: S.flow, out: S.move, shape: { kind: 'tag', x: 1240, y: 740, text: w.text('flow-tag') } },
      hand('same-insurer', 760, 525, w.text('same-insurer'), { size: 36, tone: 'accent', in: S.same, out: S.move }),

      // Below the line is not unregulated: the stamp and the three things that still apply.
      { id: 'stamp-box', tone: 'warn', in: S.stamp, out: S.move, shape: { kind: 'box', x: 140, y: 760, w: 780, h: 85 } },
      hand('stamp', 160, 820, w.text('stamp'), { size: 52, tone: 'warn', in: S.stamp, out: S.move }),
      { id: 'tag-gdpr', tone: 'accent', in: S.gdpr, out: S.move, shape: { kind: 'tag', x: 160, y: 905, text: w.text('tag-gdpr') } },
      hand('gdpr-note', 160, 970, w.text('gdpr-note'), { size: 30, wrap: 360, in: S.gdpr, out: S.move }),
      { id: 'tag-verbond', tone: 'accent', in: S.verbond, out: S.move, shape: { kind: 'tag', x: 560, y: 905, text: w.text('tag-verbond') } },
      hand('verbond-note', 560, 970, w.text('verbond-note'), { size: 30, wrap: 360, in: S.verbond, out: S.move }),
      { id: 'tag-eiopa', tone: 'accent', in: S.eiopa, out: S.move, shape: { kind: 'tag', x: 960, y: 905, text: w.text('tag-eiopa') } },
      hand('eiopa-note', 960, 970, w.text('eiopa-note'), { size: 30, wrap: 360, in: S.eiopa, out: S.move }),
      sans('sources', 120, 1050, w.text('sources'), { size: 20, tone: 'muted', in: S.eiopa, out: S.move }),

      // The move: one register, eight rows.
      hand('title-move', 120, 170, w.text('title-move'), { size: 56, in: S.move, out: S.canvas }),
      { id: 'register', in: S.move, out: S.canvas, shape: { kind: 'box', x: 120, y: 230, w: 1300, h: 760 } },
      sans('col-risk', 150, 300, w.text('col-risk'), { size: 22, tone: 'muted', in: S.move, out: S.canvas }),
      sans('col-owner', 880, 300, w.text('col-owner'), { size: 22, tone: 'muted', in: S.move, out: S.canvas }),
      sans('col-review', 1180, 300, w.text('col-review'), { size: 22, tone: 'muted', in: S.move, out: S.canvas }),
      { id: 'register-rule', tone: 'muted', in: S.move, out: S.canvas, shape: { kind: 'line', points: [[140, 322], [1400, 322]] } },
      ...rows,
      hand('every', 120, 1045, w.text('every'), { size: 34, tone: 'accent', in: S.every, out: S.know }),
      hand('who', 980, 150, w.text('who'), { size: 30, tone: 'warn', wrap: 440, in: S.who, out: S.canvas }),
      hand('know', 120, 1045, w.text('know'), { size: 34, tone: 'accent', in: S.know, out: S.canvas }),

      // The download.
      hand('canvas-title', 100, 130, w.text('canvas-title'), { size: 52, in: S.canvas, out: S.takeaway }),
      { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'register-blank', x: 100, y: 180, w: 640, h: 760 } },
      { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'register-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [1, 3] } } },
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('swap', 100, 1010, w.text('swap'), { size: 40, wrap: 1280, in: S.swap }),
    ],
  };
}
