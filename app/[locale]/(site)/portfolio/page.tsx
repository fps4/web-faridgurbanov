import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { getDictionary } from '@/lib/dictionaries';
import { REPO_LINKS_ENABLED, pillars, repos, site } from '@/lib/site';
import { locales, type Locale } from '@/lib/i18n';

// Portfolio (FS-0005/US-0013, restructured by ADR-0006). Build proof grouped by pillar —
// integration, data & modernization first, then AI & applied ML — each card carrying an honest
// maturity label. The ADR-0004 link gate is discharged (every listed repo is public, licensed and
// honestly framed) but REPO_LINKS_ENABLED stays in the code so a future not-yet-linkable repo can
// flip it back without a structural change. No "production systems" claim. Repos still being built
// are not listed here; they live in docs/notes/portfolio-repos-build-plan.md until they are real.
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
  const t = getDictionary(locale as Locale).portfolio;
  return { title: `${t.title} — ${site.name}`, description: t.lede };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale).portfolio;

  return (
    <div className="container py-16">
      <PageIntro title={t.title} lede={t.lede} />
      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {t.narrative}
      </p>

      {pillars.map((pillar) => {
        const items = repos.filter((repo) => repo.pillar === pillar.id);
        if (items.length === 0) return null;
        return (
          <section key={pillar.id} className="mt-12 first:mt-8">
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              {pillar.label[locale]}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{pillar.lede[locale]}</p>
            <ol className="mt-5 grid gap-6 lg:grid-cols-3">
              {items.map((repo, i) => {
                const maturityLabel =
                  repo.maturity === 'working' ? t.maturityWorking : t.maturityReference;
                const maturityClass =
                  repo.maturity === 'working'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground';
                return (
                  <li key={repo.slug} className="flex flex-col rounded-lg border border-border p-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-mono text-xs">{i + 1}</span>
                      <span>{repo.role[locale]}</span>
                    </div>
                    <h3 className="mt-3 font-mono text-lg font-semibold tracking-tight">{repo.name}</h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                          maturityClass
                        }
                      >
                        {maturityLabel}
                      </span>
                      {repo.license ? (
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                          {repo.license}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      {t.provesHeading}
                    </p>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{repo.proves[locale]}</p>

                    {/* Per-repo override wins in both directions; `linkLive: false` suppresses a
                        link for a repo that exists but is not public yet, so no card ever carries
                        a dead link. */}
                    {repo.linkLive ?? REPO_LINKS_ENABLED ? (
                      <a
                        href={repo.url}
                        rel="noopener"
                        target="_blank"
                        className="mt-6 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-foreground"
                      >
                        {t.viewRepo}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {!REPO_LINKS_ENABLED ? (
        <p className="mt-8 max-w-2xl rounded-md border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          {t.linksGatedNotice}
        </p>
      ) : null}

      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">{t.honesty}</p>
    </div>
  );
}
