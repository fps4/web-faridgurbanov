---
title: "FS-0003 — Expertise pages"
status: draft
last_updated: 2026-06-09
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
maestro:
  feature: expertise-pages
  kind: functional_spec
  summary: |
    The "what I do" pages — a small set of expertise areas (integration architecture,
    event-driven/streaming, APIs, data/lakehouse, and AI/automation) each as a markdown page.
    The AI/automation area is promoted to a peer of the others now that the three repos back it.
    These pages give recruiters and clients the depth behind the home-page positioning and feed
    the relevant case studies.
---

# FS-0003 — Expertise pages

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

The home page states the positioning; the expertise pages substantiate it for visitors who want
depth before contacting. Existing content from the previous site is on-message and largely
portable; this spec restructures it around the current five areas and re-authors it bilingually.

## Scope

1. **Five expertise areas**, each a markdown page: integration architecture; event-driven /
   streaming; APIs & gateways; data & lakehouse; **AI & automation** (promoted to a peer area).
2. **AI/automation peer promotion** — the AI area is presented at the same level as
   event-driven, backed by `sovereign-copilot` / `sovereign-llm-gateway` / `maestro` (subject to
   the public-surface prerequisites, ADR-0004).
3. **Cross-links** — each expertise area links to the case studies (FS-0004) that evidence it.
4. **Bilingual** — EN now; NL may lag for these deeper pages (per ADR-0002 fallback).
5. **Expertise index** — a listing/landing for the five areas.

## Out of scope

- Case-study detail (FS-0004) and repo cards (FS-0005); expertise pages *link* to them.
- An exhaustive skills matrix — the résumé carries that; these pages are narrative.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present five expertise areas (integration architecture, event-driven /
  streaming, APIs & gateways, data & lakehouse, AI & automation), each as its own page reachable
  from an expertise index.
- THE AI & automation page SHALL be presented as a peer of the other areas (not a sub-section).
- WHERE an expertise area is evidenced by a case study, THE page SHALL link to that case study.
- THE expertise pages SHALL be authored as markdown via the FS-0001 content pipeline and SHALL
  render in English, with Dutch provided or falling back per ADR-0002.
- WHERE the AI & automation page references the repositories, IT SHALL respect the public-surface
  prerequisites (ADR-0004) — descriptions may ship before live links.

## Definition of done

- Five expertise pages + an index render via the content pipeline in EN (NL provided or
  falling back).
- Each page cross-links at least one case study where one exists.
- The AI & automation page reads as a peer area and is consistent with the honesty rule
  (runnable vs reference).
