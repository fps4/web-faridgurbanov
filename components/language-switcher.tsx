'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isLocale, localeName, locales, otherLocale, type Locale } from '@/lib/i18n';

// Language switcher (FS-0001): navigates to the equivalent page in the other locale, preserving
// page identity (not resetting to home). It swaps the leading `/en|/nl` segment of the current
// path — pure client-side routing, so it works under static export with no middleware (ADR-0002).
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const target = otherLocale(locale);

  const segments = pathname.split('/');
  // segments[0] is '' (leading slash); segments[1] is the locale.
  if (isLocale(segments[1])) segments[1] = target;
  else segments.splice(1, 0, target);
  const href = segments.join('/') || `/${target}`;

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm">
      {locales.map((l) => (
        <span key={l} aria-hidden={l === locale ? undefined : true}>
          {l === locale ? (
            <span className="font-medium text-foreground" aria-current="true">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={href}
              prefetch={false}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              hrefLang={l}
              aria-label={localeName[l]}
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
