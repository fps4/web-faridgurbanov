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
 * The locale whose copy a page shows. Until the owner approves the Dutch copy, every Dutch address
 * shows the English page under the fallback notice (maestro story art-bf5tq4788n, following decision art-896t5kxfka, ADR-0010 here), so
 * this maps nl to en. The Dutch story brings the approved copy back by making this the identity.
 * The URL, the language switcher and the notice keep using the requested locale.
 */
export function copyLocale(locale: Locale): Locale {
  return locale === 'nl' ? defaultLocale : locale;
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
