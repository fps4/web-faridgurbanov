---
title: faridgurbanov.com overview
status: draft
last_updated: 2026-06-08
owners: [architect]
related:
  - docs/README.md
  - docs/product/00-product-intent.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/delivery/roadmap/README.md
---

# faridgurbanov.com

A bilingual (EN/NL) personal site and single credibility surface for three buyer journeys —
**training buyers** (L&D / EA leads), **hiring/contract** (recruiters, hiring managers), and
**build-service clients** — under one brand: *the architect who builds AI and teaches teams to
direct it*. It is a **static-exported** Next.js 15 site (no application server, no database;
markdown content rendered at build time, served by nginx on the ds1 Docker host). The **target** home is training-forward, but
the **first ship (M0)** leads with credibility (selected work + portfolio) and carries training
as a CTA stub; the training-forward home and full Training section land in **M1**.

Start with the [product intent](product/00-product-intent.md) for the *what & why*, the
[ADRs](design/decisions/) for the locked technical decisions, or the
[roadmap](delivery/roadmap/README.md) for the M0/M1 plan — see the
[docs index](README.md) for the full map.
