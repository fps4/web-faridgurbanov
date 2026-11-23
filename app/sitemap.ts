import type { MetadataRoute } from 'next';
import { getEntry, listSection } from '@/lib/content';
import { ARTICLES_SECTION } from '@/lib/practice-model';
import { locales } from '@/lib/i18n';
import { ownLocalesOf, siteOrigin, sitemapEntries, type SitemapPage } from '@/lib/sitemap';
import { site } from '@/lib/site';

// /sitemap.xml, written once at build time into the static export (ADR-0001). Lists the published
// pages with their hreflang pairs (FS-0013): a page with its own Dutch under /en and /nl, a page
// without it (the privacy page) under /en alone (maestro story art-j9e7z77xy0). Drafts are left out
// (so are the unpublished guidelines, patterns and earlier articles, art-gdp0zjj9fd). There is no
// References page: the references are a band of the home page (art-2ya5at7k1q).
export const dynamic = 'force-static';

/** The pages of a content section, each with the locales that have a file of their own for it. */
async function pagesOf(section: string, base: string): Promise<SitemapPage[]> {
  const perLocale = await Promise.all(locales.map((l) => listSection(section, l)));
  const slugs = [...new Set(perLocale.flat().map((e) => e.slug))].sort();
  return Promise.all(
    slugs.map(async (slug) => {
      const dutch = await getEntry(section, slug, 'nl');
      return { path: `${base}/${slug}`, own: ownLocalesOf(`${base}/${slug}`, dutch?.isFallback ?? true) };
    }),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, articles] = await Promise.all([pagesOf('work', '/work'), pagesOf(ARTICLES_SECTION, '/practice/articles')]);
  const page = (path: string): SitemapPage => ({ path, own: ownLocalesOf(path) });
  const pages = [page(''), page('/work'), ...work, page('/practice'), ...articles, page('/privacy')];
  return sitemapEntries(siteOrigin(process.env.NEXT_PUBLIC_SITE_URL, site.domain), pages);
}
