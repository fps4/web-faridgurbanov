import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticle } from '@/components/content-article';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Case-study detail (FS-0004/US-0011). Consistent structure (context → built → impact → role/stack)
// lives in the markdown body; clients abstracted where confidentiality requires, metrics kept.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await sectionSlugs('work')).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry('work', slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} — ${site.name}`, description: summary(entry.data) };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = await getEntry('work', slug, locale);
  if (!entry) notFound();
  const t = getDictionary(locale);

  return (
    <ContentArticle
      entry={entry}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/work')}
      backLabel={t.indexes.backToIndex.work}
    />
  );
}
