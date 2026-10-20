---
title: "US-0031: Episode deck engine and the 1.1 deck"
persona: architect
status: in-review
complexity: M
milestone: M1
last_updated: 2026-10-20
spec: docs/product/FS-0010-ai-product-design-storyline.md
design: docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
---

## Story

As the owner recording an episode,
I want a deck that draws its diagram step by step in a hand-drawn style while I talk, with my
downloads as slides in the same look,
so that sixteen episodes look like one series and nobody watches a slide sit still.

## Context

Decks are data (`lib/decks/`), drawn by `components/deck/` with rough.js and CSS animation, recorded
from `next dev` with OBS. The 1.1 deck follows the script in the wiki
(`publishing/ai-product-design/episodes/1.1-fund-one-decision.md`).

## Acceptance criteria (EARS)

- WHEN the presenter advances, THE stage SHALL draw the arriving elements in order and fade the
  leaving ones; WHEN they step back, THE stage SHALL show the earlier step still.
- THE stage SHALL keep the bottom-right camera corner clear on every step.
- THE presenter view SHALL show the cue, the next cue, the script time and a clock, and SHALL stay in
  step with the stage.
- THE build SHALL fail WHEN a deck breaks the format (FS-0010 acceptance criteria).
- THE deck page SHALL carry `noindex, nofollow`.
