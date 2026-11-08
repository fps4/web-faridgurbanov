import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PracticeEntry } from '@/components/practice-entry';
import { entrySlugs, getPracticeEntry } from '@/lib/practice';
import { site } from '@/lib/site';
import { isLocale } from '@/lib/i18n';

// Pattern detail (FS-0013); the page itself is components/practice-entry.tsx, shared with guidelines.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await entrySlugs('pattern')).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const e = await getPracticeEntry('pattern', slug, locale);
  if (!e) return {};
  return { title: `${e.id}: ${e.title} — ${site.name}`, description: e.summary };
}

export default async function PatternPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const e = await getPracticeEntry('pattern', slug, locale);
  if (!e) notFound();
  return <PracticeEntry entry={e} locale={locale} />;
}
