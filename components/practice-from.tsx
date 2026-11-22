import Link from 'next/link';
import { localizeHref, type Locale } from '@/lib/i18n';
import type { FromItem } from '@/lib/practice-model';

// "Where it comes from" on the Practice list and on an article page (art-gdp0zjj9fd): the work an
// article is drawn from. An item with a link leads to that work (a case study, or an entry of the
// Earlier work list); an item without one is plain text, as the approved copy has it. `label` is the
// approved "Where it comes from".
export function PracticeFrom({ label, items, locale }: { label: string; items: FromItem[]; locale: Locale }) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.label}
            href={localizeHref(item.href, locale)}
            className="py-1.5 font-medium underline-offset-4 hover:underline"
          >
            {item.label}
          </Link>
        ) : (
          <span key={item.label} className="py-1.5 font-medium">
            {item.label}
          </span>
        ),
      )}
    </>
  );
}
