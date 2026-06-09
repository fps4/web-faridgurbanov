import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Selected-work index (FS-0004/US-0011): 3–4 case studies, each with a one-line hook and a
// headline impact metric (frontmatter `hook` / `metric`). Detail bodies are markdown under
// content/{locale}/work/. The Cloud Gateway study carries its scale + cost-saving metrics.
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
  return { title: `${t.workTitle} — ${site.name}`, description: t.workLede };
}

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('work', locale);

  return (
    <div className="container py-16">
      <PageIntro title={t.workTitle} lede={t.workLede} />
      <ul className="mt-10 space-y-4">
        {entries.map((e) => {
          const hook = typeof e.data.hook === 'string' ? e.data.hook : summary(e.data);
          const metric = typeof e.data.metric === 'string' ? e.data.metric : '';
          return (
            <li key={e.slug}>
              <Link
                href={hrefFor(locale, `/work/${e.slug}`)}
                className="group flex flex-col gap-3 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-medium">{title(e.data)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{hook}</p>
                </div>
                <div className="flex items-center gap-4">
                  {metric ? (
                    <span className="whitespace-nowrap text-sm font-semibold">{metric}</span>
                  ) : null}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
