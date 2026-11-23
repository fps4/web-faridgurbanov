'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { copyLocale, localelessPath, type Locale } from '@/lib/i18n';

// The App-Router root layout owns <html> and cannot know the locale (it is below the root in the
// segment tree), so the statically-served lang attribute is the default. This client island
// corrects document.documentElement.lang to the language the page text is in after navigation, for
// assistive tech and the browser's own language handling. That is the locale of the address, except
// on a page that has no Dutch (copyLocale, lib/i18n.ts), which is English under /nl; the notice
// carries its own lang="nl". Renders nothing.
export function HtmlLang({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const path = localelessPath(pathname ?? `/${locale}`);
  // Known gap: this does not know that a content page fell back to English (`fellBack`); such a page marks
  // its own wrapper lang="en". None exists: lib/content-parity.test.ts requires a Dutch file for every published file.
  useEffect(() => {
    document.documentElement.lang = copyLocale(locale, path);
  }, [locale, path]);
  return null;
}
