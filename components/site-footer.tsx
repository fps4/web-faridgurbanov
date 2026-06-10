import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { headerNav, hrefFor, trainingNav } from '@/lib/nav';
import { site, TRAINING_PUBLISHED } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Shared footer (FS-0001/US-0002): tagline, the site nav, the connect links (LinkedIn/GitHub +
// contact), and the site-wide privacy link required by FS-0007.
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).shell;
  const year = 2026;
  const navItems = TRAINING_PUBLISHED ? [...headerNav(), trainingNav] : headerNav();

  return (
    <footer className="mt-16 border-t border-border">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t.footerTagline}</p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-medium">{t.footerNavHeading}</p>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={hrefFor(locale, item.href)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-medium">{t.footerConnectHeading}</p>
          <ul className="space-y-2">
            <li>
              <a href={site.linkedin} className="text-muted-foreground hover:text-foreground" rel="me noopener" target="_blank">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.github} className="text-muted-foreground hover:text-foreground" rel="me noopener" target="_blank">
                GitHub
              </a>
            </li>
            <li>
              <Link href={hrefFor(locale, '/contact')} className="text-muted-foreground hover:text-foreground">
                {navItems.find((n) => n.href === '/contact')?.label[locale]}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. {t.rights}
        </p>
        <div className="flex items-center gap-4">
          <Link href={hrefFor(locale, '/privacy')} className="hover:text-foreground">
            {t.privacy}
          </Link>
          <span>{t.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
