---
title: "Product intent — faridgurbanov.com"
status: draft
last_updated: 2026-11-22
owners: [architect]
related:
  - docs/overview.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/design/decisions/0010-the-site-has-one-job.md
  - docs/delivery/roadmap/README.md
---

# Product intent

The **what & why** for faridgurbanov.com. Functional specs (`FS-NNNN-*.md`) decompose this;
ADRs in [`../design/decisions/`](../design/decisions/) lock the *how*. The strategy itself is
[ADR-0010](../design/decisions/0010-the-site-has-one-job.md), recorded in maestro at
<https://maestro.fps4.nl/artifacts/art-896t5kxfka>; this page restates the parts a builder needs
(decision §1 and §2).

## The one job

A visitor who can hire the owner or recommend him decides to get in touch. Every page is kept or
cut by whether it helps that.

He presents himself as a **Platform and Integration Architect**. The same title heads his résumé
and his LinkedIn profile.

The site sells no training and publishes no courses. It has no labs and no portfolio section.

## Three readers

| Reader | Who | What they come for |
|---|---|---|
| **Hiring manager** | A manager hiring an architect, a small business owner hiring one directly, or a product or business leader who will work with him | What he does, proof that it worked, and how to reach him |
| **Peer** | A fellow architect or a senior engineer, asked for an opinion on him | How he thinks and decides, and whether they would want to work with him |
| **Recruiter** | A niche recruiter placing architects | Résumé, availability and how he contracts |

Training buyers and course learners are not readers the site is built for.

## Two goals

| Goal | Who it serves | Description |
|---|---|---|
| **G-01 · Decide whether to call him** | Hiring manager, peer | In a few minutes I see what he does, what it achieved and where it stands, and I can reach him in one step. |
| **G-04 · Place him quickly** | Recruiter | I find his résumé, his availability and how he contracts without asking. |

G-02 and G-03 are retired. Plain words for a reader who does not build are a rule on every page,
not a goal of their own.

## Shape of the site

Home, Work, Practice and Contact; the header reads Work, Practice, Contact. The site stays
bilingual (EN/NL) and static. The pages are cut to what a reader uses, and each changes in its own
story when its copy is approved.

## Rules that hold for every change

- **Every text is the owner's and is approved by him.** Site copy is taken verbatim from the
  approved review document of the site copy; a builder adds, rewrites or generalizes nothing
  (see `AGENTS.md`, *Where copy comes from*).
- **The repository is public.** Nothing the owner has not cleared for publishing is committed,
  and no private repository is linked.
- **One set of facts.** The site, his LinkedIn profile and his one résumé say the same, in the
  same words. No client is named and no exact internal figure of his current work is written.

## Out of scope

Any server runtime, database, CMS, auth, per-seat checkout, comment system, or tracking of
visitors. The site collects nothing about visitors.

## Measure

One measure: enquiries that name the site or arrive through it, counted by hand by the owner.

## Functional specs

The specs that still describe the site are FS-0001 (shell and content pipeline), FS-0002 (home),
FS-0004 (case studies), FS-0006 (writing), FS-0007 (contact and privacy) and FS-0009
(references); each is brought in line by the story that changes its pages. FS-0003, FS-0005,
FS-0008, FS-0012 and FS-0013 are superseded by ADR-0010.

## Cross-cutting constraints

- **Bilingual EN/NL** with i18n routing (ADR-0002). The Dutch text is made from the approved
  English and approved the same way.
- **Static export**: every feature must work with `output: 'export'` (ADR-0001).
