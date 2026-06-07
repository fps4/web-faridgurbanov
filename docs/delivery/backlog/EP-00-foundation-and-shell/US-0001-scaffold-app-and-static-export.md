---
title: "US-0001: Scaffold app from maestro/web base with static export"
persona: architect
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0001-site-shell-and-content-pipeline.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As the architect,
I want a Next.js 15 app scaffolded from the maestro/web base and configured for static export,
so that every later page builds on a clean, free-to-host foundation with no server to operate.

## Context

Prerequisite for every other story. Reuse maestro/web's `package.json`, drop
`react-diff-viewer-continued`, keep Tailwind + shadcn + react-markdown + remark-gfm +
`@tailwindcss/typography`; use npm, no Docker (ADR-0001). The main risk is confirming the i18n
approach (US-0002) is compatible with `output: 'export'` — spike it here.

## Acceptance criteria (EARS)

- WHEN the project is built with `npm run build`, THE SYSTEM SHALL emit a fully static export
  (`output: 'export'`) with no server-side runtime or API routes.
- THE SYSTEM SHALL be based on Next.js 15 (App Router) + React 19 + Tailwind 3 + shadcn/ui, using
  npm and without Docker.
- THE SYSTEM SHALL NOT include the maestro-only dependency `react-diff-viewer-continued`.
- THE static export SHALL deploy to and serve from a CDN preview (Cloudflare Pages) with no
  backend.
- THE scaffold SHALL include a documented decision/spike confirming the chosen i18n library is
  static-export-compatible (feeds US-0002).

## Out of scope

- Actual page content, navigation, and i18n wiring (US-0002, US-0003 and EP-01).

## Notes

If the preferred i18n library proves incompatible with static export, record the fallback choice
as a follow-up note to ADR-0002 before US-0002 starts.
