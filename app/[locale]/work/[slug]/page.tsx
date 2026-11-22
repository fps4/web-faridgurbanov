import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/case-study';
import { ContentArticle } from '@/components/content-article';
import { ReferenceQuote } from '@/components/reference-quote';
import { caseStudyFrontmatter } from '@/lib/case-study';
import { getDictionary } from '@/lib/dictionaries';
import { getEntry, sectionSlugs, summary, title } from '@/lib/content';
import { hrefFor } from '@/lib/nav';
import { loadReferences, referencesFor } from '@/lib/references';
import { site } from '@/lib/site';
import { isLocale, type Locale } from '@/lib/i18n';
import { fallbackCanonical } from '@/lib/canonical';

// Case-study detail (FS-0004). An entry whose frontmatter has an `intro` is on the case-study page
// shape (components/case-study.tsx, art-13yb9kshaw); the others are still on the earlier shape below
// until the Work stories rewrite or remove them.
//
// Earlier shape (US-0011). Consistent structure (context → built → impact → role/stack)
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
  return {
    title: `${title(entry.data)} — ${site.name}`,
    description: summary(entry.data),
    ...fallbackCanonical(locale, `/work/${slug}`),
  };
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

  const study = caseStudyFrontmatter(entry.data);
  if (study) {
    return (
      <CaseStudy
        entry={entry}
        locale={locale}
        study={study}
        fallbackMessage={t.fallback.notice}
        reference={
          refs.length ? (
            <div className="flex flex-col gap-6">
              {refs.map((ref) => (
                <ReferenceQuote key={ref.slug} reference={ref} locale={locale} variant="article" />
              ))}
            </div>
          ) : undefined
        }
        contactHref={hrefFor(locale, '/contact')}
        nextHref={study.next ? hrefFor(locale, `/work/${study.next.slug}`) : null}
      />
    );
  }

  return (
    <ContentArticle
      entry={entry}
      locale={locale}
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
