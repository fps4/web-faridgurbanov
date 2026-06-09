import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';
import { hrefFor } from '@/lib/nav';
import { HOME_VARIANT } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Home page (FS-0002/US-0010). M0 leads with the credibility hero; the M1 training-forward flip is
// the single HOME_VARIANT switch (ADR-0003) — the section set and CTAs stay, only the lead changes,
// so no structural rebuild. Authored fully in EN + NL (highest-traffic page).
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
      <section className="container py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {t.available}
          </span>

          {/* M0: credibility-led. M1 (HOME_VARIANT='training') leads with the training offer and
              moves the architect proof beneath it — same page, configured emphasis (FS-0002). */}
          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
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
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="container py-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.proofHeading}
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
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
    </>
  );
}
