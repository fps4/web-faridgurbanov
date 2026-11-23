# Codebase overview

faridgurbanov.com is a **static-exported** Next.js 15 site (ADR-0001): a bilingual (EN/NL)
personal credibility surface that renders filesystem markdown to static HTML at build time and is
served by nginx on the ds1 Docker host. There is **no application server and no database** — the
build artifact (`out/`) is the whole product.

> **Status (2026-11-22):** the site's strategy changed. It has one job, and carries no courses,
> labs or portfolio section ([ADR-0010](docs/design/decisions/0010-the-site-has-one-job.md)); the
> training-forward positioning no longer applies. The pages below still describe the code as it
> stands today; later stories cut them to Home, Work, Practice and Contact, each when its copy is
> approved. Learning, Portfolio, Training and Expertise are already removed (maestro story
> `art-y97cjsakwq`): their old addresses 301 in nginx, and the header is Work, Practice, Contact.
> Below is the history of what the M0 foundation put in place, in which they still appear.
>
> The **M0 credibility foundation** has landed. On top of the US-0001 scaffold: the
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
| `app/` | Next.js App Router. Root `layout.tsx` + `page.tsx` (root `/` → default-locale chooser/redirect); `app/[locale]/` holds the bilingual shell `layout.tsx` and every page — home `page.tsx`, `work`, `practice` (FS-0006: the plain list and `articles/[slug]`; the unpublished guidelines, patterns and earlier articles, and the old `/writing` URLs, 301 to `/practice` in nginx), `privacy` (there is no References page: `/references` 301s to the references band of the home page, `#references`, in nginx); Contact is the last part of the home page (`#contact`) and `/contact` 301s to it in nginx; the removed Learning, Portfolio, Training and Expertise addresses 301 in nginx (to Work, and for Expertise to Home); `app/sitemap.ts` writes `/sitemap.xml` with hreflang pairs; `globals.css` holds the Tailwind layer |
| `components/` | React components. `ui/` holds shadcn primitives; `site-header`/`site-footer` are the shell chrome; `language-switcher`, `theme-toggle`, `html-lang`, `root-redirect`, `obfuscated-email` are client islands; `markdown.tsx` + `content-article.tsx` render content bodies; `reference-quote.tsx` renders one reference as a card on the home band or as a block on a case study; `practice-from` draws Where it comes from on the Practice list and an article page; `page-intro`, `fallback-notice` are layout helpers |
| `lib/` | Framework-free helpers — `i18n.ts` (locales/default), `site.ts` (facts and the intro-video setting), `nav.ts` (the header: Work, Practice, Contact), `dictionaries.ts` (bilingual UI copy), `content.ts` (build-time markdown loader, server-only), `practice-model.ts` (an article's fields, `from` list and validators; framework-free) and `practice.ts` (loads and checks the published articles; server-only), `sitemap.ts` (sitemap entries), `references.ts` (the references loader + validation, server-only), `sections.ts` (split a body before its last H2), `frontmatter.ts` (parse/strip), `dates.ts`, `utils.ts` |
| `content/` | Filesystem markdown under `content/{en,nl}/<section>/`; frontmatter (`title`, `summary`, `order`, `draft`, `date`, `hook`, `metric`) drives titles, ordering, and draft exclusion. Sections: `work` and `practice/articles` (four published articles: `title`, `summary` = the first line, `date`, `order`, `read`, `from`; see FS-0006). The guidelines, patterns and ten earlier articles under `practice/` are kept marked `draft: true` and are not built (`sectionSlugs` leaves a draft out of the static params). `content/references/` is locale-less: one file per person quoted (FS-0009), the quote as the body, never translated; `_template.md` is the shape |
| `infra/docker/` | The static site packaged for ds1: multi-stage `web.Dockerfile` (export → nginx), `nginx.conf` (incl. the `/writing` → `/practice` 301s and those of the removed sections, checked by `lib/redirects.test.ts`), `compose.yml` |
| `ops/` | Operational scripts (e.g. `ops/maestro/`) |
| `.github/workflows/` | `dod.yml` — the Definition-of-Done quality gate (lint, test, assert `out/` builds); `publish-images.yml` — build, scan and publish the site image to GHCR on green merge (the deploy is run elsewhere, by digest) |
| `public/references/` | Referee photos, square and small, committed with the reference that names them (never hotlinked from LinkedIn) |
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
