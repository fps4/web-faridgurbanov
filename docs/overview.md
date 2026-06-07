---
title: faridgurbanov.com overview
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/README.md
  - docs/product/00-product-intent.md
  - docs/design/README.md
  - docs/delivery/roadmap/README.md
---

# faridgurbanov.com

A bilingual (EN/NL) personal site and single credibility surface for three buyer journeys —
**training buyers** (L&D / EA leads), **hiring/contract** (recruiters, hiring managers), and
**build-service clients** — under one brand: *the architect who builds AI and teaches teams to
direct it*. It is a **static-exported** Next.js 15 site (no server, no database; markdown
content rendered at build time, hosted on a CDN). The **target** home is training-forward, but
the **first ship (M0)** leads with credibility (selected work + portfolio) and carries training
as a CTA stub; the training-forward home and full Training section land in **M1**.

Start with [Product](product/00-product-intent.md) for intent and the functional specs, the
[Design](design/README.md) plane for the locked technical decisions (ADRs), or the
[Roadmap](delivery/roadmap/README.md) for the M0/M1 plan. The strategy this product
implements lives in `wiki/job-search-and-upskilling/personal-website-strategy.md`.
