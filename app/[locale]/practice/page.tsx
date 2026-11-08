import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title } from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { ARTICLES_SECTION, listGuidelines } from '@/lib/guidelines';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Practice landing (FS-0013): the guidelines in their `order`, then the articles in the order the
// writing index always had (`order`, then newest first; FS-0006). A group with nothing in it is left out, not shown as "coming soon". Adding a
// guideline or an article is a markdown file, no code change.
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

function Group({ id, heading, lede, children }: { id: string; heading: string; lede: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {heading}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{lede}</p>
      {children}
    </section>
  );
}

export default async function PracticeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).practice;
  const [guidelines, articles] = await Promise.all([listGuidelines(locale), listSection(ARTICLES_SECTION, locale)]);

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />

      {guidelines.length ? (
        <Group id="guidelines" heading={t.guidelinesHeading} lede={t.guidelinesLede}>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {guidelines.map((g) => (
              <li key={g.slug}>
                <Link
                  href={hrefFor(locale, `/practice/guidelines/${g.slug}`)}
                  className="group flex h-full flex-col rounded-lg border border-border p-5 transition-colors hover:border-foreground/40"
                >
                  <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{g.id}</span>
                  <h3 className="mt-2 text-lg font-medium group-hover:underline">{g.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{g.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {articles.length ? (
        <Group id="articles" heading={t.articlesHeading} lede={t.articlesLede}>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {articles.map((e) => {
              const date = typeof e.data.date === 'string' ? e.data.date : '';
              return (
                <li key={e.slug}>
                  <Link href={hrefFor(locale, `/practice/articles/${e.slug}`)} className="group block py-6">
                    {date ? (
                      <time dateTime={date} className="text-xs uppercase tracking-wide text-muted-foreground">
                        {formatDate(date, locale)}
                      </time>
                    ) : null}
                    <h3 className="mt-1 text-lg font-medium group-hover:underline">{title(e.data)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{summary(e.data)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Group>
      ) : null}
    </div>
  );
}
