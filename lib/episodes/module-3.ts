import { plan } from '@/lib/episodes/plan';
import type { Episode } from '@/lib/storyline';

// Module 3, Data and model requirements: its episodes (FS-0010). An episode with a deck has its
// opening lines (`promise`) and closing card (`takeaway`) written here once; the deck and the post
// read them. The script in the wiki (episodes/03-data/<nn>-<slug>.slides.md) opens with them and copies the card.

const titles = [
  'Intro',
  'Data requirements',
  'Labels',
  'Data quality and leakage',
  'Splits and validation',
  'Choosing metrics',
  'Thresholds and operating points',
  'Baselines',
  'Non-functional requirements',
  'From prototype to production',
  'Feedback loops',
  'People and roles',
  'What it costs',
];

const written: Record<string, Partial<Episode>> = {
  '3.0': {
    promise: [
      'why the model is the small part of an AI product',
      'the three mental models this module is built on',
      'Werkmora and the forecast we follow through the module',
    ],
    takeaway: {
      idea: 'The model is a small box in a large diagram. Most requirements for an AI product are requirements for the system around it.',
      move: 'Treat the data as the specification, give the decision to a business owner, and write monitoring and retraining down before launch.',
      monday: 'Draw the boxes around the model you work on, and write an owner next to each one.',
    },
    deck: '3-0',
  },
  '3.1': {
    promise: [
      'why a row count does not answer “enough data?”',
      'which questions to ask of every data source',
      'how to approach “data sufficiency”',
    ],
    takeaway: {
      idea: 'Enough data is six answers per source and a measurement. A row count answers none of them.',
      move: 'Ask the six questions of every source, give each answer an owner, and measure “enough” with a learning curve, per group.',
      monday: 'List the sources of the model you work on, and write the six answers for one of them.',
    },
    deck: '3-1',
  },
};

export const module3Episodes: Episode[] = plan(3, 'data', titles).map((e) => ({ ...e, ...written[e.number] }));
