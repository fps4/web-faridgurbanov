---
title: "US-0013: Portfolio — three repo cards (links gated, ADR-0004)"
persona: visitor
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0005-portfolio-repos.md
design: docs/design/decisions/0004-public-surface-prerequisites.md
---

## Story

As a recruiter, client, or L&D buyer evaluating whether the owner builds or only advises,
I want the three repositories presented as one govern→build→deliver story with honest maturity
labels,
so that I can see real systems behind the positioning without being misled about their readiness.

## Context

Implements FS-0005 — the "I build AI, not just advise" proof and the teaching spine of the EA-tier
training. Three cards: `sovereign-llm-gateway` (govern & route — **Working**), `sovereign-copilot`
(build — **Reference architecture**), `maestro` (deliver, MIT — **Reference architecture**).
Because this is a name-bearing public surface, live links are gated on the three ADR-0004
prerequisites; until they close, cards render description-only / "coming soon" and enabling links
is a single content/config change. Depends on EP-00; pairs with US-0011 and US-0012.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present the three repositories as one govern→build→deliver narrative, each as a
  card stating what it proves.
- EACH repo card SHALL display an honest maturity label distinguishing a runnable system from a
  reference architecture.
- THE portfolio SHALL NOT claim that all three repositories are production systems.
- WHILE any public-surface prerequisite (ADR-0004) is unmet, THE SYSTEM SHALL render repo cards
  without live external links (descriptions only / "coming soon").
- WHEN all three public-surface prerequisites are met, THE SYSTEM SHALL enable the live repository
  links via a single content/config change with no structural rebuild.
- THE portfolio SHALL render via the FS-0001 content pipeline in English, with Dutch provided or
  falling back per ADR-0002.

## Out of scope

- Case-study detail (US-0011) — the portfolio supports it.
- Closing the ADR-0004 prerequisites themselves — that work happens in the respective repos; this
  story only gates publishing.

## Notes

Keep the link-gating a single flag/config so closing the prerequisites needs no code change. NL
may lag (ADR-0002).
