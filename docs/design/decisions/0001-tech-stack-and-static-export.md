---
title: "0001: Tech stack — Next 15 + Tailwind/shadcn + markdown, static export"
status: accepted
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/design/decisions/0002-bilingual-en-nl-i18n.md
---

# ADR-0001 — Tech stack & static export

## Context

The site must be a credibility piece (clean, fast, on the open stack the owner recommends to
clients), cheap and operationally free to run, and authorable as filesystem markdown by both the
owner and an implementing agent. The old webapp (`../faridgurbanov-webapp/`) is heavier than a
personal site needs (yarn, Docker/compose, "FPS Delivery Hub" framing). The `../maestro/web/`
stack is the simpler open base.

## Decision

Build on the maestro/web base, exported static:

```
Next.js 15 (App Router) + React 19
Tailwind 3 + shadcn/ui
react-markdown + remark-gfm
@tailwindcss/typography
output: 'export'   (static files on a CDN)
npm (not yarn), no Docker
```

- **Reuse maestro/web's `package.json`** as the base; drop the maestro-only dep
  (`react-diff-viewer-continued`); add the i18n library (ADR-0002).
- **Content is filesystem markdown** under `/content/{en,nl}/...`, rendered by `react-markdown`.
  No CMS, no database.
- **`output: 'export'`** → static HTML/CSS/JS on a CDN (Cloudflare Pages preferred). No server,
  no uptime concern.

## Consequences

- Free/near-free hosting; nothing to operate; the stack itself is part of the pitch.
- Constraint: **every feature must work under static export** — no server-side runtime, no API
  routes, no SSR-only features. Contact submission uses a static-friendly third-party mechanism
  (FS-0007). The chosen i18n approach must be static-export-compatible (ADR-0002).
- Content changes are git + markdown, no deploy pipeline beyond the static build.
