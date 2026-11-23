import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { PracticeFrom } from '@/components/practice-from';
import { getDictionary } from '@/lib/dictionaries';
import { listArticles } from '@/lib/practice';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';
import { LocaleNotice } from '@/components/locale-notice';
import { fallbackCanonical } from '@/lib/canonical';

// The Practice page (art-gdp0zjj9fd, ADR-0010 §11), in the order of the approved design: the
// introduction, then the published articles as a plain list, each with its reading time, title,
// first line and Where it comes from. No filter, no planned article and no "coming soon". Every text
// is verbatim from the approved site copy: the introduction and the labels come from
// lib/dictionaries.ts, the rest from each article's own file. Adding an article is a markdown file.
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
  return { title: `${t.title} — ${site.name}`, description: t.lede, ...fallbackCanonical(locale, '/practice') };
}

export default async function PracticeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).practice;
  const articles = await listArticles(locale);

  return (
    <div className="container py-16">
      <LocaleNotice locale={locale} />
      <PageIntro title={t.title} lede={t.lede} />

      <ol aria-label="Articles" className="mt-12 flex list-none flex-col border-b border-border p-0">
        {articles.map((a) => (
          <li key={a.slug} className="flex flex-wrap gap-x-10 gap-y-3 border-t border-border py-6">
            <div className="flex min-w-0 flex-[999_1_28rem] flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">{a.read}</span>
              <h2 className="text-xl font-semibold leading-snug tracking-tight">
                <Link href={hrefFor(locale, `/practice/articles/${a.slug}`)} className="inline-block py-1 hover:underline underline-offset-4">
                  {a.title}
                </Link>
              </h2>
              <p className="max-w-3xl text-foreground/90">{a.summary}</p>
            </div>
            <div className="flex min-w-0 flex-[1_1_15rem] flex-col gap-0.5 text-[0.9375rem]">
              <PracticeFrom label={t.comesFrom} items={a.from} locale={locale} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
