---
title: "US-0019: Writing becomes Practice, with working guidelines"
persona: visitor
status: draft
complexity: M
milestone: M1
last_updated: 2026-11-08
spec: docs/product/FS-0013-practice-and-guidelines.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As a hiring manager, client architect or peer visiting the site,
I want to see how Farid works, his standing guidelines on architecture documentation, decisions
and delivery, next to his articles,
so that I can judge his way of working before talking to him, not only his results.

As Farid,
I want a durable, structured home for my working guidelines that I can extend one at a time,
without losing my existing articles.

## Context

Implements FS-0013. The Writing section (FS-0006, US-0014) is renamed Practice / Werkwijze and moves
to `/practice`; its articles move to `/practice/articles/<slug>` unchanged, and nginx answers the
old URLs with a 301. A new Guideline content type sits beside them, and Guideline 01 (architecture
documentation) ships in EN with a Dutch draft for review. A sitemap with hreflang pairs is added,
since the site had none. The video series stay in the Learning section (FS-0012); a Series group on
the landing page is a follow-up.

## Acceptance criteria (EARS)

- THE header and footer SHALL show **Practice** (EN) / **Werkwijze** (NL) and no "Writing" or
  "Blog" label for the section.
- WHEN a visitor opens `/<locale>/practice`, THE SYSTEM SHALL show Guidelines then Articles, and
  SHALL hide an empty group.
- THE SYSTEM SHALL serve every article previously at `/<locale>/writing/<slug>` at
  `/<locale>/practice/articles/<slug>` with unchanged content.
- WHEN a request arrives for any old `/<locale>/writing` URL, nginx SHALL answer 301 to its new path.
- WHEN a visitor opens `/<locale>/practice/guidelines/architecture-documentation`, THE SYSTEM SHALL
  render the template's sections, the `G-01` badge, the last-revised date and the summary as the
  meta description.
- THE build SHALL emit `/sitemap.xml` with the new URLs, none of the old, and hreflang pairs.
- THE Dutch guideline SHALL carry the review marker until Farid has read it.

### Revision (2026-11-08): one filterable list, patterns and tags

- WHEN a visitor opens `/<locale>/practice`, THE SYSTEM SHALL list guidelines, patterns and articles
  in one row shape, with chips for kind, topic and technology that filter it and are reflected in
  the query string.
- THE build SHALL publish patterns at `/<locale>/practice/patterns/<slug>` with the same page
  furniture as a guideline, and SHALL fail on an unknown tag.
- WHEN an entry names an article in `related`, THE article page SHALL link back to it.
- THE first extraction SHALL publish G-02, G-03 and P-01 to P-05, with Dutch drafts marked for review.

### Revision (2026-11-08): a diagram on every page

- WHEN a visitor opens a guideline, pattern or article, THE SYSTEM SHALL show at least one diagram
  of its central mechanism, labelled in the page's language, with alt text starting `Diagram:`.
- IF a page has no diagram, a missing diagram file, or a Dutch page uses the English-labelled
  file, THEN the test suite SHALL fail.

## Out of scope

- Editing article prose (articles gain tags in frontmatter and a diagram only); search, comments, RSS; the Series group (follow-up).
