---
title: "FS-0001 — Bilingual site shell, navigation & content pipeline"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/design/decisions/0002-bilingual-en-nl-i18n.md
maestro:
  feature: site-shell-and-content-pipeline
  kind: functional_spec
  summary: |
    The foundation every page sits on: a bilingual (EN/NL) Next.js shell that renders
    filesystem markdown as static HTML. It gives the site a consistent header/nav/footer, a
    language switcher that keeps the visitor on the same page in the other language, and a
    content pipeline that turns markdown files under /content/{en,nl} into styled pages — so
    each later page spec only has to supply content, not plumbing. The whole site exports to
    static files on a CDN with no server.
---

# FS-0001 — Bilingual site shell, navigation & content pipeline

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)
- **Decisions:** [ADR-0001](../design/decisions/0001-tech-stack-and-static-export.md),
  [ADR-0002](../design/decisions/0002-bilingual-en-nl-i18n.md)

## Why

Every content page (FS-0002…FS-0008) needs the same frame — header, navigation, footer,
language switching, and a markdown→HTML pipeline — and the site must export to static files for
free CDN hosting. Specifying this once keeps the page specs thin and the structure identical
across pages and across languages.

## Scope

1. **App shell** — a shared layout (header with logo/name + primary nav, footer with social /
   contact links) wrapping every route, on Next.js 15 App Router + Tailwind + shadcn/ui.
2. **Bilingual routing** — locale-segmented routes (`/en/...`, `/nl/...`) with a default locale
   and a language switcher that preserves the current page across the switch.
3. **Content pipeline** — markdown files under `/content/{en,nl}/<section>/...` rendered via
   `react-markdown` + `remark-gfm` + `@tailwindcss/typography`; frontmatter (title, summary,
   order, draft) drives titles and ordering.
4. **Navigation** — a single nav definition driving header links and localized labels; the nav
   set is milestone-aware (Training is a CTA stub in M0, a full nav item in M1).
5. **Static export** — `output: 'export'`; the production build emits static HTML/CSS/JS with no
   server or database.
6. **Graceful language fallback** — when a page has no translation in the requested locale, the
   site behaves predictably (see acceptance criteria) rather than 404-ing silently.

## Out of scope

- Page-specific content and layout (each later FS owns its own page).
- Any server runtime, API, database, CMS, or auth.
- Search, comments, analytics dashboards.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL render every page within a shared layout providing a header with the owner's
  name/logo and primary navigation, and a footer with contact and social links.
- THE SYSTEM SHALL serve content under locale-segmented routes for English and Dutch, with a
  single configured default locale.
- WHEN a visitor uses the language switcher on any page, THE SYSTEM SHALL navigate to the
  equivalent page in the other locale, preserving the page identity (not resetting to the home
  page).
- WHERE a page exists in the default locale but not in the requested locale, THE SYSTEM SHALL
  fall back to the default-locale content for that page and SHALL indicate the content is shown
  in the fallback language (no silent 404).
- THE SYSTEM SHALL render page bodies from markdown files under `/content/{en,nl}/` using GFM,
  with prose typography styling applied.
- THE SYSTEM SHALL derive each page's title, ordering, and draft status from the markdown file's
  frontmatter, and SHALL exclude `draft: true` content from the production build.
- THE SYSTEM SHALL produce a fully static export (`output: 'export'`) that runs from a CDN with
  no server-side runtime or database.
- THE navigation SHALL be milestone-configurable so that the Training entry renders as a CTA
  stub in M0 and as a full navigation item in M1 without code changes to the shell.

## Definition of done

- `npm run build` produces a static export that serves both `/en` and `/nl` from a CDN preview
  with no runtime backend.
- A new markdown file dropped under `/content/{en,nl}/<section>/` appears as a styled page with
  correct nav and language switching, with no code change beyond content/frontmatter.
- The language switcher round-trips on every page; the fallback path is covered by a check.
- Lighthouse/basic performance is healthy on a representative page (static, no heavy JS).
