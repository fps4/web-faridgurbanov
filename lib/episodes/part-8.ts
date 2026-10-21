import type { Episode } from '@/lib/storyline';

// Part 8, Building it with agents: its episodes (FS-0010). Each episode's opening lines (`promise`)
// and closing card (`takeaway`) are written here once; the deck, the part page, the post and the
// YouTube description all read them. The script in the wiki copies them.

export const part8Episodes: Episode[] = [
  {
    number: '8.1',
    title: 'It doesn’t ask. It guesses.',
    promise: [
      'why a vague brief now comes back as finished, wrong work',
      'four things an agent could build from one line, at the insurer',
      'a brief in four parts, and six questions to check it',
    ],
    takeaway: {
      idea: 'An agent does not ask. It guesses, and what comes back looks finished.',
      move: 'Write every brief in four parts: user, constraint, acceptance criteria, metric.',
      monday: 'Check one brief that is live in your team against the six failures.',
      download: 'Brief template and six-failure checklist, with the claims brief filled in',
    },
    deck: '8-1',
  },
  {
    number: '8.2',
    title: 'Is review our bottleneck?',
    promise: [
      'where the time goes when agents write the code',
      'three numbers that show it on your own repositories',
      'a one-page readout for your sponsor, and one experiment',
    ],
    takeaway: {
      idea: 'Writing got cheap. Checking did not, so the queue in front of review grows.',
      move: 'Measure the wait, the queue and the size of changes, per team, then test one change.',
      monday: 'Pick one quarter before and one recent quarter, and run it on two teams.',
      download: 'Review-bottleneck check, one-page readout and experiment card',
    },
    deck: '8-2',
  },
];
