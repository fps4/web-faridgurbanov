import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ContentArticle } from '@/components/content-article';
import { PracticeTags } from '@/components/practice-tags';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/lib/i18n';
import { hrefFor } from '@/lib/nav';
import { entryHref, listEntries, neighbours, resolveRelated, type Entry } from '@/lib/practice';

// A guideline's or a pattern's page (FS-0013): title, summary, kind and id badge, last-revised
// date, the status where it is not `current`, what it replaces or is replaced by, its tags (each a
// link to the filtered list), the body, the pages where it was applied, and the entries of the
// same kind either side of it in `order`.
export async function PracticeEntry({ entry: e, locale }: { entry: Entry; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.practice;
  const all = await listEntries(locale);
  const sameKind = all.filter((o) => o.kind === e.kind);
  const related = await resolveRelated(e, all, locale);
  const { prev, next } = neighbours(sameKind, e.slug);
  const replaced = e.supersedes ? all.find((o) => o.id === e.supersedes) : undefined;
  const replacedBy = all.find((o) => o.supersedes === e.id);

  const meta = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded border border-border px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-foreground">
          {p.kind[e.kind]} · {e.id}
        </span>
        {e.status !== 'current' ? (
          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground">{p.status[e.status]}</span>
        ) : null}
        <span>
          {p.lastRevised} <time dateTime={e.revised}>{formatDate(e.revised, locale)}</time>
        </span>
        {replaced ? (
          <span>
            {p.supersedes}{' '}
            <Link href={hrefFor(locale, entryHref(replaced))} className="underline underline-offset-4">
              {replaced.id}
            </Link>
          </span>
        ) : null}
        {replacedBy ? (
          <span>
            {p.supersededBy}{' '}
            <Link href={hrefFor(locale, entryHref(replacedBy))} className="underline underline-offset-4">
              {replacedBy.id}
            </Link>
          </span>
        ) : null}
      </div>
      <PracticeTags tags={e} locale={locale} label={p.filterTopic} />
    </div>
  );

  const card = 'group rounded-lg border border-border p-4 hover:border-foreground/40';
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
          <nav aria-label={p.kindPlural[e.kind]} className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={hrefFor(locale, entryHref(prev))} className={card}>
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
              <Link href={hrefFor(locale, entryHref(next))} className={`${card} text-right`}>
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
      entry={{ slug: e.slug, data: { title: e.title }, body: e.body, isFallback: e.isFallback }}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/practice')}
      backLabel={p.backToIndex}
      lede={e.summary}
      meta={meta}
      after={after}
    />
  );
}
