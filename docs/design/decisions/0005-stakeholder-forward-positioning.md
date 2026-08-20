---
title: "0005: Stakeholder-forward positioning — lead with adoption, not only with build"
status: accepted
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/design/decisions/0003-single-site-training-forward-positioning.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0003-expertise.md
  - docs/product/FS-0004-selected-work-case-studies.md
---

# ADR-0005 — Stakeholder-forward positioning

## Context

A freelance data-architect engagement (Aug 2026) was lost with explicit client feedback: the
technical skills were **not in doubt**, but the client was not convinced the owner could do
stakeholder management across teams and across the organisation. The same feedback noted that
**outdated technical certifications were not an issue** — which locates the gap precisely, on the
non-technical side of an architect's job.

The site as shipped in M0 answers "can he build it" on every surface: the hero, the proof strip,
the case-study bodies, the footer tagline, and an expertise index whose technical group leads. The
evidence for the other half already existed but was placed where a hurried reader never reaches —
one practice page ranked seventh of eight, and a "Who had to say yes" section at the bottom of two
of six case studies.

The defect is therefore **placement and specificity, not absence**. The correction must not trade
away the technical credibility, which is the thing that is working.

## Decision

1. **The hero carries both halves.** The headline states the build claim *and* the adoption claim;
   the lede quantifies the adoption claim ("18–20 product teams onto one platform, three estates
   onto one event contract") rather than asserting it as an adjective.
2. **The proof strip is rebalanced, not replaced.** Four points: three about adoption and trust,
   one about scale. The scale metric stays — it is what makes the adoption claims credible.
3. **A dedicated adoption band on the home page**, linking the three case studies that carry a
   "Who had to say yes" section, with the disagreement named in the card body.
4. **The practice group leads the expertise index.** Technical depth is rarely what a buyer doubts,
   so it is not what the page has to prove first.
5. **Stakeholder work is written as situations, not adjectives.** The practice page carries five
   named situations with the disagreement, the mechanism that resolved it, and — in two of them —
   what the owner got wrong. Claims of collaboration are worthless; specific accounts including
   mistakes are not.
6. **Every client case study carries "Who had to say yes"** — stakeholders, the disagreement, what
   resolved it, what it cost. Demo/portfolio studies (AI trio, contrail, dynamic pricing) are
   exempt: they have no client stakeholders and a fabricated section would be dishonest.
7. **The current SAP event-backbone initiative becomes a case study**, because it is the strongest
   available evidence of working across an organisation: three teams, three estates, no shared
   tooling, and a contract that had to be negotiated before code.

## Consequences

- The front door now answers the question that lost the engagement, in the first screen.
- The technical proof is preserved: the same metrics appear, reframed by what they took to achieve.
- Case-study bodies grow. That is acceptable — the "Who had to say yes" section is the part a
  hiring manager quotes back in an interview.
- New client-work case studies must include the section, or explain in review why they cannot.
- The site and the CV/LinkedIn surfaces must stay consistent: the same situations, told the same
  way, are the interview answers. Drift between them is a credibility risk, not a formatting one.
