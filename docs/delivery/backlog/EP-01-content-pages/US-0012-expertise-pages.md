---
title: "US-0012: Expertise pages + index (AI promoted to peer)"
persona: visitor
status: draft
complexity: L
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0003-expertise.md
design: docs/design/decisions/0004-public-surface-prerequisites.md
---

## Story

As a recruiter or client who has read the home positioning,
I want a small set of pages that explain each area the owner works in, with the AI work shown as a
peer discipline,
so that I can judge depth before deciding to reach out.

## Context

Implements FS-0003 — the "what I do" depth behind the home-page positioning (US-0010). Five
markdown areas (integration architecture; event-driven / streaming; APIs & gateways; data &
lakehouse; AI & automation) plus an index, authored via the FS-0001 content pipeline (US-0003).
The AI & automation area is promoted to a peer (ADR-0003) and references the three repos, so its
links respect the public-surface prerequisites (ADR-0004). Portable source exists from the previous site. Depends on EP-00.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present five expertise areas (integration architecture, event-driven /
  streaming, APIs & gateways, data & lakehouse, AI & automation), each as its own page reachable
  from an expertise index.
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

NL may lag for these deeper pages (ADR-0002 fallback). Restructure the portable content around the
current five areas rather than porting verbatim.
