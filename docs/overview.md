---
title: faridgurbanov.com overview
status: draft
last_updated: 2026-11-22
owners: [architect]
related:
  - docs/README.md
  - docs/product/00-product-intent.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/delivery/roadmap/README.md
---

# faridgurbanov.com

A bilingual (EN/NL) personal site with one job: a visitor who can hire or recommend the owner
decides to get in touch. He presents himself as a Platform and Integration Architect. The site
serves three readers (hiring manager, peer, recruiter), is Home, Work, Practice and Contact, and
carries no courses, no labs and no portfolio section ([ADR-0010](design/decisions/0010-the-site-has-one-job.md)).
It is a **static-exported** Next.js 15 site (no application server, no database; markdown content
rendered at build time, served by nginx on the ds1 Docker host). The pages are being cut to this
shape story by story, each when its copy is approved.

Start with the [product intent](product/00-product-intent.md) for the *what & why*, the
[ADRs](design/decisions/) for the locked decisions, or the [docs index](README.md) for the full
map.
