---
title: "FS-0002 — Home page"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/product/FS-0008-training-and-eu-ai-act.md
maestro:
  feature: home-page
  kind: functional_spec
  summary: |
    The front door. In M0 it leads with credibility — a hero that says "integration architect
    who builds AI", an "available now" signal, links into the strongest case studies and the
    portfolio, and a single low-key "book a taster" call-to-action for training. In M1 the same
    page flips to lead with the training offer, with the architect track record as the proof
    beneath it. One page, two configured emphases tied to the milestone.
---

# FS-0002 — Home page

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

The home page is where all three audiences land. The product intent sets a **training-forward
target** but a **credibility-first first ship**, because the training sale depends on architect
proof that is shippable immediately. The home page must express both phases without a rewrite
between them.

## Scope

1. **M0 — credibility hero.** Headline positioning the owner as an integration architect who
   *builds* AI (not just advises); a short sub-line; an **"Available now"** availability block;
   primary CTAs into Selected Work (FS-0004) and Contact (FS-0007); a **single understated
   "Book a taster" training CTA** linking to the Training stub (FS-0008).
2. **M0 — proof strip.** A compact set of headline proof points (e.g. Cloud Gateway scale, the
   AI trio) linking into case studies and portfolio.
3. **M1 — training-forward flip.** The hero leads with the training offer ("AI training for
   product & architecture teams — taught by an architect who ships"); the architect credibility
   moves to a supporting proof block; CTAs lead to the Training section and taster booking.
4. **Bilingual.** Full EN/NL content for the home page (it is the highest-traffic page).

## Out of scope

- The Training section content itself (FS-0008) and case-study detail pages (FS-0004).
- Any A/B testing or personalization.

## Acceptance criteria (EARS)

- WHILE the site is in its M0 configuration, THE home page SHALL lead with the credibility hero
  (integration-architect-who-builds-AI positioning) and SHALL display an "Available now" block.
- WHILE the site is in its M0 configuration, THE home page SHALL present training as a single
  understated "Book a taster" CTA linking to the Training stub, and SHALL NOT foreground the
  full offer ladder.
- WHILE the site is in its M1 configuration, THE home page SHALL lead with the training offer and
  SHALL present the architect track record as supporting proof beneath it.
- THE home page SHALL provide primary calls-to-action into Selected Work and Contact in both
  milestone configurations.
- THE home page SHALL display a proof strip linking to at least two case studies and the
  portfolio section.
- THE home page SHALL be fully available in both English and Dutch.
- WHEN the milestone configuration changes from M0 to M1, THE home page SHALL switch emphasis
  via configuration/content, not require a structural rebuild.

## Definition of done

- M0 home renders the credibility hero, availability block, proof strip, and taster CTA stub in
  EN and NL.
- The M1 training-forward variant is reachable by a single configuration/content switch (it may
  remain content-incomplete until M1, but the mechanism exists).
- All CTAs resolve to live targets (Contact, Selected Work, Training stub).
