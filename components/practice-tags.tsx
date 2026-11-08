import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { hrefFor } from '@/lib/nav';
import { TECH, TOPICS, filterQuery, type Tags } from '@/lib/practice-model';

// An item's topics and technologies on its own page (FS-0013). Each one links to the Practice list
// filtered by it, so a reader can go from one pattern to everything else on the same subject.
export function PracticeTags({ tags, locale, label }: { tags: Tags; locale: Locale; label: string }) {
  if (!tags.topics.length && !tags.tech.length) return null;
  const link = 'rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground';
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.topics.map((tp) => (
        <li key={tp}>
          <Link href={`${hrefFor(locale, '/practice')}${filterQuery({ topic: tp })}`} className={link}>
            {TOPICS[tp][locale]}
          </Link>
        </li>
      ))}
      {tags.tech.map((tc) => (
        <li key={tc}>
          <Link href={`${hrefFor(locale, '/practice')}${filterQuery({ tech: tc })}`} className={`${link} font-mono`}>
            {TECH[tc]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
