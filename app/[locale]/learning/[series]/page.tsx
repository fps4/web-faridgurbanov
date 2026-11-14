import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FallbackNotice } from '@/components/fallback-notice';
import { LearningCrumbs } from '@/components/learning-crumbs';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { getEntry, summary, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import {
  LEARNING_SECTION,
  isReleased,
  learningCopy,
  learningPath,
  pagedEpisodes,
  previewing,
  series as allSeries,
  seriesBySlug,
  seriesHasPage,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// A course page (FS-0012): its words from content/<locale>/learning/<course>.md, then every planned
// episode in order. A switched-on episode links to its page; the others are muted and marked
// Coming. Under `next dev` every planned episode links to its preview. Only a course with a page
// (lib/learning.ts) is generated; WHILE the section is unpublished a production build renders a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  // Every course is listed so the route never has an empty param list in the static export; a
  // course without a page renders the 404 below.
  return locales.flatMap((locale) => allSeries.map((s) => ({ locale, series: s.slug })));
}

type Params = Promise<{ locale: string; series: string }>;

function find(slug: string) {
  const s = seriesBySlug(slug);
  return s && seriesHasPage(s) ? s : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { locale, series } = await params;
  const s = find(series);
  if (!s) return {};
  const words = await getEntry(LEARNING_SECTION, s.slug, locale as Locale);
  return { title: `${s.title} — ${site.name}`, description: words ? summary(words.data) : s.line };
}

export default async function SeriesPage({ params }: { params: Params }) {
  if (!learningVisible()) notFound();
  const { locale: raw, series } = await params;
  const locale = raw as Locale;
  const s = find(series);
  if (!s) notFound();
  const l = learningCopy[locale];
  const words = await getEntry(LEARNING_SECTION, s.slug, locale);
  const linked = new Set(pagedEpisodes(s).map((e) => e.number));
  const eyebrow = typeof words?.data.eyebrow === 'string' ? words.data.eyebrow : undefined;

  return (
    <div className="container py-16 sm:py-20">
      {words?.isFallback ? <FallbackNotice message={getDictionary(locale).fallback.notice} /> : null}
      <LearningCrumbs locale={locale} trail={[{ label: l.title, href: learningPath.index }]} />

      <header className="mt-8 max-w-3xl">
        {eyebrow ? <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{words ? title(words.data) : s.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{words ? summary(words.data) : s.line}</p>
        {s.repo ? (
          <Button asChild variant="outline" className="mt-8">
            <a href={s.repo} target="_blank" rel="noreferrer">
              {l.repoCta} ↗
            </a>
          </Button>
        ) : null}
      </header>

      <section className="mt-14">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{l.episodes}</h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {s.episodes.map((episode) => {
            const released = isReleased(s, episode);
            const row = (
              <div className="grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto]">
                <span className="text-sm tabular-nums text-muted-foreground">{l.episodeLabel(episode.number)}</span>
                <span>
                  <span className={`block text-lg font-medium ${released ? '' : 'text-muted-foreground'}`}>{episode.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{episode.line}</span>
                </span>
                {released ? null : (
                  <span className="text-xs uppercase tracking-wide text-muted-foreground sm:pt-1.5">
                    {previewing() ? l.previewTag : l.coming}
                  </span>
                )}
              </div>
            );
            return (
              <li key={episode.number}>
                {linked.has(episode.number) ? (
                  <Link href={hrefFor(locale, learningPath.episode(s, episode))} className="block transition-colors hover:bg-muted/50">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {words?.body.trim() ? (
        <section className="mt-14 max-w-3xl">
          <Markdown>{words.body}</Markdown>
        </section>
      ) : null}
    </div>
  );
}
