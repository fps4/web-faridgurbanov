import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntroVideo } from '@/components/intro-video';
import { ReferenceQuote } from '@/components/reference-quote';
import { listSection, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { hrefFor } from '@/lib/nav';
import { earlierWorkOf, featuredReferences, loadReferences, workPath } from '@/lib/references';
import { earlierWorkTitle } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';
import { LocaleNotice } from '@/components/locale-notice';
import { fallbackCanonical } from '@/lib/canonical';

// Home page (FS-0002; maestro story art-9947n0hg99, following the decision art-896t5kxfka): the hero
// (line above the title, title, introduction, two buttons), the optional intro video and How I work,
// every text verbatim from the approved site copy, section "Home". The references band stays as it
// was until its own story: it renders nothing WHILE no reference is marked `featured` (FS-0009).
// The track record and What I do bands come back when their text is approved, not before.
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
  const t = getDictionary(locale as Locale).home;
  return { title: 'Farid Gurbanov', description: t.heroIntro[0], ...fallbackCanonical(locale, '') };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).home;
  const tr = getDictionary(locale).references;
  const featured = featuredReferences(await loadReferences());
  const work = featured.length ? await listSection('work', locale) : [];
  const workLabel = (slug: string) => {
    const earlier = earlierWorkOf(slug);
    if (earlier) return earlierWorkTitle(earlier);
    const study = work.find((w) => w.slug === slug);
    if (!study) return undefined;
    return typeof study.data.short === 'string' ? study.data.short : title(study.data);
  };

  return (
    <>
      <section>
        <div className="container py-16 sm:py-24">
          <div className="max-w-3xl">
            <LocaleNotice locale={locale} />
            <p className="text-sm font-medium text-muted-foreground">{t.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t.heroTitle}</h1>
            <div className="mt-6 space-y-4 text-lg">
              {t.heroIntro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={hrefFor(locale, '/contact')}>{t.primaryContact}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hrefFor(locale, '/work')}>{t.primaryWork}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The place of the intro video (art-9947n0hg99, AC-5): nothing at all, no frame, WHILE
          INTRO_VIDEO in lib/site.ts is null. */}
      <IntroVideo locale={locale} />

      <section aria-labelledby="how-i-work" className="border-t border-border">
        <div className="container grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <h2 id="how-i-work" className="text-2xl font-semibold tracking-tight">
              {t.howHeading}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.howLine}</p>
          </div>
          <div className="space-y-5 text-lg">
            {t.howBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link
              href={hrefFor(locale, '/practice')}
              className="inline-block py-2 text-base font-medium underline underline-offset-4"
            >
              {t.howCta}
            </Link>
          </div>
        </div>
      </section>

      {/* 2b — references. People who were on those engagements, in their own words, each linked to
          their public profile. Two at most: the band is two columns, and two voices from different
          sides (product and engineering, say) carry more than three from the same one. */}
      {featured.length > 0 && (
        <section className="border-t border-border">
          <div className="container py-16">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {tr.heading}
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{tr.homeLede}</p>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
              {featured.map((ref) => (
                <ReferenceQuote
                  key={ref.slug}
                  reference={ref}
                  locale={locale}
                  variant="home"
                  workLabel={workLabel(ref.work)}
                  workHref={hrefFor(locale, workPath(ref.work))}
                />
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href={hrefFor(locale, '/references')}>
                  {tr.allCta}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

    </>
  );
}
