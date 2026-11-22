import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { headerNav, hrefFor, referencesNav } from '@/lib/nav';
import { loadReferences } from '@/lib/references';
import { site } from '@/lib/site';
import { copyLocale, type Locale } from '@/lib/i18n';

// Shared footer (FS-0001/US-0002): the one statement on how AI is used (art-4fzvp6bqm0), the site
// nav, the connect links (LinkedIn/GitHub + contact), and the site-wide privacy link required by
// FS-0007. The references page (FS-0009) is listed here, not in the header, and only WHILE at least
// one reference is published. Every text in it is the approved statement or a link label (AC-2 of
// art-4fzvp6bqm0): no name heading, no column headings, no copyright line.
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).shell;
  const hasReferences = (await loadReferences()).length > 0;
  const navItems = [...headerNav(), ...(hasReferences ? [referencesNav] : [])];

  return (
    <footer className="mt-16 border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
        <div className="col-span-2">
          <p className="max-w-md text-sm text-muted-foreground">{t.footerAiStatement}</p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={hrefFor(locale, item.href)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label[copyLocale(locale)]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="text-sm">
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
                {navItems.find((n) => n.href === '/contact')?.label[copyLocale(locale)]}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={hrefFor(locale, '/privacy')} className="hover:text-foreground">
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
