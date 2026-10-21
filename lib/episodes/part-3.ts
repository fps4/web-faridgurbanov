import type { Episode } from '@/lib/storyline';

// Part 3, Data and evaluation: its episodes (FS-0010). Each episode's opening lines (`promise`) and closing card
// (`takeaway`) are written here once; the deck, the part page, the post and the YouTube description
// all read them. The script in the wiki copies them.

export const part3Episodes: Episode[] = [
  {
    number: '3.1',
    title: 'The threshold is a business decision',
    promise: [
      'why the cut-off is a question about money',
      'the four ways to be wrong, priced on one claims desk',
      'one rule that draws the line, and who signs it',
    ],
    takeaway: {
      idea: 'A model gives a score. Where you draw the line depends on what each mistake costs.',
      move: 'Price each kind of wrong answer, draw the line from those prices, and have the business owner sign it.',
      monday: 'Write down which wrong answers are unacceptable, and what each of the others costs.',
      download: 'Scorecard, blank and filled in for the claims example, with the threshold sheet',
    },
    deck: '3-1',
  },
  {
    number: '3.2',
    title: 'A demo is not evidence',
    promise: [
      'why five green ticks tell you nothing about next year',
      'the scorecard, and the baselines a model has to beat',
      'what to agree before the work, and re-run on every change',
    ],
    takeaway: {
      idea: 'A demo is not evidence. Ask: compared to what, on which cases, measured how?',
      move: 'Agree the scorecard, the baselines and the threshold before the work, and re-run it on every change.',
      monday: 'Before the next demo, ask what today’s process gets wrong, and what that costs.',
      download: 'Scorecard, blank and filled in for the claims example',
    },
    deck: '3-2',
  },
];
