---
title: Deciding what crosses the SAP↔Snowflake seam
summary: For every object in a SAP estate, one question sets the cost and the freshness of everything downstream: share it zero-copy, replicate it, federate it, split it, or keep it in SAP. Here is a reference architecture that answers it per object — nine ordered rules, a cost model with the crossover frequency, and a local simulation that runs all three modes.
date: 2026-08-10
order: 1
---

# Deciding what crosses the SAP↔Snowflake seam

When a SAP estate moves toward Snowflake, one question repeats for every object in scope: is it shared zero-copy, replicated, federated, split across two modes, or modelled inside SAP? Each answer sets a monthly bill, a freshness guarantee and an operational burden that lasts for years.

I built [`sap-bdc-snowflake-blueprint`](https://github.com/fps4/sap-bdc-snowflake-blueprint) to answer that question object by object, in the open: a one-page SAP → Business Data Cloud / Datasphere → Snowflake reference architecture with the decision attached, priced, and runnable.

## Five ways across the seam

Everything to the left of the integration layer belongs to SAP; everything to the right belongs to Snowflake. The decisions that matter sit in the seam between them, and there are five outcomes to choose from:

- **Share** — zero-copy via Delta Sharing. Snowflake reads SAP data products in place. You pay consumer compute, and freshness follows the producer's refresh cadence.
- **Replicate** — a Datasphere replication flow lands a second copy. You pay the initial load, delta movement, outbound integration, storage at rest, and a pipeline someone operates. The data is as fresh as the last successful run.
- **Federate** — a remote table with query pushdown. The source answers each query as it arrives, so the result is current, and the source carries the load every time.
- **Hybrid** — replicate the aggregate, federate the rare drill-down. A dashboard and a line-item lookup are two workloads, and one of them justifies a copy.
- **Keep in SAP** — model and report inside SAP, with the results going to SAP Analytics Cloud.

The diagram also runs in both directions: Snowflake serves as a source for Datasphere, as a remote table or inside a replication flow, which is how most real estates actually work.

## Constraints resolve first, cost decides last

Nine rules assign each object a mode, and the order carries the argument. The first five settle what is possible; the seventh chooses among what remains.

1. **Residency and personal data.** Where a copy at rest must stay, and where a query result crossing a border counts as an export too. Objects bound by both stay in SAP.
2. **Delta capability.** Replication suits objects that can deliver a delta. Above the size ceiling, a full reload each cycle rules the mode out — which is the usual finding for custom Z-tables.
3. **Freshness SLO.** A copy is as fresh as its last run; a share is as fresh as its producer chose. The SLO says which of those is enough.
4. **Latency SLO at peak concurrency.** Federation runs on the system that also runs the business, so it is measured at month-end close rather than on a quiet afternoon.
5. **Share availability.** Zero-copy needs an SAP-delivered data product, outbound. Where one exists, sharing is a configuration; where it does not, building it is a project.
6. **Semantics.** Objects rich in currency conversion, hierarchies and CDS annotations prefer the share, within a stated cost premium — because rebuilding those semantics downstream carries a cost that never lands on the pipeline's bill.
7. **Economics.** The cheapest surviving mode wins.
8. **Hybrid.** Split the object where it is genuinely two workloads.
9. **Join locality.** Advisory: expose the modelled view, so SAP-side joins run where the data is and only the result crosses.

Keeping economics at position seven is the architectural commitment here, and the code enforces it: constraints eliminate before any cost is computed, so a cheap option can never argue its way past a residency rule.

## The crossover, in one line

Replication is mostly fixed cost. Federation is mostly variable. Two straight lines, and they meet:

```
                                F_replicate − F_federate
  crossover (queries/day)  =  ──────────────────────────────
                              (v_federate − v_replicate) × 30
```

Below the crossover, federating is cheaper. Above it, the copy pays for itself.

That formula turns a discussion about preferences into a discussion about two numbers — what a query costs the source, and what the pipeline costs per month — and a room can settle two numbers in an afternoon. On the worked catalog, `ACDOCA` crosses over at 61 queries/day and `T001` at roughly 11,000: two objects with very different economics, and a single default would have treated them the same way.

Sharing changes the shape of the curve rather than its position. It removes almost all of the fixed cost — no pipeline, no second copy, no outbound metering — and raises the marginal cost, since a shared object prunes less efficiently than a native table. So a share wins clearly at moderate query frequency on semantically rich data, and a plain copy wins on the hottest, highest-concurrency facts.

## Running it

Disagreement here takes the form of a pull request against `config/policy.yaml` or `config/cost_model.yaml`, after which the register re-renders with the consequences attached.

`make demo` runs end-to-end on a laptop in under a minute. It assigns a mode to all 24 objects in a synthetic mixed SAP estate, writes a register where each row carries the rule that decided it alongside what the eliminated options would have cost, and executes all three modes on local DuckDB. The decided mix comes to €9,279/month against €27,557 for replicating everything — 66% avoided, and six fewer pipelines to operate. Two HR objects stay in SAP on constraints, and the register still prices what replicating them would have cost, so the constraint stays visible as a priced choice.

The simulation is careful about what it demonstrates. DuckDB plays both sides of the seam, so the query times land within milliseconds of each other by construction; they are printed and labelled as such, since the real federation penalty is a network hop into a busy production system. What the substitution does preserve is what the modes genuinely differ in. Replication leaves a second copy at rest and a delta job that runs on every tick. Federation and sharing leave the warehouse holding almost nothing. And when a row changes in the source, federation reflects it on the next query, a share reflects it once the producer republishes, and a copy reflects it after its next delta run.

That last line is the one worth carrying into a design review: **a share is a copy someone else operates, and its freshness is their promise rather than your schedule.** Choose it for the semantics and the economics, and plan around the producer's cadence.

## What the artifact contains

Stated as plainly here as it is in the README: DuckDB stands in for both sides of the seam. The cost figures are illustrative placeholders shaped like list pricing, kept in a single YAML file so a real rate card drops straight in. The 24-object catalog is synthetic, shaped like a DACH manufacturing estate. SAP's integration surface moves quickly, so the mechanisms named here are worth checking against current documentation before a budget depends on them.

The durable artifact is the decision procedure. Load a real rate card, re-run, and read what moves: any decision that shifts under real prices was an economic call rather than an architectural one, which is a useful thing to learn about your own estate early.

## Why I build this way

This is the loop I run everywhere: intent written down first, trade-offs recorded as ADRs, and the claim demonstrated rather than asserted. I have delivered this seam for real — see the [SAP S/4HANA Finance → Snowflake case study](/en/work/sap-snowflake), where data contracts sit exactly where SAP hands off to the lakehouse. The pattern is the same in both places: put the design surface on the boundary, and make the decision there explicit enough to review.

A reference architecture becomes useful at the moment a team can disagree with it precisely. Attaching the decision engine is what makes that possible.

*The repo is public and MIT-licensed: [github.com/fps4/sap-bdc-snowflake-blueprint](https://github.com/fps4/sap-bdc-snowflake-blueprint). Start with `docs/reference-architecture.md` — that is the page to put on a screen, and everything else exists to support it.*
