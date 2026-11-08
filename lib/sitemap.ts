import { defaultLocale, locales } from '@/lib/i18n';

// The sitemap's entries (FS-0013): every page once per locale, each carrying the hreflang set for
// all locales plus x-default. Every page exists in both locales (a missing translation falls back
// to English at the same path, ADR-0002), so the pairs are always complete. Framework-free and
// unit-tested; app/sitemap.ts collects the paths and hands them in.

export interface SitemapEntry {
  url: string;
  alternates: { languages: Record<string, string> };
}

/** The site's origin: the deploy's NEXT_PUBLIC_SITE_URL (baked at build), else the domain. */
export function siteOrigin(env: string | undefined, domain: string): string {
  return (env || `https://${domain}`).replace(/\/+$/, '');
}

/** `paths` are locale-less ('' for home, '/practice', …); one entry per path per locale. */
export function sitemapEntries(origin: string, paths: string[]): SitemapEntry[] {
  return paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `${origin}/${l}${path}`]));
    languages['x-default'] = languages[defaultLocale];
    return locales.map((l) => ({ url: languages[l], alternates: { languages } }));
  });
}
