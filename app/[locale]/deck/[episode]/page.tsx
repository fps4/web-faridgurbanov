import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeckPlayer } from '@/components/deck/deck-player';
import { deckFor } from '@/lib/decks';
import { isLocale } from '@/lib/i18n';
import { deckIsReleased } from '@/lib/learning';
import { learningVisible } from '@/lib/site';
import { decks } from '@/lib/storyline';
import '@/components/deck/deck.css';

// The recording deck for one episode, per language (FS-0010, ADR-0010): /en/deck/3-1, and
// /nl/deck/3-1 once a Dutch deck exists (until then it shows the English one, with a note in the
// presenter view). Under the locale but outside the (site) route group: no header, no footer,
// nothing but the 1920×1080 stage for OBS to capture. Never indexed. `next dev` serves every deck,
// which is where recording happens, before an episode is switched on. A production build serves a
// deck only WHILE the Learning section is published AND its episode is switched on (RELEASED in
// lib/learning.ts); otherwise the page is a 404. (Returning no params would not stop the export of a
// path the storyline lists, so the page itself refuses, as the references page does.)
export const dynamicParams = false;

export function generateStaticParams() {
  return decks().map(({ episode }) => ({ episode: episode.deck }));
}

/** Whether this deck renders: every deck under `next dev`; in production, a published, switched-on one. */
function deckVisible(deck: string, env: string | undefined = process.env.NODE_ENV): boolean {
  return env === 'development' || (learningVisible(env) && deckIsReleased(deck));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; episode: string }> }): Promise<Metadata> {
  // While the deck is hidden the page is a 404, and its metadata must not name the episode.
  const { locale, episode } = await params;
  if (!deckVisible(episode)) return { robots: { index: false, follow: false } };
  const found = isLocale(locale) ? deckFor(locale, episode) : undefined;
  return {
    title: found ? `${found.deck.episode} · ${found.deck.title} (deck)` : 'Deck',
    robots: { index: false, follow: false },
  };
}

export default async function DeckPage({ params }: { params: Promise<{ locale: string; episode: string }> }) {
  const { locale, episode } = await params;
  if (!deckVisible(episode) || !isLocale(locale)) notFound();
  const found = deckFor(locale, episode);
  if (!found) notFound();
  return <DeckPlayer deck={found.deck} isFallback={found.isFallback} />;
}
