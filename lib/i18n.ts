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

export const localeName: Record<Locale, string> = { en: 'English', nl: 'Nederlands' };
