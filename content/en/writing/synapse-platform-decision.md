---
title: Deciding where a Synapse estate goes
summary: Synapse has an end date, so the question is no longer whether to move but where each workload lands — Fabric, Databricks or Snowflake. Ten ordered rules, a cost model that treats a pre-paid capacity as the step function it is, and the finding that surprised me most: the platform that priced best was eliminated from almost every workload it priced best on.
date: 2026-08-29
order: 1
---

# Deciding where a Synapse estate goes

Microsoft has moved its roadmap to Fabric, and every Azure estate that grew through Synapse Analytics now has a date attached to it. That changes the conversation. It is no longer whether to migrate — it is where each workload lands, and what the answer costs for the next several years.

Three plausible destinations, and most estates will end up with more than one: Microsoft Fabric, Databricks on Azure, Snowflake on Azure. I built [`azure-lakehouse-decision`](https://github.com/fps4/azure-lakehouse-decision) to answer that question workload by workload, in the open — the platform decision made explicit, priced against Fabric's capacity model, and runnable on a laptop.

## Why the usual artifact does not decide anything

The usual artifact is a capability matrix. Forty rows, three columns, ticks and crosses. It is mostly accurate and it settles nothing, for two reasons.

The first is that four or five rows eliminate anything at all. The rest is thoroughness theatre, and adding a third column triples the noise without adding a decision.

The second is worse, and it is about the prices underneath. For Databricks and Snowflake a per-workload price table is fair — both are metered, so a workload's cost is a property of that workload and stays true standing on its own. Fabric is not metered. It is a **pre-paid capacity**: one F-SKU carries the whole estate, and one more workload costs *nothing* until the capacity saturates, at which point it costs the price of the next rung. A step function, not a line.

Put all three in one price table and the table is quietly comparing two different kinds of number. Three consequences follow, and they are the reason the repo exists:

- **A workload's platform depends on what else is on the platform.** The same notebook is free on Fabric with headroom and costs a full rung without it.
- **Unused headroom is the cheapest compute in the estate.** An F32 at 50% is an F32 paid for in full, and the only way to use it is to put something on it.
- **The marginal workload that forces a rung pays for the whole rung** — which is why *"just add it to Fabric"* is occasionally the most expensive sentence in a design review.

## Constraints eliminate, economics chooses

Ten rules place every workload, and the order carries the argument. R1 to R5 return reasons and never see a number. R7 is the first rule allowed to look at a price.

1. **Residency and clearance.** Where data may come to rest, and which platform the estate has actually cleared for a restricted classification. A regulator does not accept a cheaper option.
2. **T-SQL surface.** Stored procedures and multi-table transactions from a dedicated SQL pool do not lift onto a platform without them. That is a rewrite, not a dialect difference.
3. **Streaming semantics.** A window that must be restated by event time when a late event arrives, or a sink that must be exactly-once. An ingestion-time engine is not a cheaper event-time engine.
4. **Sub-second telemetry.** The mirror constraint, pointing the other way: high-cardinality telemetry answered interactively. "Possible with enough warm compute" is a way of saying wrong engine.
5. **ML lifecycle.** Tracking, a registry and a served endpoint. A judgement, and marked in the config as one.
6. **Direct Lake premium.** A semantic model reading Delta in place is worth a bounded premium — no import refresh to fail, no DirectQuery round trip.
7. **Economics, capacity-aware.** The cheapest survivor, placed against a capacity that moves underneath each decision.
8. **Step-boundary review.** R7 fills greedily and stops. Is the rung it landed on the one to own?
9. **Platform portfolio review.** Did every platform we opened pay for its own overhead?
10. **Locality.** Advisory: shortcut the storage, do not copy it.

Keeping economics at position seven is the architectural commitment, and the code enforces it — a test asserts across the whole estate that no workload was ever placed on a platform its constraints eliminated. A cheap option cannot argue its way past a residency rule.

## What a second meter changes

R9 is the rule I did not need when the comparison was Fabric versus Databricks, and it is the most interesting thing a third platform added.

With one meter, the fixed cost of operating that platform was never a variable — the estate was always going to run it. With two, the estate might run one, both or neither, and the contract, the landing zone, the identity integration, the network path and the people who know it become a decision.

That cost has the same awkward property as a capacity rung: **it is not divisible by workload.** A meter that wins five workloads by €200/month each has won €1,000/month of consumption and, if standing the platform up costs €1,200/month, has lost the estate money. R7 places one workload at a time and structurally cannot see this — the same blind spot as a per-workload price table, one level up.

So R7 stays blind to it on purpose, and R9 asks the question once the whole allocation exists: for each platform opened on economics alone, is its metered cost plus its overhead more than re-homing everything on it to somewhere already open? A platform that R1–R5 pinned a workload to is exempt — if some workload survives nowhere else, that overhead is not a choice. Constraints outrank economics even when the economics is about a platform rather than a workload.

## The most interesting row is the empty one

On the worked estate — 20 workloads, invented but shaped like a mid-size Azure estate that grew through Synapse between 2020 and 2024 — the answer comes out as 15 workloads on Fabric, 4 on Databricks, and one that goes nowhere. **Snowflake wins nothing.**

That is not a shrug, and the plan does not leave it as an empty column. Snowflake is the **cheapest meter on five of the twenty workloads** — every one of them in the dedicated SQL pool, where its per-second billing and auto-suspend genuinely do beat the alternative. And R2 eliminates it from four of those five, because they are written in T-SQL. The fifth is absorbed by capacity the estate has already paid for, and no meter can underbid €0.

**The platform prices best precisely where it is not allowed to compete.**

A capability matrix cannot reach that conclusion, because it has no prices. A price table cannot reach it either, because it has no constraints. It needs both in the same sentence, which is the whole argument for running a procedure rather than reading a comparison.

It is also a verdict on *this estate*, not on the product — the expensive work here is Spark-shaped and the SQL-shaped work is locked to T-SQL. Change either fact and the answer moves, which is what the engine is for.

## What happens when you change it

Relax one policy flag — *"we accept a rewrite of the finance warehouse; price it, do not eliminate it"* — and re-run. Snowflake now takes the general ledger fact on the meter: €647/month against Databricks' €796.

Then R9 takes it straight back. €647 of consumption plus €1,200/month to operate a third platform, against €796/month to run the same workload somewhere already open. **Net €1,051/month to not have a third vendor** — for a workload that genuinely was cheaper on it.

That is the second half of the argument, and the half a per-workload comparison structurally cannot make. Winning workloads and winning an estate are different things.

## The workload with no home

One stream has no destination at all. It needs event-time restatement, which rules out Fabric and Snowflake; it carries a restricted classification cleared only for Fabric, which rules out Databricks. Adding a third candidate did not rescue it — the third one fails it the same way the first does.

It is the most useful row in the register, because it names the single fact that has to change: clear a second platform for that data, or accept an ingestion-time approximation on a payment ledger. And with Synapse ending, "leave it where it is" is no longer a stable answer. It has an expiry date now, which is exactly the kind of thing worth discovering while there is still time to do something about it.

## Two eliminations executed rather than asserted

The rules most likely to be waved through in a design review are the ones about semantics, so two of them run rather than assert.

The same payment stream goes through both streaming shapes. The ingestion-time engine finishes **3.49% out per window** and over-counts the total by every redelivery; the event-time shape restates 245 windows and lands exactly on the truth. Separately, a load is killed between its two writes: with a multi-table transaction it rolls back clean, and without one it leaves **893 customers** whose aggregate disagrees with the fact table beneath it — with nothing in either table saying so.

Those are behaviours of two designs, not benchmarks of three products, and the report is explicit about the difference.

## What the artifact is, and is not

Stated as plainly here as in the README. No Azure subscription, no Fabric capacity, no Databricks workspace and no Snowflake account are involved — DuckDB stands in, and Fabric cannot run locally at all, so it is modelled rather than executed. The euro figures are illustrative placeholders shaped like list pricing, in one YAML file so a real rate card drops straight in. The conversion factors — how much capacity a compute hour burns, how a CU compares to a DBU or a credit — are the weakest numbers in the repo and the ones that move the answer most. The estate is synthetic. All three platforms ship constantly, so every capability claim is dated and needs re-checking before it decides a budget.

The durable artifact is the decision procedure, not the euros and certainly not the capability matrix. Load a real rate card, re-run, and read what moves: anything that shifts under real prices was an economic call rather than an architectural one, and that is a useful thing to learn about your own estate early.

## Why I build this way

Intent written down first, trade-offs recorded as decision records, and the claim demonstrated rather than asserted. Disagreement takes the form of a pull request against `config/policy.yaml` or `config/cost_model.yaml`, after which the plan re-renders with the consequence attached.

It is the same loop as the [SAP↔Snowflake seam decision](/en/writing/sap-snowflake-seam-decision), applied one layer up: there the question was which objects cross a boundary, here it is which platform carries a workload. Both put the design surface where the decision actually is, and both make it explicit enough to be argued with.

A reference architecture becomes useful at the moment a team can disagree with it precisely.

*The repo is public and MIT-licensed: [github.com/fps4/azure-lakehouse-decision](https://github.com/fps4/azure-lakehouse-decision). Start with `docs/platform-decision.md` — that is the page to put on a screen, and everything else exists to defend it.*
