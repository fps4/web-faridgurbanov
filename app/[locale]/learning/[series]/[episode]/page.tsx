import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EpisodeVideo } from '@/components/episode-video';
import { LearningCrumbs } from '@/components/learning-crumbs';
import {
  isReleased,
  learningCopy,
  learningPath,
  pagedEpisodes,
  series as allSeries,
  seriesBySlug,
  type Episode,
  type Series,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// The template for every episode page (FS-0012): the video, what the viewer leaves with, the
// questions to ask the platform team, and the notes and lab for the episode in the course's repo.
// Previous and next walk the course's episodes that have a page. Only a switched-on episode has a
// page in a production build (RELEASED, lib/learning.ts); under `next dev` every planned episode
// renders as a marked preview. WHILE the section is unpublished a production build renders a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  // Every planned episode is listed so the route never has an empty param list in the static
  // export; an episode without a page renders the 404 below.
  return locales.flatMap((locale) =>
    allSeries.flatMap((s) => s.episodes.map((e) => ({ locale, series: s.slug, episode: e.slug }))),
  );
}

type Params = Promise<{ locale: string; series: string; episode: string }>;

function find(seriesSlug: string, episodeSlug: string): { s: Series; episode: Episode } | undefined {
  const s = seriesBySlug(seriesSlug);
  const episode = s ? pagedEpisodes(s).find((e) => e.slug === episodeSlug) : undefined;
  return s && episode ? { s, episode } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { series, episode } = await params;
  const found = find(series, episode);
  if (!found) return {};
  return {
    title: `${found.episode.title} — ${found.s.title} — ${site.name}`,
    description: found.episode.line,
  };
}

const heading = 'text-sm font-medium uppercase tracking-wide text-muted-foreground';

export default async function EpisodePage({ params }: { params: Params }) {
  if (!learningVisible()) notFound();
  const { locale: raw, series, episode: episodeSlug } = await params;
  const locale = raw as Locale;
  const found = find(series, episodeSlug);
  if (!found) notFound();
  const { s, episode } = found;
  const l = learningCopy[locale];

  const all = pagedEpisodes(s);
  const at = all.findIndex((e) => e.number === episode.number);
  const previous = all[at - 1];
  const next = all[at + 1];
  const repoBase = s.repo && episode.repoModule ? `${s.repo}/blob/main/${episode.repoModule}` : undefined;

  return (
    <article className="container py-16 sm:py-20">
      {isReleased(s, episode) ? null : (
        <p role="note" className="mb-8 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
          {l.preview}
        </p>
      )}
      <LearningCrumbs
        locale={locale}
        trail={[
          { label: l.title, href: learningPath.index },
          { label: s.title, href: learningPath.series(s) },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <p className={heading}>{l.episodeLabel(episode.number)}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{episode.title}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{episode.line}</p>
          {episode.video ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {l.duration} {episode.video.duration}
            </p>
          ) : null}
        </div>
        <EpisodeVideo video={episode.video} title={episode.title} missing={l.videoComing} />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        {episode.promise?.length ? (
          <section>
            <h2 className={heading}>{l.inThisEpisode}</h2>
            <ol className="mt-4 space-y-3 text-lg">
              {episode.promise.map((line, i) => (
                <li key={line} className="grid grid-cols-[1.5rem_minmax(0,1fr)]">
                  <span className="tabular-nums text-muted-foreground">{i + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {episode.questions?.length ? (
          <section>
            <h2 className={heading}>{l.questions}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{l.questionsIntro}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {episode.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {repoBase ? (
        <section className="mt-14">
          <h2 className={heading}>{l.inTheRepo}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <a href={`${repoBase}/notes.md`} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
                {l.notes} <span aria-hidden="true" className="text-muted-foreground">↗</span>
              </a>
            </li>
            <li>
              <a href={`${repoBase}/lab.md`} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
                {l.lab} <span aria-hidden="true" className="text-muted-foreground">↗</span>
              </a>
            </li>
          </ul>
        </section>
      ) : null}

      {previous || next ? (
        <nav aria-label="Episodes" className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-sm">
          {previous ? (
            <Link href={hrefFor(locale, learningPath.episode(s, previous))} className="hover:text-foreground">
              <span className="block text-muted-foreground">← {l.previous}</span>
              <span className="mt-1 block font-medium">
                {previous.number}. {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={hrefFor(locale, learningPath.episode(s, next))} className="text-right hover:text-foreground">
              <span className="block text-muted-foreground">{l.next} →</span>
              <span className="mt-1 block font-medium">
                {next.number}. {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
