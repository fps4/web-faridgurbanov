---
title: "FS-0009 — References"
status: accepted
last_updated: 2026-11-23
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/product/FS-0007-contact-and-privacy.md
  - docs/design/decisions/0009-references-as-curated-snapshots.md
  - docs/guides/references.md
maestro:
  feature: references
  kind: functional_spec
  summary: |
    People the owner worked with, quoted in their own words and linked to their public LinkedIn
    profile, on two surfaces: a band of the home page (two of them) and, where a reference names
    one, inside the case study it is about. There is no References page. Each reference is a
    markdown file the owner or an agent maintains by hand; nothing is fetched from LinkedIn. The
    section exists to make the site read as a person other people have worked with, which no amount
    of the owner's own prose can do.
---

# FS-0009 — References

- **Status:** accepted
- **Raised:** 2026-09-17
- **Changed:** 2026-11-23, maestro story `art-2ya5at7k1q`: the References page is removed and the references are a band of the home page
- **Owner:** @farid (architect)
- **Decision:** [ADR-0009](../design/decisions/0009-references-as-curated-snapshots.md), whose References page is superseded by [ADR-0010](../design/decisions/0010-the-site-has-one-job.md) §5

## Why

The site argues, in the owner's voice, that the work shipped and that organisations adopted it.
A third party saying the same thing, with a name and a profile a reader can open, is a different
kind of evidence, and it is the one thing on the site that cannot read as generated. A reference is
one of the people who were there, speaking.

## Scope

1. **A reference** is one person's words: name, their position as their LinkedIn headline shows it
   (refreshed by hand on review), `context` (how they worked with the owner, as the line under the
   quote reads), a link to their public LinkedIn profile, the date they wrote it, the language it
   is in, and the quote itself, verbatim, paragraphs kept. It may name the work it is about
   (`work`), may carry a `photo`, a `translated_from`, a `verified` flag (the same words are a
   recommendation on the owner's LinkedIn profile) and an `order`. Stored as one markdown file per
   person under `content/references/`, locale-less, because the quote is never translated. The
   cards are ordered by `order` (a positive integer, lower first); references without one come
   after those with one, then newest first, then by name.
2. **Home** — a band after How I work and before Contact (`id="references"`) showing the references
   marked `featured` (at most two): the heading, and a card per quote with the name linked to the
   person's profile, `role · context`, and "Read it on LinkedIn" to the recommendations on the
   owner's own profile. No photo, initials, date or years on a card. The texts are those of the
   approved copy ("References on Home"). `/references` answers 301 to this band in nginx.
3. **Case study** — WHERE a published reference names a case study in `work`, that study renders an
   "In their words" block, framed so the other person's words are visibly not the owner's prose.
   No case study shows one today.
4. **No page of their own.** There is no References page, no header or footer entry for one, and
   no sitemap entry.
5. **Ships dark.** WHILE no reference is marked `featured`, the home band renders nothing.
6. **Checked by the build.** A malformed reference fails `npm run test`: quote length (one budget,
   30 to 120 words, for every quote), profile-link shape, photo presence, `context` present, and
   that `work`, when given, names a case study or an Earlier work entry.
7. **Bilingual chrome.** The Dutch addresses show the English band under the fallback notice until
   the Dutch copy is approved; the quote is never translated.

## Out of scope

- Fetching anything from LinkedIn (profile data, photos, recommendations), at build or at request
  time — see ADR-0009 for why none of the routes is available to a static site that keeps its
  privacy promise.
- Testimonials for the training offer (FS-0008, M1).
- Star ratings, logo walls, carousels, or any aggregate ("trusted by 20 teams").

## Acceptance criteria (EARS)

- THE SYSTEM SHALL read references from `content/references/*.md`, one person per file, with the
  person's details in flat frontmatter and the quote as the body, and SHALL exclude files marked
  `draft: true`.
- EACH reference SHALL carry a `linkedin` URL of the form `https://www.linkedin.com/in/<handle>/`,
  a `role` as their LinkedIn headline shows it, and a `context`.
- WHERE at least one reference is marked `featured`, THE home page SHALL render, after How I work and
  before Contact, a band with the approved heading and each featured reference as a card: the quote
  as the person wrote it, the name linked to their profile (new tab, `rel="noopener"`), `role ·
  context`, and a link "Read it on LinkedIn" to the owner's LinkedIn recommendations.
- THE SYSTEM SHALL NOT load any image or script from LinkedIn.
- THE SYSTEM SHALL fail the build WHEN more than two references are marked `featured`.
- WHILE no reference is marked `featured`, THE home band SHALL NOT render.
- WHEN `/en/references` or `/nl/references` is requested, THE server SHALL answer 301 to
  `/en#references` or `/nl#references`, keeping a query string before the fragment.
- THE header, the footer and the sitemap SHALL NOT name a References page.
- WHERE a published reference names a case study, THE case-study page SHALL render an "In their
  words" block containing that reference: the quote, the name linked to their profile, `role ·
  context`, their `photo` or, without one, their initials, and the date as month and year; WHERE the
  reference is `verified`, an "Also on my LinkedIn" link to the recommendations; WHEN the quote is in
  a language other than the page's, or is an approved translation, a note that says so.
- THE SYSTEM SHALL fail `npm run test` WHEN a quote is outside 30–120 words, when its profile link
  is not a LinkedIn profile URL, when its photo file is missing, when `context` is missing, when
  `order` is given and is not a positive integer, or when `work` is given and names no case study or
  Earlier work entry.
- THE voice check SHALL NOT measure `content/references/`, because the words are not the owner's.
- THE privacy page SHALL state what a reference publishes about a person and how they have it
  removed (FS-0007).

## Definition of done

- The loader, the component and the surfaces above are in place; `npm run build` with no featured
  reference produces a home page without the band.
- `lib/references.test.ts` validates every file under `content/references/`;
  `components/home-references.test.tsx` holds the approved strings of the band.
- `content/references/_template.md` (a draft) shows the file shape; `docs/guides/references.md`
  says how to ask for one and what the build checks.
