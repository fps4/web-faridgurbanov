import type { Episode } from '@/lib/storyline';

// Part 5, Design for people: its episodes (FS-0010). Each episode's opening lines (`promise`) and
// closing card (`takeaway`) are written here once; the deck, the part page, the post and the YouTube
// description all read them. The script in the wiki copies them.

export const part5Episodes: Episode[] = [
  {
    number: '5.1',
    title: 'Design for the day it is wrong',
    promise: [
      'why the day it is wrong decides the product',
      'one claim, shown two ways when the check is wrong',
      'three questions for every step, and a card to fill in',
    ],
    takeaway: {
      idea: 'Every AI feature will be wrong for someone. The product is what happens then.',
      move: 'Design the error case first: visible, cheap to fix, and a correction that teaches.',
      monday: 'Ask of the feature closest to going live: what does the customer see when it is wrong?',
      download: 'Automation and failure card, blank and filled in for the claims example',
    },
    deck: '5-1',
  },
  {
    number: '5.2',
    title: 'Automation is a dial',
    promise: [
      'why “human in the loop” is a slogan, and a dial is a design',
      'six steps of one claims desk, with the dial set for each',
      'a test week with known errors in, before you launch',
    ],
    takeaway: {
      idea: 'Automation is a dial, set per step. Trust each step as much as it deserves.',
      move: 'Set the level and the approver for every step, then test with known errors in.',
      monday: 'Mark the level for each step of your candidate, and circle the one you are least sure of.',
      download: 'Automation and failure card, with the seeded-error week on its back',
    },
    deck: '5-2',
  },
];
