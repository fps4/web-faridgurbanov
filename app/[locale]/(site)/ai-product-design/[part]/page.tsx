import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, PlayCircle } from 'lucide-react';
import { FallbackNotice } from '@/components/fallback-notice';
import { Markdown } from '@/components/markdown';
import { Sketch } from '@/components/deck/sketch';
import { diagramStep } from '@/lib/deck';
import { deckById } from '@/lib/decks';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, summary, title } from '@/lib/content';
import { resolveCards } from '@/lib/kit';
import { hrefFor } from '@/lib/nav';
import { splitBeforeSection } from '@/lib/sections';
import { site, storylineVisible } from '@/lib/site';
import { STORYLINE_SECTION, kitFileUrl, partBySlug, partsWithPages, storylineCopy } from '@/lib/storyline';
import { isLocale, type Locale } from '@/lib/i18n';
import '@/components/deck/deck.css';

// One part of the AI Product Design storyline (FS-0010). The chapter text is markdown
// (content/en/ai-product-design/<slug>.md, English first per ADR-0010); around it the page shows
// the part's diagram, its episodes (each as its closing card: the idea, the move, Monday) and its
// downloads from lib/storyline.ts. The diagram is the
// first episode's deck drawn at its finished step, so the page figure and the video are the same
// drawing. Episodes and downloads sit before "In your organisation", where the reader turns from
// the example to their own case.
export const dynamicParams = false;

export function generateStaticParams() {
  return partsWithPages().map((p) => ({ part: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; part: string }> }): Promise<Metadata> {
  const { locale, part: slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry(STORYLINE_SECTION, slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} · ${storylineCopy[locale].title} — ${site.name}`, description: summary(entry.data) };
}

export default async function PartPage({ params }: { params: Promise<{ locale: string; part: string }> }) {
  if (!storylineVisible()) notFound();
  const { locale: raw, part: slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const part = partBySlug(slug);
  const entry = await getEntry(STORYLINE_SECTION, slug, locale);
  if (!part || !entry) notFound();
  const t = storylineCopy[locale];

  const deckSlug = part.episodes.find((e) => e.deck)?.deck;
  const deck = deckSlug ? deckById(deckSlug) : undefined;
  const cards = deck ? await resolveCards(deck) : {};
  const { head, tail } = splitBeforeSection(entry.body, 'In your organisation');

  return (
    <article className="container max-w-3xl py-16">
      {entry.isFallback ? <FallbackNotice message={getDictionary(locale).fallback.notice} /> : null}
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {t.title} · {t.partLabel(part.number)}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title(entry.data)}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{summary(entry.data)}</p>

      {deck ? (
        <figure className="mt-10 overflow-hidden rounded-lg border border-border">
          <Sketch deck={deck} step={diagramStep(deck)} cards={cards} className="block h-auto w-full" />
        </figure>
      ) : null}

      <div className="mt-10">
        <Markdown>{head}</Markdown>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{t.episodes}</h2>
        <ul className="mt-5 space-y-4">
          {part.episodes.map((ep) => (
            <li key={ep.number} className="flex gap-4 rounded-lg border border-border p-4">
              <PlayCircle className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <div className="font-medium">
                  {ep.number} · {ep.title}
                </div>
                <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[7rem_1fr]">
                  {(['idea', 'move', 'monday'] as const).map((key) => (
                    <div key={key} className="contents">
                      <dt className="text-muted-foreground">{t.takeaway[key]}</dt>
                      <dd>{ep.takeaway[key]}</dd>
                    </div>
                  ))}
                </dl>
                {ep.video ? null : <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{t.videoComing}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{t.downloads}</h2>
        <ul className="mt-5 space-y-4">
          {part.downloads.map((d) => (
            <li key={d.blank} className="rounded-lg border border-border p-4">
              <div className="font-medium">{d.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d.line}</p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={kitFileUrl(d.blank)} rel="noopener" target="_blank" className="inline-flex items-center gap-0.5 underline underline-offset-4">
                  {t.blank}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                {d.filled ? (
                  <a href={kitFileUrl(d.filled.path)} rel="noopener" target="_blank" className="inline-flex items-center gap-0.5 underline underline-offset-4">
                    {d.filled.label}
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {tail ? (
        <div className="mt-12">
          <Markdown>{tail}</Markdown>
        </div>
      ) : null}

      <div className="mt-12 border-t border-border pt-6">
        <Link
          href={hrefFor(locale, `/${STORYLINE_SECTION}`)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>
      </div>
    </article>
  );
}
