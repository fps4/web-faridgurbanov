import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { PageIntro } from '@/components/page-intro';
import { getEntry, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { hrefFor } from '@/lib/nav';
import { site, storylineVisible } from '@/lib/site';
import { KIT_REPO, STORYLINE_SECTION, parts, storylineCopy } from '@/lib/storyline';
import { locales, type Locale } from '@/lib/i18n';

// The AI Product Design storyline index (FS-0010): what the storyline is, the running example, and
// the eight parts in order. A part with a page links to it; a part still to come is listed so the
// reader sees the whole arc. WHILE the storyline is unpublished a production build renders a 404
// (STORYLINE_PUBLISHED, ADR-0010); `next dev` shows it.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = storylineCopy[locale as Locale];
  return { title: `${t.title} — ${site.name}`, description: t.tagline };
}

export default async function StorylineIndex({ params }: { params: Promise<{ locale: string }> }) {
  if (!storylineVisible()) notFound();
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = storylineCopy[locale];
  const intro = await getEntry(STORYLINE_SECTION, 'index', locale);

  return (
    <div className="container py-16">
      {intro?.isFallback ? <FallbackNotice message={getDictionary(locale).fallback.notice} /> : null}
      <PageIntro title={intro ? title(intro.data) : t.title} lede={t.tagline} />
      {intro ? (
        <div className="mt-8 max-w-2xl">
          <Markdown>{intro.body}</Markdown>
        </div>
      ) : null}

      <ol className="mt-14 max-w-3xl divide-y divide-border border-y border-border">
        {parts.map((part) => {
          const linked = part.status !== 'coming';
          const inner = (
            <div className="flex gap-6 py-5">
              <span className="w-8 shrink-0 text-2xl font-semibold tabular-nums text-muted-foreground">{part.number}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-lg font-medium">{part.title}</span>
                  {linked ? null : <span className="text-xs uppercase tracking-wide text-muted-foreground">{t.coming}</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{part.line}</p>
              </div>
              {linked ? <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            </div>
          );
          return (
            <li key={part.slug}>
              {linked ? (
                <Link href={hrefFor(locale, `/${STORYLINE_SECTION}/${part.slug}`)} className="block hover:bg-muted/50">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-sm text-muted-foreground">
        <a href={KIT_REPO} rel="noopener" target="_blank" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground">
          {t.kit}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
