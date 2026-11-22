---
title: "FS-0006 — Practice: the owner's articles"
status: draft
last_updated: 2026-11-23
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0013-practice-and-guidelines.md
  - docs/design/decisions/0010-the-site-has-one-job.md
maestro:
  feature: practice-articles
  kind: functional_spec
  summary: |
    Practice is a short list of the articles the owner has approved and may publish now, each in his
    own words, dated, a few minutes to read and linked to the work it comes from. It answers one
    question: how does he work, and what does he think about it? There is no filter, no planned
    article and no "coming soon". The earlier guidelines, patterns and articles are unpublished and
    kept in the repository.
---

# FS-0006 — Practice: the owner's articles

- **Status:** draft
- **Raised:** 2026-06-07 as "Writing / blog"; **rewritten 2026-11-23** for the new Practice (maestro
  story `art-gdp0zjj9fd`, following ADR-0010 §11).
- **Owner:** @farid (architect)

> **Since 2026-11-23:** this spec describes Practice as ADR-0010 §11 sets it. FS-0013 (guidelines,
> patterns, tags and a filter) stays superseded and is not built from. The section is **Practice** at
> `/practice` (**Werkwijze** in the Dutch header), and the articles live at
> `/practice/articles/<slug>`, from `content/<locale>/practice/articles/`.

## Why

A peer who is asked for an opinion on the owner wants to see how he thinks (use case UC-01, extension 4b).
Practice gives his position, a real case from his work and the other side, in his own words. Work
shows what was done; Practice gives his opinion on it.

## Scope

1. **A list**, `/practice`: the page introduction, then the published articles as a plain list in the
   order of their `order`. Each row has the reading time, the title, the first line of the article and
   Where it comes from. The design is `Practice.dc.html`; its grey "Not on the site until written"
   section is a planning note of the mock and is not built.
2. **An article page**, `/practice/articles/<slug>`: the back link, the title, the date it was written
   and the reading time, the article, a side column with Where it comes from and Written how, and a
   bar at the foot. The design is `Article.dc.html`.
3. **Every text is verbatim** from the approved site copy (section Practice, and Texts shown in the
   design that were missing above); a builder adds no text (`AGENTS.md`, Where copy comes from). The
   labels and the introduction are in `lib/dictionaries.ts`; the rest is in each article's file.
4. **An article file** has the frontmatter `title`, `summary` (its first line, taken unchanged from
   its own text), `date` (the day it was written, ISO), `order`, `read` (the reading-time label) and
   `from` (Where it comes from). An item of `from` is plain text, or `Label | /en/…` with a link to a
   case study (`/en/work/<slug>`) or an Earlier work entry (`/en/work#earlier-<id>`). The frontmatter
   parser splits an inline list on every comma, so an item holds no comma: its link follows a ` | `.
   The loader, `lib/practice.ts`, fails the build on a malformed article.
5. **No filter, no tags, no planned article.** A planned article is not shown until it is written and
   approved; there is no "coming soon" (ADR-0010 §11.4).
6. **Drafts are not built.** A file marked `draft: true` is not listed, has no page (it is left out of
   the static params), and is not in the sitemap. The guidelines, the patterns and the ten earlier
   articles are kept in the repository marked draft; they come back only rewritten under ADR-0010 §12.
   Their diagrams are kept in `content/en/practice/diagrams/`, outside `public/`, so the build does
   not export them; a diagram moves back to `public/diagrams/` when its piece is published again.
7. **Redirects.** The addresses of the unpublished pieces, and every old `/writing` address, answer
   301 to `/<locale>/practice` (nginx, `infra/docker/nginx.conf`; checked by `lib/redirects.test.ts`).
8. **Sitemap.** `/sitemap.xml` lists Practice and each published article (`app/sitemap.ts`).
9. **Bilingual.** English now; Dutch shows the English page under a notice until the approved Dutch
   copy is in (ADR-0002, `copyLocale`).

## Out of scope

- Comments, reactions, feeds, a content calendar, tags, filters and a scheduling system.
- Videos above an article (ADR-0010 §4; added later, when the owner has recorded one).
- A worked use case with short guidelines (ADR-0010 §10; a later story).

## Acceptance criteria (EARS)

- WHEN a visitor opens `/practice`, THE SYSTEM SHALL show the page introduction and the published
  articles, each title and first line verbatim from the approved copy, and no filter, no planned
  article and no "coming soon".
- WHEN a visitor reads an article in the list, THE SYSTEM SHALL show its reading time and its Where it
  comes from, and each item that names a case study or an Earlier work entry SHALL lead to it.
- WHEN a visitor opens an article, THE SYSTEM SHALL show the date it was written, its reading time,
  Written how, the bar at its foot and its body unchanged from the approved copy.
- THE SYSTEM SHALL NOT build a page for, list, or put in the sitemap a file marked `draft: true`.
- WHEN a visitor opens an address of an unpublished piece, or an old `/writing` address, THE SYSTEM
  SHALL answer 301 to `/practice` in the same locale.
- WHERE an article names maestro, THE SYSTEM SHALL name it and not link it.
- EACH article SHALL read as the owner's own prose per the Voice section of `AGENTS.md`, and SHALL
  pass `npm run voice -- --strict` or state in its PR which file is flagged and the approved copy it
  comes from.

## Definition of done

- `/practice` and each published article render via the content pipeline, and `npm run build`
  produces them in both locales.
- Adding an article requires only a markdown file with the frontmatter above and the approved copy.
