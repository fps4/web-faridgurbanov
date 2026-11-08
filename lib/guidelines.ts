import { getEntry, listSection, sectionSlugs, title as fmTitle } from '@/lib/content';
import type { Frontmatter } from '@/lib/frontmatter';
import type { Locale } from '@/lib/i18n';

// The Practice section's guidelines (FS-0013): the standing rules, one markdown file each under
// content/<locale>/practice/guidelines/, ordered by an explicit `order` (a reference set, not a
// feed). A malformed guideline throws at build time, so `next build` fails rather than render a
// page with a missing badge or a dangling "related" link. Server-only (it reads the filesystem
// through lib/content.ts); the validators and prev/next are pure and unit-tested.

export const ARTICLES_SECTION = 'practice/articles';
export const GUIDELINES_SECTION = 'practice/guidelines';

export const GUIDELINE_STATUSES = ['current', 'revised', 'retired'] as const;
export type GuidelineStatus = (typeof GUIDELINE_STATUSES)[number];

/** Listing card and meta description share it, so it stays short enough for both. */
export const SUMMARY_MAX = 140;

const ID_RE = /^G-\d{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** A related entry is another guideline's id, or a page of the site by section and slug. */
const RELATED_PAGE_RE = /^(work|expertise|practice\/articles)\/[a-z0-9-]+$/;

export interface GuidelineMeta {
  slug: string;
  id: string;
  order: number;
  title: string;
  summary: string;
  status: GuidelineStatus;
  revised: string;
  supersedes?: string;
  related: string[];
}

export interface Guideline extends GuidelineMeta {
  body: string;
  isFallback: boolean;
}

export interface RelatedLink {
  href: string;
  label: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** Read a guideline's fields off its frontmatter. Validation is separate (validateGuideline). */
export function toGuidelineMeta(slug: string, data: Frontmatter): GuidelineMeta {
  const related = data.related;
  return {
    slug,
    id: str(data.id),
    order: typeof data.order === 'number' ? data.order : Number.NaN,
    title: fmTitle(data),
    summary: str(data.summary),
    status: str(data.status) as GuidelineStatus,
    revised: str(data.revised),
    supersedes: str(data.supersedes) || undefined,
    related: Array.isArray(related) ? related : [],
  };
}

/** The problems with one guideline's fields; empty when it is publishable. */
export function validateGuideline(g: GuidelineMeta): string[] {
  const errors: string[] = [];
  if (!ID_RE.test(g.id)) errors.push(`id "${g.id}" is not of the form G-01`);
  if (!Number.isInteger(g.order) || g.order < 1) errors.push('order must be a positive whole number');
  if (!g.title) errors.push('title is missing');
  if (!g.summary) errors.push('summary is missing');
  if (g.summary.length > SUMMARY_MAX) errors.push(`summary is ${g.summary.length} characters (max ${SUMMARY_MAX})`);
  if (!GUIDELINE_STATUSES.includes(g.status)) errors.push(`status "${g.status}" is not one of ${GUIDELINE_STATUSES.join(', ')}`);
  if (!DATE_RE.test(g.revised)) errors.push(`revised "${g.revised}" is not a YYYY-MM-DD date`);
  if (g.supersedes !== undefined && !ID_RE.test(g.supersedes)) errors.push(`supersedes "${g.supersedes}" is not a guideline id`);
  for (const r of g.related) {
    if (!ID_RE.test(r) && !RELATED_PAGE_RE.test(r)) errors.push(`related "${r}" is neither a guideline id nor work/, expertise/ or practice/articles/<slug>`);
  }
  return errors.map((e) => `${g.slug}: ${e}`);
}

/** The problems across the set: ids and orders are unique, and every id a guideline points at exists. */
export function validateGuidelineSet(list: GuidelineMeta[]): string[] {
  const errors = list.flatMap(validateGuideline);
  const ids = new Set<string>();
  const orders = new Set<number>();
  for (const g of list) {
    if (ids.has(g.id)) errors.push(`${g.slug}: id ${g.id} is used twice`);
    if (orders.has(g.order)) errors.push(`${g.slug}: order ${g.order} is used twice`);
    ids.add(g.id);
    orders.add(g.order);
  }
  for (const g of list) {
    for (const ref of [...(g.supersedes ? [g.supersedes] : []), ...g.related.filter((r) => ID_RE.test(r))]) {
      if (ref === g.id) errors.push(`${g.slug}: points at itself`);
      else if (!ids.has(ref)) errors.push(`${g.slug}: ${ref} does not exist`);
    }
  }
  return errors;
}

/** The guidelines either side of `slug` in reading order. */
export function neighbours<T extends { slug: string }>(list: T[], slug: string): { prev?: T; next?: T } {
  const i = list.findIndex((g) => g.slug === slug);
  if (i === -1) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}

function assertValid(list: GuidelineMeta[]) {
  const errors = validateGuidelineSet(list);
  if (errors.length) throw new Error(`Invalid guidelines:\n  ${errors.join('\n  ')}`);
}

/** Every guideline in one locale (EN fallback per ADR-0002), drafts excluded, in `order`. */
export async function listGuidelines(locale: Locale): Promise<GuidelineMeta[]> {
  const list = (await listSection(GUIDELINES_SECTION, locale)).map((e) => toGuidelineMeta(e.slug, e.data));
  assertValid(list);
  return list.sort((a, b) => a.order - b.order);
}

export async function guidelineSlugs(): Promise<string[]> {
  return sectionSlugs(GUIDELINES_SECTION);
}

export async function getGuideline(slug: string, locale: Locale): Promise<Guideline | null> {
  const entry = await getEntry(GUIDELINES_SECTION, slug, locale);
  if (!entry) return null;
  const meta = toGuidelineMeta(slug, entry.data);
  assertValid([meta]);
  return { ...meta, body: entry.body, isFallback: entry.isFallback };
}

/**
 * Turn a guideline's `related` entries into links (paths without the locale). Throws on one that
 * does not resolve, so a renamed case study fails the build instead of leaving a dead link.
 */
export async function resolveRelated(g: GuidelineMeta, all: GuidelineMeta[], locale: Locale): Promise<RelatedLink[]> {
  return Promise.all(
    g.related.map(async (ref) => {
      if (ID_RE.test(ref)) {
        const other = all.find((o) => o.id === ref);
        if (!other) throw new Error(`${g.slug}: related ${ref} does not exist`);
        return { href: `/practice/guidelines/${other.slug}`, label: `${other.id} · ${other.title}` };
      }
      const cut = ref.lastIndexOf('/');
      const entry = await getEntry(ref.slice(0, cut), ref.slice(cut + 1), locale);
      if (!entry) throw new Error(`${g.slug}: related ${ref} does not exist`);
      return { href: `/${ref}`, label: fmTitle(entry.data) };
    }),
  );
}
