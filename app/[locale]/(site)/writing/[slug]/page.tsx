import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticle } from '@/components/content-article';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Writing post detail (FS-0006/US-0014). Markdown body via the FS-0001 pipeline with prose
// typography; date from frontmatter.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await sectionSlugs('writing')).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry('writing', slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} — ${site.name}`, description: summary(entry.data) };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = await getEntry('writing', slug, locale);
  if (!entry) notFound();
  const t = getDictionary(locale);
  const date = typeof entry.data.date === 'string' ? entry.data.date : '';

  return (
    <ContentArticle
      entry={entry}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/writing')}
      backLabel={t.indexes.backToIndex.writing}
      meta={date ? <time dateTime={date}>{formatDate(date, locale)}</time> : undefined}
    />
  );
}
