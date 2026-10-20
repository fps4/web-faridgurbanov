import type { Episode } from '@/lib/storyline';

// Part 1, Frame the decision: its episodes (FS-0010). Each episode's opening lines (`promise`) and
// closing card (`takeaway`) are written here once; the deck, the part page, the post and the YouTube
// description all read them. The script in the wiki copies them.

export const part1Episodes: Episode[] = [
  {
    number: '1.1',
    title: 'Fund one decision, not more seats',
    promise: [
      'why more seats don\u2019t add up to a capability',
      'the three parts of a decision, on one claims desk',
      'one move, and a canvas to use on Monday',
    ],
    takeaway: {
      idea: 'AI sells predictions, not decisions. Judgement and action stay with you.',
      move: 'Fund one decision, with an owner, data, a budget and a result someone measures.',
      monday: 'Name three decisions in your area where waiting for information is the cost.',
      download: 'Use-case canvas, blank and filled in for the claims example',
    },
    deck: '1-1',
  },
  {
    number: '1.2',
    title: 'Picking the first one',
    promise: [
      'the baseline that decides it: today\u2019s process, with its mistakes',
      'three candidates at the insurer, scored two ways',
      'why one goes first, and how to write down why the others wait',
    ],
    takeaway: {
      idea: 'The baseline is today\u2019s process, errors included. Value and feasibility are separate scores.',
      move: 'Price today, score value and feasibility separately, pick one and write down why the others wait.',
      monday: 'Score the three decisions you named on the canvas, against today.',
      download: 'Use-case canvas, the scoring half, filled in for three candidates',
    },
  },
];
