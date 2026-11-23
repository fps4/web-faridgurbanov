// i18n core (ADR-0002). The site is bilingual EN/NL on native App-Router `[locale]` segments —
// no i18n library, no middleware — which is what `output: 'export'` requires (ADR-0001, US-0001
// spike). This module is the single source of the locale set and the default; pages enumerate
// `locales` in `generateStaticParams`.

export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The other locale — used by the language switcher to round-trip a page. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'nl' : 'en';
}

/**
 * Pages with no Dutch yet, as locale-less paths ('' is home, '/work/x' a case study). Under /nl each
 * one shows the English page under the fallback notice, with a canonical link to the English page
 * and no entry in the sitemap. The privacy page is the one today: the approved Dutch copy has no
 * text for it (maestro story art-j9e7z77xy0). Giving a page its Dutch is removing it from this
 * list, and nothing else here changes. A page that is made from a content file has its own check as
 * well: it falls back when the locale's file is missing (`ContentEntry.isFallback`).
 */
export const pathsWithoutDutch: readonly string[] = ['/privacy'];

/** True when the page has its own Dutch. `path` is locale-less. */
export function hasDutch(path: string): boolean {
  return !pathsWithoutDutch.includes(path);
}

/**
 * The locale whose copy a page shows. A Dutch address shows Dutch, except for a page without Dutch
 * (`pathsWithoutDutch`, or `fellBack` when its content file is missing), which shows the English
 * page. The URL, the language switcher and the notice keep using the requested locale.
 */
export function copyLocale(locale: Locale, path: string, fellBack = false): Locale {
  return locale !== defaultLocale && (fellBack || !hasDutch(path)) ? defaultLocale : locale;
}

/** The locale-less path of a pathname served by the site: '/nl/work/x/' gives '/work/x', '/nl' gives ''. */
export function localelessPath(pathname: string): string {
  const m = /^\/(?:en|nl)(\/.*)?$/.exec(pathname);
  return (m?.[1] ?? '').replace(/\/+$/, '').replace(/\.html$/, '');
}

/**
 * A page's markdown is written with `/en/…` links. Served under another locale it links within that
 * locale: `/en/work/x` becomes `/nl/work/x` under /nl. Other links are left alone.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === defaultLocale) return href;
  const prefix = `/${defaultLocale}`;
  if (href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}#`) || href.startsWith(`${prefix}?`)) {
    return `/${locale}${href.slice(prefix.length)}`;
  }
  return href;
}

export const localeName: Record<Locale, string> = { en: 'English', nl: 'Nederlands' };
