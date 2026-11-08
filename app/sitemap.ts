import type { MetadataRoute } from 'next';
import { listSection } from '@/lib/content';
import { ARTICLES_SECTION, ENTRY_KINDS } from '@/lib/practice';
import { locales } from '@/lib/i18n';
import { loadReferences } from '@/lib/references';
import { siteOrigin, sitemapEntries } from '@/lib/sitemap';
import { site } from '@/lib/site';

// /sitemap.xml, written once at build time into the static export (ADR-0001). Lists the published
// pages in both locales with their hreflang pairs (FS-0013). Drafts are left out; the references
// page only WHILE a reference is published, the same rule the page itself follows (FS-0009).
export const dynamic = 'force-static';

async function slugs(section: string): Promise<string[]> {
  const perLocale = await Promise.all(locales.map((l) => listSection(section, l)));
  return [...new Set(perLocale.flat().map((e) => e.slug))].sort();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [expertise, work, articles, guidelines, patterns, references] = await Promise.all([
    slugs('expertise'),
    slugs('work'),
    slugs(ARTICLES_SECTION),
    slugs(ENTRY_KINDS.guideline.section),
    slugs(ENTRY_KINDS.pattern.section),
    loadReferences(),
  ]);
  const paths = [
    '',
    '/expertise',
    ...expertise.map((s) => `/expertise/${s}`),
    '/work',
    ...work.map((s) => `/work/${s}`),
    '/portfolio',
    '/practice',
    ...guidelines.map((s) => `/practice/guidelines/${s}`),
    ...patterns.map((s) => `/practice/patterns/${s}`),
    ...articles.map((s) => `/practice/articles/${s}`),
    ...(references.length ? ['/references'] : []),
    '/contact',
    '/privacy',
  ];
  return sitemapEntries(siteOrigin(process.env.NEXT_PUBLIC_SITE_URL, site.domain), paths);
}
