---
title: "0010: The storyline ships English first, gated, and its episode decks are data rendered by the site"
status: proposed
last_updated: 2026-11-01
owners: [architect]
related:
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/design/decisions/0002-bilingual-en-nl-i18n.md
  - docs/product/FS-0010-ai-product-design-storyline.md
---

# ADR-0010 — The storyline ships English first, gated, and its episode decks are data rendered by the site

## Context

The AI Product Design storyline (FS-0010) becomes the site's main section. Three questions came with
it.

1. **Language.** ADR-0002 makes the site bilingual, with an explicit English fallback when a page
   has no Dutch file. The owner deferred Dutch for the storyline (2026-10-20), and on 2026-10-21 made
   it English only, labels included, until the owner decides otherwise.
2. **When it shows.** The first episodes are screened privately before they are published, and the
   main branch keeps deploying to ds1 for every other change.
3. **How the episodes are made.** Each episode is slides with the talking head in a corner: diagrams
   that build while the owner speaks, closing on one card. The owner wants every episode in the same
   style, with the diagrams drawing themselves in a hand-drawn look fast enough that nobody waits for
   a hand.

The storyline was rebuilt on 2026-10-21: six modules of short episodes replace the eight parts, and
the episodes no longer show downloads from a kit. This record is updated to match (it is still
`proposed`).

## Decision

1. **English only, through the existing fallback.** The storyline's text lives only in
   `content/en/`; Dutch routes render it with the fallback notice, and the section's labels are the
   English ones in both locales. No change to ADR-0002.
2. **One flag, and a release list.** `LEARNING_PUBLISHED` in `lib/site.ts` (named
   `STORYLINE_PUBLISHED` until 2026-11-01, when the series moved under the Learning section,
   FS-0012), false until the first episodes publish. While it is false, a production build leaves the
   nav item out and every page under `/learning` and every deck renders a 404. Same shape as
   `TRAINING_PUBLISHED`. Which episodes show is data: `RELEASED` in `lib/learning.ts` lists the
   switched-on episodes per series, and a module or series opens with its first one. Under
   `next dev` the section shows what a published build would, and every deck stays reachable for
   recording.
3. **A deck is data; the site draws it.** A deck has two halves. Its words (each step's time,
   every line on screen, the card headings) are in `content/decks/<locale>/<episode>.yaml`, which
   the owner edits without touching code. Its layout, `lib/decks/<episode>.ts`, places them by id on a
   1920×1080 stage with the step each appears and leaves at; adding a step or moving an element is a
   layout change. A Dutch deck is a translated YAML file on the same layout. `components/deck/` draws them with rough.js
   (seeded per element, so every render is the same drawing) and animates arrivals with CSS: strokes
   trace in, text writes on, cards rise. The handwriting face is Caveat, self-hosted via
   `@fontsource/caveat`. The deck route is `/<locale>/deck/<episode>`, under the locale so a Dutch deck can
   follow, but outside the `(site)` route group that carries the header and footer, so OBS captures
   the stage and nothing else. A locale without its own deck shows the English one.
4. **The same drawing serves the page.** The landing page renders the first deck at the step its
   layout names as the figure, as a static SVG on the server, with no client JavaScript.
5. **The format is tested.** `deckProblems()` rejects a deck with a step that changes nothing, an
   element under the camera corner, text on top of text, or a card that does not exist.
   `composeDeck()` rejects words and a layout that disagree (a step or id in one and not the other)
   and lists every mismatch with the file it is in.
6. **The presenter notes stay in the wiki and out of the build.** They live in the episode's
   `.slides.md` (one `▶` block per step), never in the deck's words file, which ships with the site.
   Under `npm run dev` a small Node server next to `next dev` (`scripts/notes-server.mjs`, 127.0.0.1
   only, the dev origin only) reads them for the presenter view and writes an edit back into the
   `▶` block it came from; a save that would overwrite a block changed on disk since the editor opened
   is refused once. The presenter view is compiled only when `NODE_ENV` is `development`. The site
   stays a static export (ADR-0001): the server is a dev tool, like `next dev` itself.

## Consequences

- The site chrome moved from `app/[locale]/layout.tsx` into the `(site)` route group; URLs are
  unchanged. The locale layout keeps only the locale check and the `lang` attribute.

- An episode deck is a code change reviewed like any other; a style change reaches every episode at
  once.
- Three dependencies: `roughjs` (about 9 kB gzipped, deck and landing pages only), `@fontsource/caveat`
  (OFL font files), and `yaml` (server-side only, reads the deck words; no client bytes).
- Text widths are estimated, so the camera-corner check is approximate; the estimate errs large.
- Recording happens on the owner's machine under `next dev`; the deck needs no deploy.
- The presenter view needs the wiki checked out next to this repository (or `WIKI_DIR`). Saves land in
  the wiki's working tree; committing them stays a manual step.
- The deck pages are part of the static export once the flag is true. They are not linked and carry
  `noindex`, but they are public.

## Alternatives considered

- **PowerPoint or Keynote.** Familiar, but the hand-drawn look and step builds are slow to make by
  hand and drift between episodes.
- **Excalidraw with an animation export.** The most hand-drawn look, but each diagram is drawn by
  hand and animated per file, with no shared style or data.
- **Copy the notes into the words file (`npm run notes`, until 2026-10-25).** One source to render
  from, but the notes then shipped with every deck page, the copy went stale between runs, and an
  edit had to go back to the wiki by hand.
- **A Next.js route handler for saving, enabled in development only.** No second process, but API
  routes are excluded by ADR-0001 and a dev-only route under `output: 'export'` is easy to break.
- **The whole deck in YAML or Markdown, positions included.** One file to edit, but coordinates and
  step numbers by hand in a text file break silently; a typed layout is checked by the compiler and
  the tests, and the words still sit in a plain file.
- **Code-to-video (Remotion, Motion Canvas).** Renders finished video with exact timing; heavier than
  needed while the episodes are recorded live, and a possible later step for the teasers.
- **Artifact slides read from the kit's downloads** (the first iteration, removed 2026-10-21). They
  kept a slide and its download in step, but the rebuilt series has no downloads.
