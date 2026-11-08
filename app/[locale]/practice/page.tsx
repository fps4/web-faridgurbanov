import type { Metadata } from 'next';
import { PageIntro } from '@/components/page-intro';
import { PracticeList } from '@/components/practice-list';
import { getDictionary } from '@/lib/dictionaries';
import { practiceList } from '@/lib/practice';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Practice landing (FS-0013): one list of guidelines, patterns and articles, filtered by kind,
// topic and technology in a client island. Adding an item is a markdown file, no code change.
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
  const t = getDictionary(locale as Locale).practice;
  return { title: `${t.title} — ${site.name}`, description: t.lede };
}

export default async function PracticeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).practice;
  const items = await practiceList(locale);

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />
      <PracticeList items={items} locale={locale} t={t} />
    </div>
  );
}
