import type { Frontmatter } from '@/lib/frontmatter';
import type { Locale } from '@/lib/i18n';

// The Practice section's model (FS-0013), framework-free and safe to import from a client island:
// the three kinds, the tag vocabularies, the entry validators, the list order and the filter.
// lib/practice.ts loads the files and re-exports all of this.
//
// - Guidelines (G-NN): the standing rules, under content/<locale>/practice/guidelines/.
// - Patterns (P-NN): reusable solutions to a recurring problem, under …/practice/patterns/.
// - Articles: the dated pieces, under …/practice/articles/ (FS-0006).
//
// Guidelines and patterns are "entries": numbered, ordered by an explicit `order`, revised in
// place. Every item carries `topics` (one or more) and `tech` (zero or more) from the vocabularies
// below, so a typo fails `npm run test` and the build instead of adding a filter chip of its own.

export const ARTICLES_SECTION = 'practice/articles';

export const ENTRY_KINDS = {
  guideline: { section: 'practice/guidelines', prefix: 'G', route: 'guidelines' },
  pattern: { section: 'practice/patterns', prefix: 'P', route: 'patterns' },
} as const;
export type EntryKind = keyof typeof ENTRY_KINDS;
export const KINDS = ['guideline', 'pattern', 'article'] as const;
export type Kind = (typeof KINDS)[number];

/** What an item is about. Labels per locale; the key is what frontmatter and the URL carry. */
export const TOPICS = {
  architecture: { en: 'Architecture practice', nl: 'Architectuurpraktijk' },
  adoption: { en: 'Adoption & delivery', nl: 'Adoptie en delivery' },
  'data-platforms': { en: 'Data platforms', nl: 'Dataplatforms' },
  integration: { en: 'Integration', nl: 'Integratie' },
  governance: { en: 'Governance & compliance', nl: 'Governance en compliance' },
  ai: { en: 'AI', nl: 'AI' },
  cost: { en: 'Cost', nl: 'Kosten' },
} as const satisfies Record<string, Record<Locale, string>>;
export type Topic = keyof typeof TOPICS;

/** The technology an item works with in substance (a passing mention does not earn a tag). */
export const TECH = {
  sap: 'SAP',
  snowflake: 'Snowflake',
  databricks: 'Databricks',
  fabric: 'Microsoft Fabric',
  azure: 'Azure',
  'knowledge-graphs': 'Knowledge graphs',
  mcp: 'MCP',
} as const;
export type Tech = keyof typeof TECH;

export const ENTRY_STATUSES = ['current', 'revised', 'retired'] as const;
export type EntryStatus = (typeof ENTRY_STATUSES)[number];

/** Listing card and meta description share it, so it stays short enough for both. */
export const SUMMARY_MAX = 140;

const ID_RE = /^[GP]-\d{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** A related entry is another entry's id, or a page of the site by section and slug. */
const RELATED_PAGE_RE = /^(work|expertise|practice\/articles)\/[a-z0-9-]+$/;

export interface Tags {
  topics: Topic[];
  tech: Tech[];
}

export interface EntryMeta extends Tags {
  kind: EntryKind;
  slug: string;
  id: string;
  order: number;
  title: string;
  summary: string;
  status: EntryStatus;
  revised: string;
  supersedes?: string;
  related: string[];
}

export interface Entry extends EntryMeta {
  body: string;
  isFallback: boolean;
}

/** One row of the Practice list, whatever its kind. Serialisable: it is handed to a client island. */
export interface PracticeItem extends Tags {
  kind: Kind;
  /** Path under the locale, e.g. /practice/patterns/policy-compiler. */
  href: string;
  /** G-01 / P-03 for entries; absent for articles. */
  id?: string;
  /** ISO date: `date` for an article, `revised` for an entry. */
  date: string;
  title: string;
  summary: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const list = (v: unknown) => (Array.isArray(v) ? v : []);

/** Read an item's tags off its frontmatter. Validation is separate (validateTags). */
export function toTags(data: Frontmatter): Tags {
  return { topics: list(data.topics) as Topic[], tech: list(data.tech) as Tech[] };
}

/** The problems with an item's tags: at least one topic, and every tag from the vocabularies. */
export function validateTags(where: string, tags: Tags): string[] {
  const errors: string[] = [];
  if (tags.topics.length === 0) errors.push('needs at least one topic');
  for (const t of tags.topics) if (!(t in TOPICS)) errors.push(`topic "${t}" is not one of ${Object.keys(TOPICS).join(', ')}`);
  for (const t of tags.tech) if (!(t in TECH)) errors.push(`tech "${t}" is not one of ${Object.keys(TECH).join(', ')}`);
  return errors.map((e) => `${where}: ${e}`);
}

/** Read an entry's fields off its frontmatter. Validation is separate (validateEntry). */
export function toEntryMeta(kind: EntryKind, slug: string, data: Frontmatter): EntryMeta {
  return {
    kind,
    slug,
    id: str(data.id),
    order: typeof data.order === 'number' ? data.order : Number.NaN,
    title: str(data.title),
    summary: str(data.summary),
    status: str(data.status) as EntryStatus,
    revised: str(data.revised),
    supersedes: str(data.supersedes) || undefined,
    related: list(data.related),
    ...toTags(data),
  };
}

/** The problems with one entry's fields; empty when it is publishable. */
export function validateEntry(e: EntryMeta): string[] {
  const errors: string[] = [];
  const prefix = ENTRY_KINDS[e.kind].prefix;
  if (!ID_RE.test(e.id) || !e.id.startsWith(`${prefix}-`)) errors.push(`id "${e.id}" is not of the form ${prefix}-01`);
  if (!Number.isInteger(e.order) || e.order < 1) errors.push('order must be a positive whole number');
  if (!e.title) errors.push('title is missing');
  if (!e.summary) errors.push('summary is missing');
  if (e.summary.length > SUMMARY_MAX) errors.push(`summary is ${e.summary.length} characters (max ${SUMMARY_MAX})`);
  if (!ENTRY_STATUSES.includes(e.status)) errors.push(`status "${e.status}" is not one of ${ENTRY_STATUSES.join(', ')}`);
  if (!DATE_RE.test(e.revised)) errors.push(`revised "${e.revised}" is not a YYYY-MM-DD date`);
  if (e.supersedes !== undefined && !e.supersedes.startsWith(`${prefix}-`)) errors.push(`supersedes "${e.supersedes}" is not a ${e.kind} id`);
  for (const r of e.related) {
    if (!ID_RE.test(r) && !RELATED_PAGE_RE.test(r)) errors.push(`related "${r}" is neither an entry id nor work/, expertise/ or practice/articles/<slug>`);
  }
  return [...errors.map((x) => `${e.slug}: ${x}`), ...validateTags(e.slug, e)];
}

/** The problems across all entries: ids unique, orders unique per kind, every id pointed at exists. */
export function validateEntrySet(entries: EntryMeta[]): string[] {
  const errors = entries.flatMap(validateEntry);
  const ids = new Set<string>();
  const orders = new Set<string>();
  for (const e of entries) {
    if (ids.has(e.id)) errors.push(`${e.slug}: id ${e.id} is used twice`);
    if (orders.has(`${e.kind}:${e.order}`)) errors.push(`${e.slug}: ${e.kind} order ${e.order} is used twice`);
    ids.add(e.id);
    orders.add(`${e.kind}:${e.order}`);
  }
  for (const e of entries) {
    for (const ref of [...(e.supersedes ? [e.supersedes] : []), ...e.related.filter((r) => ID_RE.test(r))]) {
      if (ref === e.id) errors.push(`${e.slug}: points at itself`);
      else if (!ids.has(ref)) errors.push(`${e.slug}: ${ref} does not exist`);
    }
  }
  return errors;
}

export function entryHref(e: Pick<EntryMeta, 'kind' | 'slug'>): string {
  return `/practice/${ENTRY_KINDS[e.kind].route}/${e.slug}`;
}

/** The entries either side of `slug` in reading order. */
export function neighbours<T extends { slug: string }>(entries: T[], slug: string): { prev?: T; next?: T } {
  const i = entries.findIndex((e) => e.slug === slug);
  if (i === -1) return {};
  return { prev: entries[i - 1], next: entries[i + 1] };
}

/** The list order: guidelines, then patterns, each by `order`; then articles, newest first. */
export function buildList(entries: EntryMeta[], articles: PracticeItem[]): PracticeItem[] {
  const rank = (k: Kind) => KINDS.indexOf(k);
  const sorted = [...entries].sort((a, b) => rank(a.kind) - rank(b.kind) || a.order - b.order);
  return [
    ...sorted.map((e) => ({ kind: e.kind, href: entryHref(e), id: e.id, date: e.revised, title: e.title, summary: e.summary, topics: e.topics, tech: e.tech })),
    ...[...articles].sort((a, b) => b.date.localeCompare(a.date)),
  ];
}

export interface Filter {
  kind?: Kind;
  topic?: Topic;
  tech?: Tech;
}

/** Items matching every set facet (one value per facet; an unset facet matches everything). */
export function filterItems(items: PracticeItem[], f: Filter): PracticeItem[] {
  return items.filter(
    (i) => (!f.kind || i.kind === f.kind) && (!f.topic || i.topics.includes(f.topic)) && (!f.tech || i.tech.includes(f.tech)),
  );
}

/** Read a filter from a query string, dropping anything that is not a known value. */
export function parseFilter(search: string): Filter {
  const q = new URLSearchParams(search);
  const kind = q.get('kind');
  const topic = q.get('topic');
  const tech = q.get('tech');
  return {
    ...(kind && (KINDS as readonly string[]).includes(kind) ? { kind: kind as Kind } : {}),
    ...(topic && topic in TOPICS ? { topic: topic as Topic } : {}),
    ...(tech && tech in TECH ? { tech: tech as Tech } : {}),
  };
}

/** The query string for a filter ('' when nothing is set), in a fixed key order. */
export function filterQuery(f: Filter): string {
  const q = new URLSearchParams();
  if (f.kind) q.set('kind', f.kind);
  if (f.topic) q.set('topic', f.topic);
  if (f.tech) q.set('tech', f.tech);
  const s = q.toString();
  return s ? `?${s}` : '';
}

/** The topics and technologies the items use, in vocabulary order: the chips worth showing. */
export function usedTags(items: PracticeItem[]): Tags {
  return {
    topics: (Object.keys(TOPICS) as Topic[]).filter((t) => items.some((i) => i.topics.includes(t))),
    tech: (Object.keys(TECH) as Tech[]).filter((t) => items.some((i) => i.tech.includes(t))),
  };
}

/** Entries that name `ref` (e.g. practice/articles/<slug>) in their `related`: what was drawn from it. */
export function entriesCiting(entries: EntryMeta[], ref: string): EntryMeta[] {
  return entries.filter((e) => e.related.includes(ref));
}
