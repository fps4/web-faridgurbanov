---
title: "0002: Bilingual EN/NL with i18n routing"
status: accepted
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
---

# ADR-0002 — Bilingual EN/NL with i18n routing

## Context

An earlier strategy draft proposed English-only and cutting the i18n machinery (the owner's Dutch
is A2–B1). But the site now carries a **training practice targeting the NL market**, where Dutch
L&D buyers weight a Dutch-language / `.nl` presence as "present in NL," and Dutch SEO matters for
intent like "AI training productteam" and "EU AI Act training medewerkers." The owner confirmed
**full bilingual EN/NL** for the first build (2026-06-07).

## Decision

The site is **bilingual EN/NL with i18n routing** (`/en/...`, `/nl/...`) from M0:

- Locale-segmented routes with a configured default locale and a language switcher that preserves
  the current page across the switch (FS-0001).
- Content lives under `/content/{en,nl}/...`; the i18n library is added to the maestro/web base
  (e.g. `next-intl` or App-Router `[locale]` segments) — **whichever is verified compatible with
  `output: 'export'`** (ADR-0001).
- **Translation is scoped to value:** marketing, training, contact, privacy, and home are
  first-class in both languages; deep technical prose may **lag in Dutch and fall back to
  English** rather than block a release (FS-0001 fallback rule).

## Consequences

- Reverses the "cut i18n" position and aligns with the `overview.md` "multilingual" framing.
- Adds translation/upkeep cost — mitigated by the scoped-translation + fallback rule.
- The i18n choice constrains the stack to static-export-compatible i18n; verify before adopting.
- Enables the phased `.nl` training domain and NL SEO landing pages (M1+).

## Spike note — i18n × static export (US-0001, 2026-06-07)

US-0001's last acceptance criterion required confirming the chosen i18n approach is compatible with
`output: 'export'` before US-0002 builds the shell. **Result: confirmed.**

**Chosen approach: native App-Router `[locale]` segments — no i18n library.** The spike added
`app/[locale]/page.tsx` with `generateStaticParams()` returning `en` and `nl` plus
`export const dynamicParams = false`. `npm run build` pre-renders both locales as static HTML
(`out/en.html`, `out/nl.html`) — verified in the build output (`● /[locale]` → `/en`, `/nl`,
marked SSG) and in `out/`. No server, no middleware, no runtime locale negotiation, which is exactly
what `output: 'export'` requires.

Why not a library: `next-intl` *does* support static export, but only with care (it leans on
`middleware.ts` for locale negotiation/redirects in its default setup, and middleware does not run in
a static export — you must use its no-middleware/static config). Plain `[locale]` segments avoid that
incompatibility class entirely and carry zero dependency/upkeep cost. The owner's scoped-translation
+ English-fallback rule (above) is plain data/routing logic that does not need a runtime i18n library.

**Implication for US-0002:** build the bilingual shell on `[locale]` segments. The default-locale
entry and the language switcher that preserves page identity (FS-0001) are implemented as static
links / `generateStaticParams`, not middleware redirects. Root `/` is a static placeholder today;
US-0002 decides whether it renders the default locale directly or links into `/en` `/nl`.

**Fallback (per the Notes in US-0001):** none needed — the preferred approach is compatible, so no
follow-up fallback choice is recorded.
