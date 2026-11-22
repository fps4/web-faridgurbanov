import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { listSection, title, type ContentMeta } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { EARLIER_WORK_ANCHOR, alsoBuilt, earlierWork, site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';
import { LocaleNotice } from '@/components/locale-notice';
import { fallbackCanonical } from '@/lib/canonical';

// The Work page (art-vvzsw9ap9e, ADR-0010 §3.3, §5), in the order of the approved design: the
// introduction, the two case studies as rows, Earlier work as a short list with no case pages, and
// the Also built strip with the owner's public repositories. Every text is verbatim from the
// approved site copy: the introduction, the list labels and the Earlier work and Also built
// entries come from lib/dictionaries.ts and lib/site.ts; a case study's list line and Where it
// stands come from its own frontmatter (`large`, `listed`, `stands`). An element whose text is not there is
// not drawn.
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
  return { title: `${t.workTitle} — ${site.name}`, description: t.workIntro, ...fallbackCanonical(locale, '/work') };
}

const str = (e: ContentMeta, key: string) =>
  typeof e.data[key] === 'string' ? (e.data[key] as string) : '';

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).indexes;
  const entries = await listSection('work', locale);

  return (
    <>
      <div className="container py-16">
        <LocaleNotice locale={locale} />
        <PageIntro title={t.workTitle} lede={t.workIntro} />

        <ol className="mt-12 flex flex-col border-b border-border">
          {entries.map((e) => {
            const large = str(e, 'large');
            const listed = str(e, 'listed');
            const stands = str(e, 'stands');
            return (
              <li key={e.slug} className="border-t border-border">
                <Link
                  href={hrefFor(locale, `/work/${e.slug}`)}
                  className="group flex flex-wrap gap-x-10 gap-y-2 py-7"
                >
                  {large ? (
                    <span className="flex-[0_0_16rem] text-2xl font-semibold leading-tight tracking-tight">
                      {large}
                    </span>
                  ) : null}
                  <div className="flex min-w-0 flex-[999_1_24rem] flex-col gap-1.5">
                    <h2 className="flex items-start justify-between gap-3 text-lg font-semibold">
                      {title(e.data)}
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </h2>
                    {listed ? <p className="max-w-3xl text-foreground/90">{listed}</p> : null}
                    {stands ? (
                      <p className="max-w-3xl text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{t.whereItStands}</span> {stands}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <section id={EARLIER_WORK_ANCHOR} aria-labelledby="earlier-work-heading" className="scroll-mt-6">
        <div className="container flex flex-wrap gap-x-10 gap-y-6 pb-16">
          <div className="flex min-w-0 flex-[1_1_16rem] flex-col gap-2">
            <h2 id="earlier-work-heading" className="text-xl font-semibold tracking-tight">
              {t.earlierHeading}
            </h2>
            <p className="text-sm text-muted-foreground">{t.earlierLine}</p>
          </div>
          <ul className="m-0 flex min-w-0 flex-[999_1_32rem] list-none flex-col border-b border-border p-0">
            {earlierWork.map((e) => (
              <li key={e.id} id={e.id} className="scroll-mt-6 border-t border-border py-3.5 text-foreground/90">
                <strong className="font-semibold text-foreground">{e.lead}</strong>
                {e.rest}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="also-built-heading" className="border-t border-border bg-muted/40">
        <div className="container flex flex-wrap gap-x-10 gap-y-6 py-12">
          <div className="flex min-w-0 flex-[1_1_16rem] flex-col gap-2">
            <h2 id="also-built-heading" className="text-xl font-semibold tracking-tight">
              {t.alsoHeading}
            </h2>
            <p className="text-sm text-muted-foreground">{t.alsoLine}</p>
          </div>
          <ul className="m-0 flex min-w-0 flex-[999_1_32rem] list-none flex-col border-b border-border p-0">
            {alsoBuilt.map((r) => (
              <li key={r.name} className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border py-3.5">
                <a
                  href={r.href}
                  rel="noopener"
                  target="_blank"
                  className="flex-[0_0_15rem] py-1 font-semibold underline-offset-4 hover:underline"
                >
                  {r.name}
                </a>
                <span className="min-w-0 flex-[1_1_18rem] text-foreground/90">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
