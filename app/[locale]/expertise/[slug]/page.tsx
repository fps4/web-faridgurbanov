import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticle } from '@/components/content-article';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Expertise area detail (FS-0003/US-0012). Body is markdown under content/{locale}/expertise/.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await sectionSlugs('expertise')).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry('expertise', slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} — ${site.name}`, description: summary(entry.data) };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = await getEntry('expertise', slug, locale);
  if (!entry) notFound();
  const t = getDictionary(locale);

  return (
    <ContentArticle
      entry={entry}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/expertise')}
      backLabel={t.indexes.backToIndex.expertise}
    />
  );
}
