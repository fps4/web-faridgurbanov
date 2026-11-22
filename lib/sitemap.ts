import { copyLocale, defaultLocale, locales, type Locale } from '@/lib/i18n';

// The sitemap's entries (FS-0013): every page once per locale, each carrying the hreflang set for
// all locales plus x-default. Every page exists in both locales (a missing translation falls back
// to English at the same path, ADR-0002), so the pairs are always complete. A locale that shows
// another locale's page (copyLocale: Dutch shows English until its copy is approved, maestro story
// art-bf5tq4788n) is left out, and so are the pairs: its pages are copies, and each says so with a
// canonical link (lib/canonical.ts). Framework-free and unit-tested; app/sitemap.ts collects the
// paths and hands them in.

export interface SitemapEntry {
  url: string;
  alternates?: { languages: Record<string, string> };
}

/** The site's origin: the deploy's NEXT_PUBLIC_SITE_URL (baked at build), else the domain. */
export function siteOrigin(env: string | undefined, domain: string): string {
  return (env || `https://${domain}`).replace(/\/+$/, '');
}

/** The locales that have a copy of their own to list. */
export const ownLocales: readonly Locale[] = locales.filter((l) => copyLocale(l) === l);

/** `paths` are locale-less ('' for home, '/practice', …); one entry per path per own locale. */
export function sitemapEntries(origin: string, paths: string[], own: readonly Locale[] = ownLocales): SitemapEntry[] {
  return paths.flatMap((path) => {
    if (own.length === 1) return [{ url: `${origin}/${own[0]}${path}` }];
    const languages: Record<string, string> = Object.fromEntries(own.map((l) => [l, `${origin}/${l}${path}`]));
    languages['x-default'] = languages[defaultLocale];
    return own.map((l) => ({ url: languages[l], alternates: { languages } }));
  });
}
