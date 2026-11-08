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

## Out of scope

- Editing article content; search, tags, comments, RSS; the Series group (follow-up).
