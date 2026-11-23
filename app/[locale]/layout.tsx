import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HtmlLang } from '@/components/html-lang';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, locales, type Locale } from '@/lib/i18n';

// Bilingual shell wrapping every locale route (FS-0001/US-0002). Locales are enumerated at build
// time so /en and /nl pre-render as static HTML with no server (ADR-0001/0002); any other segment
// is a build-time 404.
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
  const t = getDictionary(locale as Locale).shell;

  // The shell (header, footer, skip link) is in the language of the address. A page without Dutch
  // (the privacy page) marks its own text lang="en" and its notice lang="nl"; <html lang> follows
  // the page (components/html-lang.tsx).
  const lang = locale as Locale;

  return (
    <>
      <HtmlLang locale={locale as Locale} />
      <a
        href="#main"
        lang={lang}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-1 focus:ring-ring"
      >
        {t.skipToContent}
      </a>
      <div lang={lang} className="flex min-h-screen flex-col">
        <SiteHeader locale={locale as Locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale as Locale} />
      </div>
    </>
  );
}
