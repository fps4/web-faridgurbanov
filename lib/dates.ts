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

/** Month and year only ('March 2026', 'maart 2026') — for a reference's date, where the day is noise. */
export function formatMonth(iso: string, locale: Locale): string {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
