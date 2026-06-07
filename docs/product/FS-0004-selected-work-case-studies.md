---
title: "FS-0004 — Selected work / case studies"
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0005-portfolio-repos.md
maestro:
  feature: selected-work-case-studies
  kind: functional_spec
  summary: |
    The biggest gap and the highest-converting section: 3–4 anonymized case studies that turn a
    visitor into a call. The set mirrors the proof points actually used across the owner's job
    applications — the Cloud Gateway API platform, the SAP→Snowflake finance migration, the
    Confluent Kafka data-product platform, and the AI trio — each with the problem, what was
    built, and quantified impact. They evidence the home-page positioning and make the training
    credible.
---

# FS-0004 — Selected work / case studies

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)

## Why

Across 15 job applications the same proof points recur; the case studies should mirror them, not
the original placeholder four. This is the section that converts a cold visitor into a
conversation, and it is what makes the training offer credible ("taught by someone who ships").

## Scope

1. **A case-study index** listing the studies with a one-line hook and impact metric each.
2. **3–4 case-study detail pages**, anonymized where required by client confidentiality:
   - **Cloud Gateway** — federated cross-cloud API platform; replaced IBM API Connect;
     consolidated 20+ gateways; ~500M+ req/month; 18–20 teams; ~€250–300k/yr saved; onboarding
     days→minutes. *(The canonical proof point — present in all applications.)*
   - **SAP S/4HANA Finance → Snowflake** — GL/AR/AP/CO/AA; ~30+ company codes; multi-TB backfill
     + 10–30 GB daily delta; data contracts at the SAP↔lakehouse seam.
   - **Confluent Kafka data-product platform** — 20+ productized streams; 30+ source systems;
     domain-oriented ownership.
   - **The AI trio** (`sovereign-copilot`, `maestro`, `sovereign-llm-gateway`) — the
     govern→build→deliver story; cross-links to the portfolio (FS-0005).
3. **Consistent structure** per study: context / problem → what was built → quantified impact →
   role & stack.
4. **Anonymization** — client names omitted/abstracted where confidentiality requires; metrics
   kept.
5. **Bilingual** — EN now; NL may lag (ADR-0002).

## Out of scope

- The repo cards themselves (FS-0005) — case studies *link* to them.
- Testimonials / workshop write-ups (`/cases` for training is M1, FS-0008).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a case-study index linking to between three and four case-study detail
  pages, each with a one-line hook and a headline impact metric.
- EACH case-study detail page SHALL follow a consistent structure: context/problem, what was
  built, quantified impact, and the owner's role + stack.
- THE case-study set SHALL include the Cloud Gateway API platform with its scale and cost-saving
  metrics.
- WHERE a case study references the owner's repositories, IT SHALL link to the portfolio section
  (FS-0005) and SHALL respect the honesty rule (runnable vs reference; ADR-0004).
- WHERE client confidentiality requires, A case study SHALL omit or abstract the client identity
  while retaining the quantified impact.
- THE case studies SHALL render via the FS-0001 content pipeline in English, with Dutch provided
  or falling back per ADR-0002.

## Definition of done

- Three to four case studies + an index live via the content pipeline, each with a quantified
  impact metric and consistent structure.
- The Cloud Gateway study is present and accurate to the application proof points.
- AI-trio study cross-links the portfolio and carries no "three production systems" claim.
