import { plan } from '@/lib/episodes/plan';
import type { Episode } from '@/lib/storyline';

// Module 3, Data and model requirements: its episodes (FS-0010). An episode with a deck has its
// opening lines (`promise`) and closing card (`takeaway`) written here once; the deck and the post
// read them. The script in the wiki (episodes/data/<nn>-<slug>.script.md) opens with them and copies the card.

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
  '3.1': {
    promise: [
      'why a row count does not answer “enough data?”',
      'six questions to ask of every data source',
      'how to measure “enough”',
    ],
    takeaway: {
      idea: 'Enough data is six answers per source and a measurement. A row count answers none of them.',
      move: 'Ask the six questions of every source, give each answer an owner, and measure “enough” with a learning curve on a pilot.',
      monday: 'List the sources of the model you work on, and write the six answers for one of them.',
    },
    deck: '3-1',
  },
};

export const module3Episodes: Episode[] = plan(3, 'data', titles).map((e) => ({ ...e, ...written[e.number] }));
