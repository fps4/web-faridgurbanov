import type { Deck } from '@/lib/deck';
import type { Locale } from '@/lib/i18n';
import { deck11 } from '@/lib/decks/1-1';

// Every episode deck, by route slug and language (FS-0010). An episode in lib/storyline.ts with a
// `deck` names one of these; lib/decks.test.ts checks the two lists agree.

export const allDecks: Deck[] = [deck11];

/** The English deck for an episode: the one every locale falls back to. */
export function deckById(id: string): Deck | undefined {
  return allDecks.find((d) => d.id === id && d.locale === 'en');
}

/**
 * The deck to record in a locale: that locale's own deck when it has one, otherwise the English deck
 * (the same fallback the content pages use, ADR-0002). `isFallback` tells the player to say so.
 */
export function deckFor(locale: Locale, id: string): { deck: Deck; isFallback: boolean } | undefined {
  const own = allDecks.find((d) => d.id === id && d.locale === locale);
  if (own) return { deck: own, isFallback: false };
  const en = deckById(id);
  return en ? { deck: en, isFallback: locale !== 'en' } : undefined;
}
