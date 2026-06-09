'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n';

// The App-Router root layout owns <html> and cannot know the locale (it is below the root in the
// segment tree), so the statically-served lang attribute is the default. This client island
// corrects document.documentElement.lang to the active locale after navigation, for assistive tech
// and the browser's own language handling. Renders nothing.
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
