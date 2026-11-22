import type { Frontmatter } from '@/lib/frontmatter';

// The case-study page shape (art-13yb9kshaw, ADR-0010 §5): a title, an intro line and a small line
// under it, a row of facts, the article parts in order, a facts column (role, client, built with)
// and a bar at the foot. Every text on it comes from the entry's frontmatter and body, so the
// template holds no copy of its own. An entry is on this shape when its frontmatter has an `intro`;
// the case studies that are still on the earlier shape have none and keep the earlier template
// until the Work stories rewrite or remove them. Framework-free and unit-tested per AGENTS.md.

// The labels of the facts column and the two texts of the bar at the foot are the same on every
// case study, so they are kept here rather than in each entry. They are taken as they stand from
// the approved review document of the site copy ("Case pages"). English only for now: the Dutch
// pages show the English page under a notice until the Dutch copy is approved.
export const caseStudyLabels = {
  role: 'My role',
  client: 'Client',
  builtWith: 'Built with',
  barQuestion: 'Does this look like your situation?',
  barAction: 'Start a conversation',
} as const;

export interface CaseStudyFrontmatter {
  intro: string;
  /** The small line under the intro; absent when the entry has none. */
  small: string | null;
  /** The row of facts, each one a text as it stands. Empty when the entry has none. */
  facts: string[];
  role: string | null;
  client: string | null;
  builtWith: string | null;
  /** The next case study, shown in the bar at the foot only when both are set. */
  next: { slug: string; label: string } | null;
}

function text(data: Frontmatter, key: string): string | null {
  const v = data[key];
  return typeof v === 'string' && v.trim() !== '' ? v : null;
}

/** The case-study fields of an entry, or null when the entry is not on the case-study shape. */
export function caseStudyFrontmatter(data: Frontmatter): CaseStudyFrontmatter | null {
  const intro = text(data, 'intro');
  if (!intro) return null;
  const facts = Array.isArray(data.facts) ? data.facts.filter((f) => f.trim() !== '') : [];
  const nextSlug = text(data, 'next');
  const nextLabel = text(data, 'next_label');
  return {
    intro,
    small: text(data, 'small'),
    facts,
    role: text(data, 'role'),
    client: text(data, 'client'),
    builtWith: text(data, 'built_with'),
    next: nextSlug && nextLabel ? { slug: nextSlug, label: nextLabel } : null,
  };
}
