import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LearningCrumbs } from '@/components/learning-crumbs';
import {
  learningCopy,
  learningPath,
  moduleIsOpen,
  openModules,
  releasedEpisodes,
  series as allSeries,
  seriesBySlug,
} from '@/lib/learning';
import { hrefFor } from '@/lib/nav';
import { site, learningVisible } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// A module page in the Learning section (FS-0012): the module's question, then its switched-on
// episodes in order, each with its "In this episode" lines, and how many more are planned. A module
// exists as a page only once one of its episodes is switched on (RELEASED, lib/learning.ts). WHILE
// the Learning section is unpublished a production build renders a 404; `next dev` shows it.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allSeries.flatMap((s) => openModules(s).map((m) => ({ locale, series: s.slug, module: m.slug }))),
  );
}

type Params = Promise<{ locale: string; series: string; module: string }>;

function find(slug: string, moduleSlug: string) {
  const s = seriesBySlug(slug);
  const mod = s?.modules.find((m) => m.slug === moduleSlug);
  return s && mod && moduleIsOpen(s, mod) ? { s, mod } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!learningVisible()) return {};
  const { series, module } = await params;
  const found = find(series, module);
  if (!found) return {};
  return { title: `${found.mod.title} — ${found.s.title} — ${site.name}`, description: found.mod.line };
}

export default async function ModulePage({ params }: { params: Params }) {
  if (!learningVisible()) notFound();
  const { locale: raw, series, module: moduleSlug } = await params;
  const locale = raw as Locale;
  const found = find(series, moduleSlug);
  if (!found) notFound();
  const { s, mod } = found;
  const l = learningCopy[locale];
  const episodes = releasedEpisodes(s, mod);
  const coming = mod.episodes.length - episodes.length;

  return (
    <section className="container py-16 sm:py-20">
      <LearningCrumbs
        locale={locale}
        trail={[
          { label: l.title, href: learningPath.index },
          { label: s.title, href: learningPath.series(s) },
        ]}
      />
      <div className="mt-8 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{l.moduleLabel(mod.number)}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{mod.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{mod.line}</p>
      </div>

      <ol className="mt-12 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {episodes.map((episode) => (
          <li key={episode.number}>
            <Link
              href={hrefFor(locale, learningPath.episode(s, mod, episode))}
              className="grid gap-x-8 gap-y-3 p-6 transition-colors hover:bg-muted/50 sm:grid-cols-[6rem_minmax(0,1fr)]"
            >
              <span className="text-3xl font-semibold tabular-nums text-muted-foreground">{episode.number}</span>
              <div>
                <h2 className="text-xl font-medium">{episode.title}</h2>
                {episode.promise ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                    {episode.promise.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ol>
      {coming > 0 ? <p className="mt-6 text-sm uppercase tracking-wide text-muted-foreground">{l.moreComing(coming)}</p> : null}
    </section>
  );
}
