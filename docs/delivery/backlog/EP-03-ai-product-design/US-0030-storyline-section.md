---
title: "US-0030: Storyline section — nav item, index and part page"
persona: architect
status: in-review
complexity: M
milestone: M1
last_updated: 2026-10-20
spec: docs/product/FS-0010-ai-product-design-storyline.md
design: docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
---

## Story

As a sponsor who arrived from a LinkedIn teaser,
I want one page per part with the idea, the example, the episodes and the downloads,
so that I can take the step to my own meeting without reading anything else first.

## Context

The section leads the header while the storyline is published part by part. Part texts are English
first (ADR-0010); `lib/storyline.ts` holds the parts, episodes and downloads; the chapter text is
`content/en/ai-product-design/<slug>.md`.

## Acceptance criteria (EARS)

- WHILE `STORYLINE_PUBLISHED` is false, THE production build SHALL NOT show the nav item AND SHALL
  render the index and part pages as a 404.
- WHILE the storyline renders, THE header SHALL list "AI Product Design" first.
- THE index SHALL list all eight parts, linking those with a page.
- THE part page SHALL show the diagram, the chapter text, the episodes and the downloads before
  "In your organisation".
- WHEN a Dutch route is requested, THE page SHALL show the English text with the fallback notice.
