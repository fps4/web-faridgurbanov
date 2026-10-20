import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ResolvedCard } from '@/components/deck/artifact-card';
import { isInline, type Deck } from '@/lib/deck';
import { pickRows, tableUnder } from '@/lib/kit-tables';

// Build-time reader for the kit snapshot in content/kit/ (FS-0010). Server-only (node:fs): import it
// from server components, never from a 'use client' module. scripts/sync-kit.mjs refreshes the
// snapshot from fps4/ai-product-design-kit.

const KIT_ROOT = path.join(process.cwd(), 'content', 'kit');

/** Resolve every artifact card a deck shows into the rows it renders. */
export async function resolveCards(deck: Deck): Promise<Record<string, ResolvedCard>> {
  const entries = await Promise.all(
    deck.cards.map(async (spec) => {
      if (isInline(spec)) return [spec.key, { spec, rows: spec.inline }] as const;
      const md = await fs.readFile(path.join(KIT_ROOT, spec.source), 'utf8');
      return [spec.key, { spec, rows: pickRows(tableUnder(md, spec.heading), spec.rows) }] as const;
    }),
  );
  return Object.fromEntries(entries);
}
