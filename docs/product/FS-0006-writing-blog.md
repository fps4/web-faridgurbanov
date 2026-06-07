---
title: "FS-0006 — Writing / blog"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
maestro:
  feature: writing-blog
  kind: functional_spec
  summary: |
    A low-cadence writing section — a handful of evergreen posts, not a publishing treadmill.
    M0 ships one post on the training wedge ("how I get non-technical POs writing specs agents
    can execute") so the first piece does double duty as credibility and training lead content.
    Markdown posts with a simple index; no comments, no schedule the owner won't keep.
---

# FS-0006 — Writing / blog

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

A couple of evergreen posts signal thought leadership and support a light content cadence and the
training offer — without committing to a schedule that won't be kept. The first post is deliberately a training-wedge topic so one piece of work serves two legs.

## Scope

1. **A writing index** listing posts newest-first with title, date, and summary from frontmatter.
2. **Markdown posts** rendered via the FS-0001 pipeline.
3. **M0 deliverable:** one evergreen post on the training wedge (e.g. "How I get non-technical
   POs writing specs agents can execute").
4. **No treadmill** — no enforced cadence, no comments, no newsletter machinery.
5. **Bilingual** — EN now; NL optional/lagging (ADR-0002).

## Out of scope

- Comments, reactions, RSS-driven subscriptions, tag taxonomies beyond a simple list.
- A content calendar or scheduling system.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a writing index listing posts newest-first with title, date, and
  summary derived from frontmatter.
- EACH post SHALL render from markdown via the FS-0001 content pipeline with prose typography.
- THE M0 build SHALL include at least one published post on the training wedge.
- THE writing section SHALL NOT include a comment system or require a publishing schedule.
- POSTS SHALL render in English, with Dutch provided or falling back per ADR-0002.

## Definition of done

- A writing index plus at least one published evergreen post render via the content pipeline.
- Adding a new post requires only a markdown file with frontmatter (no code change).
