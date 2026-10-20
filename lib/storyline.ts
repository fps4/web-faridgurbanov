import type { Locale } from '@/lib/i18n';

// The AI Product Design storyline (FS-0010): eight parts, published one at a time. This module is
// the single list of parts, their episodes and their downloads. The chapter text of a part lives in
// content/en/ai-product-design/<slug>.md; everything a part page shows around that text comes from
// here. English first: Dutch pages fall back to the English text with the fallback notice
// (ADR-0002, ADR-0010).

export const STORYLINE_SECTION = 'ai-product-design';

/** The kit: every download as a Markdown source, the running case as data, and whosigns. */
export const KIT_REPO = 'https://github.com/fps4/ai-product-design-kit';

export function kitFileUrl(path: string): string {
  return `${KIT_REPO}/blob/main/${path}`;
}

export interface Episode {
  /** `part.episode`, e.g. '1.1'. */
  number: string;
  title: string;
  /** One line: the step the episode carries. */
  line: string;
  /** The deck route slug under /deck, when a deck exists. */
  deck?: string;
  /** The published video, when there is one. Nothing embeds until it is set. */
  video?: { youtubeId: string; duration: string };
}

export interface Download {
  title: string;
  line: string;
  /** Kit paths. A part's downloads ship blank and, where marked, filled in for the running case. */
  blank: string;
  filled?: { label: string; path: string };
}

export type PartStatus = 'draft' | 'coming';

export interface Part {
  number: number;
  slug: string;
  title: string;
  /** The question the part answers, as a reader would ask it. */
  line: string;
  /** `draft`: has a page (shown while the storyline renders). `coming`: listed, not linked. */
  status: PartStatus;
  episodes: Episode[];
  downloads: Download[];
}

export const parts: Part[] = [
  {
    number: 1,
    slug: '1-frame-the-decision',
    title: 'Frame the decision',
    line: 'Find the one decision where the prediction is the slow part, price what today costs, and fund that.',
    status: 'draft',
    episodes: [
      {
        number: '1.1',
        title: 'Fund one decision, not more seats',
        line: 'A capability is one decision made better, with an owner, data, a budget and a result.',
        deck: '1-1',
      },
      {
        number: '1.2',
        title: 'Picking the first one',
        line: 'Score value and feasibility separately, against today’s process with its errors priced.',
      },
    ],
    downloads: [
      {
        title: 'Use-case canvas',
        line: 'One page to choose and frame the first use case.',
        blank: 'parts/1-frame-the-decision/use-case-canvas.md',
        filled: {
          label: 'filled in for the claims example',
          path: 'parts/1-frame-the-decision/use-case-canvas.claims.md',
        },
      },
      {
        title: 'Vendor question list',
        line: 'Before you switch on, or buy, an AI capability.',
        blank: 'parts/1-frame-the-decision/vendor-question-list.md',
        filled: {
          label: 'filled in for a switched-off triage module',
          path: 'parts/1-frame-the-decision/vendor-question-list.claims.md',
        },
      },
    ],
  },
  coming(2, '2-choose-the-approach', 'Choose the approach', 'Start at the bottom of the ladder, and know whether you are buying an assistant, a workflow or an agent.'),
  coming(3, '3-data-and-evaluation', 'Data and evaluation', 'The threshold is a business decision, and a demo is not evidence.'),
  coming(4, '4-make-it-run', 'Make it run', 'The model is one box of nine. Why pilots stay pilots, and the gates that let them go live.'),
  coming(5, '5-design-for-people', 'Design for people', 'Design for the day it is wrong, and set the automation level per step.'),
  coming(6, '6-risk-and-governance', 'Risk and governance', 'Risk follows the use of a model, and some of the obligations are ones you already have.'),
  coming(7, '7-process-and-proposal', 'Process and proposal', 'Buy information before you buy software: stages, gates and a one-page proposal.'),
  coming(8, '8-building-with-agents', 'Building it with agents', 'From personal copilot to organizational capability: the brief, the review queue, and who signs.'),
];

function coming(number: number, slug: string, title: string, line: string): Part {
  return { number, slug, title, line, status: 'coming', episodes: [], downloads: [] };
}

export function partBySlug(slug: string): Part | undefined {
  return parts.find((p) => p.slug === slug);
}

/** Parts with a page. `coming` parts are listed on the index but have no route yet. */
export function partsWithPages(): Part[] {
  return parts.filter((p) => p.status !== 'coming');
}

/** Every episode that has a deck, with its part, for the /deck routes. */
export function decks(): { part: Part; episode: Episode & { deck: string } }[] {
  return parts.flatMap((part) =>
    part.episodes.flatMap((episode) => (episode.deck ? [{ part, episode: { ...episode, deck: episode.deck } }] : [])),
  );
}

/** UI copy for the section. Short labels only; the storyline's prose is English-first (ADR-0010). */
export const storylineCopy: Record<
  Locale,
  {
    title: string;
    tagline: string;
    partLabel: (n: number) => string;
    episodes: string;
    downloads: string;
    blank: string;
    videoComing: string;
    coming: string;
    kit: string;
    back: string;
  }
> = {
  en: {
    title: 'AI Product Design',
    tagline: 'From a costly decision to an AI product people trust.',
    partLabel: (n) => `Part ${n} of 8`,
    episodes: 'Episodes',
    downloads: 'Downloads',
    blank: 'Blank',
    videoComing: 'Video coming',
    coming: 'Coming',
    kit: 'All downloads, as editable sources, in the kit',
    back: 'All parts',
  },
  nl: {
    title: 'AI Product Design',
    tagline: 'Van een kostbare beslissing naar een AI-product dat mensen vertrouwen.',
    partLabel: (n) => `Deel ${n} van 8`,
    episodes: 'Afleveringen',
    downloads: 'Downloads',
    blank: 'Leeg',
    videoComing: 'Video volgt',
    coming: 'Volgt',
    kit: 'Alle downloads, als bewerkbare bronnen, in de kit',
    back: 'Alle delen',
  },
};
