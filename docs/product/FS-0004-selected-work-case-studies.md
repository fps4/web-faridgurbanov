---
title: "FS-0004 — Work / case studies"
status: draft
last_updated: 2026-11-23
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
    it stands. The Cloud gateway and the Integration adapter are on this shape.
---

# FS-0004 — Work / case studies

- **Status:** draft
- **Decision:** [ADR-0010](../design/decisions/0010-the-site-has-one-job.md) §5, §7, §12, §13
- **Stories:** `art-13yb9kshaw` (the Cloud gateway on the new page shape), `art-dgsmfy8yb8` (the
  Integration adapter on it), `art-vvzsw9ap9e` (the Work page, Earlier work, Also built, and the
  three earlier case studies removed)

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
| Article parts, in order | the markdown body: *Where it started*, *What I did*, *What is in it* (Cloud gateway) or *What it gave* (Integration adapter), *Where it stands* |
| Facts column | `role` (My role), `client` (Client), `built_with` (Built with) |
| Bar at the foot | the question and *Start a conversation*, which leads to Contact; the same on every case study |
| Next link | `next` (a slug) and `next_label`; the two case studies lead to each other (*Next: Integration adapter*, *Next: Cloud gateway*) |
| Reference | a published reference about this work (FS-0009), under the facts column |

The template holds no copy of its own. An element whose text the entry does not carry is not
drawn: there is no empty place for a reference, no Next link, and no diagram that says more than
the copy says.

## Where the text comes from

Every text on a case study is taken verbatim from the approved review document of the site copy
(AGENTS.md, *Where copy comes from*). A builder adds, rewrites, shortens or generalizes nothing.
No client is named; the client is described by its kind. Figures of the owner's current work stand
in the rounder words of the approved copy, and the case study says the same as the résumé.

## The Work page

`app/[locale]/work/page.tsx` draws, in the order of the approved design, the page introduction, the
two case studies as rows, Earlier work and Also built. Every text is verbatim from the approved
review document of the site copy; where a text is not there, the element is not drawn.

| Part | Where the text is |
|---|---|
| Heading and introduction | `indexes.workTitle`, `indexes.workIntro` in `lib/dictionaries.ts` |
| A case study's row | its title, and `large` (the large text at the left), `listed` (the line) and `stands` (Where it stands) in its frontmatter; the label *Where it stands:* is `indexes.whereItStands`; the row leads to its case study |
| Earlier work | `indexes.earlierHeading`, `indexes.earlierLine`, and `earlierWork` in `lib/site.ts`: four entries of one or two lines, no case page behind them |
| Also built | `indexes.alsoHeading`, `indexes.alsoLine`, and `alsoBuilt` in `lib/site.ts`: a repository name linked to its public GitHub repository, and its one line |

The design's dashed placeholder row in Also built is not drawn.

**Anchors.** The Earlier work list is `/work#earlier-work` (`EARLIER_WORK_ANCHOR`), and each entry has
a stable id of its own: `earlier-sap-events`, `earlier-databricks-review`,
`earlier-security-data-lake` (the UK telecom operator) and `earlier-sap-finance-snowflake`. Another
page links to an entry as `/work#<id>`; a reference names it in `work:`, and a Practice article in
`from:` as `Label | /en/work#<id>` (FS-0006). An id is not renamed without redirecting what links to it.

**Also built** lists a repository only when the owner has chosen it, it is public under
`github.com/fps4/`, and ADR-0004's prerequisites hold for it. `lib/work.test.ts` checks the list
against the repositories the copy names.

## The removed case studies

The Cloudera Kafka platform, the SAP to Snowflake migration and the SAP event backbone are removed,
with their diagrams: they carried claims the owner withdrew in the interview. Their addresses
(`/<locale>/work/cloudera-kafka`, `/sap-snowflake`, `/sap-event-backbone`, bare, with a trailing
slash and with `.html`) answer 301 from `infra/docker/nginx.conf` to `/<locale>/work#earlier-work`,
the Location header carrying the fragment (a request never carries one, so nginx cannot test it), and
`lib/redirects.test.ts` checks it. A reference that named one of them names its Earlier work entry.

## The Integration adapter's address

The Integration platform case study is the Integration adapter, and its address follows its name:
`/work/integration-adapter`. `infra/docker/nginx.conf` answers 301 from `/<locale>/work/integration-platform`
(bare, with a trailing slash and with `.html`) to the new address in the same locale, and
`lib/redirects.test.ts` checks it. The adapter has no diagram: the earlier one carried a claim the
approved copy does not make. The link at its end to the article *Simple first* waits for that article.

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
- WHEN a visitor opens `/work`, THE SYSTEM SHALL show the introduction, the two case studies, Earlier
  work with its four entries and Also built, each text verbatim from the approved copy.
- THE Also built strip SHALL list only repositories the approved copy lists, each linked to its
  public repository under `github.com/fps4/`.
- WHEN a visitor opens one of the three removed case-study addresses in either locale, THE SYSTEM
  SHALL answer 301 to the Earlier work list on `/work` in the same locale.
- THE case studies SHALL render in English and in Dutch, from `content/en/work/` and `content/nl/work/`,
  with the same facts, figures and links in the same order (FS-0001; maestro story `art-j9e7z77xy0`).

## Definition of done

- The Cloud gateway and the Integration adapter case studies are on the page shape, from the
  approved copy.
- The exported page's text matches the approved copy, element by element.
- The earlier case studies, their diagrams and every link to them are gone; each old address leads to
  the Earlier work list.
