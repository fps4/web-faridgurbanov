# Codebase overview

faridgurbanov.com is a **static-exported** Next.js 15 site (ADR-0001): a bilingual (EN/NL)
personal credibility surface that renders filesystem markdown to static HTML at build time and is
served by nginx on the ds1 Docker host. There is **no application server and no database** — the
build artifact (`out/`) is the whole product.

> **Status:** the **US-0001 scaffold** has landed — the Next 15 app configured for static export,
> a Tailwind/shadcn base, a frontmatter-stripping helper, and the `[locale]` static-export spike
> that proves App-Router locale segments pre-render to `/en` and `/nl` with no server. Still
> `planned`: the real bilingual shell + language switcher (US-0002), the markdown content
> pipeline over `content/{en,nl}` (US-0003), and the content pages themselves (EP-01/EP-02).

## Directory map

| Path | Purpose |
|------|---------|
| `docs/` | Product intent, ADRs, roadmap, and backlog — the spec-driven source of truth that precedes code (see [`docs/README.md`](docs/README.md)) |
| `app/` | Next.js App Router. `layout.tsx` + `page.tsx` are the root shell; `app/[locale]/page.tsx` is the static-export locale spike; `globals.css` holds the Tailwind layer |
| `components/` | React components. `ui/` holds shadcn primitives (`button.tsx`); `markdown.tsx` renders content bodies; `theme-provider.tsx` wraps `next-themes` |
| `lib/` | Framework-free helpers — `frontmatter.ts` (strip the YAML block before rendering), `utils.ts` (`cn` class merge) |
| `content/` | *(planned, US-0003)* Filesystem markdown under `content/{en,nl}`; frontmatter drives nav, ordering, and draft state |
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
