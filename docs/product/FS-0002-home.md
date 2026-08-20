---
title: "FS-0002 — Home page"
status: draft
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/product/FS-0008-training-and-eu-ai-act.md
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
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
2. **M0 — proof strip.** A compact set of headline proof points linking into case studies and
   the portfolio. Rebalanced under ADR-0005: three points about adoption and trust (teams moved
   without a mandate, estates brought onto one contract, a function that had to trust the output)
   and one about scale. The scale metric stays — it is what makes the adoption claims credible.
2a. **M0 — three bands, in order (ADR-0007).** Under the hero: **Track record** (experience — the
   metrics), **How I get it adopted** (stakeholder management — the situations), then **What I
   build** (technical expertise — the five areas plus a portfolio tile). The technical band is last
   deliberately: it is the half nobody doubts.
2b. **M0 — optional intro video (ADR-0007).** A self-hosted `<video>` directly under the hero,
   feature-gated on `INTRO_VIDEO`; renders nothing until a recording exists. No third-party player.
2c. **M0 — adoption band.** A section below the proof strip answering the question a metric
   cannot: whether the owner can carry an organisation. Three cards, each naming a real
   disagreement and what resolved it, each linking to the case study that carries the full
   "Who had to say yes" section, plus a link to the practice page (FS-0003).
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
- THE home page hero SHALL state both the build claim and the adoption claim, and THE hero lede
  SHALL substantiate the adoption claim with specifics rather than assert it as an adjective.
- THE home page SHALL display an adoption band of at least three entries, EACH naming a
  cross-organisation situation and linking to the case study or practice page that evidences it.
- THE home page SHALL present its bands in the order track record, adoption, then technical areas
  (ADR-0007).
- WHILE no intro video is configured, THE home page SHALL render no video section at all.
- WHERE an intro video is configured, THE player SHALL be self-hosted, SHALL NOT autoplay, and
  SHALL carry a caption track for the active locale.
- THE home page SHALL be fully available in both English and Dutch.
- WHEN the milestone configuration changes from M0 to M1, THE home page SHALL switch emphasis
  via configuration/content, not require a structural rebuild.

## Definition of done

- M0 home renders the credibility hero, availability block, proof strip, adoption band, and
  taster CTA stub in EN and NL.
- No claim in the adoption band is an adjective; each resolves to a named engagement.
- The M1 training-forward variant is reachable by a single configuration/content switch (it may
  remain content-incomplete until M1, but the mechanism exists).
- All CTAs resolve to live targets (Contact, Selected Work, Training stub).
