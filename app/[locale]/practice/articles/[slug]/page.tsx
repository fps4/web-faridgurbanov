import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { PracticeFrom } from '@/components/practice-from';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';
import { sectionSlugs } from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { ARTICLES_SECTION, getArticle } from '@/lib/practice';
import { CONTACT_HREF, hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';
import { fallbackCanonical } from '@/lib/canonical';

// One Practice article (art-gdp0zjj9fd, ADR-0010 §11), in the order of the approved design: the back
// link, the title, the date it was written and its reading time, the body unchanged, a side column
// with Where it comes from and Written how, and a bar at the foot. The body is the article's markdown
// and the labels come from lib/dictionaries.ts, each verbatim from the approved site copy. A draft
// has no page: sectionSlugs leaves it out of the static params.
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
  const article = await getArticle(slug, locale);
  if (!article) return {};
  return {
    title: `${article.title} — ${site.name}`,
    description: article.summary,
    ...fallbackCanonical(locale, `/practice/articles/${slug}`),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const article = await getArticle(slug, locale);
  if (!article) notFound();
  const t = getDictionary(locale);
  const p = t.practice;

  return (
    <>
      <div className="container max-w-5xl pt-16">
        {article.isFallback ? <FallbackNotice message={t.fallback.notice} /> : null}
        <Link
          href={hrefFor(locale, '/practice')}
          className="mb-4 inline-block py-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {p.back}
        </Link>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <time dateTime={article.date}>{formatDate(article.date, locale)}</time> · {article.read}
        </p>
      </div>

      <div className="container flex max-w-5xl flex-wrap gap-x-12 gap-y-10 py-12">
        <div className="min-w-0 max-w-2xl flex-[999_1_32rem] text-lg">
          <Markdown locale={locale}>{article.body}</Markdown>
        </div>
        <aside aria-label="About this article" className="flex min-w-0 flex-[1_1_16rem] flex-col gap-8">
          <div className="flex flex-col border-b border-border text-sm">
            <div className="flex flex-col gap-0.5 border-t border-border py-3">
              <PracticeFrom label={p.comesFrom} items={article.from} locale={locale} />
            </div>
            <div className="flex flex-col gap-0.5 border-t border-border py-3">
              <span className="text-muted-foreground">{p.writtenHowLabel}</span>
              <span className="font-medium">{p.writtenHow}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="border-t border-border">
        <div className="container flex max-w-5xl flex-wrap items-center justify-between gap-5 py-10">
          <p className="m-0 text-lg font-medium">{p.barQuestion}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={hrefFor(locale, CONTACT_HREF)}>{p.barAction}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={hrefFor(locale, '/practice')}>{p.barAll}</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
