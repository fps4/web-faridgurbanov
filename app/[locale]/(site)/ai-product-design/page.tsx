import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Sketch } from '@/components/deck/sketch';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { diagramStep } from '@/lib/deck';
import { deckById } from '@/lib/decks';
import { getEntry, summary, title } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { resolveCards } from '@/lib/kit';
import { landingSections, type LandingSection } from '@/lib/landing';
import { hrefFor } from '@/lib/nav';
import { site, storylineVisible } from '@/lib/site';
import { KIT_REPO, STORYLINE_SECTION, parts, storylineCopy, type Part } from '@/lib/storyline';
import { locales, type Locale } from '@/lib/i18n';
import '@/components/deck/deck.css';

// The AI Product Design landing page (FS-0010): what the storyline is, who it is for, what a part
// gives you, the running example, the eight parts and the common questions. The words are the
// markdown in content/en/ai-product-design/index.md, one band per `## ` heading (lib/landing.ts);
// the page only lays them out, so the owner edits the page as text. The hero carries Part 1's
// diagram, the same drawing as the episode. WHILE the storyline is unpublished a production build
// renders a 404 (STORYLINE_PUBLISHED, ADR-0010); `next dev` shows it.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if (!storylineVisible()) return {};
  const { locale } = await params;
  const t = storylineCopy[locale as Locale];
  const intro = await getEntry(STORYLINE_SECTION, 'index', locale as Locale);
  return { title: `${t.title} — ${site.name}`, description: intro ? summary(intro.data) : t.tagline };
}

const heading = 'text-sm font-medium uppercase tracking-wide text-muted-foreground';

export default async function StorylineIndex({ params }: { params: Promise<{ locale: string }> }) {
  if (!storylineVisible()) notFound();
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = storylineCopy[locale];
  const intro = await getEntry(STORYLINE_SECTION, 'index', locale);
  const { lead, sections } = landingSections(intro?.body ?? '');
  const eyebrow = typeof intro?.data.eyebrow === 'string' ? intro.data.eyebrow : '';

  const first = parts[0];
  const firstHref = hrefFor(locale, `/${STORYLINE_SECTION}/${first.slug}`);
  const deckSlug = first.episodes.find((e) => e.deck)?.deck;
  const deck = deckSlug ? deckById(deckSlug) : undefined;
  const cards = deck ? await resolveCards(deck) : {};

  return (
    <>
      {intro?.isFallback ? (
        <div className="container pt-8">
          <FallbackNotice message={getDictionary(locale).fallback.notice} />
        </div>
      ) : null}

      <section className="container py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div>
            {eyebrow ? <p className={heading}>{eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{intro ? title(intro.data) : t.title}</h1>
            <p className="mt-6 text-lg text-muted-foreground">{intro ? summary(intro.data) : t.tagline}</p>
            {lead ? (
              <div className="mt-6">
                <Markdown>{lead}</Markdown>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={firstHref}>
                  {t.startPart1}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={KIT_REPO} rel="noopener" target="_blank">
                  {t.kitButton}
                  <ArrowUpRight />
                </a>
              </Button>
            </div>
          </div>
          {deck ? (
            <figure>
              <Link href={firstHref} className="block overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
                <Sketch deck={deck} step={diagramStep(deck)} cards={cards} className="block h-auto w-full" />
              </Link>
              <figcaption className="mt-3 text-sm text-muted-foreground">{t.diagramCaption}</figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      {/* The last band (who is behind it) closes with the two next steps. */}
      {sections.map((s, i) => (
        <Band key={s.heading} section={s} shaded={i % 2 === 0}>
          {s.parts ? <PartsGrid locale={locale} /> : null}
          {i === sections.length - 1 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={firstHref}>
                  {t.startPart1}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hrefFor(locale, '/contact')}>{t.contactCta}</Link>
              </Button>
            </div>
          ) : null}
        </Band>
      ))}
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

/** The eight parts as cards, in order. A part with a page links to it; Part 1 is marked as the start. */
function PartsGrid({ locale }: { locale: Locale }) {
  const t = storylineCopy[locale];
  const card = (part: Part) => (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-3xl font-semibold tabular-nums text-muted-foreground">{part.number}</span>
        {part.status === 'coming' ? (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{t.coming}</span>
        ) : part.number === 1 ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">{t.startHere}</span>
        ) : null}
      </div>
      <h3 className="mt-4 flex items-start justify-between gap-2 text-base font-medium">
        {part.title}
        {part.status !== 'coming' ? (
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        ) : null}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{part.line}</p>
    </div>
  );
  return (
    <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {parts.map((part) => (
        <li key={part.slug} className="bg-background">
          {part.status !== 'coming' ? (
            <Link href={hrefFor(locale, `/${STORYLINE_SECTION}/${part.slug}`)} className="group block h-full hover:bg-muted/50">
              {card(part)}
            </Link>
          ) : (
            card(part)
          )}
        </li>
      ))}
    </ol>
  );
}
