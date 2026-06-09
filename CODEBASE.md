# Codebase overview

faridgurbanov.com is a **static-exported** Next.js 15 site (ADR-0001): a bilingual (EN/NL)
personal credibility surface that renders filesystem markdown to static HTML at build time and is
served by nginx on the ds1 Docker host. There is **no application server and no database** — the
build artifact (`out/`) is the whole product.

> **Status:** the **M0 credibility foundation** has landed. On top of the US-0001 scaffold: the
> bilingual shell — shared header/nav/footer, language switcher that preserves page identity, and a
> milestone-aware nav (Training is a CTA stub in M0) over App-Router `[locale]` segments (US-0002);
> the markdown content pipeline reading `content/{en,nl}/<section>/` with frontmatter parsing and
> EN-fallback (US-0003); and every M0 page — home credibility hero (US-0010), five expertise pages
> (US-0012), four case studies (US-0011), portfolio with ADR-0004-gated repo links (US-0013), a
> writing index + training-wedge post (US-0014), contact + privacy (US-0015), and the training
> taster stub (US-0020). All pages are authored in EN **and** NL. Repo links stay off until the
> ADR-0004 prerequisites close (flip `REPO_LINKS_ENABLED` in `lib/site.ts`). Remaining for US-0004:
> DNS, TLS, and the `.nl → /nl/training` redirect are ds1 **host** config (see `infra/docker/`).

## Directory map

| Path | Purpose |
|------|---------|
| `docs/` | Product intent, ADRs, roadmap, and backlog — the spec-driven source of truth that precedes code (see [`docs/README.md`](docs/README.md)) |
| `app/` | Next.js App Router. Root `layout.tsx` + `page.tsx` (root `/` → default-locale chooser/redirect); `app/[locale]/` holds the bilingual shell `layout.tsx` and every page — home `page.tsx`, `expertise`, `work`, `portfolio`, `writing` (index + `[slug]`), `contact`, `privacy`, `training`; `globals.css` holds the Tailwind layer |
| `components/` | React components. `ui/` holds shadcn primitives; `site-header`/`site-footer` are the shell chrome; `language-switcher`, `theme-toggle`, `html-lang`, `root-redirect`, `obfuscated-email` are client islands; `markdown.tsx` + `content-article.tsx` render content bodies; `page-intro`, `fallback-notice` are layout helpers |
| `lib/` | Framework-free helpers — `i18n.ts` (locales/default), `site.ts` (facts + the `REPO_LINKS_ENABLED`/`HOME_VARIANT` gates + repo data), `nav.ts` (milestone-aware nav), `dictionaries.ts` (bilingual UI copy), `content.ts` (build-time markdown loader, server-only), `frontmatter.ts` (parse/strip), `dates.ts`, `utils.ts` |
| `content/` | Filesystem markdown under `content/{en,nl}/<section>/`; frontmatter (`title`, `summary`, `order`, `draft`, `date`, `hook`, `metric`) drives titles, ordering, and draft exclusion. Sections: `expertise`, `work`, `writing` |
| `infra/docker/` | The static site packaged for ds1: multi-stage `web.Dockerfile` (export → nginx), `nginx.conf`, `compose.yml` |
| `ops/` | Operational scripts (e.g. `ops/maestro/`) |
| `.github/workflows/` | `dod.yml` — the Definition-of-Done quality gate (lint, test, assert `out/` builds); `deploy-ds1.yml` — deploy to the ds1 self-hosted runner on green merge |
| `out/` | Build output (git-ignored) — the static export nginx serves |

## Entry points

- **App shell:** `app/layout.tsx` → `app/page.tsx` (and the `app/[locale]/` segment).
- **Build:** `next build` with `output: 'export'` (`next.config.mjs`) → `out/`.
- **Tests:** `vitest run` (`vitest.config.ts`, `vitest.setup.ts`); co-located `*.test.ts(x)`.
- **Config:** `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `components.json` (shadcn).

## Naming notes

- Functional specs: `docs/product/FS-NNNN-*.md`; ADRs: `docs/design/decisions/NNNN-*.md`.
- User stories: `docs/delivery/backlog/EP-NN-slug/US-NNNN-*.md`, each carrying `milestone: M<n>`.
- The site is built from the `../maestro/web/` base; the docs follow maestro's documentation standard.

## Out of scope

- No application server, API routes, server components fetching at runtime, or database — anything
  requiring a server is incompatible with the static export (ADR-0001).
- No `next/image` optimisation (no server loader) — images are passed through unoptimised.
- Per-story build/review status is **not** kept in a Markdown board; it lives in the story
  frontmatter and is tracked off-repo.
