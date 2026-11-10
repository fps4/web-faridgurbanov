---
title: "FS-0012 — Learning section"
status: draft
last_updated: 2026-11-10
owners: [architect]
related:
  - docs/product/FS-0007-contact-and-privacy.md
  - docs/product/FS-0013-practice-and-guidelines.md
  - docs/delivery/backlog/EP-01-content-pages/US-0040-learning-section-confluent-course.md
maestro:
  feature: learning-section
  kind: functional_spec
  summary: |
    Free video courses under one section, Learning: a landing page with one card per course, a page
    per course and a page per episode. The Confluent crash course goes first: one episode per module
    of its public repo, each a self-hosted video with what you leave with, the questions to ask, and
    links to the module's notes and lab. The owner switches episodes on one by one as their videos
    are published; the rest of the plan shows as coming. AI Product Design and AI Product Delivery
    show as coming cards and join the section later.
---

# FS-0012 — Learning section

- **Status:** draft
- **Raised:** 2026-11-01, rewritten 2026-11-10 for the Confluent crash course going first
- **Owner:** @farid (architect)

## Why

The owner is publishing free video courses. The first one ready is the Confluent crash course: a
public repo with notes and labs for eight modules, and a short video per module that explains the
reasoning. The AI Product Design series is further from ready (draft PR #99). The courses need one
home, and the owner needs to publish them episode by episode as videos are recorded, without a page
written by hand per episode and without showing what is not recorded yet.

## Scope

1. **One nav item, "Learning"** (`/learning`, Dutch label "Leren"), first in the header.
2. **Landing page** (`/learning`): the section's words from `content/en/learning/index.md`, one card
   per course (title, one line, episodes out of the plan or the planned size), and an *Out now* band
   with every switched-on episode.
3. **Course page** (`/learning/<course>`): the words from `content/en/learning/<course>.md` (title,
   eyebrow, summary, body), a link to the course's repo when it has one, and every planned episode in
   order. A switched-on episode links to its page; the others are muted and marked *Coming*.
4. **Episode page** (`/learning/<course>/<episode>`), one template for every episode: the number,
   title and line, the video, the *In this episode* lines, the *Questions to ask*, links to the
   module's notes and lab in the repo, and previous / next across the course's episodes.
5. **The video is self-hosted** (`<video>` with a poster and a WebVTT caption track), as the home
   intro video. No YouTube or Vimeo player: a third-party frame would add a processor and its cookies
   and break the privacy page's "nothing is collected" (FS-0007).
6. **The courses and their plans** in `lib/learning.ts`; a course with episodes keeps them in
   `lib/courses/<course>.ts`. A course whose episodes are not planned yet carries only its size
   ("6 modules") for its card.
7. **The release list.** `RELEASED` in `lib/learning.ts` holds, per course, the numbers of the
   episodes switched on. Adding a number publishes that episode's page and opens its course; removing
   it takes them down. Nothing else is edited by hand.
8. **The gate.** `LEARNING_PUBLISHED` in `lib/site.ts` hides the whole section from a production
   build. Under `next dev` the section always shows, and every planned episode renders as a marked
   preview, so a page can be checked before its video exists.

## Out of scope

- Dutch text and labels: Dutch routes show the English text with the fallback notice.
- Module pages: the Confluent course has one episode per module, so episodes sit directly under the
  course. A course with several episodes per module (AI Product Design) adds that level when it joins.
- The AI Product Design decks, presenter view and per-episode sources (draft PR #99), which rebase
  onto this section.
- Where the video files are hosted. The `video.src` field takes a path under `public/` or an https URL.

## Acceptance criteria (EARS)

- WHILE `LEARNING_PUBLISHED` is false, THE production build SHALL NOT list "Learning" in the header,
  SHALL render `/learning` and every page under it as a 404 with no course or episode title in the
  page, AND SHALL list no Learning path in the sitemap.
- WHILE `LEARNING_PUBLISHED` is true OR the site runs under `next dev`, THE header SHALL list
  "Learning" first, before the other primary items.
- THE landing page SHALL show one card per course in `lib/learning.ts`; WHEN a course has no
  switched-on episode, ITS card SHALL be marked *Coming* AND SHALL NOT link anywhere in a production
  build.
- THE course page SHALL list every planned episode in order; WHEN an episode is switched on, IT SHALL
  link to its page; OTHERWISE it SHALL be marked *Coming* AND SHALL NOT link in a production build.
- THE production build SHALL generate a course or episode page with content only WHEN it holds a
  switched-on episode; every other path under `/learning` SHALL render as a 404.
- WHEN the owner adds an episode's number to `RELEASED`, THE episode page, its course page and the
  sitemap entries SHALL appear without any other change.
- THE tests SHALL fail WHEN `RELEASED` names a course or an episode the plan does not have, names an
  episode twice, or switches on an episode without a video, a `.vtt` caption track or its *In this
  episode* lines.
- WHILE the site runs under `next dev`, THE course page SHALL link every planned episode AND each
  unreleased episode page SHALL say it is a preview.
- THE episode video SHALL be a self-hosted `<video>` with controls, no autoplay, a poster and a
  caption track; THE page SHALL NOT embed a third-party player.
- WHEN a Dutch route is requested, THE page SHALL show the English text with the fallback notice.

## Definition of done

- `/learning`, `/learning/confluent-crash-course` and its episode pages render under `next dev`.
- `lib/learning.test.ts` covers the release list, the plan, what opens, the routes and the gate.
- A production build with the gate closed emits no course or episode title, no nav item and no
  sitemap entry for the section.
