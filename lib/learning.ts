import type { Locale } from '@/lib/i18n';
import { confluentCrashCourse } from '@/lib/courses/confluent-crash-course';

// The Learning section (FS-0012): free video courses, each a list of short episodes, and which
// episodes are switched on. A course and an episode show on the site only once the episode is
// switched on in RELEASED; the rest of the plan stays listed as "coming", without a page of its own.
// The scripts live in the wiki (publishing/<course>/episodes/), the labs in the course's own repo.

/**
 * The section's words under content/<locale>/learning/: `index.md` for /learning, and one file per
 * course named by its slug (`confluent-crash-course.md`).
 */
export const LEARNING_SECTION = 'learning';

/** A self-hosted episode video, as the home intro video (no third-party player, FS-0007). */
export interface EpisodeVideo {
  /** Path under public/ or an https URL. H.264/AAC in an MP4 container. */
  src: string;
  /** Poster frame shown before playback. */
  poster: string;
  /** WebVTT caption track. Required: an uncaptioned episode excludes people. */
  captions: string;
  /** Running time as shown, e.g. '8:40'. */
  duration: string;
}

export interface Episode {
  /** The episode's number in the course, '0' for the intro. */
  number: string;
  /** The route segment under the course. */
  slug: string;
  title: string;
  /** What the episode answers, in one line, for lists. */
  line: string;
  /** "In this episode": what the viewer leaves with. Required to switch the episode on. */
  promise?: string[];
  /** The questions to ask the team that runs the platform, from the episode's close. */
  questions?: string[];
  /** The module folder in the course repo that the episode explains, e.g. '08-linking-and-contracts'. */
  repoModule?: string;
  /** Required to switch the episode on. */
  video?: EpisodeVideo;
}

export interface Series {
  /** The route segment under /learning, and the content file under content/<locale>/learning/. */
  slug: string;
  title: string;
  /** What the course is about, in one line, for its card on /learning. */
  line: string;
  /** The course's size for its card while no episode is listed, e.g. '6 modules'. */
  size?: string;
  /** The public repo with the notes and labs, when the course has one. */
  repo?: string;
  episodes: Episode[];
}

export const series: Series[] = [
  confluentCrashCourse,
  {
    slug: 'ai-product-design',
    title: 'AI Product Design',
    line: 'How an AI product gets framed, built, measured and run, in six modules of short episodes.',
    size: '6 modules',
    episodes: [],
  },
  {
    slug: 'ai-product-delivery',
    title: 'AI Product Delivery',
    line: 'How software gets built when engineers work with AI agents: the engineer, the team, the rhythm, the pipeline and the organisation around them.',
    size: '8 modules',
    episodes: [],
  },
];

/**
 * The episodes switched on, by number, per course. Add an episode's number once its video is
 * published: its page appears, and the course's card links to it. Remove the number to take it down
 * again. `lib/learning.test.ts` fails on a number the course does not have, and on an episode
 * without its video or its "In this episode" lines.
 * A production build still shows nothing WHILE `LEARNING_PUBLISHED` is false (lib/site.ts).
 */
export const RELEASED: Record<string, string[]> = {
  'confluent-crash-course': [],
  'ai-product-design': [],
  'ai-product-delivery': [],
};

/**
 * Under `next dev` every planned episode gets a page, marked as a preview, so a page can be checked
 * before its video exists. A production build only ever renders switched-on episodes.
 */
export function previewing(env: string | undefined = process.env.NODE_ENV): boolean {
  return env === 'development';
}

export function seriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}

export function isReleased(s: Series, episode: Episode): boolean {
  return (RELEASED[s.slug] ?? []).includes(episode.number);
}

/** A course's switched-on episodes, in order. */
export function releasedEpisodes(s: Series): Episode[] {
  return s.episodes.filter((e) => isReleased(s, e));
}

/** A course opens (gets a page, a link from /learning) once one of its episodes is switched on. */
export function seriesIsOpen(s: Series): boolean {
  return releasedEpisodes(s).length > 0;
}

/** The episodes that get a page: the switched-on ones, or every planned one while previewing. */
export function pagedEpisodes(s: Series, preview: boolean = previewing()): Episode[] {
  return preview ? s.episodes : releasedEpisodes(s);
}

/** Whether a course gets a page: it is open, or it has planned episodes and we are previewing. */
export function seriesHasPage(s: Series, preview: boolean = previewing()): boolean {
  return pagedEpisodes(s, preview).length > 0;
}

/** Paths under the locale segment, for hrefFor(). */
export const learningPath = {
  index: '/learning',
  series: (s: Series) => `/learning/${s.slug}`,
  episode: (s: Series, e: Episode) => `/learning/${s.slug}/${e.slug}`,
};

/** The published paths for the sitemap: nothing until the section is published and a course is open. */
export function learningSitemapPaths(published: boolean): string[] {
  if (!published) return [];
  return [
    learningPath.index,
    ...series
      .filter((s) => seriesIsOpen(s))
      .flatMap((s) => [learningPath.series(s), ...releasedEpisodes(s).map((e) => learningPath.episode(s, e))]),
  ];
}

interface LearningCopy {
  title: string;
  coming: string;
  preview: string;
  previewTag: string;
  /** The episodes a course has out, of its planned total. */
  episodeCount: (out: number, total: number) => string;
  episodeLabel: (number: string) => string;
  episodes: string;
  outNow: string;
  openSeries: string;
  inThisEpisode: string;
  questions: string;
  questionsIntro: string;
  inTheRepo: string;
  notes: string;
  lab: string;
  repoCta: string;
  videoComing: string;
  duration: string;
  previous: string;
  next: string;
}

const en: LearningCopy = {
  title: 'Learning',
  coming: 'Coming',
  preview: 'Preview: not released yet. Only the dev server shows this page.',
  previewTag: 'Preview',
  episodeCount: (out, total) => (out ? `${out} of ${total} episodes out` : `${total} episodes`),
  episodeLabel: (number) => `Episode ${number}`,
  episodes: 'Episodes',
  outNow: 'Out now',
  openSeries: 'Open the course',
  inThisEpisode: 'In this episode',
  questions: 'Questions to ask',
  questionsIntro: 'For the team that runs the platform, before you design this.',
  inTheRepo: 'In the repo',
  notes: 'Notes',
  lab: 'Lab',
  repoCta: 'Notes and labs on GitHub',
  videoComing: 'The video for this episode is not out yet.',
  duration: 'Running time',
  previous: 'Previous',
  next: 'Next',
};

/** UI copy for the section. English only for now; Dutch routes show the English text. */
export const learningCopy: Record<Locale, LearningCopy> = { en, nl: en };
