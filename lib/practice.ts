import { getEntry, listSection } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import {
  ARTICLES_SECTION,
  toArticleMeta,
  validateArticle,
  validateArticleSet,
  type ArticleMeta,
} from '@/lib/practice-model';

// Loads the Practice articles (art-gdp0zjj9fd) and checks them, so a malformed article fails
// `next build`. Server-only: it reads the filesystem through lib/content.ts. The model it builds on
// is lib/practice-model.ts, re-exported here for server code.

export * from '@/lib/practice-model';

export interface Article extends ArticleMeta {
  body: string;
  isFallback: boolean;
}

/** Every published article in one locale (EN fallback per ADR-0002), drafts excluded, in `order`, checked. */
export async function listArticles(locale: Locale): Promise<ArticleMeta[]> {
  const entries = await listSection(ARTICLES_SECTION, locale);
  const articles = entries.map((e) => toArticleMeta(e.slug, e.data)).sort((a, b) => a.order - b.order);
  const errors = [...articles.flatMap((a) => validateArticle(a)), ...validateArticleSet(articles)];
  if (errors.length) throw new Error(`Invalid practice articles:\n  ${errors.join('\n  ')}`);
  return articles;
}

/** One published article with its body, or null when there is none (a draft is none). */
export async function getArticle(slug: string, locale: Locale): Promise<Article | null> {
  const entry = await getEntry(ARTICLES_SECTION, slug, locale);
  if (!entry) return null;
  const meta = toArticleMeta(slug, entry.data);
  const errors = validateArticle(meta, entry.body);
  if (errors.length) throw new Error(`Invalid practice article:\n  ${errors.join('\n  ')}`);
  return { ...meta, body: entry.body, isFallback: entry.isFallback };
}
