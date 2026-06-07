import { notFound } from 'next/navigation';

// i18n static-export spike (US-0001, feeds US-0002 / ADR-0002).
//
// Proves that App-Router `[locale]` segments are compatible with `output: 'export'`: the two
// locales are enumerated at build time via generateStaticParams, so `next build` pre-renders
// /en and /nl to static en.html / nl.html with NO server, NO middleware, NO runtime locale
// negotiation. This is the lowest-risk, zero-dependency i18n foundation; US-0002 builds the
// real bilingual shell (header, language switcher, content) on top of this segment.

export const dynamicParams = false; // any locale outside the list → build-time 404, not a server lookup

const LOCALES = ['en', 'nl'] as const;
type Locale = (typeof LOCALES)[number];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const COPY: Record<Locale, { title: string; body: string }> = {
  en: { title: 'English', body: 'Locale-segmented route, statically exported. Content arrives in US-0002/US-0003.' },
  nl: { title: 'Nederlands', body: 'Taal-gesegmenteerde route, statisch geëxporteerd. Inhoud volgt in US-0002/US-0003.' },
};

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const copy = COPY[locale as Locale];

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="max-w-prose text-muted-foreground">{copy.body}</p>
    </main>
  );
}
