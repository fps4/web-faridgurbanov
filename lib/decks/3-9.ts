import type { CardSpec, Element } from '@/lib/deck';
import type { DeckLayout, Words } from '@/lib/decks/compose';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 3.9, "From prototype to production" (FS-0010): the layout. The words are in
// content/decks/<locale>/3-9.yaml; this file places them on the stage by id. The episode follows the
// wiki presenter notes (publishing/ai-product-design/episodes/03-data/09-from-prototype-to-production.slides.md):
// what the episode promises, "now switch it on" as the usual belief, Google's screening in Thai
// clinics as the case (Beede et al. 2020), Werkmora's three stages, what production adds around the
// model, the rollout in steps with its fallback, the six signals to watch (Epic at the start of
// COVID-19 as concept drift in one line), the trigger page, a month later, and the hand-over to the
// agentic module. The Thai and Epic numbers are the papers'; every Werkmora number is fictional.

const STEPS = [
  'title',
  'promise',
  'notebook',
  'clinics',
  'rooms',
  'werkmora',
  'poc',
  'pilot',
  'production',
  'pipelines',
  'features',
  'registry',
  'shadow',
  'limit',
  'canary',
  'fallback',
  'four',
  'epic',
  'two',
  'triggers',
  'month',
  'agents',
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

const episode = episodeByNumber('3.9') ?? missing('episode 3.9 is missing from lib/episodes/module-3.ts');
const promise = episode.promise ?? missing('episode 3.9 needs its "In this episode" lines');
const takeaway = episode.takeaway ?? missing('episode 3.9 needs its closing card');

// The three stages, left to right: the box is drawn with the names, the question and Werkmora's
// version fill in one click each.
const STAGES = [
  { key: 'poc', x: 120 },
  { key: 'pilot', x: 560 },
  { key: 'production', x: 1000 },
] as const;

// What production adds, as one pipeline: the two jobs first, the shared features and the registry
// one click each.
const ADDS = [
  { key: 'data', x: 120, step: 'pipelines' },
  { key: 'features', x: 450, step: 'features' },
  { key: 'training', x: 780, step: 'pipelines' },
  { key: 'registry', x: 1110, step: 'registry' },
] as const;

// The six signals: the guide's four, then the two the research adds.
const SIGNALS = [
  { key: 'data-drift', step: 'four' },
  { key: 'concept-drift', step: 'four' },
  { key: 'performance', step: 'four' },
  { key: 'business', step: 'four' },
  { key: 'upstream', step: 'two' },
  { key: 'serving', step: 'two' },
] as const;

// The trigger page and the month after: one line each.
const TRIGGERS = ['schedule', 'extra', 'rollback'] as const;
const MONTH = ['nightly', 'fallback', 'page', 'live'] as const;

export const layout39: DeckLayout<Step> = {
  id: '3-9',
  episode: '3.9',
  steps: STEPS,
  figure: 'fallback',
  build,
};

function build(w: Words, S: Record<Step, number>): { elements: Element[]; cards: CardSpec[] } {
  const copy = storylineCopy[w.locale];

  const stages: Element[] = STAGES.flatMap(({ key, x }, i) => [
    { id: `stage-${key}`, tone: i === 0 ? 'accent' : undefined, in: S.werkmora, out: S.pipelines, shape: { kind: 'box', x, y: 340, w: 400, h: 110 } },
    hand(`stage-${key}-label`, x + 30, 410, w.text(`stage-${key}`), { size: 40, in: S.werkmora, out: S.pipelines }),
    hand(`stage-${key}-question`, x, 530, w.text(`stage-${key}-question`), { size: 34, tone: 'accent', wrap: 380, in: S[key], out: S.pipelines }),
    sans(`stage-${key}-werkmora`, x, 690, w.text(`stage-${key}-werkmora`), { size: 26, wrap: 380, in: S[key], out: S.pipelines }),
  ]);

  const adds: Element[] = ADDS.flatMap(({ key, x, step }) => [
    { id: `add-${key}`, in: S[step], out: S.shadow, shape: { kind: 'box', x, y: 320, w: 300, h: 100 } },
    hand(`add-${key}-label`, x + 20, 385, w.text(`add-${key}`), { size: 36, in: S[step], out: S.shadow }),
    sans(`add-${key}-note`, x, 500, w.text(`add-${key}-note`), { size: 26, wrap: 290, in: S[step], out: S.shadow }),
  ]);

  const signals: Element[] = SIGNALS.flatMap(({ key, step }, i) => {
    const y = 300 + i * 85;
    return [
      hand(`signal-${key}`, 120, y, w.text(`signal-${key}`), { size: 38, tone: step === 'four' ? 'accent' : 'ink', in: S[step], out: S.triggers }),
      sans(`signal-${key}-what`, 520, y, w.text(`signal-${key}-what`), { size: 26, wrap: 620, in: S[step], out: S.triggers }),
      sans(`signal-${key}-labels`, 1180, y, w.text(`signal-${key}-labels`), { size: 26, in: S[step], out: S.triggers }),
    ];
  });

  const triggers: Element[] = TRIGGERS.map((key, i) =>
    sans(`trigger-${key}`, 160, 440 + i * 100, w.text(`trigger-${key}`), { size: 28, wrap: 920, in: S.triggers, out: S.month }),
  );

  const month: Element[] = MONTH.map((key, i) =>
    hand(`month-${key}`, 120, 290 + i * 75, w.text(`month-${key}`), { size: 38, tone: i === 3 ? 'accent' : 'ink', in: S.month, out: S.takeaway }),
  );

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
      hand('promise-title', 120, 250, copy.inThisEpisode, { size: 72, in: S.promise, out: S.notebook }),
      ...promise.map((line, i) =>
        hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 52, tone: i === 1 ? 'accent' : 'ink', in: S.promise, out: S.notebook }),
      ),

      // The usual belief, which stays as the heading while the case answers it.
      hand('hook', 120, 160, w.text('hook'), { size: 56, tone: 'accent', in: S.notebook, out: S.werkmora }),
      hand('hook-belief', 120, 460, w.text('hook-belief'), { size: 64, in: S.notebook, out: S.clinics }),
      { id: 'hook-tag', tone: 'muted', in: S.notebook, out: S.clinics, shape: { kind: 'tag', x: 120, y: 580, text: w.text('hook-tag') } },

      // The case: the same model, from retrospective studies into real clinics.
      sans('case-what', 120, 240, w.text('case-what'), { size: 28, wrap: 1250, in: S.clinics, out: S.werkmora }),
      hand('value-lab', 120, 440, w.text('value-lab'), { size: 120, tone: 'accent', in: S.clinics, out: S.werkmora }),
      sans('label-lab', 120, 510, w.text('label-lab'), { size: 28, wrap: 420, in: S.clinics, out: S.werkmora }),
      sans('case-credit', 120, 900, w.text('case-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.clinics, out: S.werkmora }),
      { id: 'arrow-clinic', in: S.rooms, out: S.werkmora, shape: { kind: 'arrow', x1: 400, y1: 400, x2: 600, y2: 400 } },
      hand('value-clinic', 640, 440, w.text('value-clinic'), { size: 120, tone: 'warn', in: S.rooms, out: S.werkmora }),
      sans('label-clinic', 640, 510, w.text('label-clinic'), { size: 28, wrap: 420, in: S.rooms, out: S.werkmora }),
      hand('outage', 1140, 400, w.text('outage'), { size: 36, wrap: 560, in: S.rooms, out: S.werkmora }),
      hand('same', 120, 740, w.text('same'), { size: 44, tone: 'accent', wrap: 1250, in: S.rooms, out: S.werkmora }),
      sans('followup', 120, 945, w.text('followup'), { size: 22, tone: 'muted', wrap: 1250, in: S.rooms, out: S.werkmora }),

      // Werkmora's question, and the three stages that answer it.
      hand('title-werkmora', 120, 160, w.text('title-werkmora'), { size: 56, in: S.werkmora, out: S.pipelines }),
      { id: 'werkmora-tag', tone: 'muted', in: S.werkmora, out: S.pipelines, shape: { kind: 'tag', x: 1500, y: 160, text: w.text('werkmora-tag') } },
      sans('werkmora', 120, 240, w.text('werkmora'), { size: 30, wrap: 1250, in: S.werkmora, out: S.pipelines }),
      ...stages,
      { id: 'arrow-stage-1', in: S.werkmora, out: S.pipelines, shape: { kind: 'arrow', x1: 520, y1: 395, x2: 560, y2: 395 } },
      { id: 'arrow-stage-2', in: S.werkmora, out: S.pipelines, shape: { kind: 'arrow', x1: 960, y1: 395, x2: 1000, y2: 395 } },
      hand('offline', 120, 900, w.text('offline'), { size: 40, tone: 'warn', wrap: 1250, in: S.poc, out: S.pipelines }),

      // What production adds around the model, as one pipeline.
      hand('title-adds', 120, 160, w.text('title-adds'), { size: 56, in: S.pipelines, out: S.shadow }),
      sans('mlops', 120, 235, w.text('mlops'), { size: 26, tone: 'muted', in: S.pipelines, out: S.shadow }),
      ...adds,
      { id: 'arrow-add-1', in: S.features, out: S.shadow, shape: { kind: 'arrow', x1: 420, y1: 370, x2: 450, y2: 370 } },
      { id: 'arrow-add-2', in: S.features, out: S.shadow, shape: { kind: 'arrow', x1: 750, y1: 370, x2: 780, y2: 370 } },
      { id: 'arrow-add-3', in: S.registry, out: S.shadow, shape: { kind: 'arrow', x1: 1080, y1: 370, x2: 1110, y2: 370 } },
      { id: 'mark-features', tone: 'warn', in: S.features, out: S.shadow, shape: { kind: 'ellipse', x: 425, y: 300, w: 350, h: 140 } },
      sans('feature-store', 450, 720, w.text('feature-store'), { size: 22, tone: 'muted', wrap: 290, in: S.features, out: S.shadow }),
      hand('registry-question', 120, 900, w.text('registry-question'), { size: 44, tone: 'accent', wrap: 1250, in: S.registry, out: S.shadow }),

      // The rollout in steps: shadow, the live test on part of the stores, and the way back.
      hand('title-rollout', 120, 160, w.text('title-rollout'), { size: 56, in: S.shadow, out: S.four }),
      { id: 'roll-shadow', tone: 'accent', in: S.shadow, out: S.four, shape: { kind: 'box', x: 120, y: 300, w: 380, h: 110 } },
      hand('roll-shadow-label', 150, 370, w.text('roll-shadow'), { size: 40, in: S.shadow, out: S.four }),
      sans('roll-shadow-note', 120, 490, w.text('roll-shadow-note'), { size: 26, wrap: 380, in: S.shadow, out: S.four }),
      sans('stages-credit', 120, 960, w.text('stages-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.shadow, out: S.four }),
      hand('limit', 120, 760, w.text('limit'), { size: 34, tone: 'warn', wrap: 400, in: S.limit, out: S.four }),
      { id: 'arrow-roll-1', in: S.canary, out: S.four, shape: { kind: 'arrow', x1: 500, y1: 355, x2: 560, y2: 355 } },
      { id: 'roll-canary', tone: 'accent', in: S.canary, out: S.four, shape: { kind: 'box', x: 560, y: 300, w: 420, h: 110 } },
      hand('roll-canary-label', 590, 370, w.text('roll-canary'), { size: 40, in: S.canary, out: S.four }),
      sans('roll-canary-note', 560, 490, w.text('roll-canary-note'), { size: 26, wrap: 400, in: S.canary, out: S.four }),
      sans('guardrails', 560, 720, w.text('guardrails'), { size: 24, tone: 'muted', wrap: 400, in: S.canary, out: S.four }),
      { id: 'arrow-roll-2', in: S.canary, out: S.four, shape: { kind: 'arrow', x1: 980, y1: 355, x2: 1040, y2: 355 } },
      { id: 'roll-all', tone: 'muted', in: S.canary, out: S.four, shape: { kind: 'box', x: 1040, y: 300, w: 360, h: 110 } },
      hand('roll-all-label', 1070, 370, w.text('roll-all'), { size: 40, tone: 'muted', in: S.canary, out: S.four }),
      { id: 'arrow-back', tone: 'warn', in: S.fallback, out: S.four, shape: { kind: 'arrow', x1: 1220, y1: 430, x2: 1220, y2: 470 } },
      hand('fallback', 1040, 520, w.text('fallback'), { size: 34, tone: 'warn', wrap: 380, in: S.fallback, out: S.four }),
      sans('fallback-credit', 1040, 700, w.text('fallback-credit'), { size: 22, tone: 'muted', wrap: 380, in: S.fallback, out: S.four }),

      // What to watch: the guide's four, Epic as concept drift, then the two the research adds.
      hand('title-watch', 120, 160, w.text('title-watch'), { size: 56, in: S.four, out: S.triggers }),
      sans('drift-words', 120, 225, w.text('drift-words'), { size: 22, tone: 'muted', in: S.four, out: S.triggers }),
      sans('col-labels', 1180, 225, w.text('col-labels'), { size: 22, tone: 'muted', in: S.four, out: S.triggers }),
      ...signals,
      { id: 'mark-concept', tone: 'warn', in: S.epic, out: S.two, shape: { kind: 'ellipse', x: 90, y: 330, w: 1330, h: 80 } },
      sans('epic', 120, 820, w.text('epic'), { size: 28, wrap: 1250, in: S.epic, out: S.two }),
      sans('epic-credit', 120, 940, w.text('epic-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.epic, out: S.two }),
      hand('outputs', 120, 830, w.text('outputs'), { size: 36, tone: 'accent', wrap: 1250, in: S.two, out: S.triggers }),
      sans('watch-credit', 120, 940, w.text('watch-credit'), { size: 22, tone: 'muted', wrap: 1250, in: S.two, out: S.triggers }),

      // The trigger page, written and signed before go-live.
      hand('title-triggers', 120, 160, w.text('title-triggers'), { size: 56, in: S.triggers, out: S.month }),
      { id: 'page', in: S.triggers, out: S.month, shape: { kind: 'box', x: 120, y: 270, w: 1000, h: 480 } },
      hand('page-head', 160, 350, w.text('page-head'), { size: 40, in: S.triggers, out: S.month }),
      { id: 'page-tag', tone: 'muted', in: S.triggers, out: S.month, shape: { kind: 'tag', x: 1180, y: 330, text: w.text('page-tag') } },
      ...triggers,
      sans('retrain-kinds', 120, 860, w.text('retrain-kinds'), { size: 24, tone: 'muted', wrap: 1250, in: S.triggers, out: S.month }),

      // A month later, and the hand-over to agents.
      hand('title-month', 120, 160, w.text('title-month'), { size: 56, in: S.month, out: S.takeaway }),
      ...month,
      sans('no-rule', 120, 600, w.text('no-rule'), { size: 24, tone: 'muted', wrap: 1250, in: S.month, out: S.takeaway }),
      { id: 'agents-box', tone: 'accent', in: S.agents, out: S.takeaway, shape: { kind: 'box', x: 120, y: 680, w: 1260, h: 320 } },
      hand('agents-title', 150, 750, w.text('agents-title'), { size: 44, tone: 'accent', in: S.agents, out: S.takeaway }),
      sans('agents', 150, 820, w.text('agents'), { size: 26, wrap: 1200, in: S.agents, out: S.takeaway }),
      sans('agents-module', 150, 965, w.text('agents-module'), { size: 22, tone: 'muted', in: S.agents, out: S.takeaway }),

      // The episode in one card, and what comes next.
      { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
      hand('next', 100, 1010, w.text('next'), { size: 40, wrap: 1280, in: S.next }),
    ],
  };
}
