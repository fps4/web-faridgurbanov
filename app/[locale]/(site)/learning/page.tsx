import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sketch } from '@/components/deck/sketch';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { diagramStep } from '@/lib/deck';
import { deckById } from '@/lib/decks';
import { getEntry, summary, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import {
  LEARNING_SECTION,
  learningCopy,
  learningPath,
  releasedInSeries,
  series as allSeries,
  seriesIsOpen,
  type Series,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';
import '@/components/deck/deck.css';

// The Learning landing page (FS-0012): what the section is, one card per series, and the episodes
// out now. The words are content/en/learning/index.md. A series with a switched-on episode links to
// its page; one without is shown as coming. The episodes out now are every switched-on episode, in
// the order of the series and their plan, each with its diagram. WHILE the Learning section is unpublished a
// production build renders a 404 (LEARNING_PUBLISHED, ADR-0010); `next dev` shows it.
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
  const out = allSeries.flatMap((s) => releasedInSeries(s).map((x) => ({ s, ...x })));

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

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
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
              {out.map(({ s, module, episode }) => {
                const deck = episode.deck ? deckById(episode.deck) : undefined;
                return (
                  <li key={`${s.slug}-${episode.number}`}>
                    <Link href={hrefFor(locale, learningPath.episode(s, module, episode))} className="group block">
                      {deck ? (
                        <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow group-hover:shadow-md">
                          <Sketch deck={deck} step={diagramStep(deck)} className="block h-auto w-full" />
                        </div>
                      ) : null}
                      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                        {s.title} · {l.episodeLabel(episode.number)}
                      </p>
                      <h3 className="mt-1 text-lg font-medium group-hover:underline">{episode.title}</h3>
                      {episode.takeaway ? <p className="mt-2 text-sm text-muted-foreground">{episode.takeaway.idea}</p> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** One series as a card: its title and line, its size, and what is out. Links only once it is open. */
function SeriesCard({ locale, series: s }: { locale: Locale; series: Series }) {
  const l = learningCopy[locale];
  const open = seriesIsOpen(s);
  const episodes = s.modules.reduce((n, m) => n + m.episodes.length, 0);
  const released = releasedInSeries(s).length;
  const body = (
    <div className="flex h-full flex-col p-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={`text-2xl font-semibold tracking-tight ${open ? '' : 'text-muted-foreground'}`}>{s.title}</h2>
        {open ? null : <span className="text-xs uppercase tracking-wide text-muted-foreground">{l.coming}</span>}
      </div>
      <p className="mt-4 text-muted-foreground">{s.line}</p>
      <p className="mt-auto pt-6 text-xs uppercase tracking-wide text-muted-foreground">
        {l.moduleCount(s.modules.length)}
        {episodes > 0 ? ` · ${l.episodeCount(released, episodes)}` : ''}
      </p>
      {open ? <p className="mt-4 text-sm font-medium">{l.openSeries} →</p> : null}
    </div>
  );
  return open ? (
    <Link href={hrefFor(locale, learningPath.series(s))} className="block h-full transition-colors hover:bg-muted/50">
      {body}
    </Link>
  ) : (
    body
  );
}
