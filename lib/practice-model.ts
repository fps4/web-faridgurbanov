import type { Frontmatter } from '@/lib/frontmatter';

// The Practice section's model (art-gdp0zjj9fd, ADR-0010 §11): a short list of the owner's own
// articles. Framework-free; lib/practice.ts loads the files and checks them with these validators.
//
// An article is one markdown file under content/<locale>/practice/articles/. Every text it shows
// is in the file or in lib/dictionaries.ts, taken verbatim from the approved copy:
//
//   title, summary (the first line of the article, taken unchanged from its own text), date (the
//   day it was written), order, read (the reading-time label) and from ("Where it comes from").
//
// `from` is an inline list, and the frontmatter parser splits an inline list on every comma, so an
// item carries its link after a ` | ` and holds no comma itself: `Integration adapter |
// /en/work/integration-adapter`. An item with no ` | ` is plain text. The guidelines, patterns and
// earlier articles are unpublished (`draft: true`) and are not part of this model.

export const ARTICLES_SECTION = 'practice/articles';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** A link of `from`: a case study, or an entry of the Earlier work list, written with the /en prefix. */
const FROM_HREF_RE = /^\/en\/work(\/[a-z0-9-]+|#earlier-[a-z0-9-]+)$/;

export interface FromItem {
  label: string;
  /** Path as written in the file (`/en/…`, localized when shown); null for plain text. */
  href: string | null;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  /** The first line of the article, taken unchanged from its own text. */
  summary: string;
  /** ISO date the article was written. */
  date: string;
  order: number;
  /** The reading-time label, e.g. "Three-minute read". */
  read: string;
  from: FromItem[];
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** Read the `from` list: `Label | /en/work/slug` is a link, `Label` is plain text. */
export function parseFrom(v: unknown): FromItem[] {
  const items = Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : [];
  return items.map((raw) => {
    const [label, ...rest] = String(raw).split(' | ');
    const href = rest.join(' | ').trim();
    return { label: label.trim(), href: href || null };
  });
}

/** Read an article's fields off its frontmatter. Validation is separate (validateArticle). */
export function toArticleMeta(slug: string, data: Frontmatter): ArticleMeta {
  return {
    slug,
    title: str(data.title),
    summary: str(data.summary),
    date: str(data.date),
    order: typeof data.order === 'number' ? data.order : Number.NaN,
    read: str(data.read),
    from: parseFrom(data.from),
  };
}

/** The problems with one article's fields, and with its first line against its body; empty when publishable. */
export function validateArticle(a: ArticleMeta, body?: string): string[] {
  const errors: string[] = [];
  if (!a.title) errors.push('title is missing');
  if (!a.summary) errors.push('summary (the first line of the article) is missing');
  if (!DATE_RE.test(a.date)) errors.push(`date "${a.date}" is not a YYYY-MM-DD date`);
  if (!Number.isInteger(a.order) || a.order < 1) errors.push('order must be a positive whole number');
  if (!a.read) errors.push('read (the reading-time label) is missing');
  if (a.from.length === 0) errors.push('from (Where it comes from) is missing');
  for (const f of a.from) {
    if (!f.label) errors.push('from has an item with no label');
    if (f.href !== null && !FROM_HREF_RE.test(f.href)) errors.push(`from link "${f.href}" is not /en/work/<slug> or /en/work#earlier-<id>`);
  }
  if (body !== undefined && a.summary && !body.trimStart().startsWith(a.summary)) {
    errors.push('summary is not the first line of the body, taken unchanged');
  }
  return errors.map((e) => `${a.slug}: ${e}`);
}

/** The problems across all articles: each order used once. */
export function validateArticleSet(articles: ArticleMeta[]): string[] {
  const orders = new Set<number>();
  const errors: string[] = [];
  for (const a of articles) {
    if (orders.has(a.order)) errors.push(`${a.slug}: order ${a.order} is used twice`);
    orders.add(a.order);
  }
  return errors;
}
