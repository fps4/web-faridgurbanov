import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentArticle } from '@/components/content-article';
import { PracticeTags } from '@/components/practice-tags';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { ARTICLES_SECTION, entriesCiting, entryHref, listEntries, toTags } from '@/lib/practice';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Article detail (FS-0006/US-0014; under Practice since FS-0013). Markdown body via the FS-0001 pipeline with prose
// typography; date and tags from frontmatter, and the guidelines and patterns drawn from it (the
// entries whose `related` names this article).
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await sectionSlugs(ARTICLES_SECTION)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry(ARTICLES_SECTION, slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} — ${site.name}`, description: summary(entry.data) };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = await getEntry(ARTICLES_SECTION, slug, locale);
  if (!entry) notFound();
  const t = getDictionary(locale);
  const date = typeof entry.data.date === 'string' ? entry.data.date : '';
  const p = t.practice;
  const drawn = entriesCiting(await listEntries(locale), `${ARTICLES_SECTION}/${slug}`);

  return (
    <ContentArticle
      entry={entry}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/practice')}
      backLabel={p.backToIndex}
      meta={
        <div className="flex flex-col gap-3">
          {date ? <time dateTime={date}>{formatDate(date, locale)}</time> : null}
          <PracticeTags tags={toTags(entry.data)} locale={locale} label={p.filterTopic} />
        </div>
      }
      after={
        drawn.length ? (
          <section aria-labelledby="drawn" className="rounded-lg border border-border p-5">
            <h2 id="drawn" className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {p.drawnFrom}
            </h2>
            <ul className="mt-3 space-y-1">
              {drawn.map((e) => (
                <li key={e.id}>
                  <Link href={hrefFor(locale, entryHref(e))} className="underline underline-offset-4">
                    {p.kind[e.kind]} {e.id} · {e.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : undefined
      }
    />
  );
}
