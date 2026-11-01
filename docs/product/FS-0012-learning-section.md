---
title: "FS-0012 — Learning section"
status: draft
last_updated: 2026-11-01
owners: [architect]
related:
  - docs/product/FS-0010-ai-product-design-storyline.md
  - docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
  - docs/delivery/backlog/EP-03-ai-product-design/US-0035-learning-section.md
maestro:
  feature: learning-section
  kind: functional_spec
  summary: |
    The video series move under one section, Learning: a landing page with one card per series, a page
    per series, per module and per episode. AI Product Design is the first series, AI Product
    Delivery the next. The owner switches episodes on one by one as they are recorded; a module and a
    series open with their first switched-on episode, and the rest of the plan shows as coming.
---

# FS-0012 — Learning section

- **Status:** draft
- **Raised:** 2026-11-01
- **Owner:** @farid (architect)
- **Decision:** [ADR-0010](../design/decisions/0010-storyline-english-first-and-decks-as-data.md)
  (decision 2, the gate and the release list)

## Why

The header had one item for one series, AI Product Design. A second series, AI Product Delivery, is
next, and more may follow. The series need one home, and the owner needs to publish them episode by
episode as they are recorded, without a page per episode written by hand and without showing what is
not recorded yet.

## Scope

1. **One nav item, "Learning"** (`/learning`, Dutch label "Leren"), first in the header, replacing
   "AI Product Design".
2. **Landing page** (`/learning`): the section's words from `content/en/learning/index.md`, one card
   per series (title, one line, number of modules, episodes out of the plan), and an *Out now* band
   with every switched-on episode, each with its diagram and the idea from its card.
3. **Series page** (`/learning/<series>`): the former storyline landing page, now generic. Its words
   are `content/en/learning/<series>.md` (bands as in FS-0010 §1); the hero shows the first
   switched-on episode with a deck (its diagram, a button to the episode), with the caption from the
   file's `figure_caption`. The modules band lists the whole plan: an open module links to its page
   and says how many of its episodes are out; the others are muted and marked *Coming*.
4. **Module page** (`/learning/<series>/<module>`): the module's number, title and line, its
   switched-on episodes in order with their *In this episode* lines, and how many more are planned.
5. **Episode page** (`/learning/<series>/<module>/<episode>`, the episode slug from its title):
   the episode's number and title, its *In this episode* lines, its diagram with a link to step
   through the deck, the closing card (idea, move, Monday), and previous / next across the series'
   switched-on episodes.
6. **The series and their plans** in `lib/learning.ts`: AI Product Design takes its modules and
   episodes from `lib/storyline.ts`; AI Product Delivery lists its eight modules, episodes to follow.
7. **The release list.** `RELEASED` in `lib/learning.ts` holds, per series, the numbers of the
   episodes switched on. Adding a number publishes that episode's page and opens its module and
   series; removing it takes them down. Nothing else is edited by hand.
8. **The gate.** `LEARNING_PUBLISHED` in `lib/site.ts` (formerly `STORYLINE_PUBLISHED`) still hides
   the whole section from a production build. Under `next dev` the section shows exactly what a
   published build would show, so the owner sees the site as visitors will; every deck stays
   reachable under `next dev` for recording.

## Out of scope

- The episode video (US-0032): the episode page gains it once a video is published.
- Text pages per module beyond the generated module page.
- Dutch text and labels (ADR-0010 decision 1).
- Redirects from `/ai-product-design`: the old route was never published (gated), so it is removed.

## Acceptance criteria (EARS)

- WHILE `LEARNING_PUBLISHED` is false, THE production build SHALL NOT list "Learning" in the header
  AND SHALL render `/learning` and every page under it as a 404, with no series, module or episode
  title in the page's metadata.
- WHILE `LEARNING_PUBLISHED` is true OR the site runs under `next dev`, THE header SHALL list
  "Learning" first, before the other primary items.
- THE landing page SHALL show one card per series in `lib/learning.ts`; WHEN a series has no
  switched-on episode, ITS card SHALL be marked *Coming* AND SHALL NOT link anywhere.
- THE series page SHALL list every module of the series in order; WHEN a module has a switched-on
  episode, ITS card SHALL link to the module page and show its episodes out of its total; OTHERWISE
  it SHALL be marked *Coming* AND SHALL NOT link.
- THE module page SHALL list only the module's switched-on episodes, in order, AND SHALL state how
  many planned episodes are not out yet.
- THE build SHALL generate a series, module or episode page only WHEN it holds a switched-on episode;
  every other path under `/learning` SHALL be a 404.
- WHEN the owner adds an episode's number to `RELEASED`, THE episode page, its module page and its
  series page SHALL appear without any other change.
- THE tests SHALL fail WHEN `RELEASED` names a series or an episode the plan does not have, names an
  episode twice, or switches on an episode without its *In this episode* lines and closing card.
- WHILE `LEARNING_PUBLISHED` is true, THE production build SHALL render a deck only WHEN its episode
  is switched on; under `next dev` every deck SHALL render.
- WHEN a Dutch route is requested, THE page SHALL show the English text with the fallback notice.

## Definition of done

- `/learning`, `/learning/ai-product-design`, its module 3 page and the 3.1 episode page render under
  `next dev`; `/ai-product-design` is gone.
- `lib/learning.test.ts` covers the release list, what opens, the routes and the gate.
- FS-0010, ADR-0010, EP-03 and CODEBASE.md name the new routes and the renamed gate.
