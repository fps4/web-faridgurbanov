import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sketch } from '@/components/deck/sketch';
import { LearningCrumbs } from '@/components/learning-crumbs';
import { Button } from '@/components/ui/button';
import { diagramStep } from '@/lib/deck';
import { deckById } from '@/lib/decks';
import {
  episodeSlug,
  learningCopy,
  learningPath,
  releasedEpisodes,
  releasedInSeries,
  series as allSeries,
  seriesBySlug,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { storylineCopy } from '@/lib/storyline';
import { locales, type Locale } from '@/lib/i18n';
import '@/components/deck/deck.css';

// An episode page in the Learning section (FS-0012): what the episode promises, its diagram (the
// same drawing as the deck, at the step the deck names as its figure) with a link to step through
// the slides, and the closing card: the idea, the move, and what to do on Monday. Previous and next
// walk the switched-on episodes of the series in order. Only a switched-on episode has a page
// (RELEASED, lib/learning.ts). The video joins the page once it is published (US-0032). WHILE the
// Learning section is unpublished a production build renders a 404; `next dev` shows it.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allSeries.flatMap((s) =>
      releasedInSeries(s).map(({ module, episode }) => ({ locale, series: s.slug, module: module.slug, episode: episodeSlug(episode) })),
    ),
  );
}

type Params = Promise<{ locale: string; series: string; module: string; episode: string }>;

function find(slug: string, moduleSlug: string, slugOfEpisode: string) {
  const s = seriesBySlug(slug);
  const mod = s?.modules.find((m) => m.slug === moduleSlug);
  const episode = s && mod ? releasedEpisodes(s, mod).find((e) => episodeSlug(e) === slugOfEpisode) : undefined;
  return s && mod && episode ? { s, mod, episode } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { series, module, episode } = await params;
  const found = find(series, module, episode);
  if (!found) return {};
  return {
    title: `${found.episode.number} ${found.episode.title} — ${found.s.title} — ${site.name}`,
    description: found.episode.takeaway?.idea ?? found.mod.line,
  };
}

export default async function EpisodePage({ params }: { params: Params }) {
  if (!learningVisible()) notFound();
  const { locale: raw, series, module: moduleSlug, episode: slugOfEpisode } = await params;
  const locale = raw as Locale;
  const found = find(series, moduleSlug, slugOfEpisode);
  if (!found) notFound();
  const { s, mod, episode } = found;
  const l = learningCopy[locale];
  const t = storylineCopy[locale];
  const deck = episode.deck ? deckById(episode.deck) : undefined;

  const all = releasedInSeries(s);
  const at = all.findIndex((x) => x.episode.number === episode.number);
  const previous = all[at - 1];
  const next = all[at + 1];

  return (
    <article className="container py-16 sm:py-20">
      <LearningCrumbs
        locale={locale}
        trail={[
          { label: l.title, href: learningPath.index },
          { label: s.title, href: learningPath.series(s) },
          { label: mod.title, href: learningPath.module(s, mod) },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{l.episodeLabel(episode.number)}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{episode.title}</h1>
          {episode.promise ? (
            <>
              <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">{t.inThisEpisode}</h2>
              <ol className="mt-4 space-y-3 text-lg">
                {episode.promise.map((line, i) => (
                  <li key={line} className="grid grid-cols-[1.5rem_minmax(0,1fr)]">
                    <span className="tabular-nums text-muted-foreground">{i + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </div>

        {deck ? (
          <figure>
            <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
              <Sketch deck={deck} step={diagramStep(deck)} className="block h-auto w-full" />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{l.slides}</span>
              <Button asChild size="sm" variant="outline">
                <Link href={hrefFor(locale, `/deck/${deck.id}`)}>{l.slidesCta}</Link>
              </Button>
            </figcaption>
          </figure>
        ) : null}
      </div>

      {episode.takeaway ? (
        <section className="mt-16 max-w-3xl rounded-lg border border-border">
          <h2 className="border-b border-border px-6 py-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {l.episodeLabel(episode.number)} · {episode.title}
          </h2>
          <dl className="divide-y divide-border">
            {(['idea', 'move', 'monday'] as const).map((key) => (
              <div key={key} className="grid gap-x-8 gap-y-1 px-6 py-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <dt className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{t.takeaway[key]}</dt>
                <dd className="text-lg">{episode.takeaway![key]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {previous || next ? (
        <nav aria-label="Episodes" className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-sm">
          {previous ? (
            <Link href={hrefFor(locale, learningPath.episode(s, previous.module, previous.episode))} className="hover:text-foreground">
              <span className="block text-muted-foreground">← {l.previous}</span>
              <span className="mt-1 block font-medium">
                {previous.episode.number} {previous.episode.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={hrefFor(locale, learningPath.episode(s, next.module, next.episode))} className="text-right hover:text-foreground">
              <span className="block text-muted-foreground">{l.next} →</span>
              <span className="mt-1 block font-medium">
                {next.episode.number} {next.episode.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
