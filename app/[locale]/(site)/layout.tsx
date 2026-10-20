import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

// Bilingual shell wrapping every page of the site (FS-0001/US-0002): skip link, shared header with
// the nav and language switcher, and the footer. A route group, so it adds nothing to the URL; the
// locale itself is resolved and checked by app/[locale]/layout.tsx.
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale).shell;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-1 focus:ring-ring"
      >
        {t.skipToContent}
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale as Locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale as Locale} />
      </div>
    </>
  );
}
