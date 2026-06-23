import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Expertise index (FS-0003/US-0012): the six areas, AI & applied-ML leading, each linking
// to its page. Authored as markdown under content/{locale}/expertise via the FS-0001 pipeline.
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

export default async function ExpertiseIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('expertise', locale);

  return (
    <div className="container py-16">
      <PageIntro title={t.expertiseTitle} lede={t.expertiseLede} />
      <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {entries.map((e) => (
          <li key={e.slug} className="bg-background">
            <Link href={hrefFor(locale, `/expertise/${e.slug}`)} className="group block h-full p-6">
              <h2 className="flex items-center justify-between gap-2 text-lg font-medium">
                {title(e.data)}
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{summary(e.data)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
