import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title, type ContentMeta } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Expertise index (FS-0003/US-0012, redesigned by ADR-0008). Two groups, deliberately asymmetric.
//
// Practice ("how I work") renders as two large feature cards, because it is the page's argument and
// the thing a buyer doubts. The five domain areas render as a compact list. Giving both groups the
// same card made the ordering the only signal of hierarchy, and readers do not register ordering.
// The compact list also removes the stray empty cell a five-item card grid leaves behind.
//
// Every row carries its evidence — the case studies that back it — resolved from the `evidence`
// frontmatter against the work section, so an index chip can never claim a study the page does not
// actually cite.
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
  return { title: `${t.expertiseTitle} — ${site.name}`, description: t.expertiseLede };
}

interface Evidence {
  label: string;
  href: string;
}

/** Resolve `evidence: [work-slug | portfolio]` to labels, using each study's own short title. */
function resolveEvidence(entry: ContentMeta, work: ContentMeta[], portfolioLabel: string): Evidence[] {
  const slugs = Array.isArray(entry.data.evidence) ? (entry.data.evidence as string[]) : [];
  return slugs.flatMap((slug) => {
    if (slug === 'portfolio') return [{ label: portfolioLabel, href: '/portfolio' }];
    const study = work.find((w) => w.slug === slug);
    if (!study) return [];
    const short = typeof study.data.short === 'string' ? study.data.short : title(study.data);
    return [{ label: short, href: `/work/${slug}` }];
  });
}

function EvidenceChips({ locale, items }: { locale: Locale; items: Evidence[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((e) => (
        <li key={e.href} className="rounded-full border border-border px-2.5 py-0.5">
          {e.label}
        </li>
      ))}
    </ul>
  );
}

export default async function ExpertiseIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const [entries, work] = await Promise.all([
    listSection('expertise', locale),
    listSection('work', locale),
  ]);

  const practice = entries.filter((e) => e.data.group === 'practice');
  const domain = entries.filter((e) => e.data.group !== 'practice');

  return (
    <div className="container py-16">
      <PageIntro title={t.expertiseTitle} lede={t.expertiseLede} />

      {practice.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.expertiseGroups.practice.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t.expertiseGroups.practice.lede}</p>

          <ul className="mt-6 grid gap-6 lg:grid-cols-2">
            {practice.map((e) => (
              <li key={e.slug}>
                <Link
                  href={hrefFor(locale, `/expertise/${e.slug}`)}
                  className="group flex h-full flex-col rounded-lg border border-border bg-muted/40 p-8 transition-colors hover:bg-muted/70"
                >
                  <h3 className="flex items-start justify-between gap-3 text-xl font-medium tracking-tight">
                    {title(e.data)}
                    <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-3 flex-1 text-muted-foreground">{summary(e.data)}</p>
                  <div className="mt-6">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.evidenceLabel}
                    </p>
                    <EvidenceChips
                      locale={locale}
                      items={resolveEvidence(e, work, t.portfolioLabel)}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.expertiseGroups.domain.heading}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.expertiseGroups.domain.lede}</p>

        <ul className="mt-6 flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
          {domain.map((e) => (
            <li key={e.slug} className="bg-background">
              <Link
                href={hrefFor(locale, `/expertise/${e.slug}`)}
                className="group grid items-baseline gap-x-8 gap-y-2 p-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] sm:px-6"
              >
                <h3 className="font-medium">{title(e.data)}</h3>
                <p className="text-sm text-muted-foreground">{summary(e.data)}</p>
                <div className="flex items-center gap-4 sm:justify-end">
                  <EvidenceChips
                    locale={locale}
                    items={resolveEvidence(e, work, t.portfolioLabel)}
                  />
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
