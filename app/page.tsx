import Link from 'next/link';
import { RootRedirect } from '@/components/root-redirect';
import { defaultLocale, localeName, locales } from '@/lib/i18n';

// Root `/` (index.html). There is no default-locale content at the root — the site lives under
// /en and /nl (ADR-0002). Static export can't issue a server redirect, so we send visitors to the
// default locale client-side and leave a visible, crawlable language chooser as the no-JS path.
export default function RootPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <RootRedirect to={`/${defaultLocale}`} />
      <h1 className="text-2xl font-semibold tracking-tight">Farid Gurbanov</h1>
      <p className="text-sm text-muted-foreground">Choose a language / Kies een taal</p>
      <nav className="flex gap-4 text-sm">
        {locales.map((l) => (
          <Link key={l} className="underline underline-offset-4" href={`/${l}`} hrefLang={l}>
            {localeName[l]}
          </Link>
        ))}
      </nav>
    </main>
  );
}
