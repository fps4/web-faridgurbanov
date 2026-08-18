import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title, type ContentMeta } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Expertise index (FS-0003/US-0012): the areas in two groups — the technical domains ("what I
// build") and the architecture practice ("how I work"), the latter carrying the stakeholder and
// decision-making work a domain page can't. Grouping is frontmatter (`group:`), so adding an area
// stays a markdown-only change. An entry without a group falls into the domain group.
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

function AreaGrid({ locale, entries }: { locale: Locale; entries: ContentMeta[] }) {
  return (
    <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
      {entries.map((e) => (
        <li key={e.slug} className="bg-background">
          <Link href={hrefFor(locale, `/expertise/${e.slug}`)} className="group block h-full p-6">
            <h3 className="flex items-center justify-between gap-2 text-lg font-medium">
              {title(e.data)}
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{summary(e.data)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ExpertiseIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('expertise', locale);

  const practice = entries.filter((e) => e.data.group === 'practice');
  const domain = entries.filter((e) => e.data.group !== 'practice');

  return (
    <div className="container py-16">
      <PageIntro title={t.expertiseTitle} lede={t.expertiseLede} />

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.expertiseGroups.domain.heading}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.expertiseGroups.domain.lede}</p>
        <AreaGrid locale={locale} entries={domain} />
      </section>

      {practice.length > 0 && (
        <section className="mt-14">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.expertiseGroups.practice.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t.expertiseGroups.practice.lede}</p>
          <AreaGrid locale={locale} entries={practice} />
        </section>
      )}
    </div>
  );
}
