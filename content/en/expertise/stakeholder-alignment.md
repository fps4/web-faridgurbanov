---
title: Stakeholder alignment
summary: Getting an architecture agreed to and adopted — influence without authority, decisions written where they can be challenged, and platforms teams choose rather than are told to use.
order: 7
group: practice
---

# Stakeholder alignment

An architecture nobody agreed to is a diagram. The hard part of the job is rarely the design — it is the twenty teams who each already have something that works, the finance director who has to trust a number before signing off on it, and the vendor contract somebody signed four years ago. I have spent most of twenty years doing this without ever having the authority to order anyone to do anything.

## What I do

- **Make the paved road cheaper than the alternative.** Teams move when moving is the path of least resistance — self-service onboarding, a security model they stop having to build themselves. A mandate produces twenty exceptions; a better road produces adoption.
- **Design for trust, not just for throughput.** Finance doesn't adopt a warehouse because the architecture is elegant. It adopts one when the numbers reconcile against the ledger it already believes. Naming who has to trust the output — and building the thing that earns it — is part of the design, not a phase after it.
- **Assess before I prescribe.** Arriving at another team's platform with a roadmap they didn't ask for goes nowhere. I read the estate first and write down what I found, so the priorities are arguable: an assessment a team can disagree with beats a recommendation they can ignore.
- **Write the decision where it can be challenged.** Architecture decision records, C4 diagrams, and the trade-off stated in plain language — including what the decision costs. Alignment holds when people can see what was given up and why; it collapses when the reasoning lives in one architect's head.
- **Say the unwelcome part early.** Where a design puts friction on a team that had none, or where my own experience runs out, the conversation goes better at the start than at the review. Credibility is spent slowly and lost all at once.

## Working part-time and still owning the architecture

A two- or three-day-a-week architect is a stakeholder problem before it is a technical one: decisions have to keep moving on the days I'm not there. What makes it work is agreeing the operating model up front — a named counterpart on the client side, a written decision log instead of decisions that live in meetings, and an explicit line between what the team decides without me and what waits.

Designed that way a fractional seat isn't a diluted architect. It's an architecture the team can carry — which is the only kind that survives the end of a contract anyway.

## Evidenced by

- [Cloud Gateway](/en/work/cloud-gateway) — 18–20 product teams onto one federated model and an IBM API Connect exit, with onboarding cut from days to minutes. Adoption bought with developer experience rather than authority.
- [SAP S/4HANA Finance → Snowflake](/en/work/sap-snowflake) — reconciliation against the source ledger so Finance would trust the numbers, and source-to-target mapping agreed with the SAP-side architects.
- [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka) — 20+ productised streams across 30+ source systems, which meant negotiating domain ownership with the teams that produced the data.

Background: TOGAF 9 Certified; Accenture Certified Technology Architect; architecture decision records and C4 as working practice. I also teach architecture and product teams — the same skill, with the stakes moved.
