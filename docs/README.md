---
title: faridgurbanov.com documentation index
status: draft
last_updated: 2026-06-08
owners: [architect]
---

# faridgurbanov.com docs

Documentation index. This site is **spec-driven**: product intent precedes design precedes code.
Docs split into two planes — **Docs** (reference, you read) and **Delivery** (work, you track).

> This `docs/README.md` is for browsing the repo on GitHub; it is **not** a navigation surface.
> The in-app landing is [`overview.md`](./overview.md). Per the documentation standard, shelf
> folders (`product/`, `design/`, `reference/`, `guides/`) carry **no** README.

## Start here

- [`overview.md`](./overview.md) — what the site is, in ≤ 6 sentences
- [`../README.md`](../README.md) — repo orientation for humans
- [`../CODEBASE.md`](../CODEBASE.md) — directory map and entry points
- [`../GLOSSARY.md`](../GLOSSARY.md) — domain terms
- [`../AGENTS.md`](../AGENTS.md) — what agents may/may not do, how to run things

## Product — what we're building and why

Intent + functional specs (`kind: functional_spec`). Start with the
[product intent](./product/00-product-intent.md); the specs below decompose it.

| Spec | Title | Milestone |
|---|---|---|
| [00](./product/00-product-intent.md) | Product intent | — |
| [FS-0001](./product/FS-0001-site-shell-and-content-pipeline.md) | Bilingual site shell, navigation & content pipeline | M0 |
| [FS-0002](./product/FS-0002-home.md) | Home page | M0 → M1 |
| [FS-0003](./product/FS-0003-expertise.md) | Expertise pages | M0 |
| [FS-0004](./product/FS-0004-selected-work-case-studies.md) | Selected work / case studies | M0 |
| [FS-0005](./product/FS-0005-portfolio-repos.md) | Portfolio / repositories | M0 (gated, ADR-0004) |
| [FS-0006](./product/FS-0006-writing-blog.md) | Writing / blog | M0 |
| [FS-0007](./product/FS-0007-contact-and-privacy.md) | Contact & privacy/GDPR | M0 |
| [FS-0008](./product/FS-0008-training-and-eu-ai-act.md) | Training section & EU AI Act page | M0 stub → M1 full |

## Design — how it's built

Technical designs (`kind: technical_design`) and ADRs. Diagrams are Mermaid inside markdown.
No designs yet; the decisions are locked as ADRs under [`design/decisions/`](./design/decisions/).

| ADR | Decision |
|---|---|
| [0001](./design/decisions/0001-tech-stack-and-static-export.md) | Tech stack — Next 15 + Tailwind/shadcn + markdown, static export |
| [0002](./design/decisions/0002-bilingual-en-nl-i18n.md) | Bilingual EN/NL i18n |
| [0003](./design/decisions/0003-single-site-training-forward-positioning.md) | Single site, training-forward positioning (credibility-first first ship) |
| [0004](./design/decisions/0004-public-surface-prerequisites.md) | Public-surface prerequisites (gating the portfolio) |

## Reference

The exact lookup surface — API, schema/contracts, config. Currently empty; the
[glossary](../GLOSSARY.md) lives at the repo root as an agent-facing file. Reference content
lands here as the content model and routes stabilise.

## Guides

How-to, operations, and onboarding live under `guides/` (Diátaxis discipline is advisory here).
The shelf is currently empty — build, deploy, and content-authoring guides land here as the
toolchain settles.

## Delivery — the work

- [`delivery/roadmap/`](./delivery/roadmap/README.md) — milestones (M0 → M1) and per-milestone scoping docs
- [`delivery/backlog/`](./delivery/backlog) — epics → user stories; per-story status is tracked off-repo, not in a Markdown board

| Epic | Capability | Specs |
|---|---|---|
| [EP-00 — Foundation & shell](./delivery/backlog/EP-00-foundation-and-shell/README.md) | Scaffold, bilingual shell, content pipeline, static export, hosting | FS-0001 |
| [EP-01 — Content pages](./delivery/backlog/EP-01-content-pages/README.md) | Home, expertise, case studies, portfolio, writing, contact/privacy | FS-0002…FS-0007 |
| [EP-02 — Training & EU AI Act](./delivery/backlog/EP-02-training/README.md) | Training CTA stub (M0) → full Training section + EU AI Act page (M1) | FS-0008 |

- [`delivery/issues/`](./delivery/issues/README.md) — `ISSUE-NNNN` (defects, with RCA) + `LIMITATION-NNNN` (accepted constraints)
