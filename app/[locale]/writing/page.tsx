import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title } from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Writing index (FS-0006/US-0014): posts newest-first with title, date, and summary from
// frontmatter. No comments, no schedule — adding a post is a markdown file, no code change.
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
  const t = getDictionary(locale as Locale).indexes;
  return { title: `${t.writingTitle} — ${site.name}`, description: t.writingLede };
}

export default async function WritingIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('writing', locale);

  return (
    <div className="container py-16">
      <PageIntro title={t.writingTitle} lede={t.writingLede} />
      <ul className="mt-10 divide-y divide-border border-y border-border">
        {entries.map((e) => {
          const date = typeof e.data.date === 'string' ? e.data.date : '';
          return (
            <li key={e.slug}>
              <Link href={hrefFor(locale, `/writing/${e.slug}`)} className="group block py-6">
                {date ? (
                  <time dateTime={date} className="text-xs uppercase tracking-wide text-muted-foreground">
                    {formatDate(date, locale)}
                  </time>
                ) : null}
                <h2 className="mt-1 text-lg font-medium group-hover:underline">{title(e.data)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{summary(e.data)}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
