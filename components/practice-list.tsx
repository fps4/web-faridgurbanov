'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Dictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/lib/i18n';
import { hrefFor } from '@/lib/nav';
import {
  KINDS,
  TECH,
  TOPICS,
  filterItems,
  filterQuery,
  parseFilter,
  usedTags,
  type Filter,
  type PracticeItem,
} from '@/lib/practice-model';
import { cn } from '@/lib/utils';

// The Practice list (FS-0013): every guideline, pattern and article in one shape, with a row of
// filter chips per facet (kind, topic, technology). One value per facet; facets combine. The
// filter lives in the query string (?kind=pattern&topic=ai) so a filtered view can be linked.
// The static HTML holds the full, unfiltered list; the filter applies once the page has loaded,
// so without JavaScript every item is still there and reachable.

type T = Dictionary['practice'];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function PracticeList({ items, locale, t }: { items: PracticeItem[]; locale: Locale; t: T }) {
  const [filter, setFilter] = useState<Filter>({});

  // Read the filter from the URL once on load, and again when the visitor goes back or forward.
  useEffect(() => {
    const read = () => setFilter(parseFilter(window.location.search));
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  const update = (next: Filter) => {
    setFilter(next);
    window.history.pushState(null, '', `${window.location.pathname}${filterQuery(next)}`);
  };
  const toggle = <K extends keyof Filter>(key: K, value: Filter[K]) =>
    update({ ...filter, [key]: filter[key] === value ? undefined : value });

  const tags = useMemo(() => usedTags(items), [items]);
  const kinds = KINDS.filter((k) => items.some((i) => i.kind === k));
  const shown = filterItems(items, filter);
  const active = Boolean(filter.kind || filter.topic || filter.tech);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 border-y border-border py-5">
        <FacetRow label={t.filterKind}>
          <Chip active={!filter.kind} onClick={() => update({ ...filter, kind: undefined })}>
            {t.all}
          </Chip>
          {kinds.map((k) => (
            <Chip key={k} active={filter.kind === k} onClick={() => toggle('kind', k)}>
              {t.kindPlural[k]}
            </Chip>
          ))}
        </FacetRow>
        <FacetRow label={t.filterTopic}>
          {tags.topics.map((tp) => (
            <Chip key={tp} active={filter.topic === tp} onClick={() => toggle('topic', tp)}>
              {TOPICS[tp][locale]}
            </Chip>
          ))}
        </FacetRow>
        {tags.tech.length ? (
          <FacetRow label={t.filterTech}>
            {tags.tech.map((tc) => (
              <Chip key={tc} active={filter.tech === tc} onClick={() => toggle('tech', tc)}>
                {TECH[tc]}
              </Chip>
            ))}
          </FacetRow>
        ) : null}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p aria-live="polite">{t.showing.replace('{n}', String(shown.length)).replace('{total}', String(items.length))}</p>
          {active ? (
            <button
              type="button"
              onClick={() => update({})}
              className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              {t.clear}
            </button>
          ) : null}
        </div>
      </div>

      {shown.length ? (
        <ul className="divide-y divide-border border-b border-border">
          {shown.map((i) => (
            <li key={i.href}>
              <Link href={hrefFor(locale, i.href)} className="group block py-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="font-medium text-foreground">{t.kind[i.kind]}</span>
                  {i.id ? <span className="font-mono">{i.id}</span> : <time dateTime={i.date}>{formatDate(i.date, locale)}</time>}
                </div>
                <h2 className="mt-1 text-lg font-medium group-hover:underline">{i.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.summary}</p>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {i.topics.map((tp) => (
                    <span key={tp}>#{TOPICS[tp][locale]}</span>
                  ))}
                  {i.tech.map((tc) => (
                    <span key={tc} className="font-mono">
                      {TECH[tc]}
                    </span>
                  ))}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-muted-foreground">{t.empty}</p>
      )}
    </div>
  );
}
