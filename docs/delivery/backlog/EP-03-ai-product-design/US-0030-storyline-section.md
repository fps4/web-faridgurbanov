---
title: "US-0030: Storyline section — nav item and landing page"
persona: architect
status: in-review
complexity: M
milestone: M1
last_updated: 2026-10-21
spec: docs/product/FS-0010-ai-product-design-storyline.md
design: docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
---

## Story

As an engineer who arrived from a teaser,
I want one page that says what the series is, who it is for, and which of the six modules to start
with,
so that I can pick the module I need without reading the others first.

## Context

The section leads the header while the storyline is published module by module. The text is English
only (ADR-0010); `lib/storyline.ts` holds the modules and their episodes; the landing text is
`content/en/ai-product-design/index.md`. Module pages follow once a module's text is written.

## Acceptance criteria (EARS)

- WHILE `STORYLINE_PUBLISHED` is false, THE production build SHALL NOT show the nav item AND SHALL
  render the index and part pages as a 404.
- WHILE the storyline renders, THE header SHALL list "AI Product Design" first.
- THE landing page SHALL list all six modules with their number of episodes.
- WHEN a Dutch route is requested, THE page SHALL show the English text with the fallback notice.
