import type { Locale } from '@/lib/i18n';
import { modules as designModules, type Episode, type Module } from '@/lib/storyline';

// The Learning section (FS-0012): the video series, each a set of modules of short episodes, and
// which episodes are switched on. A series, module or episode shows on the site only once something
// in it is switched on in RELEASED; the rest of the plan stays listed as "coming" where a page lists
// it, without a page of its own. The scripts and sources of each series live in the wiki
// (publishing/<series>/).

/**
 * The section's words under content/<locale>/learning/: `index.md` for /learning, and one file per
 * series named by its slug (`ai-product-design.md`), one band per `## ` heading (lib/landing.ts).
 */
export const LEARNING_SECTION = 'learning';

export interface Series {
  /** The route segment under /learning, and the content folder under content/<locale>/learning/. */
  slug: string;
  title: string;
  /** What the series is about, in one line, for its card on /learning. */
  line: string;
  modules: Module[];
}

// AI Product Delivery: how software gets built when engineers work with AI agents (the wiki's
// publishing/delivering-with-agents/). Eight modules; the episodes are added as they are planned.
const deliveryModules: Module[] = [
  ['what-changes', 'What changes with agents', 'Where the bottleneck moves when an agent writes the code, and the one thing that is settled: a named person answers for the result.'],
  ['working-with-an-agent', 'Working with an agent', 'What the agent knows, specs and small steps, tests as the contract, and reviewing what it writes.'],
  ['the-team', 'The team', 'What a team holds that one person with agents does not, and six team shapes side by side.'],
  ['the-rhythm', 'The rhythm', 'Which ceremonies stay, what happens to estimates, and how to keep the review queue short.'],
  ['the-delivery-system', 'The delivery system', 'The rules for one agent change: an identity for every agent, who approves, and what merges by itself.'],
  ['the-agent-platform', 'The agent platform', 'The shared infrastructure that makes those rules cheap to follow, and who pays for it.'],
  ['the-organisation', 'The organisation', 'An AI stance, who decides which work agents may do, roles that move, and the budget moving to tokens.'],
  ['measure-and-choose', 'Measure and choose', 'Putting the operating model together, and running the experiment on your own work.'],
].map(([slug, title, line], i) => ({ number: i + 1, slug, title, line, episodes: [] }));

export const series: Series[] = [
  {
    slug: 'ai-product-design',
    title: 'AI Product Design',
    line: 'How an AI product gets framed, built, measured and run, in six modules of short episodes.',
    modules: designModules,
  },
  {
    slug: 'ai-product-delivery',
    title: 'AI Product Delivery',
    line: 'How software gets built when engineers work with AI agents: the engineer, the team, the rhythm, the pipeline and the organisation around them.',
    modules: deliveryModules,
  },
];

/**
 * The episodes switched on, by number, per series. Add an episode's number when it is recorded and
 * should go out: its page appears, its module opens, and the series' card links to it. Remove the
 * number to take it down again. `lib/learning.test.ts` fails on a number the series does not have.
 * A production build still shows nothing WHILE `LEARNING_PUBLISHED` is false (lib/site.ts).
 */
export const RELEASED: Record<string, string[]> = {
  'ai-product-design': ['3.1'],
  'ai-product-delivery': [],
};

export function seriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}

export function isReleased(s: Series, episode: Episode): boolean {
  return (RELEASED[s.slug] ?? []).includes(episode.number);
}

/** A module's switched-on episodes, in order. */
export function releasedEpisodes(s: Series, module: Module): Episode[] {
  return module.episodes.filter((e) => isReleased(s, e));
}

/** A module opens (gets a page, a link) once one of its episodes is switched on. */
export function moduleIsOpen(s: Series, module: Module): boolean {
  return releasedEpisodes(s, module).length > 0;
}

export function openModules(s: Series): Module[] {
  return s.modules.filter((m) => moduleIsOpen(s, m));
}

/** A series opens (gets a page, a link from /learning) once one of its episodes is switched on. */
export function seriesIsOpen(s: Series): boolean {
  return openModules(s).length > 0;
}

/** Every switched-on episode of a series, with its module, in the order of the plan. */
export function releasedInSeries(s: Series): { module: Module; episode: Episode }[] {
  return s.modules.flatMap((module) => releasedEpisodes(s, module).map((episode) => ({ module, episode })));
}

/** Whether the episode with this deck is switched on, in any series. */
export function deckIsReleased(deck: string): boolean {
  return series.some((s) => s.modules.some((m) => m.episodes.some((e) => e.deck === deck && isReleased(s, e))));
}

/** An episode's route segment: its title, lower case, words joined by dashes ('Data requirements' → 'data-requirements'). */
export function episodeSlug(episode: Episode): string {
  return episode.title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Paths under the locale segment, for hrefFor(). */
export const learningPath = {
  index: '/learning',
  series: (s: Series) => `/learning/${s.slug}`,
  module: (s: Series, m: Module) => `/learning/${s.slug}/${m.slug}`,
  episode: (s: Series, m: Module, e: Episode) => `/learning/${s.slug}/${m.slug}/${episodeSlug(e)}`,
};

interface LearningCopy {
  title: string;
  coming: string;
  /** The episodes a module or series has out, of its planned total. */
  episodeCount: (out: number, total: number) => string;
  /** The planned episodes not out yet, under a module's list. */
  moreComing: (n: number) => string;
  moduleCount: (n: number) => string;
  moduleLabel: (n: number) => string;
  episodeLabel: (number: string) => string;
  outNow: string;
  watch: (number: string) => string;
  openSeries: string;
  slides: string;
  slidesCta: string;
  previous: string;
  next: string;
}

const en: LearningCopy = {
  title: 'Learning',
  coming: 'Coming',
  episodeCount: (out, total) => (out ? `${out} of ${total} episodes out` : `${total} episodes`),
  moreComing: (n) => (n === 1 ? '1 more episode coming' : `${n} more episodes coming`),
  moduleCount: (n) => `${n} modules`,
  moduleLabel: (n) => `Module ${n}`,
  episodeLabel: (number) => `Episode ${number}`,
  outNow: 'Out now',
  watch: (number) => `Open episode ${number}`,
  openSeries: 'Open the series',
  slides: 'The slides',
  slidesCta: 'Step through the slides',
  previous: 'Previous',
  next: 'Next',
};

/** UI copy for the section. English only, labels included, as the storyline's (ADR-0010). */
export const learningCopy: Record<Locale, LearningCopy> = { en, nl: en };
