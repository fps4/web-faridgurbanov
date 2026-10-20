import type { Deck } from '@/lib/deck';
import { deck11 } from '@/lib/decks/1-1';

// Every episode deck, by route slug (FS-0010). An episode in lib/storyline.ts with a `deck` names
// one of these; lib/decks.test.ts checks the two lists agree.

export const allDecks: Deck[] = [deck11];

export function deckById(id: string): Deck | undefined {
  return allDecks.find((d) => d.id === id);
}
