import { defaultLocale, hasDutch, locales, type Locale } from '@/lib/i18n';

// The sitemap's entries (FS-0013): a page is listed once per locale that has a copy of its own, each
// entry carrying the hreflang set for those locales plus x-default. Whether a page has its own Dutch
// is decided per page (`hasDutch` in lib/i18n.ts, and for a content page whether its Dutch file
// exists): a page with Dutch is listed under /en and under /nl as a pair; a page without it (the
// privacy page) is listed under /en alone, because its /nl address is a copy of the English page and
// says so with a canonical link (lib/canonical.ts). Framework-free and unit-tested; app/sitemap.ts
// collects the pages and hands them in.

export interface SitemapEntry {
  url: string;
  alternates?: { languages: Record<string, string> };
}

/** A page of the site: `path` is locale-less ('' for home, '/practice', …); `own` the locales that have a copy of it. */
export interface SitemapPage {
  path: string;
  own: readonly Locale[];
}

/** The site's origin: the deploy's NEXT_PUBLIC_SITE_URL (baked at build), else the domain. */
export function siteOrigin(env: string | undefined, domain: string): string {
  return (env || `https://${domain}`).replace(/\/+$/, '');
}

/** The locales that have a copy of their own of a page, from the per-page rule (and a content file's own check). */
export function ownLocalesOf(path: string, dutchFellBack = false): readonly Locale[] {
  return hasDutch(path) && !dutchFellBack ? locales : [defaultLocale];
}

/** One entry per page per own locale. */
export function sitemapEntries(origin: string, pages: SitemapPage[]): SitemapEntry[] {
  return pages.flatMap(({ path, own }) => {
    if (own.length === 1) return [{ url: `${origin}/${own[0]}${path}` }];
    const languages: Record<string, string> = Object.fromEntries(own.map((l) => [l, `${origin}/${l}${path}`]));
    languages['x-default'] = languages[defaultLocale];
    return own.map((l) => ({ url: languages[l], alternates: { languages } }));
  });
}
