import { notFound } from 'next/navigation';
import { HtmlLang } from '@/components/html-lang';
import { isLocale, locales, type Locale } from '@/lib/i18n';

// The locale segment (FS-0001/US-0002). Locales are enumerated at build time so /en and /nl
// pre-render as static HTML with no server (ADR-0001/0002); any other segment is a build-time 404.
// The site chrome (header, nav, footer) lives one level down in the (site) route group, so a route
// under the locale can opt out of it: the episode decks at /<locale>/deck/<episode> render the bare
// recording stage (FS-0010, ADR-0010).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <HtmlLang locale={locale as Locale} />
      {children}
    </>
  );
}
