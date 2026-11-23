---
title: "FS-0001 — Bilingual site shell, navigation & content pipeline"
status: draft
last_updated: 2026-11-23
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
    static files served by nginx on the ds1 Docker host with no application server.
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
low-cost self-hosting on ds1. Specifying this once keeps the page specs thin and the structure identical
across pages and across languages.

## Scope

1. **App shell** — a shared layout (header with logo/name + primary nav, footer with social /
   contact links) wrapping every route, on Next.js 15 App Router + Tailwind + shadcn/ui.
2. **Bilingual routing** — locale-segmented routes (`/en/...`, `/nl/...`) with a default locale
   and a language switcher that preserves the current page across the switch.
3. **Content pipeline** — markdown files under `/content/{en,nl}/<section>/...` rendered via
   `react-markdown` + `remark-gfm` + `@tailwindcss/typography`; frontmatter (title, summary,
   order, draft) drives titles and ordering.
4. **Navigation** — a single nav definition driving header links and localized labels. The header
   reads Work, Practice, Contact, in that order, besides the name, the language switcher and the
   theme toggle ([ADR-0010](../design/decisions/0010-the-site-has-one-job.md) §5; maestro story
   `art-y97cjsakwq`). The footer lists the same three, and References while one is published.
   Contact leads to the Contact part of the home page, `/<locale>#contact` (maestro story
   `art-r903t1r2tp`).
   The footer carries the one statement on how AI is used, verbatim from the approved copy
   (ADR-0010 §6; maestro story `art-4fzvp6bqm0`), and stands nowhere else on the site.
5. **Look** — one centred column whose text is 1080px wide, with 32px at each side (the container
   box is at most 1144px; bands run the full width), running text at 17px (the root size, so every
   rem-based size scales with it, which is why no text size is written in pixels) and a line height of 1.55, Inter for
   text and Space Grotesk for headings and the name in the header, both served by the site itself
   (maestro story `art-26rhtzey62`).
6. **Static export** — `output: 'export'`; the production build emits static HTML/CSS/JS with no
   server or database.
7. **Graceful language fallback** — when a page has no translation in the requested locale, the
   site behaves predictably (see acceptance criteria) rather than 404-ing silently.

## Out of scope

- Page-specific content and layout (each later FS owns its own page).
- Any server runtime, API, database, CMS, or auth.
- Search, comments, analytics dashboards.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL render every page within a shared layout providing a header with the owner's
  name/logo and primary navigation, and a footer with contact and social links.
- THE SYSTEM SHALL carry in the footer of every page, in both locales, the approved statement on
  how AI is used, and SHALL carry that statement nowhere else.
- THE SYSTEM SHALL carry in the footer only the approved statement and link labels: no tagline,
  built-with line, name or column heading, and no copyright line.
- THE SYSTEM SHALL set the top bar, the content and the footer of every page in one centred column
  whose text is at most 1080px wide (the box is at most 1144px with 32px at each side), with equal
  space left and right, while the coloured bands run the full width of
  the screen.
- THE SYSTEM SHALL set running text at 17px with a line height of 1.55, with headings, introductions and small text keeping
  their steps above and below it, in Inter, and headings (including those inside prose) and the name
  in the header in Space Grotesk.
- THE SYSTEM SHALL serve the font files from the site itself (the Latin subsets of the
  `@fontsource-variable/inter` and `@fontsource-variable/space-grotesk` packages, SIL Open Font
  License), SHALL send no request to another site for them, and SHALL show text at once in a
  fallback font while they load (`font-display: swap`).
- THE SYSTEM SHALL show in the header, on a wide screen, the name at about 19px (`text-lg`) semibold in the heading
  typeface, the links Work, Practice and Contact at 17px medium in the colour of the page text with a
  target at least 44px high, and the language link at about 15px (`text-sm`); at 360px wide nothing is cut off and the
  page does not scroll sideways.
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
- THE SYSTEM SHALL produce a fully static export (`output: 'export'`) served by a static file
  server (nginx on the ds1 Docker host) with no server-side application runtime or database.
- THE header SHALL show the links Work, Practice and Contact, in that order, on every page in both
  locales, besides the name, the language switcher and the theme toggle.
- WHEN a visitor opens an old address under `/learning`, `/portfolio` or `/training` in either
  locale (including its trailing-slash and `.html` forms), THE SYSTEM SHALL answer 301 to Work in the
  same locale; WHEN the address is under `/expertise`, THE SYSTEM SHALL answer 301 to the home page
  in the same locale. The rules are nginx locations in `infra/docker/nginx.conf`, checked against the
  export by `lib/redirects.test.ts`.
- WHEN any internal link on any page of the export is followed, THE SYSTEM SHALL NOT end on a 404;
  a link to a removed address ends on its 301 target.

## Interim state: Dutch shows the English page

Until the owner approves the Dutch copy, every address under `/nl` shows the English page under the
fallback notice above (maestro story `art-bf5tq4788n`, "Site · Dutch pages show the English page, with
a notice, until the Dutch copy is approved", which follows [ADR-0010](../design/decisions/0010-the-site-has-one-job.md)). `content/nl` holds no files, the Dutch
dictionary is the English one except the notice, and `copyLocale` in `lib/i18n.ts` makes the
locale-keyed copy (navigation labels, topics) read English under `/nl`. The text
of the page is marked `lang="en"` and the notice `lang="nl"`. A link written as `/en/…` in
markdown stays under `/nl`, each `/nl` page has a canonical link to its English twin, and the sitemap
lists the English addresses only. The routes and the language switcher are unchanged. The Dutch story of the site's cut brings the approved copy back.

## Definition of done

- `npm run build` produces a static export that serves both `/en` and `/nl` from the nginx
  container with no runtime backend.
- A new markdown file dropped under `/content/{en,nl}/<section>/` appears as a styled page with
  correct nav and language switching, with no code change beyond content/frontmatter.
- The language switcher round-trips on every page; the fallback path is covered by a check.
- Lighthouse/basic performance is healthy on a representative page (static, no heavy JS).
