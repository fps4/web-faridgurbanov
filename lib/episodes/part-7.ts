import type { Episode } from '@/lib/storyline';

// Part 7, Process and proposal: its episodes (FS-0010). Each episode's opening lines (`promise`) and
// closing card (`takeaway`) are written here once; the deck, the part page, the post and the YouTube
// description all read them. The script in the wiki copies them.

export const part7Episodes: Episode[] = [
  {
    number: '7.1',
    title: 'Buy information before you buy software',
    promise: [
      'why so many AI pilots wait for a decision nobody wrote down',
      'four stages, each with a gate written before it starts',
      'the number that breaks the case, and a one-page ask',
    ],
    takeaway: {
      idea: 'Buy information before you buy software: each stage is a cheap test of one question.',
      move: 'Write the gate before the stage, and ask for the next stage only.',
      monday: 'Write the stop criteria for the stage you are in now.',
      download: 'One-page proposal, blank and filled in for the claims example',
    },
    deck: '7-1',
  },
  {
    number: '7.2',
    title: 'The first quarter',
    promise: [
      'why most AI plans stall: everyone is waiting for someone',
      'four roles moving at the same time, kept in step by two gates',
      'twelve weeks at the insurer, and a plan to fill in on Monday',
    ],
    takeaway: {
      idea: 'Four roles move at the same time; the gates keep them in step.',
      move: 'Before week one, put a name, an output and a date in every cell.',
      monday: 'Put names against weeks one and two.',
      download: 'First-quarter plan, blank and filled in for the claims example',
    },
    deck: '7-2',
  },
];
