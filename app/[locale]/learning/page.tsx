import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { getEntry, summary, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import {
  LEARNING_SECTION,
  learningCopy,
  learningPath,
  releasedEpisodes,
  series as allSeries,
  seriesHasPage,
  seriesIsOpen,
  type Series,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// The Learning landing page (FS-0012): what the section is, one card per course, and the episodes
// out now. The words are content/<locale>/learning/index.md. A course with a switched-on episode
// links to its page; one without is shown as coming (under `next dev` a planned course links to its
// preview). WHILE the section is unpublished a production build renders a 404 (LEARNING_PUBLISHED).
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { locale } = await params;
  const intro = await getEntry(LEARNING_SECTION, 'index', locale as Locale);
  const l = learningCopy[locale as Locale];
  return { title: `${l.title} — ${site.name}`, description: intro ? summary(intro.data) : undefined };
}

const heading = 'text-sm font-medium uppercase tracking-wide text-muted-foreground';

export default async function LearningIndex({ params }: { params: Promise<{ locale: string }> }) {
  if (!learningVisible()) notFound();
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const l = learningCopy[locale];
  const intro = await getEntry(LEARNING_SECTION, 'index', locale);
  const out = allSeries.flatMap((s) => releasedEpisodes(s).map((episode) => ({ s, episode })));

  return (
    <>
      {intro?.isFallback ? (
        <div className="container pt-8">
          <FallbackNotice message={getDictionary(locale).fallback.notice} />
        </div>
      ) : null}

      <section className="container py-16 sm:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{intro ? title(intro.data) : l.title}</h1>
          {intro ? <p className="mt-6 text-lg text-muted-foreground">{summary(intro.data)}</p> : null}
          {intro?.body.trim() ? (
            <div className="mt-6">
              <Markdown>{intro.body}</Markdown>
            </div>
          ) : null}
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {allSeries.map((s) => (
            <li key={s.slug} className="bg-background">
              <SeriesCard locale={locale} series={s} />
            </li>
          ))}
        </ul>
      </section>

      {out.length > 0 ? (
        <section className="border-t border-border bg-muted/40">
          <div className="container py-14">
            <h2 className={heading}>{l.outNow}</h2>
            <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {out.map(({ s, episode }) => (
                <li key={`${s.slug}-${episode.number}`}>
                  <Link href={hrefFor(locale, learningPath.episode(s, episode))} className="group block">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {s.title} · {l.episodeLabel(episode.number)}
                    </p>
                    <h3 className="mt-1 text-lg font-medium group-hover:underline">{episode.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{episode.line}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** One course as a card: its title and line, its size, and what is out. Links only once it has a page. */
function SeriesCard({ locale, series: s }: { locale: Locale; series: Series }) {
  const l = learningCopy[locale];
  const open = seriesIsOpen(s);
  const linked = seriesHasPage(s);
  const total = s.episodes.length;
  const size = total > 0 ? l.episodeCount(releasedEpisodes(s).length, total) : s.size;
  const body = (
    <div className="flex h-full flex-col p-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={`text-2xl font-semibold tracking-tight ${open ? '' : 'text-muted-foreground'}`}>{s.title}</h2>
        {open ? null : <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">{l.coming}</span>}
      </div>
      <p className="mt-4 text-muted-foreground">{s.line}</p>
      {size ? <p className="mt-auto pt-6 text-xs uppercase tracking-wide text-muted-foreground">{size}</p> : null}
      {linked ? <p className="mt-4 text-sm font-medium">{l.openSeries} →</p> : null}
    </div>
  );
  return linked ? (
    <Link href={hrefFor(locale, learningPath.series(s))} className="block h-full transition-colors hover:bg-muted/50">
      {body}
    </Link>
  ) : (
    body
  );
}
