---
title: "FS-0002 — Home page"
status: draft
last_updated: 2026-11-23
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
    (Contact and Work), then Track record (four cards) and What I do (six lines), each leading to
    the work behind it, then How I work in his own words. Every text is verbatim from the approved
    site copy.
---

# FS-0002 — Home page

- **Status:** draft
- **Stories:** maestro `art-9947n0hg99` and `art-spqwxpsqc3`, following the decision `art-896t5kxfka` (ADR-0010)

## Why

The home page is the first screen a hiring manager reads. The site has one job (ADR-0010): get the
call. The page says who he is in his own words and sends the reader to Contact or to Work.

## Scope

1. **Hero.** The line above the title, the title, the introduction (two paragraphs) and two
   buttons: the first leads to Contact, the second to Work. On a wide screen the hero is two
   columns: these on the left, the photo (item 2) on the right; on a narrow screen the photo
   stands under the buttons.
2. **Intro video place** (maestro story `art-cxvf6s5t94`). WHILE no video is configured
   (`INTRO_VIDEO` in `lib/site.ts`), a photo of him stands in its place, in the right column of
   the hero: upright 4 to 5 frame, rounded corners, up to 420 px wide, with its size given so the
   page does not move when it loads. It is served from the site itself (`public/media/`), has his
   name as alternative text and no metadata, and has one line under it: the place and two links
   (UNESCO World Heritage, Wikipedia), each opening in a new tab, and followed only when the visitor clicks. Texts are in
   `lib/dictionaries.ts` (`home.photo*`), the file and the two addresses in `lib/site.ts`
   (`HERO_PHOTO`). WHEN `INTRO_VIDEO` is set, the video takes the place (a section under the hero)
   and neither the photo nor its line is rendered. The player carries no text of its own.
3. **Track record** (maestro story `art-spqwxpsqc3`). Heading, the line under it and four cards,
   each a link: the first two to the Cloud gateway case study, the third to the Integration adapter
   case study, the fourth to the security data lake entry under Earlier work (`/work#earlier-security-data-lake`).
   The large text of the first and third card is the case study's own `large` (the same words as its
   row on the Work page); the other texts are in `lib/dictionaries.ts`.
4. **What I do** (same story). Heading, the line under it and six lines, each with a link: Cloud
   gateway, Integration adapter, Both products (`/work`), Cloud gateway, Simple first (the article)
   and Earlier work (`/work#earlier-work`). The addresses are in `lib/home.ts`.
5. **How I work.** Heading, the line under it, three statements and a link to Practice.
6. **References band (FS-0009).** Unchanged: renders nothing WHILE no reference is marked
   `featured`. It has its own story.
7. **Copy.** Every text is taken verbatim from the approved copy (`lib/dictionaries.ts`, `home`).
   No text is written for the page. The meta description is the first sentence of the introduction.
8. **Contact** (maestro story `art-r903t1r2tp`, [FS-0007](./FS-0007-contact-and-privacy.md)) is
   the last part of the page, `id="contact"`; the hero's first button leads to it.
9. **Not on the page now:** the references as cards and the résumé button. Each returns in its
   own story when its text is approved.
10. **Languages.** The Dutch addresses show the English page under the fallback notice until the
   Dutch copy is approved.

## Acceptance criteria (EARS)

- THE home page's first screen SHALL show the line above the title, the title, the introduction and
  two buttons, exactly as in the approved copy, leading to the Contact part of the page and to Work.
- THE home page SHALL show How I work: its three statements verbatim and a link to Practice.
- THE home page SHALL show Track record between the introduction and How I work: its heading, line
  and four cards exactly as in the approved copy, each card leading to the case study or the
  earlier-work entry behind it.
- THE home page SHALL show What I do after Track record: its heading, line and six lines exactly as
  in the approved copy, each line leading to the page it names.
- THE home page SHALL carry no text that is not in the approved copy.
- THE home page's meta description SHALL be the first sentence of the approved introduction.
- WHILE neither a video nor a photo is configured, THE home page SHALL render nothing in the place of
  the intro video and SHALL leave no empty frame.
- THE home page SHALL name no client and hold no exact internal figure.
- Every internal link on the home page SHALL resolve to a page, without a redirect.
