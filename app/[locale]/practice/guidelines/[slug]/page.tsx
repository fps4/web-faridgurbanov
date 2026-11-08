import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ContentArticle } from '@/components/content-article';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/dates';
import { getGuideline, guidelineSlugs, listGuidelines, neighbours, resolveRelated } from '@/lib/guidelines';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Guideline detail (FS-0013): title, summary, the id badge and the last-revised date (the status
// only when it is not `current`), the body in the template's sections, the pages where the
// guideline was applied when it names any, and the guidelines either side of it in `order`. A
// guideline that replaces another, or is replaced, links to the other one in its meta line.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await guidelineSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const g = await getGuideline(slug, locale);
  if (!g) return {};
  return { title: `${g.id}: ${g.title} — ${site.name}`, description: g.summary };
}

export default async function GuidelinePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const g = await getGuideline(slug, locale);
  if (!g) notFound();
  const t = getDictionary(locale);
  const p = t.practice;
  const all = await listGuidelines(locale);
  const related = await resolveRelated(g, all, locale);
  const { prev, next } = neighbours(all, slug);
  const replaced = g.supersedes ? all.find((o) => o.id === g.supersedes) : undefined;
  const replacedBy = all.find((o) => o.supersedes === g.id);

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="rounded border border-border px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-foreground">
        {g.id}
      </span>
      {g.status !== 'current' ? (
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground">{p.status[g.status]}</span>
      ) : null}
      <span>
        {p.lastRevised} <time dateTime={g.revised}>{formatDate(g.revised, locale)}</time>
      </span>
      {replaced ? (
        <span>
          {p.supersedes}{' '}
          <Link href={hrefFor(locale, `/practice/guidelines/${replaced.slug}`)} className="underline underline-offset-4">
            {replaced.id}
          </Link>
        </span>
      ) : null}
      {replacedBy ? (
        <span>
          {p.supersededBy}{' '}
          <Link href={hrefFor(locale, `/practice/guidelines/${replacedBy.slug}`)} className="underline underline-offset-4">
            {replacedBy.id}
          </Link>
        </span>
      ) : null}
    </div>
  );

  const after =
    related.length || prev || next ? (
      <div className="flex flex-col gap-10">
        {related.length ? (
          <section aria-labelledby="related">
            <h2 id="related" className="text-xl font-semibold tracking-tight">
              {p.related}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={hrefFor(locale, r.href)} className="underline underline-offset-4">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {prev || next ? (
          <nav aria-label={p.guidelinesHeading} className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={hrefFor(locale, `/practice/guidelines/${prev.slug}`)}
                className="group rounded-lg border border-border p-4 hover:border-foreground/40"
              >
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" aria-hidden />
                  {p.previous}
                </span>
                <span className="mt-1 block font-medium group-hover:underline">
                  {prev.id} · {prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={hrefFor(locale, `/practice/guidelines/${next.slug}`)}
                className="group rounded-lg border border-border p-4 text-right hover:border-foreground/40"
              >
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  {p.next}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
                <span className="mt-1 block font-medium group-hover:underline">
                  {next.id} · {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    ) : undefined;

  return (
    <ContentArticle
      entry={{ slug: g.slug, data: { title: g.title }, body: g.body, isFallback: g.isFallback }}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/practice')}
      backLabel={p.backToIndex}
      lede={g.summary}
      meta={meta}
      after={after}
    />
  );
}
