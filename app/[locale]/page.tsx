import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ObfuscatedEmail } from '@/components/obfuscated-email';
import { WhatsAppButton } from '@/components/whatsapp-contact';
import { IntroVideo } from '@/components/intro-video';
import { HeroPhoto, heroPhotoShown } from '@/components/hero-photo';
import { ReferenceQuote } from '@/components/reference-quote';
import { listSection, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { CONTACT_HREF, hrefFor } from '@/lib/nav';
import { earlierWorkOf, featuredReferences, loadReferences, workPath } from '@/lib/references';
import { locales, type Locale } from '@/lib/i18n';
import { earlierWorkTitle, site } from '@/lib/site';
import { LocaleNotice } from '@/components/locale-notice';
import { fallbackCanonical } from '@/lib/canonical';
import { trackRecordCards, whatIDoHrefs } from '@/lib/home';

// Home page (FS-0002; maestro story art-9947n0hg99, following the decision art-896t5kxfka): the hero
// (line above the title, title, introduction, two buttons), the optional intro video and How I work,
// every text verbatim from the approved site copy, section "Home". The references band stays as it
// was until its own story: it renders nothing WHILE no reference is marked `featured` (FS-0009).
// Track record and What I do (art-spqwxpsqc3, following art-896t5kxfka §5): two bands between the
// introduction and How I work, as the design orders them, texts verbatim from the approved copy
// ("Home · track record", "Home · What I do"); where each card and line leads is in lib/home.ts.
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
  const tc = getDictionary(locale).contact;
  const tr = getDictionary(locale).references;
  const featured = featuredReferences(await loadReferences());
  const work = await listSection('work', locale);
  // A card's large text is the case study's own `large` when it has one (the same words as its row
  // on the Work page), so the two places cannot drift.
  const largeOf = (slug: string) => {
    const v = work.find((w) => w.slug === slug)?.data.large;
    return typeof v === 'string' && v.trim() !== '' ? v : undefined;
  };
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
        <div
          className={`container py-16 sm:py-24 ${
            heroPhotoShown() ? 'grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]' : ''
          }`}
        >
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
                <Link href={hrefFor(locale, CONTACT_HREF)}>{t.primaryContact}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hrefFor(locale, '/work')}>{t.primaryWork}</Link>
              </Button>
            </div>
          </div>
          {/* The photo (art-cxvf6s5t94): in this column WHILE INTRO_VIDEO is null; renders nothing
              once a video is set, and the video takes its place below. */}
          <HeroPhoto locale={locale} />
        </div>
      </section>

      {/* The place of the intro video (art-9947n0hg99, AC-5): no frame WHILE INTRO_VIDEO in
          lib/site.ts is null; the photo in the hero stands in its place until then. */}
      <IntroVideo locale={locale} />

      <section aria-labelledby="track-record" className="border-t border-border bg-muted/40">
        <div className="container flex flex-col gap-7 py-12">
          <div className="flex flex-col gap-1.5">
            <h2 id="track-record" className="text-2xl font-semibold tracking-tight">
              {t.trackHeading}
            </h2>
            <p className="text-muted-foreground">{t.trackLine}</p>
          </div>
          <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {trackRecordCards.map((card, i) => {
              const copy = t.trackCards[i];
              const large = card.largeFrom ? largeOf(card.largeFrom) : copy.large;
              return (
                <li key={i} className="flex">
                  <Link
                    href={hrefFor(locale, card.href)}
                    className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-background p-5 transition-colors hover:border-foreground/40"
                  >
                    {large ? (
                      <span className="text-2xl font-semibold leading-tight tracking-tight">{large}</span>
                    ) : null}
                    <span className="text-[15px] text-foreground/90">{copy.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="what-i-do">
        <div className="container flex flex-wrap gap-x-10 gap-y-6 py-16">
          <div className="flex min-w-0 flex-[1_1_16rem] flex-col gap-2">
            <h2 id="what-i-do" className="text-2xl font-semibold tracking-tight">
              {t.whatHeading}
            </h2>
            <p className="text-muted-foreground">{t.whatLine}</p>
          </div>
          <ul className="m-0 flex min-w-0 flex-[999_1_32rem] list-none flex-col border-b border-border p-0">
            {t.whatLines.map((line, i) => (
              <li
                key={line.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border py-4"
              >
                <span className="min-w-0 font-semibold">
                  {line.name} <span className="font-normal text-muted-foreground">{line.detail}</span>
                </span>
                <Link
                  href={hrefFor(locale, whatIDoHrefs[i])}
                  className="py-1 underline underline-offset-4"
                >
                  {line.link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      {/* Contact (maestro story art-r903t1r2tp, AC-1 to AC-3, AC-7): the id is the anchor the header,
          the footer and /contact lead to. The address and the number are put together in the
          browser. No Available and Résumé rows until the résumé story brings their text. */}
      <section id="contact" aria-labelledby="contact-h" className="border-t border-border">
        <div className="container grid gap-10 py-16 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 id="contact-h" className="text-2xl font-semibold tracking-tight">
              {tc.title}
            </h2>
            <p className="max-w-xl text-lg">{tc.lede}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ObfuscatedEmail className={buttonVariants({ size: 'lg' })} fallbackClassName="self-center text-muted-foreground">
                {tc.email}
              </ObfuscatedEmail>
              <WhatsAppButton label={tc.whatsapp} />
              <Button asChild size="lg" variant="outline">
                <a href={site.linkedin} rel="me noopener" target="_blank">
                  {tc.linkedin}
                </a>
              </Button>
            </div>
          </div>
          <dl className="border-b border-border">
            {[
              [tc.contractLabel, tc.contractValue],
              [tc.basedLabel, tc.basedValue],
              [tc.languagesLabel, tc.languagesValue],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border py-3.5">
                <dt className="basis-36 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 basis-48 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
