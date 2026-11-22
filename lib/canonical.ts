import type { Metadata } from 'next';
import { copyLocale, defaultLocale, isLocale } from '@/lib/i18n';

/**
 * Metadata for a page whose locale shows another locale's page: `<link rel="canonical">` pointing
 * at that page, so a search engine reads the Dutch address as a copy of the English one. Empty for a
 * locale that has its own copy. `path` is locale-less ('' for home, '/work/x'). It follows
 * copyLocale, the same switch as the fallback itself (maestro story art-bf5tq4788n).
 */
export function fallbackCanonical(locale: string, path: string): Pick<Metadata, 'alternates'> {
  if (!isLocale(locale) || copyLocale(locale) === locale) return {};
  return { alternates: { canonical: `/${defaultLocale}${path}` } };
}
