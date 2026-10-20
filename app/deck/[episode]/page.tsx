import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeckPlayer } from '@/components/deck/deck-player';
import { deckById } from '@/lib/decks';
import { resolveCards } from '@/lib/kit';
import { storylineVisible } from '@/lib/site';
import { decks } from '@/lib/storyline';
import '@/components/deck/deck.css';

// The recording deck for one episode (FS-0010, ADR-0010). Outside the [locale] shell on purpose:
// no header, no footer, nothing but the 1920×1080 stage for OBS to capture. Never indexed. WHILE the
// storyline is unpublished a production build renders a 404 here; `next dev` always serves it,
// which is where recording happens. (Returning no params would not stop the export of a path the
// storyline lists, so the page itself refuses, as the references page does.)
export const dynamicParams = false;

export function generateStaticParams() {
  return decks().map(({ episode }) => ({ episode: episode.deck }));
}

export async function generateMetadata({ params }: { params: Promise<{ episode: string }> }): Promise<Metadata> {
  const { episode } = await params;
  const deck = deckById(episode);
  return {
    title: deck ? `${deck.episode} · ${deck.title} (deck)` : 'Deck',
    robots: { index: false, follow: false },
  };
}

export default async function DeckPage({ params }: { params: Promise<{ episode: string }> }) {
  if (!storylineVisible()) notFound();
  const { episode } = await params;
  const deck = deckById(episode);
  if (!deck) notFound();
  return <DeckPlayer deck={deck} cards={await resolveCards(deck)} />;
}
