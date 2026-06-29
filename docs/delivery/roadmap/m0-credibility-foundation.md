---
title: "M0 — Credibility foundation"
status: open
last_updated: 2026-06-09
owners: [architect]
related:
  - docs/delivery/roadmap/README.md
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/design/decisions/0003-single-site-training-forward-positioning.md
---

# M0 — Credibility foundation

## Goal

A bilingual (EN/NL), static-exported site live on the ds1 Docker host that establishes architect credibility —
home (credibility hero), expertise, 3–4 case studies, portfolio, contact + minimal privacy, and
one writing post. **Training appears only as a "book a taster" CTA stub.** This is the proof base
the training-forward M1 will stand on (ADR-0003).

## Deliverables → specs

| Deliverable | Spec |
|---|---|
| Bilingual shell, nav, markdown content pipeline, static export | FS-0001 |
| Home — credibility hero + "available now" + taster CTA stub | FS-0002 (M0) |
| Five expertise pages + index (AI/automation promoted to peer) | FS-0003 |
| 3–4 case studies + index (Cloud Gateway, SAP→Snowflake, Cloudera Kafka, AI trio) | FS-0004 |
| Portfolio — three repo cards, govern→build→deliver, links gated | FS-0005 + ADR-0004 |
| Writing index + one training-wedge post | FS-0006 |
| Contact + minimal GDPR/privacy page | FS-0007 |
| Training "book a taster" CTA stub | FS-0008 (M0) |

## Cross-cutting / setup

- `faridgurbanov.com` and `faridgurbanov.nl` are owned — point the `.com` DNS at the host and park
  the `.nl` redirecting to `/training` (ADR-0003).
- Build the static export into an nginx image and deploy it to the ds1 Docker host via the
  self-hosted runner (`infra/docker/`, `.github/workflows/deploy-ds1.yml`).
- Choose a static-export-compatible i18n approach (ADR-0001/0002) — **verify compatibility before
  adopting**; this is the main technical risk in M0.
- Migrate portable content from the previous site; author NL.

## What M0 does NOT ship

- The training-forward home and the full Training section / EU AI Act page — **M1** (FS-0002 M1,
  FS-0008 M1).
- Live repo links **if** the public-surface prerequisites (ADR-0004) are not yet closed — cards
  ship description-only until then.
- NL SEO landing pages, `/cases` workshop write-ups, per-seat checkout — M1+ / separate product.

## Definition of "M0 complete"

1. `npm run build` produces a static export serving `/en` and `/nl` from the ds1 Docker host
   (nginx) with no application backend.
2. Home (credibility), five expertise pages, 3–4 case studies, portfolio, contact + privacy, and
   one writing post are live and bilingual (NL may fall back per ADR-0002).
3. The training CTA stub is reachable from the home page and routes to Contact.
4. Repo links respect ADR-0004 (absent until prerequisites close; enabled by one config change).
5. The domain points at the deployed site.
