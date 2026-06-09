import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';
import { hrefFor } from '@/lib/nav';
import { site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Training "book a taster" stub (FS-0008/US-0020). M0 states training is offered and routes to
// Contact — no offer ladder, no tiers, no EU AI Act content (all M1). Reachable from the home
// page training CTA and the header. Bilingual.
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
  const t = getDictionary(locale as Locale).training;
  return { title: `${t.title} — ${site.name}`, description: t.lede };
}

export default async function TrainingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).training;

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />
      <div className="mt-8 max-w-2xl">
        <Markdown>{t.body}</Markdown>
      </div>

      <div className="mt-10 max-w-2xl rounded-lg border border-border p-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.ctaHeading}
        </h2>
        <p className="mt-4">{t.ctaBody}</p>
        <div className="mt-6">
          <Button asChild>
            <Link href={hrefFor(locale, '/contact')}>{t.cta}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
