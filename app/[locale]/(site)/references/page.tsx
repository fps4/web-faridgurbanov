import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { ReferenceQuote } from '@/components/reference-quote';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { loadReferences, referencesFor } from '@/lib/references';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// References (FS-0009). Every published reference, grouped by the case study it is about, in the
// case-study order, so the page reads as the work with the people who were there beside it. WHILE
// no reference is published the page is a 404 — an empty page saying "references" would be worse
// than none — and every link to it is gated on the same count (home band, contact block, footer).
// (Returning no params here would not stop the export: the [locale] layout's params still produce
// the path, so the page itself has to refuse.)
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
  const t = getDictionary(locale as Locale).references;
  return { title: `${t.title} — ${site.name}`, description: t.lede };
}

export default async function ReferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).references;
  const refs = await loadReferences();
  if (refs.length === 0) notFound();
  const work = await listSection('work', locale);
  const groups = work
    .map((study) => ({ study, refs: referencesFor(refs, study.slug) }))
    .filter((g) => g.refs.length > 0);
  const anyVerified = refs.some((r) => r.verified);

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />

      {groups.map(({ study, refs: entries }) => {
        const short = typeof study.data.short === 'string' ? study.data.short : title(study.data);
        const client = typeof study.data.client === 'string' ? study.data.client : '';
        return (
          <section key={study.slug} className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pb-3">
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-base font-medium">{short}</span>
                {client ? <span className="text-sm text-muted-foreground">{client}</span> : null}
              </h2>
              <Link
                href={hrefFor(locale, `/work/${study.slug}`)}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {t.readCaseStudy}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {entries.map((ref) => (
              <ReferenceQuote key={ref.slug} reference={ref} locale={locale} variant="page" />
            ))}
          </section>
        );
      })}

      <section className="mt-12 max-w-2xl">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.collectedHeading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {t.collectedBody}
          {anyVerified ? (
            <>
              {' '}
              {t.collectedLinkedin}{' '}
              <a
                href={site.linkedinRecommendations}
                rel="me noopener"
                target="_blank"
                className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-foreground"
              >
                {t.linkedin}
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
