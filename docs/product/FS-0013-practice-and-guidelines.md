---
title: "FS-0013 — Practice: guidelines, patterns and articles"
status: draft
last_updated: 2026-11-08
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0006-writing-blog.md
  - docs/delivery/backlog/EP-01-content-pages/US-0019-practice-and-guidelines.md
  - docs/guides/guidelines.md
maestro:
  feature: practice-and-guidelines
  kind: functional_spec
  summary: |
    The Writing section becomes Practice (NL: Werkwijze) at /practice. It holds the owner's
    standing working guidelines (architecture documentation first), each a numbered page with a
    fixed template, next to the existing articles, which move to /practice/articles/<slug>
    unchanged. Reusable solutions pulled out of the articles are patterns (P-NN). The section is
    one list of all three kinds, filtered by kind, topic and technology. The home page claims the decisions are written down where people could argue with
    them; the selected work and portfolio show the results, and this section shows the method.
---

# FS-0013 — Practice: guidelines, patterns and articles

- **Status:** draft
- **Raised:** 2026-11-08
- **Owner:** @farid (architect)

## Why

A hiring manager, a client architect or a peer can see what the owner built (selected work,
portfolio) but not how the owner works. That way of working is what they are buying, and it is easier to
judge from written rules with their costs and exceptions than from a conversation. The owner also
needs one durable place to add those rules one at a time, without losing the articles.

## Scope

1. **Rename** the Writing section to **Practice** (EN) / **Werkwijze** (NL) in the nav, the footer
   and the page metadata. The URL is `/practice` in both locales: every NL route already uses an
   English segment (`/nl/work`), and the language switcher swaps only the locale.
2. **Guidelines**: a new content type under `content/<locale>/practice/guidelines/`, one markdown
   file per guideline with `id` (`G-01`, never reused), `order`, `title`, `summary` (≤ 140
   characters), `status` (`current | revised | retired`), `revised` (date of the last substantive
   change), optional `supersedes` (a guideline id) and `related` (guideline ids or
   `work/`, `expertise/`, `practice/articles/<slug>`). Ordered by `order`: a reference set, not a feed.
3. **Template**: every guideline body has the sections *The rule*, *Why*, *How I apply it*,
   *Trade-offs*, *When I'd bend it*, and optionally *Starter templates*.
4. **Articles** move from `/writing/<slug>` to `/practice/articles/<slug>` with their content
   unchanged (FS-0006 still governs them).
5. **Landing page** `/practice`: one list of every guideline, pattern and article in the same row
   shape (kind, id or date, title, summary, tags), with filter chips on top for kind, topic and
   technology. One value per facet, facets combine, and the filter lives in the query string
   (`?kind=pattern&topic=ai`) so a filtered view can be linked. Order: guidelines, then patterns,
   by `order`; then articles, newest first. *(Revised 2026-11-08: replaced the grouped layout.)*
6. **Redirects**: every old `/writing` URL answers 301 to its new path (nginx, `infra/docker/nginx.conf`).
7. **Sitemap**: `/sitemap.xml` lists every published page in both locales with hreflang pairs.
8. **Guideline 01**, *Architecture documentation* (now *Documentation in three layers*), in EN, with a Dutch version
   that the owner reviews before it ships.
9. **Patterns**: a second numbered kind under `content/<locale>/practice/patterns/` (`P-NN`), same
   frontmatter as a guideline, body *Problem*, *Forces*, *Solution*, *Consequences*, *When not to
   use it*. A pattern is extracted from an article and links back to it through `related`; the
   article itself is not edited, and its page lists what was drawn from it.
10. **Tags**: every item carries `topics` (one or more) and `tech` (zero or more) from fixed
   vocabularies in `lib/practice-model.ts`; an unknown value fails the tests and the build.
   Detail pages show the tags as links to the filtered list.
11. **First extraction**: G-02 *Adoption by design*, G-03 *Constraints before cost*, P-01 to P-05;
   G-01 retitled *Documentation in three layers* (URL unchanged).

## Out of scope

- The video series (the Learning section, FS-0012, not yet on main). They stay their own section; a Series group on the Practice
  landing page that links to them is a follow-up once Learning is published.
- Rewriting existing articles (they gain tags in frontmatter only); search, comments, RSS.
- `<link rel="alternate">` tags in each page's head (the sitemap carries the pairs).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL label the section **Practice** in English and **Werkwijze** in Dutch in the
  header and footer, and SHALL show no "Writing" or "Blog" label for it.
- WHEN a visitor opens `/<locale>/practice`, THE SYSTEM SHALL list every guideline, pattern and
  article in one row shape showing kind, id or date, title, summary and tags, guidelines and
  patterns by `order` and articles newest first.
- WHEN a visitor selects a kind, topic or technology chip, THE SYSTEM SHALL show only the items
  matching every selected facet, announce the count, and reflect the selection in the query string;
  WHEN the page loads with such a query string, THE SYSTEM SHALL apply it.
- THE SYSTEM SHALL offer only the chips that at least one item uses.
- WHILE JavaScript is unavailable, THE `/practice` page SHALL list every item.
- IF an item carries a topic or technology outside the vocabulary, or no topic, THEN the test suite
  and the build SHALL fail.
- WHEN a visitor opens an article from which a guideline or pattern was drawn, THE SYSTEM SHALL
  link to that entry.
- WHEN a visitor opens a guideline or pattern, THE SYSTEM SHALL show its title, summary, id badge and last
  revised date, its status WHERE it is not `current`, its body, a related block WHERE `related` is
  non-empty, and links to the previous and next guideline by `order` WHERE they exist.
- THE guideline page's meta description SHALL be its `summary`.
- IF a guideline has a missing or malformed field, a reused id or order, or a `related` /
  `supersedes` entry that does not resolve, THEN the test suite and the build SHALL fail.
- THE SYSTEM SHALL serve every previously published article at `/<locale>/practice/articles/<slug>`
  with unchanged content.
- WHEN a request arrives for `/<locale>/writing` or `/<locale>/writing/<slug>`, THE web server SHALL
  answer 301 with a path-only `Location` of `/<locale>/practice` or
  `/<locale>/practice/articles/<slug>` respectively.
- THE build SHALL emit `/sitemap.xml` listing each published page once per locale, each with
  `hreflang` alternates for `en`, `nl` and `x-default`, and with no `/writing` URL.
- WHEN a visitor switches language on a guideline, THE SYSTEM SHALL open the same guideline in the
  other locale.
- WHERE a Dutch guideline is a machine draft, IT SHALL carry a `NEEDS HUMAN REVIEW` comment (never
  rendered) and SHALL NOT merge until the owner has reviewed it.
- EACH guideline SHALL read as the owner's own prose per the Voice section of `AGENTS.md`.

## Definition of done

- `/practice`, one guideline in EN and NL, and every article at its new path render in the export.
- Old `/writing` URLs 301 in production (spot-check three after deploy).
- Adding a guideline needs only a markdown file per locale ([guide](../guides/guidelines.md)).
