import type { Episode } from '@/lib/storyline';

// Part 4, Make it run: its episodes (FS-0010). Each episode's opening lines (`promise`) and closing card
// (`takeaway`) are written here once; the deck, the part page, the post and the YouTube description
// all read them. The script in the wiki copies them.

export const part4Episodes: Episode[] = [
  {
    number: '4.1',
    title: 'An AI system in one picture',
    promise: [
      'why the model is one box of nine',
      'nine layers, drawn on one claims fast track',
      'an owner on every layer, before anyone builds',
    ],
    takeaway: {
      idea: 'The model is a small part of an AI system. The layers around it carry the cost and the risk.',
      move: 'Draw every use case on the same nine layers, give each an owner, and build the shared ones once.',
      monday: 'Draw your candidate on the nine layers and write a name next to each one.',
      download: 'Reference architecture, blank and drawn for the claims example',
    },
    deck: '4-1',
  },
  {
    number: '4.2',
    title: 'Why pilots stay pilots',
    promise: [
      'why a pilot that works never goes live',
      'eight gates, run on the claims fast track',
      'one rule: budget the work, or stop',
    ],
    takeaway: {
      idea: 'A pilot proves the model. Going live depends on the eight layers the pilot never covered.',
      move: 'Run the same eight gates before the pilot and before go-live. Budget the work for each gate that fails, or stop.',
      monday: 'Run the eight gates on the pilot you have now. Write down the work and its cost, or write stop.',
      download: 'Readiness scorecard, blank and filled in for the claims example',
    },
    deck: '4-2',
  },
];
