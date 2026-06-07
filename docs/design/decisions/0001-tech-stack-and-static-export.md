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
owner and an implementing agent. The previous personal site was heavier than a personal site
needs (yarn, Docker/compose, heavyweight framing). The `../maestro/web/` stack is the simpler open
base.

## Decision

Build on the maestro/web base, exported static:

```
Next.js 15 (App Router) + React 19
Tailwind 3 + shadcn/ui
react-markdown + remark-gfm
@tailwindcss/typography
output: 'export'   (static HTML/CSS/JS, no app server)
npm (not yarn); packaged as a thin nginx image, run on the ds1 Docker host
```

- **Reuse maestro/web's `package.json`** as the base; drop the maestro-only dep
  (`react-diff-viewer-continued`); add the i18n library (ADR-0002).
- **Content is filesystem markdown** under `/content/{en,nl}/...`, rendered by `react-markdown`.
  No CMS, no database.
- **`output: 'export'`** → static HTML/CSS/JS with no application server. The export is served by
  a minimal **nginx** container on the **ds1 Docker host**, built and deployed by the self-hosted
  GitHub Actions runner (`[self-hosted, ds1]`) on merge to `main` (see
  `infra/docker/` and `.github/workflows/deploy-ds1.yml`). Docker appears only at the serving
  edge — the app itself stays a pure static export.

## Consequences

- Self-hosted on ds1: near-zero marginal hosting cost, with a small ops surface (the nginx
  container plus the host's reverse proxy / TLS). The clean static stack is still part of the pitch.
- Constraint: **every feature must work under static export** — no server-side runtime, no API
  routes, no SSR-only features. Contact submission uses a static-friendly third-party mechanism
  (FS-0007). The chosen i18n approach must be static-export-compatible (ADR-0002).
- Content changes are git + markdown; a push to `main` rebuilds the image and redeploys via the
  runner — no manual server steps.
