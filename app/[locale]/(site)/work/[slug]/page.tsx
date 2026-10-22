import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticle } from '@/components/content-article';
import { ReferenceQuote } from '@/components/reference-quote';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { loadReferences, referencesFor } from '@/lib/references';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';

// Case-study detail (FS-0004/US-0011). Consistent structure (context → built → impact → role/stack)
// lives in the markdown body; clients abstracted where confidentiality requires, metrics kept.
//
// WHERE a published reference names this study, an "In their words" section is rendered between
// "Who had to say yes" and "Role & stack" (FS-0009): the stakeholder section is the owner's account,
// and this is one of those stakeholders speaking. It comes from content/references/, so the
// markdown stays the owner's prose and the quote stays the other person's.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await sectionSlugs('work')).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const entry = await getEntry('work', slug, locale);
  if (!entry) return {};
  return { title: `${title(entry.data)} — ${site.name}`, description: summary(entry.data) };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = await getEntry('work', slug, locale);
  if (!entry) notFound();
  const t = getDictionary(locale);
  const refs = referencesFor(await loadReferences(), slug);

  return (
    <ContentArticle
      entry={entry}
      fallbackMessage={t.fallback.notice}
      backHref={hrefFor(locale, '/work')}
      backLabel={t.indexes.backToIndex.work}
      beforeLastSection={
        refs.length ? (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight">{t.references.heading}</h2>
            {refs.map((ref) => (
              <ReferenceQuote key={ref.slug} reference={ref} locale={locale} variant="article" />
            ))}
          </section>
        ) : undefined
      }
    />
  );
}
