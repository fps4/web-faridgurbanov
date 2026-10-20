import type { Episode } from '@/lib/storyline';

// Part 2, Choose the approach: its episodes (FS-0010). Each episode's opening lines (`promise`) and
// closing card (`takeaway`) are written here once; the deck, the part page, the post and the YouTube
// description all read them. The script in the wiki copies them.

export const part2Episodes: Episode[] = [
  {
    number: '2.1',
    title: 'Start at the bottom of the ladder',
    promise: [
      'four ways to build it, from a three-line rule up',
      'one claims product on three rungs',
      'one question to ask of every AI proposal',
    ],
    takeaway: {
      idea: 'Start at the bottom of the ladder. Climb only when the rung below fails on the scorecard.',
      move: 'Ask of every proposal: which rung is this, and why not the one below?',
      monday: 'Ask that question of the next AI proposal on your desk.',
      download: 'Approach ladder card, blank and filled in for the claims example',
    },
    deck: '2-1',
  },
  {
    number: '2.2',
    title: 'Assistant, workflow, agent',
    promise: [
      'why one word, agent, covers three different things',
      'all three in one claims product, and where the system acts',
      'the question to ask first in every vendor meeting',
    ],
    takeaway: {
      idea: 'Assistant, workflow and agent need different controls. The control follows who acts.',
      move: 'Use the three words the same way everywhere, and ask which one it is before features or price.',
      monday: 'In the next vendor meeting or proposal, ask: which of the three is this?',
      download: 'Glossary cards, say / mean / ask, in English and Dutch',
    },
    deck: '2-2',
  },
];
