---
title: "0010: The site has one job, and carries no courses or labs"
status: accepted
last_updated: 2026-11-22
owners: [architect]
supersedes:
  - docs/design/decisions/0003-single-site-training-forward-positioning.md
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
  - docs/design/decisions/0008-work-and-expertise-index-redesign.md
supersedes_in_part:
  - docs/design/decisions/0006-portfolio-restructure-data-architecture.md
  - docs/design/decisions/0007-front-page-three-bands-and-portfolio-focus.md
  - docs/design/decisions/0009-references-as-curated-snapshots.md
related:
  - docs/product/00-product-intent.md
---

# ADR-0010 — The site has one job, and carries no courses or labs

The decision is recorded in maestro, where its full text, its reasoning and its history are kept:
**<https://maestro.fps4.nl/artifacts/art-896t5kxfka>** (ADR-0001 of the product
`web-faridgurbanov`). This file records that it was taken, and what it replaces in this
repository. When the two differ, the maestro decision is the one to follow.

## Decision, in short

1. **One job.** A visitor who can hire or recommend the owner decides to get in touch. Every page
   is kept or cut by whether it helps that. He presents himself as a Platform and Integration
   Architect.
2. **Three readers and two goals.** Hiring manager, peer, and recruiter; G-01 (decide whether to
   call him) and G-04 (place him quickly). See
   [`00-product-intent.md`](../../product/00-product-intent.md).
3. **No courses, no labs, no portfolio section.** The site is Home, Work, Practice and Contact.
   Public repositories are linked from one strip at the foot of Work; a private repository is
   never linked.
4. **The owner is the author.** Every text is taken verbatim from one approved review document of
   the site copy; an editor shortens, orders, corrects and, where the decision asks for it,
   generalizes, and adds no opinion, anecdote or number. No text is built before he approves it.
5. **Plain words and care for the people he works with.** No client is named; figures of his
   current work stand in rounder words; English and Dutch are the only languages named.
6. **One résumé, one set of facts.** The site and his LinkedIn profile say what the résumé says.
7. **The work is a cut, and then it stops.** There is no publishing schedule.

## What it supersedes here

| Record | Effect |
|---|---|
| [ADR-0003](./0003-single-site-training-forward-positioning.md) | Superseded. The training-forward positioning ends. |
| [ADR-0005](./0005-stakeholder-forward-positioning.md) | Superseded. A case study no longer tells "who had to say yes"; it says where the work stands. |
| [ADR-0008](./0008-work-and-expertise-index-redesign.md) | Superseded. The Expertise pages and their index go. |
| [ADR-0006](./0006-portfolio-restructure-data-architecture.md) | The portfolio parts are superseded. |
| [ADR-0007](./0007-front-page-three-bands-and-portfolio-focus.md) | The portfolio parts are superseded. |
| [ADR-0009](./0009-references-as-curated-snapshots.md) | The References page is superseded. The rule that a quote is never changed stays. |

ADR-0001, ADR-0002 and ADR-0004 stand. The site stays static, bilingual and public.

In `docs/product/`, FS-0003, FS-0005, FS-0008, FS-0012 and FS-0013 are superseded by this
decision, and the product intent is rewritten to it. `docs/delivery/roadmap/m1-training-forward.md`
is superseded with them.

## Consequences

- `AGENTS.md` carries the rules that follow from it: where copy comes from, the public
  repository, the voice, and what a pull request says. The voice check stays as a signal and does
  not decide what the text says.
- The pages themselves change in later stories, each when its copy is approved. This record and
  the rule changes alone change no page.
