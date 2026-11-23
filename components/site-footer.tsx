import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { CONTACT_HREF, headerNav, hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Shared footer (FS-0001/US-0002): the one statement on how AI is used (art-4fzvp6bqm0), the site
// nav, the connect links (LinkedIn/GitHub + contact), and the site-wide privacy link required by
// FS-0007. It lists the header's pages and no References page: the references are a band of the home
// page (art-2ya5at7k1q). Every text in it is the approved statement, a link label (AC-2 of
// art-4fzvp6bqm0) or the approved privacy line, "Privacy · Nothing about you is collected" (AC-6 of
// art-r903t1r2tp): no name heading, no column headings, no copyright line. Contact leads to the
// Contact part of the home page.
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).shell;
  const navItems = headerNav();

  return (
    <footer className="mt-16 border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
        <div className="col-span-2">
          <p className="max-w-md text-sm text-muted-foreground">{t.footerAiStatement}</p>
        </div>

        <nav aria-label={t.aria.footer} className="text-sm">
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
              <Link href={hrefFor(locale, CONTACT_HREF)} className="text-muted-foreground hover:text-foreground">
                {navItems.find((n) => n.href === CONTACT_HREF)?.label[locale]}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href={hrefFor(locale, '/privacy')} className="hover:text-foreground">
            {t.privacy}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{t.privacyLine}</span>
        </div>
      </div>
    </footer>
  );
}
