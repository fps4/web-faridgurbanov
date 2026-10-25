import type { Episode } from '@/lib/storyline';

/** A module's episodes by title, numbered from the intro (n.0) on, with the wiki's ids. */
export function plan(module: number, prefix: string, titles: string[]): Episode[] {
  return titles.map((title, i) => ({
    number: `${module}.${i}`,
    id: `${prefix}-${String(i).padStart(2, '0')}`,
    title,
  }));
}
