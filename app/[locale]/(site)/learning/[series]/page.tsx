import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sketch } from '@/components/deck/sketch';
import { FallbackNotice } from '@/components/fallback-notice';
import { LearningCrumbs } from '@/components/learning-crumbs';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { diagramStep } from '@/lib/deck';
import { deckById } from '@/lib/decks';
import { getEntry, summary, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { landingSections, type LandingSection } from '@/lib/landing';
import {
  LEARNING_SECTION,
  learningCopy,
  learningPath,
  moduleIsOpen,
  releasedEpisodes,
  releasedInSeries,
  series as allSeries,
  seriesBySlug,
  seriesIsOpen,
  type Series,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { storylineCopy } from '@/lib/storyline';
import { locales, type Locale } from '@/lib/i18n';
import '@/components/deck/deck.css';

// A series page in the Learning section (FS-0010, FS-0012): what the series is, who it is for, the
// running example, its modules and the common questions. The words are the markdown in
// content/en/learning/<series>.md, one band per `## ` heading (lib/landing.ts); the page only lays
// them out, so the owner edits the page as text. The hero carries the diagram of the first switched-on
// episode with a deck, the same drawing as the episode. The modules band lists the whole plan: a module
// with a switched-on episode links to its page, the rest are marked as coming. A series exists as a
// page only once one of its episodes is switched on (RELEASED, lib/learning.ts). WHILE the Learning
// section is unpublished a production build renders a 404 (LEARNING_PUBLISHED, ADR-0010); `next dev`
// shows it.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => allSeries.filter(seriesIsOpen).map((s) => ({ locale, series: s.slug })));
}

type Params = Promise<{ locale: string; series: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { locale, series: slug } = await params;
  const s = seriesBySlug(slug);
  if (!s) return {};
  const intro = await getEntry(LEARNING_SECTION, s.slug, locale as Locale);
  return { title: `${s.title} — ${site.name}`, description: intro ? summary(intro.data) : s.line };
}

const heading = 'text-sm font-medium uppercase tracking-wide text-muted-foreground';

export default async function SeriesPage({ params }: { params: Params }) {
  if (!learningVisible()) notFound();
  const { locale: raw, series: slug } = await params;
  const locale = raw as Locale;
  const s = seriesBySlug(slug);
  if (!s || !seriesIsOpen(s)) notFound();
  const t = storylineCopy[locale];
  const l = learningCopy[locale];
  const intro = await getEntry(LEARNING_SECTION, s.slug, locale);
  const { lead, sections } = landingSections(intro?.body ?? '');
  const eyebrow = typeof intro?.data.eyebrow === 'string' ? intro.data.eyebrow : '';

  const featured = releasedInSeries(s).find(({ episode }) => episode.deck);
  const deck = featured?.episode.deck ? deckById(featured.episode.deck) : undefined;
  const caption = typeof intro?.data.figure_caption === 'string' ? intro.data.figure_caption : '';
  const contactHref = hrefFor(locale, '/contact');

  return (
    <>
      {intro?.isFallback ? (
        <div className="container pt-8">
          <FallbackNotice message={getDictionary(locale).fallback.notice} />
        </div>
      ) : null}

      <section className="container py-16 sm:py-20">
        <LearningCrumbs locale={locale} trail={[{ label: l.title, href: learningPath.index }]} />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div>
            {eyebrow ? <p className={heading}>{eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{intro ? title(intro.data) : s.title}</h1>
            <p className="mt-6 text-lg text-muted-foreground">{intro ? summary(intro.data) : s.line}</p>
            {lead ? (
              <div className="mt-6">
                <Markdown>{lead}</Markdown>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {featured ? (
                <Button asChild size="lg">
                  <Link href={hrefFor(locale, learningPath.episode(s, featured.module, featured.episode))}>
                    {l.watch(featured.episode.number)}
                  </Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline">
                <Link href={contactHref}>{t.contactCta}</Link>
              </Button>
            </div>
          </div>
          {deck && featured ? (
            <figure>
              <Link
                href={hrefFor(locale, learningPath.episode(s, featured.module, featured.episode))}
                className="block overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                <Sketch deck={deck} step={diagramStep(deck)} className="block h-auto w-full" />
              </Link>
              {caption ? <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </section>

      {/* The last band (who is behind it) closes with the way to get in touch. */}
      {sections.map((section, i) => (
        <Band key={section.heading} section={section} shaded={i % 2 === 0}>
          {section.modules ? <ModulesGrid locale={locale} series={s} /> : null}
          {i === sections.length - 1 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={contactHref}>{t.contactCta}</Link>
              </Button>
            </div>
          ) : null}
        </Band>
      ))}

      {/* A series without its own text still lists its modules. */}
      {sections.some((section) => section.modules) ? null : (
        <section className="border-t border-border">
          <div className="container py-14">
            <ModulesGrid locale={locale} series={s} />
          </div>
        </section>
      )}
    </>
  );
}

/** One `## ` section of the markdown as a band: intro, then cards or questions, then the outro. */
function Band({ section, shaded, children }: { section: LandingSection; shaded: boolean; children?: React.ReactNode }) {
  // Cards whose titles all start with a number (68,000 · 40 minutes · €2.5 million) are figures.
  const metrics = section.cards.length > 0 && section.cards.every((c) => /^[€$]?\d/.test(c.title));
  return (
    <section className={shaded ? 'border-y border-border bg-muted/40' : ''}>
      <div className="container py-14">
        <h2 className={heading}>{section.heading}</h2>
        {section.intro ? (
          <div className="mt-4 max-w-3xl [&_.prose]:text-lg">
            <Markdown>{section.intro}</Markdown>
          </div>
        ) : null}

        {metrics ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {section.cards.map((c) => (
              <li key={c.title}>
                <p className="text-3xl font-semibold tracking-tight">{c.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </li>
            ))}
          </ul>
        ) : section.cards.length > 0 ? (
          <ul
            className={`mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 ${
              section.cards.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
            }`}
          >
            {section.cards.map((c) => (
              <li key={c.title} className="bg-background p-6">
                <h3 className="text-base font-medium">{c.title}</h3>
                <div className="mt-3 [&_.prose]:text-sm [&_.prose]:text-muted-foreground">
                  <Markdown>{c.body}</Markdown>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {section.questions.length > 0 ? (
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {section.questions.map((q) => (
              <div key={q.question}>
                <dt className="text-base font-medium">{q.question}</dt>
                <dd className="mt-2 [&_.prose]:text-muted-foreground">
                  <Markdown>{q.answer}</Markdown>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children}

        {section.outro ? (
          <div className="mt-8 max-w-3xl [&_.prose]:text-sm [&_.prose]:text-muted-foreground">
            <Markdown>{section.outro}</Markdown>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The series' modules as cards, in order: the whole plan. A module with a switched-on episode links
 * to its page and says how many of its episodes are out; the rest are muted and marked as coming.
 */
function ModulesGrid({ locale, series: s }: { locale: Locale; series: Series }) {
  const l = learningCopy[locale];
  return (
    <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {s.modules.map((module) => {
        const open = moduleIsOpen(s, module);
        const body = (
          <div className="flex h-full flex-col p-6">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-3xl font-semibold tabular-nums text-muted-foreground">{module.number}</span>
              {open ? null : <span className="text-xs uppercase tracking-wide text-muted-foreground">{l.coming}</span>}
            </div>
            <h3 className={`mt-4 text-base font-medium ${open ? '' : 'text-muted-foreground'}`}>{module.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{module.line}</p>
            {module.episodes.length > 0 ? (
              <p className={`mt-auto pt-4 text-xs uppercase tracking-wide ${open ? 'text-foreground' : 'text-muted-foreground'}`}>
                {l.episodeCount(releasedEpisodes(s, module).length, module.episodes.length)}
              </p>
            ) : null}
          </div>
        );
        return (
          <li key={module.slug} className="bg-background">
            {open ? (
              <Link href={hrefFor(locale, learningPath.module(s, module))} className="block h-full transition-colors hover:bg-muted/50">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
