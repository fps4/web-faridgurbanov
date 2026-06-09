import type { Locale } from '@/lib/i18n';

const LOCALE_TAG: Record<Locale, string> = { en: 'en-GB', nl: 'nl-NL' };

/** Format an ISO date string (YYYY-MM-DD) for display, localized. Returns '' for missing/invalid. */
export function formatDate(iso: string, locale: Locale): string {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
