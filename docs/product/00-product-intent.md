---
title: "Product intent — faridgurbanov.com"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/overview.md
  - docs/design/README.md
  - docs/delivery/roadmap/README.md
---

# Product intent

The **what & why** for faridgurbanov.com. Functional specs (`FS-NNNN-*.md`) decompose this;
ADRs in [`../design/decisions/`](../design/decisions/README.md) lock the *how*.

## Why this product exists

A ZZP / contracting integration architect who **also** sells AI-assisted delivery **and** is
standing up a training practice needs one credibility surface all three legs share — a URL the
owner controls, not a LinkedIn template. The site is itself a portfolio piece: a clean, fast,
bilingual static site on the same open stack the owner recommends to clients quietly proves the
pitch.

Source of truth for positioning and rationale:
`wiki/job-search-and-upskilling/personal-website-strategy.md` (revised 2026-06-07) and
`wiki/training-and-consulting/`.

## Audiences (one brand, three journeys)

| Audience | Who | Needs to see | Primary CTA |
|---|---|---|---|
| **Training buyer** | L&D leads, heads of product, EA practice leads | Offer ladder, build-proof, EU AI Act framing | Book a taster / webinar |
| **Hiring / contract** | Recruiters, hiring managers, brokers | Selected work, expertise, availability, repos | Contact / résumé |
| **Build-service client** (year-2) | Product orgs commissioning modernization | Case studies, the `maestro` delivery model | Contact |

Brand line: *"the architect who builds AI and teaches teams to direct it."* These journeys
reinforce each other — they do **not** split into separate brands or sites.

## Positioning: training-forward target, credibility-first first-ship

- **Target (M1):** home leads with the training/workshops offer; the architect track record is
  the credibility proof beneath it. Two tiers — **EA premium** ("architecting agentic systems
  that survive production") and **PO breadth** ("directing AI as a PO", with the offer ladder).
- **First ship (M0):** home leads with **credibility** (selected work + portfolio + expertise);
  training is a single "book a taster" CTA stub. Rationale: the training sale *depends on* the
  architect proof, and that proof is shippable now while the training section is built/validated.

## Scope of the product

In scope: a multi-page bilingual marketing/portfolio site — home, expertise, selected work /
case studies, portfolio (repos), writing, training, contact, EU AI Act page, minimal privacy.
Content authored as filesystem markdown, rendered at build, exported static.

Out of scope (deliberately): any server runtime, database, CMS, auth, per-seat checkout, blog
comment system, analytics-heavy tracking. The standalone `.nl` product site (training Phase 4)
is a *separate future product*, not this one.

## Success criteria

- A recruiter / L&D buyer landing cold understands within 10 seconds what the owner does and how
  to start a conversation.
- The site is static, free-to-host, and buildable from markdown by an agent without bespoke
  infra.
- The case studies and portfolio are credible to a senior architect audience — including the
  **honesty rule**: only `sovereign-llm-gateway` runs end-to-end; `sovereign-copilot` and
  `maestro` are reference architectures. No "three production systems" claim.

## Functional specs

| Spec | Title | Milestone |
|---|---|---|
| FS-0001 | Bilingual site shell, navigation & content pipeline | M0 |
| FS-0002 | Home page | M0 (credibility) → M1 (training-forward) |
| FS-0003 | Expertise pages | M0 |
| FS-0004 | Selected work / case studies | M0 |
| FS-0005 | Portfolio / repositories | M0 (gated — see ADR-0004) |
| FS-0006 | Writing / blog | M0 (1 post) |
| FS-0007 | Contact & privacy/GDPR | M0 |
| FS-0008 | Training section & EU AI Act page | M0 stub → M1 full |

## Cross-cutting constraints

- **Bilingual EN/NL** with i18n routing (ADR-0002). Dutch may lag English on low-traffic pages.
- **Static export** — every feature must work with `output: 'export'` (ADR-0001).
- **Public-surface prerequisites** gate the repo links (ADR-0004): one umbrella name, neutralized
  + licensed forks, honest runnable-vs-reference framing.
