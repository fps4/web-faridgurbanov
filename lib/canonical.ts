import type { Metadata } from 'next';
import { copyLocale, defaultLocale, isLocale, locales } from '@/lib/i18n';

/**
 * Metadata for a page's links in the head, decided per page (maestro story art-j9e7z77xy0).
 * - A page that has its own Dutch gets, in both locales, a canonical link to itself and the pair of
 *   its two versions (`hreflang`, with English as `x-default`), so a search engine reads the Dutch
 *   and the English page as one page in two languages.
 * - A page without Dutch (the privacy page, or a content page whose Dutch file is missing) gets, under
 *   /nl, a canonical link to the English page and no pair, because the Dutch address is a copy; its
 *   English version gets no alternates.
 * `path` is locale-less ('' for home, '/work/x'). `dutchFellBack` is true when the page's Dutch
 * content file is missing (the content loader's `isFallback` for the Dutch entry).
 */
export function pageAlternates(locale: string, path: string, dutchFellBack = false): Pick<Metadata, 'alternates'> {
  if (!isLocale(locale)) return {};
  if (copyLocale('nl', path, dutchFellBack) !== 'nl') {
    return locale === defaultLocale ? {} : { alternates: { canonical: `/${defaultLocale}${path}` } };
  }
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  languages['x-default'] = languages[defaultLocale];
  return { alternates: { canonical: `/${locale}${path}`, languages } };
}
