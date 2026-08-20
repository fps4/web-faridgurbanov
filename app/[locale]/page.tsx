import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/hero-backdrop';
import { IntroVideo } from '@/components/intro-video';
import { getDictionary } from '@/lib/dictionaries';
import { hrefFor } from '@/lib/nav';
import { HOME_VARIANT, TRAINING_PUBLISHED } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Home page (FS-0002/US-0010). M0 leads with the credibility hero; the M1 training-forward flip is
// the single HOME_VARIANT switch (ADR-0003) — the section set and CTAs stay, only the lead changes,
// so no structural rebuild. Authored fully in EN + NL (highest-traffic page).
//
// Restructured by ADR-0007 into three bands under the hero, in the order a doubting buyer needs
// them: what has been delivered (track record), how it got adopted (the half that was doubted), and
// only then what I build (technical depth, which is the half nobody questions). The optional intro
// video sits directly under the hero and renders nothing until INTRO_VIDEO is configured.
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
  return { title: 'Farid Gurbanov', description: t.heroLede };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).home;

  return (
    <>
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="container py-16 sm:py-24">
          <div className="relative max-w-3xl">
            {/* M0: credibility-led. M1 (HOME_VARIANT='training') leads with the training offer and
                moves the architect proof beneath it — same page, configured emphasis (FS-0002). */}
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {HOME_VARIANT === 'training' ? t.tasterHeading : t.heroEyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t.heroTitle}</h1>
            <p className="mt-6 text-lg text-muted-foreground">{t.heroLede}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={hrefFor(locale, '/work')}>
                  {t.primaryWork}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hrefFor(locale, '/contact')}>{t.primaryContact}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 0 — the person. Renders only once a video exists (lib/site.ts → INTRO_VIDEO). */}
      <IntroVideo
        locale={locale}
        heading={t.introHeading}
        body={t.introBody}
        durationLabel={t.introDuration}
      />

      {/* 1 — experience. The numbers first, because they are what makes the rest credible. */}
      <section className="border-y border-border bg-muted/40">
        <div className="container py-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.proofHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">{t.proofLede}</p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.proofPoints.map((p) => (
              <li key={p.label}>
                <Link href={hrefFor(locale, p.href)} className="group block">
                  <p className="text-2xl font-semibold tracking-tight">{p.metric}</p>
                  <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">
                    {p.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 — stakeholder management. The track record above answers "has he built it"; this band
          answers "can he get an organisation to adopt it" — the question a metric cannot. Each card
          opens the case study carrying the full "Who had to say yes" section. */}
      <section className="container py-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.practiceHeading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{t.practiceLede}</p>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {t.practicePoints.map((p) => (
            <li key={p.title} className="bg-background">
              <Link href={hrefFor(locale, p.href)} className="group block h-full p-6">
                <h3 className="flex items-start justify-between gap-2 text-base font-medium">
                  {p.title}
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href={hrefFor(locale, '/expertise/stakeholder-alignment')}>
              {t.practiceCta}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3 — technical expertise. Last on purpose: it is the half nobody doubts, so it does not need
          to be the half that argues first. */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-16">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.buildHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{t.buildLede}</p>
          {/* Five areas plus the portfolio, so the 1px-gap grid fills exactly — an empty sixth cell
              in this pattern renders as a stray grey block. The portfolio tile doubles as the CTA. */}
          <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {t.buildPoints.map((b) => (
              <li key={b.title} className="bg-background">
                <Link href={hrefFor(locale, b.href)} className="group block h-full p-6">
                  <h3 className="flex items-start justify-between gap-2 text-base font-medium">
                    {b.title}
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{b.body}</p>
                </Link>
              </li>
            ))}
            <li className="bg-muted/60">
              <Link href={hrefFor(locale, '/portfolio')} className="group block h-full p-6">
                <h3 className="flex items-start justify-between gap-2 text-base font-medium">
                  {t.buildCta}
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{t.buildCtaBody}</p>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Training block — hidden until M1 (TRAINING_PUBLISHED). Copy stays in the dictionary. */}
      {TRAINING_PUBLISHED && (
        <section className="container py-16">
          <div className="max-w-2xl rounded-lg border border-border p-8">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {t.tasterHeading}
            </h2>
            <p className="mt-4 text-lg">{t.tasterBody}</p>
            <div className="mt-6">
              <Button asChild variant="secondary">
                <Link href={hrefFor(locale, '/training')}>{t.tasterCta}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
