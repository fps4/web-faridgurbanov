import { FallbackNotice } from '@/components/fallback-notice';
import { getDictionary } from '@/lib/dictionaries';
import { copyLocale, type Locale } from '@/lib/i18n';

// The fallback notice for a page whose words come from lib/dictionaries.ts or lib/site.ts rather
// than from a markdown file, so the content loader cannot say it fell back. It shows when the page
// has no Dutch (`pathsWithoutDutch` in lib/i18n.ts: today the privacy page) and the address is a
// Dutch one; nothing otherwise. `path` is the page's locale-less path ('' for home).
export function LocaleNotice({ locale, path }: { locale: Locale; path: string }) {
  if (copyLocale(locale, path) === locale) return null;
  return <FallbackNotice message={getDictionary(locale).fallback.notice} lang={locale} />;
}
