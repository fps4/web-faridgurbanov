import type { Episode } from '@/lib/storyline';

// Part 6, Risk and governance: its episodes (FS-0010). Each episode's opening lines (`promise`) and
// closing card (`takeaway`) are written here once; the deck, the part page, the post and the YouTube
// description all read them. The script in the wiki copies them.

export const part6Episodes: Episode[] = [
  {
    number: '6.1',
    title: 'Risk follows the use, not the model',
    promise: [
      'why compliance meets the product three months too late',
      'where the AI Act’s line runs through one insurer',
      'one register, eight rows, an owner for each',
    ],
    takeaway: {
      idea: 'Risk follows the use, not the model. Below the high-risk line is still regulated.',
      move: 'Place the use in its tier the day it gets a name, and keep one register per product.',
      monday: 'Put your candidate in a tier, and name the person who owns its register.',
      download: 'AI product risk register, blank and filled in for the claims example',
    },
    deck: '6-1',
  },
  {
    number: '6.2',
    title: 'You already have this obligation',
    promise: [
      'the change rule financial firms already have',
      'what coding agents do to the evidence for it',
      'one workflow mapped to your change process, in three questions',
    ],
    takeaway: {
      idea: 'Agents don’t create your change-approval obligation. They make it harder to evidence.',
      move: 'Start from the obligation you hold: map one AI workflow to identity, approval and record.',
      monday: 'Map one AI workflow to your change process.',
      download: 'Control map, blank and filled in for the claims example',
    },
    deck: '6-2',
  },
];
