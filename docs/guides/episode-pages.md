---
title: "Guide — episode pages: one template, fed by files"
status: guide
last_updated: 2026-11-01
owners: [architect]
related:
  - docs/product/FS-0012-learning-section.md
  - docs/product/FS-0010-ai-product-design-storyline.md
  - app/[locale]/(site)/learning/[series]/[module]/[episode]/page.tsx
  - lib/learning.ts
  - lib/sources.ts
---

# Episode pages: one template, fed by files

Every episode page in the Learning section is drawn by **one template**,
`app/[locale]/(site)/learning/[series]/[module]/[episode]/page.tsx`. No episode has markup of its
own. An episode supplies files; the template lays them out. So every episode page looks the same,
and a change to the style is a change to that one file and reaches every episode at once.

## The page, top to bottom

The order is fixed. An episode cannot reorder it or add a block; a new block is added to the
template, for all episodes.

1. **Breadcrumb:** Learning › series › module.
2. **Episode number and title.**
3. **In this episode:** the three promise lines, numbered.
4. **Sources (n) ↓:** a jump link to the sources, shown when the episode has any.
5. **The diagram:** the episode's deck drawn at the step its layout names as the figure, with
   *Step through the slides* linking to the deck.
6. **Sources:** grouped by the part of the episode, numbered straight through in the order the
   episode uses them, one line each: the title (a link), who · year, and a tag for the kind of
   source.
7. **Previous / next:** the neighbouring switched-on episodes of the series.

The closing card (the idea, the move, Monday) is in the deck, not on the page (removed
2026-11-01). The video joins the page when it is published (US-0032).

## What an episode supplies

| Input | File | Edited as |
|---|---|---|
| Number and title | `lib/episodes/module-<n>.ts` (the module's titles) | code (one line) |
| *In this episode* lines, and the closing card the deck ends on | `lib/episodes/module-<n>.ts` | code (a small object) |
| The slides' words: step times, every line on screen | `content/decks/<locale>/<n>-<e>.yaml` | text |
| The slides' layout: where each line sits, when it appears | `lib/decks/<n>-<e>.ts` | code (ADR-0010) |
| Sources | `content/sources/<n>-<e>.yaml` | text |
| Switched on | `RELEASED` in `lib/learning.ts` | one entry |

The sources and the slides' words are plain files the owner edits without touching code. The
layout of the slides stays code by design: positions and timings are checked by the tests (no text
on text, nothing under the camera).

## Adding an episode page

1. Write the episode's *In this episode* lines and card in `lib/episodes/module-<n>.ts` and give it
   its `deck` id.
2. Build the deck: `content/decks/en/<id>.yaml` and `lib/decks/<id>.ts` (FS-0010).
3. Write `content/sources/<id>.yaml`: one list of parts, each with `part` and `items`; each item has
   `title`, `who`, `year`, `url` (https) and `kind` (law, paper, preprint, model-card, dataset,
   report, vendor, news, docs, encyclopedia). The header of `content/sources/3-1.yaml` is the model.
4. Add the episode's number to `RELEASED` in `lib/learning.ts`. Its page appears, and its module and
   series open.
5. `npm run test`. It fails if the episode lacks its lines or card, has a deck but no sources file,
   or a sources file has a missing field, a non-https link or an unknown kind.

## Changing the style

- Change the template (or the components it uses: `components/learning-crumbs.tsx`,
  `components/deck/sketch.tsx`), never one episode. There is nothing per episode to change.
- Labels ("In this episode", "Sources", "Step through the slides") are in `learningCopy`
  (`lib/learning.ts`) and `storylineCopy` (`lib/storyline.ts`).
- Update the list under *The page, top to bottom* in this guide and FS-0012 §5 in the same PR.
