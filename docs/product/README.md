---
title: Product — intent & functional specs
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/overview.md
  - docs/design/README.md
---

# Product

The **what & why**: product intent and functional specs (`kind: functional_spec`). Product
intent precedes design precedes code. Each functional spec carries the `maestro:` frontmatter
block (`feature`, `kind: functional_spec`, `summary`) and EARS-format acceptance criteria.

Start with the [product intent](00-product-intent.md) — it sets the positioning, audiences, and
constraints the specs below decompose.

| Spec | Title | Milestone |
|---|---|---|
| [00](00-product-intent.md) | Product intent | — |
| [FS-0001](FS-0001-site-shell-and-content-pipeline.md) | Bilingual site shell, navigation & content pipeline | M0 |
| [FS-0002](FS-0002-home.md) | Home page | M0 → M1 |
| [FS-0003](FS-0003-expertise.md) | Expertise pages | M0 |
| [FS-0004](FS-0004-selected-work-case-studies.md) | Selected work / case studies | M0 |
| [FS-0005](FS-0005-portfolio-repos.md) | Portfolio / repositories | M0 (gated, ADR-0004) |
| [FS-0006](FS-0006-writing-blog.md) | Writing / blog | M0 |
| [FS-0007](FS-0007-contact-and-privacy.md) | Contact & privacy/GDPR | M0 |
| [FS-0008](FS-0008-training-and-eu-ai-act.md) | Training section & EU AI Act page | M0 stub → M1 full |

Locked technical decisions live in [`../design/decisions/`](../design/decisions/README.md);
the M0/M1 plan in [`../delivery/roadmap/`](../delivery/roadmap/README.md).
