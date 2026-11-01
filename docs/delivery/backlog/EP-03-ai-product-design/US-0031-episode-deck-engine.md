---
title: "US-0031: Episode deck engine and the 3.1 deck"
persona: architect
status: in-review
complexity: M
milestone: M1
last_updated: 2026-10-25
spec: docs/product/FS-0010-ai-product-design-storyline.md
design: docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
---

## Story

As the owner recording an episode,
I want a deck that draws its diagrams step by step in a hand-drawn style while I talk, and closes on
one card,
so that every episode looks like one series and nobody watches a slide sit still.

## Context

Decks are data (words in `content/decks/<locale>/<episode>.yaml`, layout in `lib/decks/`), drawn by
`components/deck/` with rough.js and CSS animation, recorded from `next dev` with OBS. Each deck
follows its episode's script in the wiki (`publishing/ai-product-design/episodes/<module>/<nn>-*.md`).
The first iteration's sixteen decks (1.1–8.2) were removed on 2026-10-21; the rebuild starts with
3.1, *Data requirements* (wiki `episodes/03-data/01-data-requirements.slides.md`).

## Acceptance criteria (EARS)

- WHEN the presenter advances, THE stage SHALL draw the arriving elements in order and fade the
  leaving ones; WHEN they step back, THE stage SHALL show the earlier step still.
- THE stage SHALL keep the bottom-right camera corner clear on every step.
- THE presenter view SHALL show the step's presenter notes as bullets (read live from the wiki's
  `.slides.md` through the dev-only notes server), the next step's first note, the planned time and a
  clock, and SHALL stay in step with the stage.
- WHEN the owner presses `e` in the presenter view, edits the click's notes and presses ⌘↵, THE
  notes SHALL be saved into that click's ▶ block in the wiki file (FS-0010 acceptance criteria).
- THE presenter view SHALL exist under `next dev` only; a production build SHALL carry no notes.
- THE build SHALL fail WHEN a deck breaks the format (FS-0010 acceptance criteria).
- THE deck page SHALL carry `noindex, nofollow`.
