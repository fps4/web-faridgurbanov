import type { Locale } from '@/lib/i18n';
import { module3Episodes } from '@/lib/episodes/module-3';
import { plan } from '@/lib/episodes/plan';

// The AI Product Design storyline (FS-0010): "an engineering perspective", six modules, each a set
// of short episodes. This module is the single list of modules and their episodes. The scripts and
// sources live in the wiki (publishing/ai-product-design/episodes/<module>/); a module's episodes
// with a deck are written out in lib/episodes/module-<n>.ts. English first: Dutch pages fall back to
// the English text with the fallback notice (ADR-0002, ADR-0010).

export const STORYLINE_SECTION = 'ai-product-design';

/**
 * An episode in one card (FS-0010): the closing slide of the episode and the text of its post.
 * Three short lines, the same three in every episode.
 */
export interface Takeaway {
  /** The idea, in one line. */
  idea: string;
  /** The move, in one line. */
  move: string;
  /** The one thing to do on Monday. */
  monday: string;
}

export interface Episode {
  /** `module.episode`, e.g. '3.1'. Episode 0 is the module's intro. */
  number: string;
  /** The wiki's id for the episode, e.g. 'data-01'. */
  id: string;
  title: string;
  /**
   * "In this episode": three short lines said early on, so a viewer arriving from a teaser knows
   * within ten seconds what they will leave with. They promise; the takeaway answers. Set once the
   * episode has a deck.
   */
  promise?: [string, string, string];
  takeaway?: Takeaway;
  /** The deck route slug under /deck, when a deck exists. */
  deck?: string;
  /** The published video, when there is one. Nothing embeds until it is set. */
  video?: { youtubeId: string; duration: string };
}

export type ModuleStatus = 'draft' | 'coming';

export interface Module {
  number: number;
  slug: string;
  title: string;
  /** What the module answers, in one line. */
  line: string;
  status: ModuleStatus;
  episodes: Episode[];
}

export const modules: Module[] = [
  {
    number: 1,
    slug: 'framing',
    title: 'Framing AI opportunities',
    line: 'AI sells predictions. Find the decision where a better prediction pays, and size what it is worth.',
    status: 'coming',
    episodes: plan(1, 'framing', [
      'Intro',
      'Prediction as the unit',
      'Is it an AI problem?',
      'The ladder of approaches',
      'Finding opportunities in a process',
      'Augment or automate',
      'The cost of being wrong',
      'Sizing the value',
      'Judging feasibility',
      'Build, buy or call an API',
      'Data advantages and moats',
      'Opportunities by sector',
      'Common traps',
    ]),
  },
  {
    number: 2,
    slug: 'ml-and-deep-learning',
    title: 'Machine learning and deep learning for product',
    line: 'What learning means, the model families worth knowing, and how to choose an approach.',
    status: 'coming',
    episodes: plan(2, 'ml', [
      'Intro',
      'What learning means',
      'Learning paradigms',
      'Task types',
      'Algorithm families',
      'Overfitting, underfitting and the bias–variance trade-off',
      'Deep learning',
      'Architectures worth recognising',
      'Transfer learning',
      'Foundation models and large language models',
      'Choosing an approach',
    ]),
  },
  {
    number: 3,
    slug: 'data-and-model-requirements',
    title: 'Data and model requirements',
    line: 'What the data has to answer, how to measure a model, and what it takes to run one.',
    status: 'coming',
    episodes: module3Episodes,
  },
  {
    number: 4,
    slug: 'human-ai-interaction',
    title: 'Human–AI interaction design',
    line: 'Design for a system that is sometimes wrong: expectations, trust, uncertainty and recovery.',
    status: 'coming',
    episodes: plan(4, 'hai', [
      'Intro',
      'What makes AI interfaces different',
      'Setting expectations',
      'Levels of automation',
      'Trust: misuse and disuse',
      'Showing uncertainty',
      'Explanations',
      'Graceful failure and recovery',
      'Capturing feedback',
      'Control and agency',
      'Generative and conversational interfaces',
      'Onboarding and cold start',
      'Prototyping and evaluating the interaction',
      'Reference sets',
    ]),
  },
  {
    number: 5,
    slug: 'risks-and-governance',
    title: 'AI product risks and governance',
    line: 'What goes wrong with AI products, what the EU AI Act asks, and a risk register you can keep.',
    status: 'coming',
    episodes: plan(5, 'risks', [
      'Intro',
      'Why AI projects fail',
      'Bias and fairness',
      'Privacy',
      'Security',
      'Robustness and reliability',
      'Transparency and accountability',
      'Regulation: the EU AI Act',
      'Governance frameworks',
      'Adoption and organisational change',
      'Sector cautions',
      'A risk register for an AI product',
    ]),
  },
  {
    number: 6,
    slug: 'process-and-proposal',
    title: 'AI product process and proposal',
    line: 'Four stages, success metrics in three layers, and a proposal a reviewer can say yes to.',
    status: 'coming',
    episodes: plan(6, 'process', [
      'Intro',
      'Four stages',
      'Success metrics, in three layers',
      'The executive summary',
      'The full proposal',
      'A worked value case',
      'Internal stakeholders versus investors',
      'Questions a good reviewer asks',
    ]),
  },
];

export function episodeByNumber(number: string): Episode | undefined {
  return modules.flatMap((m) => m.episodes).find((e) => e.number === number);
}

/** Every episode that has a deck, with its module, for the /deck routes. */
export function decks(): { module: Module; episode: Episode & { deck: string } }[] {
  return modules.flatMap((module) =>
    module.episodes.flatMap((episode) => (episode.deck ? [{ module, episode: { ...episode, deck: episode.deck } }] : [])),
  );
}

interface StorylineCopy {
  title: string;
  tagline: string;
  moduleLabel: (n: number) => string;
  episodeCount: (n: number) => string;
  inThisEpisode: string;
  takeaway: Record<keyof Takeaway, string>;
  coming: string;
  contactCta: string;
  diagramCaption: string;
}

const en: StorylineCopy = {
  title: 'AI Product Design',
  tagline: 'An engineering perspective on deciding, building and running an AI product.',
  moduleLabel: (n) => `Module ${n} of 6`,
  episodeCount: (n) => `${n} episodes`,
  inThisEpisode: 'In this episode',
  takeaway: { idea: 'The idea', move: 'The move', monday: 'On Monday' },
  coming: 'Coming',
  contactCta: 'Talk about your case',
  diagramCaption: 'From episode 3.1: six questions for every data source, drawn step by step while I talk it through.',
};

/**
 * UI copy for the section. English only, labels included, until the owner decides on Dutch
 * (ADR-0010): a Dutch route shows the English labels next to the English text.
 */
export const storylineCopy: Record<Locale, StorylineCopy> = { en, nl: en };
