---
title: Architecture decisions
summary: Making the call and writing it down — target-state with a road to it, decision records that state what a choice costs, and C4 at the altitude the audience actually needs.
order: 8
group: practice
---

# Architecture decisions

A diagram has a short half-life. The reasoning behind it should have a long one — but usually it lives in one architect's head, and eighteen months later a team reopens a settled question because nobody can say why it was settled. Most of the architecture work I do is making a call, stating what it costs, and putting it somewhere it can be argued with.

## What I do

- **Target state with a road to it.** A destination poster nobody can get to from here is worse than no target at all. The deliverable is the sequence — what moves first, what keeps running untouched, and which step is reversible if the first one is wrong.
- **Decision records that name the cost.** Context, the options actually considered, the choice, and the consequences — including the part that hurts. A decision that reads as free was not analysed; a decision whose price is written down survives the first time somebody pays it.
- **C4 at the right altitude.** A context diagram for the steering group, a container diagram for the teams, a component diagram only where the detail is load-bearing. Diagrams sized for their audience get used; one enormous diagram for everybody gets ignored by everybody.
- **Build, buy, or exit.** Vendor consolidation and decommissioning decisions carry a cost model, not a preference — what the incumbent costs to keep, what the exit costs to run, and where the crossover is.
- **Retiring a decision on purpose.** Superseding an ADR explicitly, rather than letting it quietly stop being true, is what keeps the record worth reading two years in.

## Evidenced by

- [The SAP ↔ Snowflake seam decision](/en/writing/sap-snowflake-seam-decision) — a decision record written in public: what crosses the seam, what stays, and the rules that decide.
- [Cloud Gateway](/en/work/cloud-gateway) — "federate the model, not the runtime": one standard across two clouds, and the standing cost of that promise stated upfront.
- [SAP S/4HANA Finance → Snowflake](/en/work/sap-snowflake) — a contract at the seam rather than tests at the end, and one region built as the reference architecture rather than a pilot.
- [Portfolio](/en/portfolio) — `sap-bdc-snowflake-blueprint` turns the same seam question into nine ordered rules and a cost model you can run.

Background: TOGAF 9 Certified; Accenture Certified Technology Architect; C4, architecture decision records and DAMA-DMBOK governance vocabulary as daily practice.
