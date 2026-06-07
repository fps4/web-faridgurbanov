---
title: "M1 — Training-forward"
status: open
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/delivery/roadmap/README.md
  - docs/delivery/roadmap/m0-credibility-foundation.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0008-training-and-eu-ai-act.md
  - docs/design/decisions/0003-single-site-training-forward-positioning.md
---

# M1 — Training-forward

## Goal

Flip the site to its target positioning: the home leads with the training offer (architect proof
beneath), and a full Training section + EU AI Act page go live — turning the M0 credibility base
into the paid front-of-funnel (ADR-0003). Opens after M0 is live **and** there is at least initial
training validation (per the training strategy's launch sequence).

## Deliverables → specs

| Deliverable | Spec |
|---|---|
| Home flips to training-forward hero (proof moves to supporting block) | FS-0002 (M1) |
| Full Training section — two tiers (EA premium, PO breadth) + offer ladder | FS-0008 (M1) |
| "Why me" build-proof block linking the portfolio | FS-0008 + FS-0005 |
| EU AI Act plain-language page (SEO + lead magnet, capability-first) | FS-0008 (M1) |
| Deepen case studies | FS-0004 |
| NL SEO landing pages (incl. Brabant/Eindhoven) | FS-0001 + FS-0008 |

## Depends on

- M0 complete (the credibility base the training-forward home stands on).
- FS-0002 built so the M0→M1 emphasis flips by configuration, not rebuild.

## What M1 does NOT ship

- Per-seat checkout / public course schedule and the standalone `.nl` product site — training
  Phase 4, a *separate future product* (ADR-0003).
- Workshop testimonials / `/cases` — added incrementally as workshops are delivered.

## Definition of "M1 complete"

1. The home leads with the training offer; architect track record is supporting proof; the flip
   was a configuration/content change, not a rebuild.
2. The Training section presents both tiers and the outcome-framed offer ladder, with the why-me
   build-proof block, all bilingual.
3. The EU AI Act page is live, plain-language, capability-first with honest compliance caveats.
4. All training/AI-Act CTAs route to the taster booking path (FS-0007).
