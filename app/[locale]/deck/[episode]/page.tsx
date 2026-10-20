import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeckPlayer } from '@/components/deck/deck-player';
import { deckFor } from '@/lib/decks';
import { isLocale } from '@/lib/i18n';
import { resolveCards } from '@/lib/kit';
import { storylineVisible } from '@/lib/site';
import { decks } from '@/lib/storyline';
import '@/components/deck/deck.css';

// The recording deck for one episode, per language (FS-0010, ADR-0010): /en/deck/1-1, and
// /nl/deck/1-1 once a Dutch deck exists (until then it shows the English one, with a note in the
// presenter view). Under the locale but outside the (site) route group: no header, no footer,
// nothing but the 1920×1080 stage for OBS to capture. Never indexed. WHILE the storyline is
// unpublished a production build renders a 404 here; `next dev` always serves it, which is where
// recording happens. (Returning no params would not stop the export of a path the storyline lists,
// so the page itself refuses, as the references page does.)
export const dynamicParams = false;

export function generateStaticParams() {
  return decks().map(({ episode }) => ({ episode: episode.deck }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; episode: string }> }): Promise<Metadata> {
  const { locale, episode } = await params;
  const found = isLocale(locale) ? deckFor(locale, episode) : undefined;
  return {
    title: found ? `${found.deck.episode} · ${found.deck.title} (deck)` : 'Deck',
    robots: { index: false, follow: false },
  };
}

export default async function DeckPage({ params }: { params: Promise<{ locale: string; episode: string }> }) {
  if (!storylineVisible()) notFound();
  const { locale, episode } = await params;
  if (!isLocale(locale)) notFound();
  const found = deckFor(locale, episode);
  if (!found) notFound();
  return <DeckPlayer deck={found.deck} cards={await resolveCards(found.deck)} isFallback={found.isFallback} />;
}
