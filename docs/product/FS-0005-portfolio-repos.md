---
title: "FS-0005 — Portfolio / repositories"
status: draft
last_updated: 2026-09-04
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

## Restructure (ADR-0006, 2026-08-20)

The set was cut from eleven repos in three pillars to **seven in two**, for the data-architect /
lead-architect target: the two `sovereign-*` repos (never cleared ADR-0004) and the two contrail
demos (role-specific) came off the surface; the AI and applied-ML pillars merged into **AI & applied
ML**; **Integration, data & modernization** now leads. Every remaining card is public, licensed,
runnable and linked, so the ADR-0004 link gate is discharged — `REPO_LINKS_ENABLED` is `true` and
stays in the code only for a future repo that is not yet fit to link.

### Narrowed again (ADR-0007, 2026-08-20)

Cut from seven repos in two pillars to **five in three**: `retail-dynamic-pricing` and
`marketplace-intel-platform` came off (good work, wrong conversation for a data/integration architect),
and the pillars were renamed after what a client engages an architect to do — **Data architecture &
modelling**, **Modernization & migration**, **Integration & platform services** — each with a one-line
lede in the buyer's words. Two repos in the build plan (`enterprise-data-model-lab`,
`legacy-dwh-migration`) take the set back to seven.

### Added: `ai-first-bi-platform` (2026-09-02)

A ninth card, in **Data architecture & modelling**, taking the set to nine repos in three pillars.
Public, MIT, runnable end to end (`make demo`), so it is listed with a live link on the same terms
as every other card.

It earns a place next to the two blueprint-style decision repos by asking the question that sits
underneath them — *what does the number mean* — and answering it with an implementation rather than
a document: three defensible definitions of "active customer" built in a real dbt project over five
source shapes, returning three different numbers, with the trade between a governed and an
ungoverned answer measured in both directions.

Two framing points that the honesty statement already covers and that this card must not
contradict:

- It is **not** a blueprint-style repo. The existing "the three blueprint-style repositories are
  documents first" sentence in the portfolio honesty note stays at three and stays accurate.
- Its evaluation numbers are **not** a claim about any language model. The ungoverned path is a
  deterministic stand-in; the repo's own ADR-0002 says so and the card does not present it
  otherwise.

It is also referenced from two expertise pages — `data-and-lakehouse` (the definitional point is a
modelling point) and `ai-and-automation` (grounding, refusal, and evaluation as a gate are that
page's whole argument, applied to analytics).

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

- THE portfolio SHALL present the pillars with **Integration, data & modernization** first
  (ADR-0006).
- EVERY repository listed on the portfolio SHALL be public, licensed and honestly framed; WHERE a
  repository is not, IT SHALL NOT be listed rather than listed without a link.
- THE honesty statement SHALL state that the repositories run on synthetic data and SHALL NOT make
  a production-system claim.
- EVERY repo card body ("what it proves") SHALL be 40-70 words in each locale, and THE longest card
  SHALL NOT exceed twice the length of the shortest — the cards render side by side, so an
  over-long one starves its neighbours of attention. Enforced by `lib/site.test.ts`.

### Card copy cut to a budget (2026-09-04)

The nine card bodies had drifted from 46 to 222 words as each new repo was added with its full
findings attached, which made the three-column grid unreadable: the reader met a wall of text on
one tile and skipped the row. All nine were rewritten to 44-72 words in both locales — what the
repo is, the single strongest measured finding, the run command — with the rest of the evidence
left where it belongs, in each repo's own README. The budget is now an acceptance criterion above
and a failing test in `lib/site.test.ts`, so the next card added cannot quietly reopen the gap.

No claim was dropped in the process; the cut removed enumeration, not substance.

## Definition of done

- Three repo cards with the govern→build→deliver framing and honest maturity labels render via
  the content pipeline.
- Links are gated on ADR-0004 — verifiably absent until prerequisites close, and a single
  content/config change enables them once met.
- No card overstates maturity.
