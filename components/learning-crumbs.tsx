import Link from 'next/link';
import { hrefFor } from '@/lib/nav';
import type { Locale } from '@/lib/i18n';

// The trail above a Learning page (FS-0012): Learning › series › module. The page itself is not in
// it; its heading says where you are.
export function LearningCrumbs({ locale, trail }: { locale: Locale; trail: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-x-2">
            {i > 0 ? <span aria-hidden="true">›</span> : null}
            <Link href={hrefFor(locale, crumb.href)} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
