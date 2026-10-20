---
title: "0010: The storyline ships English first, gated, and its episode decks are data rendered by the site"
status: proposed
last_updated: 2026-10-20
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
   has no Dutch file. The owner deferred Dutch for the storyline (2026-10-20): the parts publish in
   English first.
2. **When it shows.** Part 1 is screened privately before it is published, and the main branch keeps
   deploying to ds1 for every other change.
3. **How the episodes are made.** Each episode is slides with the talking head in a corner: one
   diagram that builds while the owner speaks, and the part's downloads shown as slides. The owner
   wants every episode in the same style, with the diagram drawing itself in a hand-drawn look fast
   enough that nobody waits for a hand.

## Decision

1. **English first, through the existing fallback.** The part texts live only in `content/en/`;
   Dutch routes render them with the fallback notice. The section's short labels are written in both
   languages. No change to ADR-0002.
2. **One flag.** `STORYLINE_PUBLISHED` in `lib/site.ts`, false until Part 1 publishes. While it is
   false, a production build leaves the nav item out and every storyline route renders a 404; under
   `next dev` everything shows. Same shape as `TRAINING_PUBLISHED`.
3. **A deck is data; the site draws it.** `lib/decks/<episode>.ts` places elements on a 1920×1080
   stage with the step each appears and leaves at. `components/deck/` draws them with rough.js
   (seeded per element, so every render is the same drawing) and animates arrivals with CSS: strokes
   trace in, text writes on, cards rise. The handwriting face is Caveat, self-hosted via
   `@fontsource/caveat`. The deck route is `/<locale>/deck/<episode>`, under the locale so a Dutch deck can
   follow, but outside the `(site)` route group that carries the header and footer, so OBS captures
   the stage and nothing else. A locale without its own deck shows the English one.
4. **The same drawing serves the page.** The part page renders the first episode's deck at its
   finished step as a static SVG on the server, with no client JavaScript.
5. **Artifact slides come from the kit's text.** A card names a kit file, a heading and row labels;
   the build reads the rows from `content/kit/`, a snapshot `scripts/sync-kit.mjs` copies from the kit
   repository. The build stays offline (ADR-0001), and a test fails when a card names a row the
   download no longer has.
6. **The format is tested.** `deckProblems()` rejects a deck with a step that changes nothing, an
   element under the camera corner, or a card that does not exist.

## Consequences

- The site chrome moved from `app/[locale]/layout.tsx` into the `(site)` route group; URLs are
  unchanged. The locale layout keeps only the locale check and the `lang` attribute.

- An episode deck is a code change reviewed like any other; a style change reaches all sixteen
  episodes at once.
- Two dependencies: `roughjs` (about 9 kB gzipped, deck and part pages only) and `@fontsource/caveat`
  (OFL font files).
- The snapshot can lag the kit. It is refreshed by hand, and the test only catches missing rows, not
  changed wording.
- Text widths are estimated, so the camera-corner check is approximate; the estimate errs large.
- Recording happens on the owner's machine under `next dev`; the deck needs no deploy.
- The deck pages are part of the static export once the flag is true. They are not linked and carry
  `noindex`, but they are public.

## Alternatives considered

- **PowerPoint or Keynote.** Familiar, but the hand-drawn look and step builds are slow to make by
  hand and drift between episodes; every change to a download is a redraw.
- **Excalidraw with an animation export.** The most hand-drawn look, but each diagram is drawn by
  hand and animated per file, with no shared style or data.
- **Code-to-video (Remotion, Motion Canvas).** Renders finished video with exact timing; heavier than
  needed while the episodes are recorded live, and a possible later step for the teasers.
