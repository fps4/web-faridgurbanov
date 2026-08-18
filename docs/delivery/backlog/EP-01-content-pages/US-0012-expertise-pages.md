---
title: "US-0012: Expertise pages + grouped index (domain + practice areas)"
persona: visitor
status: draft
complexity: L
milestone: M0
last_updated: 2026-08-18
spec: docs/product/FS-0003-expertise.md
design: docs/design/decisions/0004-public-surface-prerequisites.md
---

## Story

As a recruiter or client who has read the home positioning,
I want a small set of pages that explain each area the owner works in — both the technology and
the way he decides and carries stakeholders — with the AI work shown as a peer discipline,
so that I can judge depth before deciding to reach out.

## Context

Implements FS-0003 — the "what I do" depth behind the home-page positioning (US-0010). Two groups
of markdown areas plus a grouped index, authored via the FS-0001 content pipeline (US-0003):
domain areas (integration architecture; event-driven / streaming; APIs & gateways; data &
lakehouse; applied ML & data science; AI & automation) and practice areas (stakeholder alignment;
architecture decisions). The AI & automation area is promoted to a peer (ADR-0003) and references
the three repos, so its links respect the public-surface prerequisites (ADR-0004). Group
membership is frontmatter, so the index needs no code change to gain an area. Portable source
exists from the previous site. Depends on EP-00.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present the domain areas (integration architecture, event-driven / streaming,
  APIs & gateways, data & lakehouse, applied ML & data science, AI & automation) and the practice
  areas (stakeholder alignment, architecture decisions), each as its own page reachable from an
  expertise index.
- THE expertise index SHALL present the two groups under their own headings, and SHALL render an
  entry that declares no `group` in the domain group.
- WHILE the practice group has no entries, THE index SHALL omit that group rather than render an
  empty heading.
- THE AI & automation page SHALL be presented as a peer of the other areas, not as a sub-section.
- WHERE an expertise area is evidenced by a case study (US-0011), THE page SHALL link to that case
  study.
- WHERE the AI & automation page references the repositories, IT SHALL respect the public-surface
  prerequisites (ADR-0004) — descriptions may ship before live links, and no card overstates
  maturity.
- THE expertise pages and index SHALL render via the FS-0001 content pipeline in English, with
  Dutch provided or falling back per ADR-0002.

## Out of scope

- Case-study detail (US-0011) and repo card detail (US-0013); expertise pages only link to them.
- An exhaustive skills matrix — the résumé carries that; these pages stay narrative.

## Notes

NL may lag for the deeper domain pages (ADR-0002 fallback); the practice pages are
recruiter-facing and ship EN + NL together. Restructure the portable content around the current
areas rather than porting verbatim. Practice-page claims are evidenced from the existing case
studies — the stakeholder material was already written into FS-0004 pages ("Who had to say yes"),
this story surfaces it rather than inventing it.
