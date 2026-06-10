import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { getDictionary } from '@/lib/dictionaries';
import { headerNav, hrefFor, trainingNav } from '@/lib/nav';
import { site, TRAINING_PUBLISHED } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Shared header (FS-0001/US-0002): name → home, primary nav, the Training "book a taster" CTA
// (gated by TRAINING_PUBLISHED — hidden in M0, surfaced in M1), language switcher, theme toggle.
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).shell;
  return (
    <header className="border-b border-border">
      <div className="container flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link
          href={hrefFor(locale, '')}
          className="mr-auto text-base font-semibold tracking-tight"
          aria-label={`${site.name} — ${t.nav.home}`}
        >
          {site.name}
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {headerNav().map((item) => (
            <Link
              key={item.href}
              href={hrefFor(locale, item.href)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {TRAINING_PUBLISHED && (
            <Button asChild size="sm">
              <Link href={hrefFor(locale, trainingNav.href)}>{t.tasterCta}</Link>
            </Button>
          )}
          <LanguageSwitcher locale={locale} />
          <ThemeToggle label={t.themeToggle} />
        </div>
      </div>
    </header>
  );
}
