import Link from 'next/link';
import { Markdown } from '@/components/markdown';
import { FallbackNotice } from '@/components/fallback-notice';
import { Button } from '@/components/ui/button';
import { title as fmTitle, type ContentEntry } from '@/lib/content';
import { caseStudyLabels, type CaseStudyFrontmatter } from '@/lib/case-study';
import { defaultLocale, type Locale } from '@/lib/i18n';

// The case-study page (art-13yb9kshaw, ADR-0010 §5): title, intro line and small line, a row of
// facts, the article parts in the order the markdown body has them, a facts column and a bar at
// the foot. The template holds no copy of its own: every text is the entry's frontmatter or body,
// and an element whose text the entry does not carry is not drawn (so no empty place is held for a
// reference, and the Next link waits for the next case study to be on this page).
//
// `reference` is the published reference about this work, if there is one, drawn under the facts.
// `fallbackMessage` is the notice shown when the requested locale fell back to English (ADR-0002).
// `backHref`, `contactHref` and `nextHref` are already localized. The labels of the facts column and the texts
// of the bar are `caseStudyLabels`, in the page's language (English when the entry fell back).
export function CaseStudy({
  entry,
  locale,
  study,
  fallbackMessage,
  reference,
  backHref,
  contactHref,
  nextHref,
}: {
  entry: ContentEntry;
  locale: Locale;
  study: CaseStudyFrontmatter;
  fallbackMessage: string;
  reference?: React.ReactNode;
  backHref: string;
  contactHref: string;
  nextHref: string | null;
}) {
  const labels = caseStudyLabels[entry.isFallback ? defaultLocale : locale];
  const facts: { label: string; value: string }[] = [];
  if (study.role) facts.push({ label: labels.role, value: study.role });
  if (study.client) facts.push({ label: labels.client, value: study.client });
  if (study.builtWith) facts.push({ label: labels.builtWith, value: study.builtWith });

  return (
    <div lang={entry.isFallback ? defaultLocale : undefined}>
      <div className="container max-w-5xl pt-16">
        {entry.isFallback ? <FallbackNotice message={fallbackMessage} /> : null}
        <Link
          href={backHref}
          className="mb-4 inline-block py-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {labels.back}
        </Link>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {fmTitle(entry.data)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/90">{study.intro}</p>
        {study.small ? <p className="mt-3 text-sm text-muted-foreground">{study.small}</p> : null}
      </div>

      {study.facts.length > 0 ? (
        <div className="mt-10 border-y border-border bg-muted/40">
          <ul className="container grid max-w-5xl gap-x-10 gap-y-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
            {study.facts.map((fact) => (
              <li key={fact.large} className="flex flex-col gap-0.5">
                <span className="text-2xl font-semibold leading-snug tracking-tight">{fact.large}</span>
                {fact.small ? <span className="text-sm text-foreground/90">{fact.small}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="container flex max-w-5xl flex-wrap gap-x-12 gap-y-10 py-14">
        <div className="min-w-0 max-w-2xl flex-[999_1_32rem]">
          <Markdown locale={locale}>{entry.body}</Markdown>
        </div>
        {facts.length > 0 || reference ? (
          <aside className="flex min-w-0 flex-[1_1_16rem] flex-col gap-8">
            {facts.length > 0 ? (
              <dl className="m-0 flex flex-col border-b border-border text-sm">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5 border-t border-border py-3">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="m-0 font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {reference}
          </aside>
        ) : null}
      </div>

      <div className="border-t border-border">
        <div className="container flex max-w-5xl flex-wrap items-center justify-between gap-5 py-10">
          <p className="m-0 text-lg font-medium">{labels.barQuestion}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={contactHref}>{labels.barAction}</Link>
            </Button>
            {study.next && nextHref ? (
              <Button asChild size="lg" variant="outline">
                <Link href={nextHref}>{study.next.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
