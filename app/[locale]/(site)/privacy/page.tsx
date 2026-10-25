import type { Metadata } from 'next';
import { PageIntro } from '@/components/page-intro';
import { Markdown } from '@/components/markdown';
import { getDictionary } from '@/lib/dictionaries';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

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
  return { title: `${t.title} — ${site.name}` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const t = getDictionary(raw as Locale).privacy;

  return (
    <div className="container py-16">
      <PageIntro title={t.title} />
      <p className="mt-2 text-sm text-muted-foreground">{t.lastUpdated}</p>
      <div className="mt-8">
        <Markdown>{t.body}</Markdown>
      </div>
    </div>
  );
}
