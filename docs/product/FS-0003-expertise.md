---
title: "FS-0003 — Expertise pages"
status: draft
last_updated: 2026-08-18
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
maestro:
  feature: expertise-pages
  kind: functional_spec
  summary: |
    The "what I do" pages, in two groups. The domain areas (integration architecture,
    event-driven/streaming, APIs, data/lakehouse, applied ML, and AI/automation) each as a
    markdown page, with AI/automation a peer of the others now that the repos back it. Alongside
    them a practice group — stakeholder alignment and architecture decisions — covering the part
    of an architect's job a technology page cannot carry. These pages give recruiters and clients
    the depth behind the home-page positioning and feed the relevant case studies.
---

# FS-0003 — Expertise pages

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

The home page states the positioning; the expertise pages substantiate it for visitors who want
depth before contacting. Existing content from the previous site is on-message and largely
portable; this spec restructures it around the current areas and re-authors it bilingually.

A technology taxonomy alone under-sells an architect. Hiring managers and clients buy judgment and
the ability to carry an organisation, and the evidence for both already exists in the case studies
— stated once, in passing, with no page naming it. The practice group gives that evidence a home
and makes it navigable; the case studies (FS-0004) carry the per-engagement detail.

## Scope

1. **Domain areas**, each a markdown page: integration architecture; event-driven / streaming;
   APIs & gateways; data & lakehouse; applied ML & data science; **AI & automation** (promoted to
   a peer area).
2. **Practice areas**, each a markdown page: **stakeholder alignment** (influence without
   authority, adoption, and the operating model for a part-time architect seat) and
   **architecture decisions** (target state with a road to it, decision records that name the
   cost, C4 at the right altitude, build/buy/exit).
3. **AI/automation peer promotion** — the AI area is presented at the same level as
   event-driven, backed by `sovereign-copilot` / `sovereign-llm-gateway` / `maestro` (subject to
   the public-surface prerequisites, ADR-0004).
4. **Cross-links** — each expertise area links to the case studies (FS-0004) that evidence it.
   Practice areas cite the same case studies from the stakeholder/decision angle rather than the
   technology one.
5. **Bilingual** — the practice areas are recruiter-facing and ship EN + NL together; deeper
   domain pages may lag per the ADR-0002 fallback.
6. **Expertise index** — a listing/landing presenting the two groups, each with its own heading
   and lede. Group membership is frontmatter (`group: domain | practice`), so adding an area stays
   a content change; an entry with no `group` renders as a domain area.

## Out of scope

- Case-study detail (FS-0004) and repo cards (FS-0005); expertise pages *link* to them.
- An exhaustive skills matrix — the résumé carries that; these pages are narrative.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present the domain areas (integration architecture, event-driven / streaming,
  APIs & gateways, data & lakehouse, applied ML & data science, AI & automation), each as its own
  page reachable from an expertise index.
- THE SYSTEM SHALL present the practice areas (stakeholder alignment, architecture decisions),
  each as its own page reachable from the same index.
- THE expertise index SHALL present the domain and practice areas as two labelled groups.
- WHERE an expertise page declares no `group`, THE index SHALL render it in the domain group.
- WHILE the practice group has no entries, THE index SHALL omit the practice group entirely
  rather than render an empty heading.
- THE AI & automation page SHALL be presented as a peer of the other areas (not a sub-section).
- WHERE an expertise area is evidenced by a case study, THE page SHALL link to that case study.
- THE expertise pages SHALL be authored as markdown via the FS-0001 content pipeline and SHALL
  render in English, with Dutch provided or falling back per ADR-0002.
- WHERE the AI & automation page references the repositories, IT SHALL respect the public-surface
  prerequisites (ADR-0004) — descriptions may ship before live links.

## Definition of done

- The domain and practice pages plus a grouped index render via the content pipeline in EN (NL
  provided or falling back), with both practice pages authored in EN and NL.
- Each page cross-links at least one case study where one exists.
- Each practice page's claims are evidenced by a named engagement — no capability asserted
  without a case study, repo or credential behind it.
- The AI & automation page reads as a peer area and is consistent with the honesty rule
  (runnable vs reference).
