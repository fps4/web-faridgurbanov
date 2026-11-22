import type { MetadataRoute } from 'next';
import { listSection } from '@/lib/content';
import { ARTICLES_SECTION } from '@/lib/practice-model';
import { locales } from '@/lib/i18n';
import { loadReferences } from '@/lib/references';
import { siteOrigin, sitemapEntries } from '@/lib/sitemap';
import { site } from '@/lib/site';

// /sitemap.xml, written once at build time into the static export (ADR-0001). Lists the published
// pages in both locales with their hreflang pairs (FS-0013). Drafts are left out (so are the unpublished guidelines, patterns and earlier articles, art-gdp0zjj9fd); the references
// page only WHILE a reference is published, the same rule the page itself follows (FS-0009).
export const dynamic = 'force-static';

async function slugs(section: string): Promise<string[]> {
  const perLocale = await Promise.all(locales.map((l) => listSection(section, l)));
  return [...new Set(perLocale.flat().map((e) => e.slug))].sort();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, articles, references] = await Promise.all([
    slugs('work'),
    slugs(ARTICLES_SECTION),
    loadReferences(),
  ]);
  const paths = [
    '',
    '/work',
    ...work.map((s) => `/work/${s}`),
    '/practice',
    ...articles.map((s) => `/practice/articles/${s}`),
    ...(references.length ? ['/references'] : []),
    '/privacy',
  ];
  return sitemapEntries(siteOrigin(process.env.NEXT_PUBLIC_SITE_URL, site.domain), paths);
}
