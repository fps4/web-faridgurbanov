import type { Metadata } from 'next';
import { PageIntro } from '@/components/page-intro';
import { ObfuscatedEmail } from '@/components/obfuscated-email';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Contact (FS-0007/US-0015). Works on the static export with no backend: an obfuscated mailto, the
// profile links, location, and the "book a taster" path. No form → no third-party processor → the
// privacy page can honestly say nothing is collected.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale as Locale).contact;
  return { title: `${t.title} — ${site.name}`, description: t.lede };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).contact;

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.emailHeading}
          </h2>
          <p className="mt-3">
            <ObfuscatedEmail className="text-lg font-medium underline underline-offset-4 hover:text-foreground" />
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.emailHint}</p>

          <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.tasterHeading}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t.tasterBody}</p>
          <div className="mt-4">
            <Button asChild variant="secondary">
              <ObfuscatedEmail subject="Taster">{t.tasterCta}</ObfuscatedEmail>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.elsewhereHeading}
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="underline underline-offset-4 hover:text-foreground" href={site.linkedin} rel="me noopener" target="_blank">
                {t.linkedin}
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4 hover:text-foreground" href={site.github} rel="me noopener" target="_blank">
                {t.github}
              </a>
            </li>
          </ul>

          <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.locationHeading}
          </h2>
          <p className="mt-3 text-muted-foreground">{site.location[locale]}</p>
        </section>
      </div>
    </div>
  );
}
