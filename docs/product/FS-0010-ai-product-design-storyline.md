---
title: "FS-0010 — AI Product Design storyline"
status: draft
last_updated: 2026-10-25
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/design/decisions/0002-bilingual-en-nl-i18n.md
  - docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
  - docs/delivery/backlog/EP-03-ai-product-design/README.md
maestro:
  feature: ai-product-design-storyline
  kind: functional_spec
  summary: |
    The site's main section for the coming months: AI Product Design, an engineering perspective, in
    six modules of short episodes. Each module stands alone and works one use case of the same
    fictional retailer, Werkmora. The episodes are recorded over decks the site renders itself:
    diagrams drawn in a hand-drawn style step by step, closing on one card.
---

# FS-0010 — AI Product Design storyline

- **Status:** draft
- **Raised:** 2026-10-20 · **Rebuilt:** 2026-10-21 (six modules replace the eight parts)
- **Owner:** @farid (architect)
- **Decision:** [ADR-0010](../design/decisions/0010-storyline-english-first-and-decks-as-data.md)

## Why

The storyline is what the owner will publish and point people to for the next months, so it leads the
header. The content (module texts, episode scripts, sources) is written in the wiki
(`publishing/ai-product-design/`). The site is where a viewer meets it, and where the decks the owner
records over are drawn.

The first iteration (eight parts on an insurer, with downloads from a public kit) was archived on
2026-10-21. The rebuild follows the wiki's six modules: each module is a set of episodes of five or
six minutes, episode 0 is the module's intro, and every module works a different use case of
Werkmora, a fictional home, DIY and garden retailer.

## Scope

1. **Storyline landing page** (`/ai-product-design`): a hero with the first deck's diagram and a
   contact button, then bands for what the series is, who it is for, the running example in four
   figures, the six modules as cards (each with its number of episodes), common questions, and who
   is behind it. The words are the markdown in `content/en/ai-product-design/index.md`, one band per
   `## ` heading (`lib/landing.ts`): a list whose items open with bold becomes cards, `### ` headings
   become questions, and `<!-- modules -->` places the modules.
2. **Modules and episodes** in `lib/storyline.ts`: every module with its episodes by title, numbered
   `module.episode` from the intro (`3.0`) on, with the wiki's id (`data-01`). An episode with a deck
   carries its opening lines and closing card in `lib/episodes/module-<n>.ts`.
3. **Episode deck** (`/<locale>/deck/<episode>`, e.g. `/en/deck/3-1`): a 1920×1080 stage for screen
   recording, outside the site shell. Steps advance by key, click or presenter remote. Shapes and
   handwriting draw themselves in a hand-drawn style when their step arrives; cards rise in. The
   bottom-right corner stays clear for the camera. A presenter view in a second window shows the
   presenter notes for the click, the next click's first line, the planned time and a clock, and
   follows the stage. There is no word-for-word script. The notes stay in the wiki's `.slides.md`:
   under `npm run dev` a local notes server (`scripts/notes-server.mjs`, 127.0.0.1:3041) serves them
   to the presenter view, which edits a click's block in place (`e`, ⌘↵ to save) and writes it back
   into the wiki file. The presenter view and its notes exist only on the owner's machine; the
   published deck has neither. The deck's words live in
   `content/decks/<locale>/<episode>.yaml`, editable without code; the layout in `lib/decks/` places
   them by id.
4. **Every episode promises first and closes on one card.** Three short lines (*In this episode*)
   right after the title, before the opening case; at the end, the episode in one card: the idea, the move and
   Monday. Both come from `lib/episodes/module-<n>.ts`.
5. **Gated.** WHILE `STORYLINE_PUBLISHED` is false, a production build leaves the nav item out and
   renders every storyline route as a 404; `next dev` shows everything, which is where screening and
   recording happen.
6. **English only.** The landing text, the decks and the section's labels are English; Dutch routes
   show the English text with the fallback notice (ADR-0002) and the English labels, until the owner
   decides on Dutch.

## Out of scope

- Module pages. A module gets a page once its text is written; until then the landing page lists it.
- Video hosting or embedding (a later story: YouTube, loaded only after a click).
- Knowledge checks, contact through an API and visitor statistics: parked in the wiki
  (`publishing/ai-product-design/site-backend-design.md`); they need a backend next to the static
  site, which ADR-0001 does not allow yet.
- Feedback from readers: [FS-0011](FS-0011-storyline-feedback.md) (parked; written for the first
  iteration).
- Dutch: the text, the decks and the labels.

## Acceptance criteria (EARS)

- WHILE `STORYLINE_PUBLISHED` is false, THE production build SHALL NOT list the storyline in the
  header AND SHALL render `/ai-product-design` and every `/<locale>/deck/<episode>` as a 404, with no
  storyline title or summary in the page's metadata.
- WHILE `STORYLINE_PUBLISHED` is true OR the site runs under `next dev`, THE header SHALL list
  "AI Product Design" first, before the other primary items.
- THE landing page SHALL list all six modules in order with their number of episodes, AND SHALL
  render one band per `## ` section of its markdown, in the file's order.
- EACH episode with a deck SHALL carry three opening lines and a closing card (idea, move, Monday)
  in `lib/episodes/module-<n>.ts`; THE deck SHALL show both.
- THE landing page's figure SHALL be the first deck drawn at the step its layout names as the figure
  (or, without one, the step before its first card).
- WHEN the presenter advances a deck, THE stage SHALL draw the arriving elements in order within about
  two seconds and fade the leaving ones; WHEN the presenter steps back, THE stage SHALL show the
  earlier step without animation.
- THE deck SHALL follow the presenter view and the presenter view SHALL follow the deck, in either
  direction.
- THE presenter view SHALL show the step's presenter notes as bullets, read from the wiki's
  `.slides.md` through the notes server; `npm run notes:check` SHALL exit non-zero WHEN a step has no
  ▶ block with at least one line or a ▶ block names no step.
- WHEN the owner edits a step's notes in the presenter view and saves, THE notes server SHALL replace
  that step's ▶ block in the `.slides.md` and SHALL leave every other byte of the file unchanged.
- WHEN the step's ▶ block changed on disk after the editor opened, THE notes server SHALL refuse the
  first save (409) and THE presenter view SHALL keep the edited text and say so; a second save SHALL
  overwrite the block.
- WHEN the `.slides.md` changes on disk, THE presenter view SHALL show the new notes without a reload.
- THE production build SHALL contain no presenter notes and no presenter view, and a deck's words file
  SHALL be rejected WHEN it carries `notes`.
- THE notes server SHALL listen on 127.0.0.1 only and SHALL refuse requests from any origin other
  than the dev site and any host name other than its own.
- THE deck page SHALL carry `noindex, nofollow`.
- THE build SHALL fail WHEN a deck has a step that changes nothing on screen, an element under the
  camera corner, text on top of other text, an element appearing outside the deck's steps, a card
  naming an unknown card, step times out of order, or a words file and its layout that name different
  steps or ids.
- WHEN the owner edits a deck's words file under `next dev`, THE deck SHALL show the change on the
  next refresh; WHEN the file is malformed, THE error SHALL name the file and every problem in it.
- WHERE the user prefers reduced motion, THE deck SHALL show each step without the drawing animation.

## Definition of done

- The landing page and the 3.1 deck render under `next dev`; the production build is unchanged for
  visitors apart from the storyline's 404 routes.
- `lib/decks.test.ts` and `lib/landing.test.ts` cover the rules above.
- ADR-0010 records the English-first and decks-as-data choices; EP-03 lists the stories.
