---
title: "FS-0010 — AI Product Design storyline"
status: draft
last_updated: 2026-10-20
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
    The site's main section for the coming months: AI Product Design, eight parts published one at a
    time, each a page with two short episodes and the downloads that go with it. Every part shows its
    step on one running example, a fictional insurer fast-tracking small claims. The episodes are
    recorded over decks the site renders itself: one diagram per episode, drawn in a hand-drawn style
    step by step, and artifact slides cut from the kit's downloads.
---

# FS-0010 — AI Product Design storyline

- **Status:** draft
- **Raised:** 2026-10-20
- **Owner:** @farid (architect)
- **Decision:** [ADR-0010](../design/decisions/0010-storyline-english-first-and-decks-as-data.md)

## Why

The storyline is what the owner will publish and point people to for the next months, so it leads the
header. The content (the paper, the part texts, the episode scripts, the downloads) is written in
the wiki and in the public kit, `fps4/ai-product-design-kit`. The site is where a reader meets it: one
page per part, the episodes on that page, and the downloads one click away.

The episodes are slides with the owner in a corner. Built in a presentation tool, sixteen of them
drift apart in style, and every change to a download means redrawing a slide. Built here, the deck is
data: the diagram is drawn from it on screen while the owner speaks, the same drawing is the part
page's figure, and an artifact slide is rendered from the download's own text.

## Scope

1. **Storyline index** (`/ai-product-design`): what the storyline is, the running example, and the
   eight parts in order. A part with a page links to it; the others are listed as coming.
2. **Part page** (`/ai-product-design/<part>`): the chapter text (markdown), the part's diagram, the
   episodes (with the video once published), the downloads (blank and filled in, linked to the kit),
   then "In your organisation" and the sources.
3. **Episode deck** (`/<locale>/deck/<episode>`, e.g. `/en/deck/1-1`): a 1920×1080 stage for screen recording, outside the site
   shell. Steps advance by key, click or presenter remote. Shapes and handwriting draw themselves in
   a hand-drawn style when their step arrives; artifact cards rise in and rows are marked. The
   bottom-right corner stays clear for the camera. A presenter view in a second window shows the cue
   to say, the next cue, the script time and a clock, and follows the stage. The deck's words live in
   `content/decks/<locale>/<episode>.yaml`, editable without code; the layout in `lib/decks/` places
   them by id.
4. **Every episode opens with what you will get and closes on one card.** Right after the recap, three
   short lines (*In this episode*); at the end, the episode in one card: the idea, the move, Monday
   and the download. Both come from `lib/storyline.ts`, and the part page shows the same card.
5. **Artifact slides from the kit.** A card shows rows of a kit download, read at build time from a
   snapshot in `content/kit/` that `scripts/sync-kit.mjs` refreshes.
6. **Gated.** WHILE `STORYLINE_PUBLISHED` is false, a production build leaves the nav item out and
   renders every storyline route as a 404; `next dev` shows everything, which is where screening and
   recording happen.
7. **English first.** Dutch routes render the English text with the fallback notice (ADR-0002); the
   section's short UI labels are in both languages.

## Out of scope

- Video hosting or embedding (a later story: YouTube, loaded only after a click).
- PDF and DOCX builds of the downloads; the part page links to the kit's Markdown until they exist.
- Feedback from readers: [FS-0011](FS-0011-storyline-feedback.md).
- Dutch translations of the part texts (deferred by the owner, 2026-10-20).
- Episodes other than 1.1, and parts other than Part 1 (each is a content change once the pattern
  holds).

## Acceptance criteria (EARS)

- WHILE `STORYLINE_PUBLISHED` is false, THE production build SHALL NOT list the storyline in the
  header AND SHALL render `/ai-product-design`, every part page and every `/<locale>/deck/<episode>` as a 404.
- WHILE `STORYLINE_PUBLISHED` is true OR the site runs under `next dev`, THE header SHALL list
  "AI Product Design" first, before the other primary items.
- THE storyline index SHALL list all eight parts in order, linking each part that has a page.
- THE part page SHALL render, in order: the part label and title, the summary, the diagram, the
  chapter text up to "In your organisation", the episodes, the downloads, then "In your
  organisation" and the sources.
- EACH episode SHALL carry three opening lines and a closing card (idea, move, Monday, download) in
  `lib/storyline.ts`; THE deck SHALL show the lines right after the recap and the card before the
  closing line, AND THE part page SHALL show the idea, the move and Monday for each episode.
- THE part page's diagram SHALL be the first episode's deck drawn at its finished step (the step
  before the first artifact card).
- EACH download SHALL link to the blank version in the kit, and to the filled-in version WHERE one
  exists.
- WHEN the presenter advances a deck, THE stage SHALL draw the arriving elements in order within about
  two seconds and fade the leaving ones; WHEN the presenter steps back, THE stage SHALL show the
  earlier step without animation.
- THE deck SHALL follow the presenter view and the presenter view SHALL follow the deck, in either
  direction.
- THE deck page SHALL carry `noindex, nofollow`.
- THE build SHALL fail WHEN a deck has a step that changes nothing on screen, an element under the
  camera corner, an element appearing outside the deck's steps, a card naming an unknown card, a card
  row missing from the kit snapshot, step times out of order, or a words file and its layout that
  name different steps or ids.
- WHEN the owner edits a deck's words file under `next dev`, THE deck SHALL show the change on the
  next refresh; WHEN the file is malformed, THE error SHALL name the file and every problem in it.
- WHERE the user prefers reduced motion, THE deck SHALL show each step without the drawing animation.
- THE voice check SHALL NOT measure `content/kit/`, which is the kit's text.

## Definition of done

- Index, Part 1 page and the 1.1 deck render under `next dev`; the production build is unchanged
  for visitors apart from three 404 routes.
- `lib/decks.test.ts`, `lib/kit-tables.test.ts` and `lib/sections.test.ts` cover the rules above.
- ADR-0010 records the English-first and decks-as-data choices; EP-03 lists the stories.
