import type { Metadata } from 'next';
import { PageIntro } from '@/components/page-intro';
import { Markdown } from '@/components/markdown';
import { getDictionary } from '@/lib/dictionaries';
import { site } from '@/lib/site';
import { copyLocale, locales, type Locale } from '@/lib/i18n';
import { LocaleNotice } from '@/components/locale-notice';
import { pageAlternates } from '@/lib/canonical';

// Privacy/GDPR (FS-0007/US-0015). Minimal and honest, reflecting the actual data flow: a static
// site with mailto-only contact collects nothing, sets no non-essential cookies, runs no
// analytics. Linked site-wide from the footer.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale as Locale).privacy;
  return { title: `${t.title} — ${site.name}`, ...pageAlternates(locale, '/privacy') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).privacy;

  // The page has no Dutch (pathsWithoutDutch, lib/i18n.ts): under /nl its text is the English page,
  // marked lang="en", under the Dutch notice, which marks itself lang="nl".
  return (
    <div className="container py-16">
      <LocaleNotice locale={locale} path="/privacy" />
      <div lang={copyLocale(locale, '/privacy')}>
        <PageIntro title={t.title} />
        <p className="mt-2 text-sm text-muted-foreground">{t.lastUpdated}</p>
        <div className="mt-8">
          <Markdown locale={locale}>{t.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
