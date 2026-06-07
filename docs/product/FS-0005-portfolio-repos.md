---
title: "FS-0005 — Portfolio / repositories"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/design/decisions/0004-public-surface-prerequisites.md
maestro:
  feature: portfolio-repos
  kind: functional_spec
  summary: |
    The "I build AI, not just advise" proof: the three sibling repos told as one
    govern→build→deliver story — sovereign-llm-gateway (runs), sovereign-copilot (reference),
    maestro (reference). Each is a card with what it proves and an honest maturity label. Because
    this is a public surface tied to the owner's name, live links are gated on three
    prerequisites (one umbrella name, neutralized+licensed forks, honest framing) — until those
    close, cards ship with descriptions but not links.
---

# FS-0005 — Portfolio / repositories

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)
- **Decision:** [ADR-0004](../design/decisions/0004-public-surface-prerequisites.md)

## Why

The portfolio is the differentiator versus advisors who only talk: real systems the owner built.
It doubles as the teaching spine of the EA-tier training. But it is a *public* surface tied to
the owner's name, so it must be both honest about maturity and free of optics/sanctions
liabilities before links go live.

## Scope

1. **The govern→build→deliver narrative** framing the three repos as one coherent stack.
2. **Three repo cards**:
   - `sovereign-llm-gateway` — govern & route the models — **Working** (the live demo).
   - `sovereign-copilot` — build a trustworthy agentic product — **Reference architecture**.
   - `maestro` (MIT) — deliver software with agents — **Reference architecture**.
3. **Honest maturity labels** — each card states runnable-vs-reference plainly.
4. **Prerequisite gating (ADR-0004)** — live repo links are published **only after** all three
   prerequisites close; until then cards render with descriptions and maturity, links disabled or
   marked "coming soon".
5. **Bilingual** — EN now; NL may lag (ADR-0002).

## Out of scope

- The case-study detail (FS-0004); the portfolio *supports* it.
- Closing the prerequisites themselves — that work happens in the respective repos (this spec
  only gates *publishing* on their completion).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present the three repositories as one govern→build→deliver narrative, each as a
  card stating what it proves.
- EACH repo card SHALL display an honest maturity label distinguishing a runnable system from a
  reference architecture.
- THE portfolio SHALL NOT claim that all three repositories are production systems.
- WHILE any public-surface prerequisite (ADR-0004) is unmet, THE SYSTEM SHALL render repo cards
  without live external links (descriptions only / "coming soon").
- WHEN all three public-surface prerequisites are met, THE SYSTEM SHALL enable the live
  repository links.
- THE portfolio SHALL render via the FS-0001 content pipeline in English, with Dutch provided or
  falling back per ADR-0002.

## Definition of done

- Three repo cards with the govern→build→deliver framing and honest maturity labels render via
  the content pipeline.
- Links are gated on ADR-0004 — verifiably absent until prerequisites close, and a single
  content/config change enables them once met.
- No card overstates maturity.
