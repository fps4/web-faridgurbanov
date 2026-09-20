---
title: "FS-0009 — References"
status: accepted
last_updated: 2026-09-20
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
    profile, on three surfaces: inside the case study they are about, on a references page that
    holds the full set, and (two of them) on the home page. Each reference is a markdown file the
    owner or an agent maintains by hand; nothing is fetched from LinkedIn. The section exists to
    make the site read as a person other people have worked with, which no amount of the owner's
    own prose can do.
---

# FS-0009 — References

- **Status:** accepted
- **Raised:** 2026-09-17
- **Owner:** @farid (architect)
- **Decision:** [ADR-0009](../design/decisions/0009-references-as-curated-snapshots.md)

## Why

The site argues, in the owner's voice, that the work shipped and that organisations adopted it.
A third party saying the same thing, with a face, a name and a profile a reader can open, is a
different kind of evidence, and it is the one thing on the site that cannot read as generated. The
adoption band (FS-0002) and the "Who had to say yes" sections (FS-0004) are the owner's account of
the stakeholders; a reference is one of those stakeholders speaking.

## Scope

1. **A reference** is one person's words about one engagement: name, their position as their
   LinkedIn headline shows it (refreshed by hand on review) and the years worked together, a link to
   their public LinkedIn profile, an optional photo, the date they wrote it, the language it is in,
   and the quote itself, verbatim, paragraphs kept.
   Stored as one markdown file per person under `content/references/`, locale-less, because the
   quote is never translated; only the role line carries a Dutch variant.
2. **Case study** — WHERE a published reference names a case study, that study renders an
   "In their words" section between "Who had to say yes" and "Role & stack", framed so the other
   person's words are visibly not the owner's prose.
3. **Home** — a band between "How I get it adopted" and "What I build" showing the references
   marked `featured` (at most two, side by side), each linking to its case study, with a link to the
   references page.
4. **References page** (`/references`) — every published reference, grouped by case study in the
   case-study order, each with its profile link, date, and (where it is also a recommendation on the
   owner's LinkedIn) a link to that recommendations tab so the reader can check the words at the
   source. Closes with a short note on how the references were collected and how someone withdraws.
5. **Contact** — a block offering the references page and a live introduction on request.
6. **Footer** — the references page is listed in the site nav, footer only.
7. **Ships dark.** WHILE no reference is published, every one of the surfaces above renders nothing
   and the page is a 404, so the feature lands before the first reference does.
8. **Checked by the build.** A malformed reference fails `npm run test`: quote length, profile-link
   shape, photo presence, and that the named case study exists.
9. **Bilingual chrome.** Headings, ledes, the role line and the language note are EN + NL; the quote
   is shown in its own language on both, with a note when that differs from the page's.

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
  and THE SYSTEM SHALL render it as the person's profile link on every surface.
- EACH reference SHALL state the person's position as their LinkedIn headline shows it, refreshed
  by hand when the file is reviewed, and the years worked together.
- WHERE a reference carries a `photo`, IT SHALL be a file under `public/references/`; WHERE it does
  not, THE SYSTEM SHALL render the person's initials in its place. THE SYSTEM SHALL NOT load any
  image or script from LinkedIn.
- WHERE a published reference names a case study, THE case-study page SHALL render an "In their
  words" section between "Who had to say yes" and "Role & stack" containing that reference.
- WHERE at least one reference is marked `featured`, THE home page SHALL render an "In their words"
  band between the adoption band and the technical band showing the featured references, each
  linking to its case study, with a link to the references page.
- THE SYSTEM SHALL fail the build WHEN more than two references are marked `featured`.
- WHILE at least one reference is published, THE SYSTEM SHALL emit `/references` in both locales,
  grouped by case study in the case-study order; the contact page SHALL offer the page and an
  introduction; and the footer SHALL list the page.
- WHILE no reference is published, THE home band, the case-study section, the contact block and the
  footer link SHALL NOT render, and `/references` SHALL be a 404.
- WHERE a reference is marked `verified`, ITS rendering SHALL link to the owner's LinkedIn
  recommendations tab.
- WHEN a quote is in a language other than the page's, THE SYSTEM SHALL say so next to the
  attribution; WHERE the quote shown is an approved translation, IT SHALL say what it was translated
  from.
- THE SYSTEM SHALL fail `npm run test` WHEN a reference's quote is outside 30–120 words (35–75 when
  featured), when its profile link is not a LinkedIn profile URL, when its photo file is missing, or
  when its `work` names no case study.
- THE voice check SHALL NOT measure `content/references/`, because the words are not the owner's.
- THE privacy page SHALL state what a reference publishes about a person and how they have it
  removed (FS-0007).

## Definition of done

- The loader, the component and the four surfaces are in place and gated on the reference count;
  `npm run build` with an empty `content/references/` produces a site identical to before, plus a
  404 at `/references`.
- `lib/references.test.ts` validates every file under `content/references/` and fails on any of the
  conditions above.
- `content/references/_template.md` (a draft) shows the file shape; `docs/guides/references.md`
  says how to ask for one, prepare the photo, and what the build checks.
- FS-0002, FS-0004 and FS-0007 carry the cross-references; the privacy page carries the paragraph.
