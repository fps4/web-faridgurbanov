---
title: "0006: Portfolio restructured for the data-architect / lead-architect target"
status: accepted
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/design/decisions/0004-public-surface-prerequisites.md
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
  - docs/product/FS-0005-portfolio-repos.md
  - docs/notes/portfolio-repos-build-plan.md
---

# ADR-0006 — Portfolio restructured for the data-architect / lead-architect target

## Context

Two things changed the brief for the portfolio.

First, the ASICS debrief (ADR-0005) confirmed the technical case lands and the organisational case
does not. A portfolio of eleven repositories across three pillars is not read as depth; past a
certain count it is read as breadth without focus, which is the opposite of what a lead-architect
conversation needs.

Second, the owner's next target is explicitly **data architect, tech lead and architect** roles,
which carry a higher day rate than engineer-scoped work. Two areas of the portfolio were pulling
against that: the EUROCONTROL contrail demos were built for one specific role and read as aviation
ML to everyone else, and the two `sovereign-*` repos had never cleared the ADR-0004 public-surface
prerequisites — so they sat on the page with descriptions but no links, and one of them carried a
"reference architecture" label that made the whole set look less finished than it is.

The AI-versus-applied-ML split was also a distinction the audience does not make. Both pillars were
answering the same buyer question.

## Decision

1. **Remove `sovereign-llm-gateway` and `sovereign-copilot`** from the public surface. The ADR-0004
   prerequisites were never met and are no longer worth meeting for these two. The repos continue
   to exist; they are not part of the pitch.
2. **Remove the two contrail demos and their case study.** Role-specific material for a EUROCONTROL
   application, off-target for the current positioning. Same treatment: still on GitHub, off the
   pitch.
3. **Remove the AI-trio case study.** Its subject was the two repos removed in (1) plus `maestro`,
   none of which are on the portfolio; keeping it would have left a case study pointing at nothing.
4. **Merge the AI and applied-ML pillars into one, "AI & applied ML"**, and **lead with
   "Integration, data & modernization"** — that is the area a data or integration architect is hired
   for, and it should be the first thing on the page.
5. **Discharge the ADR-0004 link gate.** Every remaining repo is public, licensed and honestly
   framed, so `REPO_LINKS_ENABLED` flips to `true`. The flag stays in the code so a future
   not-yet-linkable repo can turn it off again without a structural change; ADR-0004's reasoning is
   preserved for that case.
6. **Every remaining card is `working`.** The `reference` maturity stays in the type for future use,
   and the honesty copy changes from a runnable-versus-reference count to the two claims that are
   actually true of the set: they run, and they run on synthetic data.
7. **Two new repositories are specified, not built** (`docs/notes/portfolio-repos-build-plan.md`):
   `enterprise-data-model-lab` (conceptual → logical → dimensional and Data Vault, SCD2, glossary,
   lineage) and `legacy-dwh-migration` (assessment → scored wave plan → parity harness → cutover →
   decommission ledger → business case). They close the two gaps the remaining set has for this
   target: **modelling craft**, and **the shape of a transformation programme on the data side**.

## Consequences

- The portfolio drops from eleven repos in three pillars to **seven in two**, all runnable and all
  linked. Fewer, stronger, and every card can be opened.
- The selected-work set drops from six case studies to five, all of which are client work or a
  substantial demo — and four of the five now carry a "Who had to say yes" section (ADR-0005).
- Expertise pages that pointed at the removed work were rewired to the remaining repos. The AI page
  now leads with the capability contract and the CI eval gate rather than a govern→build→deliver
  narrative that no longer has repos behind it.
- **Deep-learning computer vision loses its evidence.** The U-Net segmentation work was real, but
  with the contrail demos off the surface nothing on the site backs it, so the claim was removed
  from the applied-ML page rather than left standing unevidenced. If CV matters for a future role,
  the demo is still on GitHub and can be re-listed.
- Until R1 and R2 exist, a data-architect conversation about modelling or about migration approach
  has to be carried by the case studies and by talk. That is the known cost of this decision.
