---
title: "0004: Public-surface prerequisites gate publishing the repo links"
status: accepted
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/FS-0005-portfolio-repos.md
  - docs/product/FS-0003-expertise.md
  - docs/product/FS-0004-selected-work-case-studies.md
---

# ADR-0004 — Public-surface prerequisites for the repositories

## Context

The portfolio (FS-0005) and the AI/automation expertise page (FS-0003) reference three sibling
repos that double as the teaching spine of the EA-tier training. The website is a **public surface
tied to the owner's name**, and the repos are not yet ready to be linked publicly:

- The repos are **named inconsistently** across two naming generations (`sovereign-copilot` =
  "fps4 sovereign-AI platform"; `sovereign-llm-gateway` references "Sovereign Agentic Foundry",
  `sovereign-cloud`, etc.) — there is no single coherent cross-repo story yet.
- `sovereign-copilot`'s first example pack is a **Russian Federation / Retail CFO** scenario — an
  optics/sanctions liability on a public asset tied to the owner's name.
- Only `maestro` has a license (MIT); the others have none.
- Only `sovereign-llm-gateway` runs end-to-end; the other two are reference architectures.

## Decision

Three prerequisites **gate publishing live repo links** on the website. Until all three close, the
portfolio/expertise repo references ship as **descriptions and honest maturity labels with links
disabled / "coming soon"**:

1. **One umbrella name + aligned cross-repo story** — pick one umbrella, align all READMEs and
   cross-links.
2. **Neutralize + license the forks** — strip the RF pack, ship a neutral synthetic-data example,
   assign licenses to all three.
3. **Honest runnable-vs-reference framing** on every card — `sovereign-llm-gateway` runs (live
   demo); `sovereign-copilot` + `maestro` are reference architectures. **No "three production
   systems" claim.**

## Consequences

- The site can ship M0 *without* the repo work being done — cards render description-only and a
  single content/config change enables links once prerequisites close (FS-0005 acceptance).
- The prerequisite work itself happens in the respective repos, not this product; this ADR only
  binds *publishing* to their completion.
- Protects the owner from an avoidable optics/credibility liability on a name-bearing surface.

---

## Gate discharged (2026-08-20, ADR-0006)

This ADR's reasoning stands, but its trigger condition is no longer met. The prerequisites were
never satisfied for `sovereign-copilot` and `sovereign-llm-gateway`; ADR-0006 removed both from the
public surface instead. Every repository now listed is public, licensed and honestly framed, so
`REPO_LINKS_ENABLED` is `true`. The flag and this ADR remain in force for any future repository that
is not yet fit to link.
