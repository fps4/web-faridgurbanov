---
title: "FS-0004 — Work / case studies"
status: draft
last_updated: 2026-11-22
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0009-references.md
  - docs/design/decisions/0010-the-site-has-one-job.md
maestro:
  feature: selected-work-case-studies
  kind: functional_spec
  summary: |
    Work is two case studies of platform products the owner built, each a two-minute read on one
    page shape: where it started, what he did, what is in it, and where it stands today, with a facts
    column and a bar at the foot. Every text on a case study is the owner's approved copy, taken as
    it stands. The Cloud gateway is the first on this shape; the Integration adapter follows it.
---

# FS-0004 — Work / case studies

- **Status:** draft
- **Decision:** [ADR-0010](../design/decisions/0010-the-site-has-one-job.md) §5, §7, §12, §13
- **Story:** `art-13yb9kshaw` (the Cloud gateway on the new page shape)

## Why

A hiring manager opens the case study closest to their situation and decides in two minutes
whether to call. The case study says what was built, by whom, and where it stands today, including
what is not finished. It does not tell a story about who had to say yes, and it carries no figure
the owner has not confirmed.

## The page shape

A case study is one markdown file under `content/<locale>/work/`. It is on this shape when its
frontmatter has an `intro`; `app/[locale]/work/[slug]/page.tsx` then draws it with
`components/case-study.tsx`, and `lib/case-study.ts` reads the frontmatter.

| Part | Where the text is |
|---|---|
| Title | `title` |
| Intro line | `intro` |
| Small line | `small` |
| Back link | the same on every case study: *← All work*, leading to the Work index |
| Row of facts | `facts`, an inline list of pairs, each written as the large text, a space, a vertical bar, a space and the small text, and drawn as a large text over a small one |
| Article parts, in order | the markdown body: *Where it started*, *What I did*, *What is in it*, *Where it stands* |
| Facts column | `role` (My role), `client` (Client), `built_with` (Built with) |
| Bar at the foot | the question and *Start a conversation*, which leads to Contact; the same on every case study |
| Next link | `next` (a slug) and `next_label`, set only once the next case study is on this shape |
| Reference | a published reference about this work (FS-0009), under the facts column |

The template holds no copy of its own. An element whose text the entry does not carry is not
drawn: there is no empty place for a reference, no Next link, and no diagram that says more than
the copy says.

## Where the text comes from

Every text on a case study is taken verbatim from the approved review document of the site copy
(AGENTS.md, *Where copy comes from*). A builder adds, rewrites, shortens or generalizes nothing.
No client is named; the client is described by its kind. Figures of the owner's current work stand
in the rounder words of the approved copy, and the case study says the same as the résumé.

## Case studies still on the earlier shape

The Integration platform, the Cloudera Kafka platform, the SAP to Snowflake migration and the SAP
event backbone have no `intro` and keep the earlier template, until the Work stories rewrite or
remove them. The earlier shape (ADR-0005, ADR-0008) is superseded by ADR-0010 and is not extended.

## Acceptance criteria (EARS)

- WHEN a visitor opens a case study on the page shape, THE SYSTEM SHALL show its title, intro line
  and small line, its row of facts, its article parts in the order of the markdown body, its facts
  column and the bar at the foot.
- THE SYSTEM SHALL show on a case study only text that is in the entry's frontmatter or body, and
  the labels and bar texts of `lib/case-study.ts`, which are approved copy.
- WHERE an element's text is not in the entry, THE SYSTEM SHALL NOT draw the element.
- THE bar at the foot SHALL show the question and the *Start a conversation* link to Contact, and
  SHALL show the Next link only WHERE the entry sets both `next` and `next_label`.
- WHERE a published reference names the case study, THE SYSTEM SHALL show it under the facts
  column, and WHERE there is none, SHALL hold no place for one.
- THE case studies still on the earlier shape SHALL keep building and rendering.
- THE case studies SHALL render in English, and the Dutch page SHALL show the English text under
  the notice of FS-0001 until the Dutch copy is approved.

## Definition of done

- The Cloud gateway case study is on the page shape, from the approved copy.
- The exported page's text matches the approved copy, element by element.
- The earlier case studies still build.
