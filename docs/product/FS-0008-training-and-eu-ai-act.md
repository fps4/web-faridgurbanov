---
title: "FS-0008 — Training section & EU AI Act page"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0005-portfolio-repos.md
maestro:
  feature: training-and-eu-ai-act
  kind: functional_spec
  summary: |
    The paid edge of the brand. In M0 this is a single "book a taster" CTA stub. In M1 it becomes
    a full Training section: two tiers (EA premium, PO breadth), the offer ladder (free webinar →
    half-day-with-lunch → 1-day → retainer clinic), a "why me" build-proof block tied to the
    three repos, and a plain-language EU AI Act page used as an SEO + lead magnet (capability
    first, compliance second). Same site, distinct page — the brand is not split.
---

# FS-0008 — Training section & EU AI Act page

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

Training is the fastest-to-revenue, lowest-commitment leg and the front of the funnel for the
build service and the contract brand. Per the training strategy it lives on the *same* site as a
distinct section — two thin sites lose to one strong one. The owner's build-proof is exactly what
makes the training credible, so the section leans on the portfolio (FS-0005).

## Scope

### M0 (stub)
1. A **"Book a taster" CTA stub** — a short page/section stating training is offered and routing
   to Contact (FS-0007), reachable from the home page's training CTA.

### M1 (full section)
2. **Two tiers**: EA premium ("architecting agentic systems that survive production") and PO
   breadth ("directing AI as a PO").
3. **Offer ladder** (PO tier), framed by *outcomes, not agendas*: free 45-min webinar →
   half-day-with-lunch (the core) → 1-day deep → retainer clinic. (Public per-seat cohort is
   Phase 4, out of scope here.)
4. **"Why me" build-proof block** — the three repos as govern→build→deliver (links to FS-0005),
   plus the 20-yr architect track record. This is the differentiator; lead with it.
5. **EU AI Act page** — plain-language Article 4 explainer, **capability-first, compliance-second**
   (honest about the Digital Omnibus softening). Doubles as SEO + lead magnet.
6. **Taster CTA** — low-friction "book a 90-min taster / webinar for your team" → Contact.
7. **Bilingual EN/NL** — the training/AI-Act pages are the strongest case for Dutch SEO copy
   (ADR-0002).

## Out of scope

- Per-seat checkout / payments and a public course schedule (training Phase 4, standalone `.nl`
  product site — a separate future product).
- Workshop testimonials / `/cases` write-ups (added as workshops are delivered; later M1+).
- The standalone `.nl` site IA (lives in `wiki/training-and-consulting/`).

## Acceptance criteria (EARS)

- WHILE the site is in its M0 configuration, THE training section SHALL be a single "book a
  taster" CTA stub routing to Contact, reachable from the home page training CTA.
- WHILE the site is in its M1 configuration, THE training section SHALL present two tiers (EA
  premium and PO breadth) and the PO offer ladder (webinar, half-day, 1-day, retainer clinic).
- THE M1 training section SHALL include a "why me" build-proof block linking to the portfolio
  (FS-0005) and SHALL frame offers by outcomes rather than agendas.
- THE M1 build SHALL include an EU AI Act page that explains Article 4 in plain language,
  presented capability-first with compliance as a secondary, honestly-caveated trigger.
- THE training and EU AI Act pages SHALL provide a low-friction taster/webinar booking CTA to
  Contact (FS-0007).
- THE training section SHALL NOT include per-seat checkout or a public course schedule.
- THE M1 training and EU AI Act pages SHALL be available in both English and Dutch.

## Definition of done

- M0: the taster CTA stub is live and reachable from the home page in EN and NL.
- M1: two tiers, the offer ladder (outcome-framed), the why-me build-proof block, and the EU AI
  Act page are live and bilingual, all routing to the taster CTA.
- No per-seat checkout or course schedule is present (correctly deferred).
