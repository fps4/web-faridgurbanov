---
title: "EP-03 — AI Product Design storyline"
status: open
last_updated: 2026-10-21
owners: [architect]
related:
  - docs/delivery/roadmap/README.md
  - docs/product/FS-0010-ai-product-design-storyline.md
  - docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
  - docs/product/FS-0011-storyline-feedback.md
---

# EP-03 — AI Product Design storyline

The site's main section for the coming months: the storyline landing page with its six modules, and
the episode decks the owner records over. Implements FS-0010 under ADR-0010, gated by
`STORYLINE_PUBLISHED` until the first module is published. Rebuilt 2026-10-21: the eight parts, their
part page, their sixteen decks and the kit downloads were removed; the first deck of the rebuild is
3.1, *Data requirements*.

## Stories

| Story | Title | Spec |
|---|---|---|
| US-0030 | Storyline section: nav item and landing page with the six modules | FS-0010 §1, 2, 5, 6 |
| US-0031 | Episode deck engine and the 3.1 deck | FS-0010 §3, 4 |
| US-0032 | Episode video on a module page, loaded after a click | FS-0010 (out of scope for now) |
| US-0033 | ~~PDF and DOCX downloads built from the kit~~ | dropped 2026-10-21: no downloads in the rebuild |
| US-0034 | Feedback section, and the privacy-page line | FS-0011 §1, 2, 8 (parked) |

(US-0030 and US-0031 land together as the prototype; US-0032 and US-0034 are stubs. FS-0011 was
written for the first iteration and is parked.)
