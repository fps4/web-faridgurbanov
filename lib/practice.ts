import { getEntry, listSection, sectionSlugs, summary as fmSummary, title as fmTitle } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import {
  ARTICLES_SECTION,
  ENTRY_KINDS,
  KINDS,
  buildList,
  entryHref,
  toEntryMeta,
  toTags,
  validateEntry,
  validateEntrySet,
  validateTags,
  type Entry,
  type EntryKind,
  type EntryMeta,
  type PracticeItem,
  type RelatedLink,
} from '@/lib/practice-model';

// Loads the Practice section's files (FS-0013) and checks them, so a malformed guideline, pattern
// or article tag fails `next build`. Server-only: it reads the filesystem through lib/content.ts.
// The model it builds on is lib/practice-model.ts, re-exported here for server code.

export * from '@/lib/practice-model';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const ID_RE = /^[GP]-\d{2,}$/;

function assertValid(entries: EntryMeta[]) {
  const errors = validateEntrySet(entries);
  if (errors.length) throw new Error(`Invalid practice entries:\n  ${errors.join('\n  ')}`);
}

/** Every guideline and pattern in one locale (EN fallback per ADR-0002), drafts excluded, checked. */
export async function listEntries(locale: Locale): Promise<EntryMeta[]> {
  const perKind = await Promise.all(
    (Object.keys(ENTRY_KINDS) as EntryKind[]).map(async (kind) =>
      (await listSection(ENTRY_KINDS[kind].section, locale)).map((e) => toEntryMeta(kind, e.slug, e.data)),
    ),
  );
  const entries = perKind.flat();
  assertValid(entries);
  return entries.sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.order - b.order);
}

export async function entrySlugs(kind: EntryKind): Promise<string[]> {
  return sectionSlugs(ENTRY_KINDS[kind].section);
}

export async function getPracticeEntry(kind: EntryKind, slug: string, locale: Locale): Promise<Entry | null> {
  const entry = await getEntry(ENTRY_KINDS[kind].section, slug, locale);
  if (!entry) return null;
  const meta = toEntryMeta(kind, slug, entry.data);
  const errors = validateEntry(meta);
  if (errors.length) throw new Error(`Invalid practice entry:\n  ${errors.join('\n  ')}`);
  return { ...meta, body: entry.body, isFallback: entry.isFallback };
}

/** Every article in one locale as a list row, its tags checked. */
export async function listArticles(locale: Locale): Promise<PracticeItem[]> {
  const articles = await listSection(ARTICLES_SECTION, locale);
  const items = articles.map((a) => ({
    kind: 'article' as const,
    href: `/practice/articles/${a.slug}`,
    date: str(a.data.date),
    title: fmTitle(a.data),
    summary: fmSummary(a.data),
    ...toTags(a.data),
  }));
  const errors = items.flatMap((i) => validateTags(i.href, i));
  if (errors.length) throw new Error(`Invalid article tags:\n  ${errors.join('\n  ')}`);
  return items;
}

/** The whole Practice list for one locale. */
export async function practiceList(locale: Locale): Promise<PracticeItem[]> {
  const [entries, articles] = await Promise.all([listEntries(locale), listArticles(locale)]);
  return buildList(entries, articles);
}

/**
 * Turn an entry's `related` into links (paths without the locale). Throws on one that does not
 * resolve, so a renamed case study fails the build instead of leaving a dead link.
 */
export async function resolveRelated(e: EntryMeta, all: EntryMeta[], locale: Locale): Promise<RelatedLink[]> {
  return Promise.all(
    e.related.map(async (ref) => {
      if (ID_RE.test(ref)) {
        const other = all.find((o) => o.id === ref);
        if (!other) throw new Error(`${e.slug}: related ${ref} does not exist`);
        return { href: entryHref(other), label: `${other.id} · ${other.title}` };
      }
      const cut = ref.lastIndexOf('/');
      const page = await getEntry(ref.slice(0, cut), ref.slice(cut + 1), locale);
      if (!page) throw new Error(`${e.slug}: related ${ref} does not exist`);
      return { href: `/${ref}`, label: fmTitle(page.data) };
    }),
  );
}
