import { FallbackNotice } from '@/components/fallback-notice';
import { getDictionary } from '@/lib/dictionaries';
import { defaultLocale, type Locale } from '@/lib/i18n';

// The fallback notice for a page whose words come from lib/dictionaries.ts or lib/site.ts rather
// than from a markdown file, so the content loader cannot say it fell back. Until the Dutch copy is
// approved (maestro story art-bf5tq4788n) no such page has a Dutch version, so every one shows the notice under /nl; the
// Dutch story removes it from the pages it translates. Renders nothing for the default locale.
export function LocaleNotice({ locale }: { locale: Locale }) {
  if (locale === defaultLocale) return null;
  return <FallbackNotice message={getDictionary(locale).fallback.notice} lang={locale} />;
}
