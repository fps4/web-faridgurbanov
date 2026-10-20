import type { CardSpec, Deck, Element, Step } from '@/lib/deck';
import type { Locale } from '@/lib/i18n';

// A deck is two halves (FS-0010, ADR-0010): the words, in content/decks/<locale>/<id>.yaml, which the
// owner edits, and the layout, in lib/decks/<id>.ts, which places them on the stage. This joins the
// two and reports every mismatch at once (a step or id in one half but not the other), so an edit
// that breaks the deck says where. Framework-free; lib/decks/text.ts reads the file.

export interface DeckText {
  title: string;
  steps: Record<string, Step>;
  text: Record<string, string>;
  cards: Record<string, { title: string; subtitle: string }>;
}

/** What a layout gets to build with: the words by id, which it must all use. */
export interface Words {
  title: string;
  locale: Locale;
  text(id: string): string;
  card(key: string): { title: string; subtitle: string };
}

export interface DeckLayout<S extends string = string> {
  /** Route slug under /<locale>/deck, e.g. '1-1'. */
  id: string;
  episode: string;
  /** Step names in recording order; the text file names the same ones. */
  steps: readonly S[];
  build(words: Words, step: Record<S, number>): { elements: Element[]; cards: CardSpec[] };
}

/** Step name → index, for a layout to place elements with (`in: step.seats`). */
export function stepIndex<S extends string>(steps: readonly S[]): Record<S, number> {
  return Object.fromEntries(steps.map((name, i) => [name, i])) as Record<S, number>;
}

export class DeckTextError extends Error {
  constructor(
    readonly file: string,
    readonly problems: string[],
  ) {
    super(`${file}:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.name = 'DeckTextError';
  }
}

/** Join a layout and its words into a deck; throws DeckTextError listing every mismatch. */
export function composeDeck(layout: DeckLayout, words: DeckText, locale: Locale, file: string): Deck {
  const problems: string[] = [];

  const named = Object.keys(words.steps);
  for (const s of layout.steps) if (!named.includes(s)) problems.push(`steps: "${s}" is missing`);
  for (const s of named) if (!layout.steps.includes(s)) problems.push(`steps: "${s}" is not a step in the layout`);
  if (problems.length === 0 && named.join() !== layout.steps.join()) {
    problems.push(`steps: keep the layout's order (${layout.steps.join(', ')})`);
  }

  const usedText = new Set<string>();
  const usedCards = new Set<string>();
  const { elements, cards } = layout.build(
    {
      title: words.title,
      locale,
      text(id) {
        usedText.add(id);
        if (!(id in words.text)) problems.push(`text: "${id}" is missing`);
        return words.text[id] ?? '';
      },
      card(key) {
        usedCards.add(key);
        if (!(key in words.cards)) problems.push(`cards: "${key}" is missing`);
        return words.cards[key] ?? { title: '', subtitle: '' };
      },
    },
    stepIndex(layout.steps),
  );
  for (const id of Object.keys(words.text)) if (!usedText.has(id)) problems.push(`text: "${id}" is not used by the layout`);
  for (const key of Object.keys(words.cards)) if (!usedCards.has(key)) problems.push(`cards: "${key}" is not used by the layout`);

  if (problems.length) throw new DeckTextError(file, [...new Set(problems)]);
  return {
    id: layout.id,
    locale,
    episode: layout.episode,
    title: words.title,
    steps: layout.steps.map((s) => words.steps[s]),
    elements,
    cards,
  };
}

/** Check a parsed YAML document has the deck-text shape; returns the problems, empty when it fits. */
export function deckTextProblems(doc: unknown): string[] {
  const problems: string[] = [];
  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
  if (!isRecord(doc)) return ['the file is not a mapping of title, steps, text and cards'];
  if (typeof doc.title !== 'string' || !doc.title) problems.push('title: write it as text');
  if (!isRecord(doc.steps)) problems.push('steps: a mapping of step name to `at` and `cue`');
  else
    for (const [name, step] of Object.entries(doc.steps)) {
      if (!isRecord(step)) {
        problems.push(`steps: "${name}" needs an \`at\` and a \`cue\``);
        continue;
      }
      if (typeof step.at !== 'string' || !/^\d+:[0-5]\d$/.test(step.at)) problems.push(`steps: "${name}" at: write the time in quotes, like "1:05"`);
      if (typeof step.cue !== 'string' || !step.cue) problems.push(`steps: "${name}" cue: write it as text`);
    }
  if (!isRecord(doc.text)) problems.push('text: a mapping of element id to its words');
  else for (const [id, v] of Object.entries(doc.text)) if (typeof v !== 'string' || !v) problems.push(`text: "${id}" needs words`);
  if (doc.cards !== undefined) {
    if (!isRecord(doc.cards)) problems.push('cards: a mapping of card key to `title` and `subtitle`');
    else
      for (const [key, c] of Object.entries(doc.cards))
        if (!isRecord(c) || typeof c.title !== 'string' || typeof c.subtitle !== 'string') problems.push(`cards: "${key}" needs a title and a subtitle`);
  }
  return problems;
}
