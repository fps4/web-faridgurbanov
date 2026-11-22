---
title: "FS-0002 — Home page"
status: draft
last_updated: 2026-11-22
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0009-references.md
  - docs/design/decisions/0010-the-site-has-one-job.md
maestro:
  feature: home-page
  kind: functional_spec
  summary: |
    The front door. It opens with his title, the line above it and his introduction, two buttons
    (Contact and Work), then How I work in his own words. Every text is verbatim from the approved
    site copy. The track record and What I do bands return in their own stories, when their text
    is approved.
---

# FS-0002 — Home page

- **Status:** draft
- **Story:** maestro `art-9947n0hg99`, following the decision `art-896t5kxfka` (ADR-0010)

## Why

The home page is the first screen a hiring manager reads. The site has one job (ADR-0010): get the
call. The page says who he is in his own words and sends the reader to Contact or to Work.

## Scope

1. **Hero.** The line above the title, the title, the introduction (two paragraphs) and two
   buttons: the first leads to Contact, the second to Work.
2. **Intro video place.** Directly under the hero. WHILE no video is configured
   (`INTRO_VIDEO` in `lib/site.ts`), nothing is rendered there, no frame either. The player carries
   no text of its own.
3. **How I work.** Heading, the line under it, three statements and a link to Practice.
4. **References band (FS-0009).** Unchanged: renders nothing WHILE no reference is marked
   `featured`. It has its own story.
5. **Copy.** Every text is taken verbatim from the approved copy (`lib/dictionaries.ts`, `home`).
   No text is written for the page. The meta description is the first sentence of the introduction.
6. **Not on the page now:** the track record, What I do, the references as cards, contact and the
   résumé button. Each returns in its own story when its text is approved.
7. **Languages.** The Dutch addresses show the English page under the fallback notice until the
   Dutch copy is approved.

## Acceptance criteria (EARS)

- THE home page's first screen SHALL show the line above the title, the title, the introduction and
  two buttons, exactly as in the approved copy, leading to Contact and to Work.
- THE home page SHALL show How I work: its three statements verbatim and a link to Practice.
- THE home page SHALL carry no band with a figure, and no text that is not in the approved copy.
- THE home page's meta description SHALL be the first sentence of the approved introduction.
- WHILE neither a video nor a photo is configured, THE home page SHALL render nothing in the place of
  the intro video and SHALL leave no empty frame.
- THE home page SHALL name no client and hold no exact internal figure.
- Every internal link on the home page SHALL resolve to a page, without a redirect.
