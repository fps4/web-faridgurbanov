---
title: "0003: Single site, training-forward target, credibility-first first ship; phased .nl"
status: accepted
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0008-training-and-eu-ai-act.md
---

# ADR-0003 — Single site, training-forward positioning, phased `.nl`

## Context

The owner runs three legs off one brand — training, contract/hire, and a year-2 build service —
and is simultaneously job-applying (15 applications, 5 role clusters) and launching a training
practice. Two questions had to be settled: (1) what does the brand/home lead with, and (2) one
site or a separate training brand/domain.

## Decision

1. **One site, one brand** — *"the architect who builds AI and teaches teams to direct it."* The
   three audiences are journeys on one site, not separate brands. Two thin sites lose to one
   strong one.
2. **Training-forward *target* positioning** (owner-confirmed 2026-06-07): the eventual home leads
   with the training offer, architect track record as the proof beneath it; two tiers (EA premium,
   PO breadth).
3. **Credibility-first *first ship* (M0):** because the training sale depends on architect proof
   that is shippable now, M0 leads with credibility (selected work + portfolio + expertise) and
   carries training as a CTA stub. The training-forward home + full Training section land in **M1**
   (FS-0002, FS-0008).
4. **Phased `.nl` domain:** register a descriptive `.nl` (+ optional brandable) now and park it
   redirecting to `/training`; a dedicated landing page at Phase 3; a standalone `.nl` product site
   only at Phase 4 (public cohorts). The `.nl` is a brand/SEO asset to grow into, not a launch
   prerequisite — and the standalone site is a *separate future product*, not this one.

## Consequences

- Resolves the apparent tension (lead with training vs. ship credibility first) by sequencing it
  across M0→M1; FS-0002 is built so the emphasis flips by configuration, not rebuild.
- Keeps the brand un-split, so training credibility and contract credibility compound.
- The `.nl` standalone site is explicitly out of scope for this product.
