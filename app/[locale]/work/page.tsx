import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, summary, title, type ContentMeta } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Selected-work index (FS-0004/US-0011, redesigned by ADR-0008). Four case studies, all client
// engagements — few enough that the index can carry them rather than list them. Each row shows the
// headline metric at display size, the abstracted client (so the page keeps the promise its lede
// makes), the hook, the disagreement, and the stack. The disagreement is the differentiator and it
// belongs here: a visitor who never opens a case study should still see that these engagements were
// argued about. All of it is frontmatter, so a new study needs no code change.
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

const str = (e: ContentMeta, key: string) =>
  typeof e.data[key] === 'string' ? (e.data[key] as string) : '';

const list = (e: ContentMeta, key: string) =>
  Array.isArray(e.data[key]) ? (e.data[key] as string[]) : [];

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('work', locale);

  return (
    <div className="container py-16">
      <PageIntro title={t.workTitle} lede={t.workLede} />

      <ol className="mt-12 flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
        {entries.map((e) => {
          const hook = str(e, 'hook') || summary(e.data);
          const disagreement = str(e, 'disagreement');
          const stack = list(e, 'stack');
          return (
            <li key={e.slug} className="bg-background">
              <Link
                href={hrefFor(locale, `/work/${e.slug}`)}
                className="group grid gap-x-10 gap-y-5 p-6 sm:p-8 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
              >
                {/* The metric leads. On the home page these numbers are set large and land hard;
                    setting them small here made the strongest asset on the page a footnote. */}
                <div className="lg:pt-1">
                  <p className="text-2xl font-semibold tracking-tight">{str(e, 'metric')}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{str(e, 'client')}</p>
                </div>

                <div>
                  <h2 className="flex items-start justify-between gap-3 text-lg font-medium">
                    {title(e.data)}
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </h2>
                  <p className="mt-2 text-muted-foreground">{hook}</p>

                  {disagreement ? (
                    <div className="mt-5 border-l-2 border-border pl-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t.disagreementLabel}
                      </p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{disagreement}</p>
                    </div>
                  ) : null}

                  {stack.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
                      {stack.map((s) => (
                        <li key={s} className="rounded-full border border-border px-2.5 py-0.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">{t.workHonesty}</p>
    </div>
  );
}
