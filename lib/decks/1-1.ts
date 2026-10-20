import type { Deck, Element } from '@/lib/deck';
import { episodeByNumber, storylineCopy } from '@/lib/storyline';

// Episode 1.1, "Fund one decision, not more seats" (FS-0010). Built from the script's "On screen"
// list and stage directions; each step is one click while recording, and its `at` is the script's
// cumulative time. The diagram is the anatomy of a decision: prediction → judgement → action, after
// Agrawal, Gans & Goldfarb. Case numbers are the running case's and are tagged synthetic.

const S = {
  recap: 0,
  promise: 1,
  seats: 2,
  dnb: 3,
  gap: 4,
  idea: 5,
  prediction: 6,
  judgement: 7,
  action: 8,
  scarce: 9,
  opportunity: 10,
  decision: 11,
  predictions: 12,
  grow: 13,
  candidate: 14,
  move: 15,
  name: 16,
  labels: 17,
  useCase: 18,
  fund: 19,
  copilots: 20,
  who: 21,
  know: 22,
  canvas: 23,
  mark: 24,
  takeaway: 25,
  swap: 26,
} as const;

const hand = (id: string, x: number, y: number, text: string, opts: Partial<Element> & { size?: number; anchor?: 'start' | 'middle' | 'end'; wrap?: number } = {}): Element => {
  const { size = 40, anchor, wrap, tone, in: at = 0, out } = opts;
  return { id, tone, in: at, out, shape: { kind: 'text', x, y, text, size, font: 'hand', anchor, wrap } };
};

const sans = (id: string, x: number, y: number, text: string, opts: Partial<Element> & { size?: number; anchor?: 'start' | 'middle' | 'end'; wrap?: number } = {}): Element => {
  const { size = 32, anchor, wrap, tone, in: at = 0, out } = opts;
  return { id, tone, in: at, out, shape: { kind: 'text', x, y, text, size, font: 'sans', anchor, wrap } };
};

const episode = episodeByNumber('1.1');
if (!episode) throw new Error('episode 1.1 is missing from lib/storyline.ts');
const labels = storylineCopy.en.takeaway;

const seats: Element[] = [220, 420, 620, 820, 1020, 1220].map((x, i) => ({
  id: `seat-${i + 1}`,
  tone: 'muted',
  in: S.seats,
  out: S.idea,
  shape: { kind: 'seat', x, y: 470 },
}));

export const deck11: Deck = {
  id: '1-1',
  locale: 'en',
  episode: '1.1',
  title: 'Fund one decision, not more seats',
  steps: [
    { at: '0:00', cue: 'Recap: an insurer where a claims handler reads every small home-contents claim by hand, and wants the clear ones paid the same day.' },
    { at: '0:12', cue: 'In this episode: why more seats don\u2019t add up to a capability; the three parts of a decision, on one claims desk; one move, and a canvas for Monday.' },
    { at: '0:22', cue: '(Show the seats.) Everyone has a copilot. Nothing runs across the organization.' },
    { at: '0:30', cue: 'Almost eighty percent of large and medium Dutch insurers had AI in use (De Nederlandsche Bank).' },
    { at: '0:42', cue: 'Using AI is not the gap. Nobody owns a decision that runs on it.' },
    { at: '0:50', cue: '(Fade the seats.) Agrawal, Gans and Goldfarb: AI sells predictions, not decisions.' },
    { at: '1:05', cue: 'A prediction: the information you are missing when you decide.' },
    { at: '1:12', cue: 'Judgement: what each outcome is worth to you.' },
    { at: '1:18', cue: 'And an action that someone can take.' },
    { at: '1:22', cue: 'AI makes the first one cheaper. The other two stay with you, and become the scarce part.' },
    { at: '1:30', cue: 'An AI opportunity is one decision where the prediction is the slow or the expensive part.' },
    { at: '1:40', cue: '(Fill the boxes.) The handler’s decision: pay, pay part, deny, or investigate.' },
    { at: '1:50', cue: 'Two predictions are missing: is it covered by this policy, and is it genuine?' },
    { at: '2:10', cue: '(Grow the prediction box.) Most of the forty minutes go to finding things.' },
    { at: '2:25', cue: 'The prediction is the slow part. That is what makes this a candidate.' },
    { at: '2:35', cue: 'So fund the decision, not more seats. Three steps.' },
    { at: '2:42', cue: 'First, name the decision, the prediction it lacks, and the action.' },
    { at: '2:58', cue: '(Attach the four labels.) An owner, the data, a budget, a result.' },
    { at: '3:10', cue: 'Together they are the use case.' },
    { at: '3:18', cue: 'Third, fund it as a case. The model is usually the smallest line.' },
    { at: '3:30', cue: 'Keep the personal copilots. They help people. They are not the capability.' },
    { at: '3:35', cue: 'This is the sponsor’s move. At our insurer, the head of claims.' },
    { at: '4:00', cue: 'You will know it worked: a go or no-go within one quarter, on evidence.' },
    { at: '4:35', cue: '(Show the canvas, blank and filled in.) The use-case canvas is linked below.' },
    { at: '4:45', cue: 'The decision, the prediction it lacks and the action: the first three rows of the canvas.' },
    { at: '4:55', cue: '(Show the episode card.) In one card: the idea, the move, Monday, and the download.' },
    { at: '5:10', cue: 'In a bank, a disputed card payment; in a retailer, a refund for a damaged order. Same three boxes.' },
  ],
  cards: [
    {
      key: 'takeaway',
      title: 'Fund one decision, not more seats',
      subtitle: 'Episode 1.1 in one card',
      source: 'Episode 1.1',
      inline: [
        { label: labels.idea, value: episode.takeaway.idea },
        { label: labels.move, value: episode.takeaway.move },
        { label: labels.monday, value: episode.takeaway.monday },
        { label: labels.download, value: episode.takeaway.download },
      ],
    },
    {
      key: 'canvas-blank',
      title: 'Use-case canvas',
      subtitle: '1 · The decision · blank',
      source: 'parts/1-frame-the-decision/use-case-canvas.md',
      heading: '1 · The decision',
      rows: ['The decision', 'The prediction it lacks', 'The judgement', 'The action'],
    },
    {
      key: 'canvas-claims',
      title: 'Use-case canvas',
      subtitle: '1 · The decision · filled in for the claims example',
      source: 'parts/1-frame-the-decision/use-case-canvas.claims.md',
      heading: '1 · The decision',
      rows: ['The decision', 'The prediction it lacks', 'The judgement', 'The action'],
      tag: 'synthetic',
    },
  ],
  elements: [
    // Recap: the title card.
    sans('episode', 120, 200, 'AI Product Design · Part 1 · Episode 1.1', { size: 28, tone: 'muted', out: S.promise }),
    hand('title', 120, 360, 'Fund one decision, not more seats', { size: 96, out: S.promise }),
    sans('recap', 120, 520, 'Our running example: an insurer where a claims handler reads every small home-contents claim by hand, and wants the clear ones paid the same day.', { size: 36, wrap: 1150, out: S.promise }),
    { id: 'recap-tag', in: S.recap, out: S.promise, tone: 'muted', shape: { kind: 'tag', x: 120, y: 760, text: 'a worked example · synthetic numbers' } },
    hand('promise-title', 120, 250, storylineCopy.en.inThisEpisode, { size: 72, in: S.promise, out: S.seats }),
    ...episode.promise.map((line, i) => hand(`promise-${i + 1}`, 160, 420 + i * 120, `${i + 1}  ${line}`, { size: 56, tone: i === 2 ? 'accent' : 'ink', in: S.promise, out: S.seats })),
    sans('header', 120, 70, '1.1 · Fund one decision, not more seats', { size: 24, tone: 'muted', in: S.promise }),

    // What you see: seats, the DNB figure, the gap.
    hand('hook', 120, 230, 'Everyone has a copilot. Nothing runs across the organization.', { size: 60, wrap: 1500, in: S.seats, out: S.idea }),
    ...seats,
    hand('per-person', 720, 620, 'one licence per person', { anchor: 'middle', tone: 'muted', in: S.seats, out: S.idea }),
    sans('dnb', 120, 760, 'Almost 80% of large and medium Dutch insurers had AI in use at the start of 2025.', { size: 34, wrap: 1200, in: S.dnb, out: S.idea }),
    sans('dnb-source', 120, 860, 'De Nederlandsche Bank, 21 January 2026', { size: 22, tone: 'muted', in: S.dnb, out: S.idea }),
    hand('gap', 120, 960, 'Using AI is not the gap. Nobody owns a decision that runs on it.', { size: 46, tone: 'accent', wrap: 1250, in: S.gap, out: S.idea }),

    // The idea: prediction → judgement → action.
    hand('title-idea', 120, 170, 'AI sells predictions, not decisions.', { size: 60, in: S.idea, out: S.decision }),
    sans('credit', 1760, 260, 'after Agrawal, Gans & Goldfarb, Prediction Machines (2018)', { size: 22, tone: 'muted', anchor: 'end', in: S.idea, out: S.canvas }),
    { id: 'box-prediction', in: S.prediction, out: S.grow, shape: { kind: 'box', x: 160, y: 300, w: 440, h: 220 } },
    hand('label-prediction', 380, 370, 'prediction', { size: 48, anchor: 'middle', in: S.prediction, out: S.canvas }),
    { id: 'arrow-1', in: S.judgement, out: S.canvas, shape: { kind: 'arrow', x1: 612, y1: 410, x2: 728, y2: 410 } },
    { id: 'box-judgement', in: S.judgement, out: S.canvas, shape: { kind: 'box', x: 740, y: 300, w: 440, h: 220 } },
    hand('label-judgement', 960, 370, 'judgement', { size: 48, anchor: 'middle', in: S.judgement, out: S.canvas }),
    { id: 'arrow-2', in: S.action, out: S.canvas, shape: { kind: 'arrow', x1: 1192, y1: 410, x2: 1308, y2: 410 } },
    { id: 'box-action', in: S.action, out: S.canvas, shape: { kind: 'box', x: 1320, y: 300, w: 440, h: 220 } },
    hand('label-action', 1540, 370, 'action', { size: 48, anchor: 'middle', in: S.action, out: S.canvas }),
    hand('cheaper', 380, 590, 'AI makes this cheaper', { size: 36, anchor: 'middle', tone: 'accent', in: S.scarce, out: S.grow }),
    { id: 'scarce-line', in: S.scarce, out: S.grow, tone: 'warn', shape: { kind: 'line', points: [[760, 545], [1740, 545]] } },
    hand('scarce', 1250, 590, 'stays with you: the scarce part', { size: 36, anchor: 'middle', tone: 'warn', in: S.scarce, out: S.grow }),
    sans('opportunity', 120, 800, 'An AI opportunity is one decision where the prediction is the slow or expensive part.', { size: 32, wrap: 1250, in: S.opportunity, out: S.move }),

    // In the case.
    hand('title-case', 120, 170, 'At our insurer: one claims decision', { size: 60, in: S.decision, out: S.move }),
    hand('fill-action', 1540, 440, 'pay · pay part · deny · investigate', { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.decision, out: S.canvas }),
    hand('fill-prediction', 380, 440, 'is it covered? is it genuine?', { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.predictions, out: S.canvas }),
    hand('fill-judgement', 960, 440, 'what is each outcome worth?', { size: 34, anchor: 'middle', wrap: 420, tone: 'accent', in: S.predictions, out: S.canvas }),
    { id: 'box-prediction-big', tone: 'accent', in: S.grow, out: S.canvas, shape: { kind: 'box', x: 120, y: 280, w: 500, h: 260 } },
    { id: 'clock', tone: 'accent', in: S.grow, out: S.canvas, shape: { kind: 'clock', x: 175, y: 228, r: 34 } },
    hand('forty', 225, 242, 'most of the 40 minutes', { size: 40, tone: 'accent', in: S.grow, out: S.canvas }),
    { id: 'forty-tag', tone: 'muted', in: S.grow, out: S.canvas, shape: { kind: 'tag', x: 620, y: 230, text: 'synthetic' } },
    hand('candidate', 370, 610, '→ that makes it a candidate', { size: 40, anchor: 'middle', tone: 'accent', in: S.candidate, out: S.move }),

    // The move.
    hand('title-move', 120, 170, 'Fund the decision, not more seats.', { size: 60, in: S.move, out: S.canvas }),
    hand('step-1', 120, 820, '1  Name the decision, the prediction it lacks and the action.', { size: 38, in: S.name, out: S.canvas }),
    { id: 'tag-owner', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 160, y: 615, text: 'owner' } },
    { id: 'tag-data', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 480, y: 615, text: 'data' } },
    { id: 'tag-budget', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 800, y: 615, text: 'budget' } },
    { id: 'tag-result', tone: 'accent', in: S.labels, out: S.canvas, shape: { kind: 'tag', x: 1120, y: 615, text: 'result' } },
    hand('step-2', 120, 890, '2  Give it what a licence never has: owner, data, budget, result.', { size: 38, in: S.labels, out: S.canvas }),
    { id: 'bracket', tone: 'accent', in: S.useCase, out: S.canvas, shape: { kind: 'line', points: [[160, 650], [160, 668], [1230, 668], [1230, 650]] } },
    hand('use-case', 1250, 685, '= a use case', { size: 40, tone: 'accent', in: S.useCase, out: S.canvas }),
    hand('step-3', 120, 960, '3  Fund it as a case. The model is usually the smallest line.', { size: 38, in: S.fund, out: S.canvas }),
    sans('copilots', 120, 1040, 'Keep the personal copilots. They help people; they are not the capability.', { size: 26, tone: 'muted', in: S.copilots, out: S.know }),
    { id: 'owner-ring', tone: 'warn', in: S.who, out: S.canvas, shape: { kind: 'ellipse', x: 138, y: 583, w: 160, h: 64 } },
    hand('head-of-claims', 160, 572, 'the head of claims', { size: 36, tone: 'warn', in: S.who, out: S.canvas }),
    hand('know', 120, 1040, 'You’ll know: go or no-go within a quarter, on evidence.', { size: 38, tone: 'accent', in: S.know, out: S.canvas }),

    // The download.
    hand('canvas-title', 100, 130, 'The use-case canvas: blank, and filled in', { size: 52, in: S.canvas, out: S.takeaway }),
    { id: 'card-blank', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-blank', x: 100, y: 180, w: 640, h: 760 } },
    { id: 'card-claims', in: S.canvas, out: S.takeaway, shape: { kind: 'card', card: 'canvas-claims', x: 780, y: 180, w: 640, h: 760, highlight: { [S.mark]: [0, 1, 3] } } },
    { id: 'card-takeaway', in: S.takeaway, shape: { kind: 'card', card: 'takeaway', x: 100, y: 120, w: 1240, h: 800 } },
    hand('swap', 100, 1010, 'In a bank, a disputed card payment. In a retailer, a refund for a damaged order. Same three boxes.', { size: 40, wrap: 1280, in: S.swap }),
  ],
};
