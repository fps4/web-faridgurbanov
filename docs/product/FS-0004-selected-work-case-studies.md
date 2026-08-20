---
title: "FS-0004 — Selected work / case studies"
status: draft
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/product/FS-0005-portfolio-repos.md
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
maestro:
  feature: selected-work-case-studies
  kind: functional_spec
  summary: |
    The biggest gap and the highest-converting section: 3–4 anonymized case studies that turn a
    visitor into a call. The set mirrors the proof points actually used across the owner's job
    applications — the Cloud Gateway API platform, the SAP→Snowflake finance migration, the
    Kafka-on-Cloudera data-product platform, and the AI trio — each with the problem, what was
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
2. **Case-study detail pages**, anonymized where required by client confidentiality:
   - **SAP event backbone → cloud integration layer** — SAP Advanced Event Mesh (Solace) over
     AMQP 1.0 into the AWS-native platform; three teams and three estates (cloud, legacy IBM ESB,
     SAP) with no shared tooling; the envelope and subscription contract agreed before either
     side wrote code. *(Added under ADR-0005 as the strongest available evidence of working
     across an organisation.)*
   - **Cloud Gateway** — federated cross-cloud API platform; replaced IBM API Connect;
     consolidated 20+ gateways; ~500M+ req/month; 18–20 teams; ~€250–300k/yr saved; onboarding
     days→minutes. *(The canonical proof point — present in all applications.)*
   - **SAP S/4HANA Finance → Snowflake** — GL/AR/AP/CO/AA; ~30+ company codes; multi-TB backfill
     + 10–30 GB daily delta; data contracts at the SAP↔lakehouse seam.
   - **Kafka data-product platform on Cloudera** — 20+ productized streams; 30+ source systems;
     domain-oriented ownership.
   - **The AI trio** (`sovereign-copilot`, `maestro`, `sovereign-llm-gateway`) — the
     govern→build→deliver story; cross-links to the portfolio (FS-0005).
3. **Consistent structure** per study: context / problem → what was built → quantified impact →
   the pattern behind it (the decision and its trade-off) → who had to say yes (the stakeholders,
   the disagreement, what resolved it, what it cost) → role & stack.
4. **Anonymization** — client names omitted/abstracted where confidentiality requires; metrics
   kept.
5. **Bilingual** — EN now; NL may lag (ADR-0002).

## Out of scope

- The repo cards themselves (FS-0005) — case studies *link* to them.
- Testimonials / workshop write-ups (`/cases` for training is M1, FS-0008).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a case-study index linking to the case-study detail pages, each with a
  one-line hook and a headline impact metric.
- EACH index entry SHALL display its headline metric as the most prominent element of the row, the
  abstracted client identity, and one line stating the disagreement the engagement had to survive
  (ADR-0008), all sourced from frontmatter.
- EACH case-study detail page SHALL follow a consistent structure: context/problem, what was
  built, quantified impact, the pattern behind it, and the owner's role + stack.
- WHERE a case study describes client work, IT SHALL carry a "who had to say yes" section naming
  the stakeholders, the disagreement, what resolved it, and what it cost — stated at the same
  level of honesty as the technical trade-off, including the price of the decision.
- WHERE a case study describes a self-built demo or portfolio repository rather than client work,
  IT SHALL NOT carry a "who had to say yes" section, because it has no client stakeholders and a
  fabricated one would breach the honesty rule.
- THE case-study set SHALL include the Cloud Gateway API platform with its scale and cost-saving
  metrics.
- WHERE a case study references the owner's repositories, IT SHALL link to the portfolio section
  (FS-0005) and SHALL respect the honesty rule (runnable vs reference; ADR-0004).
- WHERE client confidentiality requires, A case study SHALL omit or abstract the client identity
  while retaining the quantified impact.
- THE case studies SHALL render via the FS-0001 content pipeline in English, with Dutch provided
  or falling back per ADR-0002.

## Definition of done

- The case studies + an index live via the content pipeline, each with a quantified impact metric
  and consistent structure.
- Every client-work case study carries its stakeholder section in EN and NL; demo studies
  deliberately carry none.
- The Cloud Gateway study is present and accurate to the application proof points.
- AI-trio study cross-links the portfolio and carries no "three production systems" claim.
