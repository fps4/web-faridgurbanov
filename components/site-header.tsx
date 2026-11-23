import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { getDictionary } from '@/lib/dictionaries';
import { headerNav, hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Shared header (FS-0001): name → home, primary nav (Work, Practice, Contact), language switcher,
// theme toggle.
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).shell;
  return (
    <header className="border-b border-border">
      <div className="container flex min-h-[68px] flex-wrap items-center gap-x-2 py-1">
        <Link
          href={hrefFor(locale, '')}
          className="mr-auto py-3 font-heading text-lg font-semibold tracking-tight"
          aria-label={`${site.name} — ${t.nav.home}`}
        >
          {site.name}
        </Link>

        <nav aria-label={t.aria.primary} className="flex flex-wrap items-center text-base">
          {headerNav().map((item) => (
            <Link
              key={item.href}
              href={hrefFor(locale, item.href)}
              className="px-[14px] py-[11px] font-medium text-foreground underline-offset-4 hover:underline"
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t.aria.language} />
          <ThemeToggle label={t.themeToggle} />
        </div>
      </div>
    </header>
  );
}
