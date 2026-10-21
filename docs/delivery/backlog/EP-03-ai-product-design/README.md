---
title: "EP-03 — AI Product Design storyline"
status: open
last_updated: 2026-10-20
owners: [architect]
related:
  - docs/delivery/roadmap/README.md
  - docs/product/FS-0010-ai-product-design-storyline.md
  - docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
  - docs/product/FS-0011-storyline-feedback.md
---

# EP-03 — AI Product Design storyline

The site's main section for the coming months: the storyline index, one page per part, and the
episode decks the owner records over. Implements FS-0010 under ADR-0010, gated by
`STORYLINE_PUBLISHED` until Part 1 is published.

## Stories

| Story | Title | Spec |
|---|---|---|
| US-0030 | Storyline section: nav item, index and part page (Part 1) | FS-0010 §1, 2, 5, 6 |
| US-0031 | Episode deck engine and the 1.1 deck; then the decks of all sixteen first-cut episodes | FS-0010 §3, 4 |
| US-0032 | Episode video on the part page, loaded after a click | FS-0010 (out of scope for now) |
| US-0033 | PDF and DOCX downloads built from the kit | FS-0010 (out of scope for now) |
| US-0034 | Feedback section on the part page, and the privacy-page line | FS-0011 §1, 2, 8 |

(US-0030 and US-0031 land together as the prototype; US-0032, US-0033 and US-0034 are stubs. FS-0011
§3–7 are kit and owner work outside this repository.)
