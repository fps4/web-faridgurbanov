---
id: P-01
order: 1
title: "Per-object crossing mode"
summary: "Choose share, replicate, federate, split or keep for each object, by ordered rules and a crossover cost."
status: current
revised: 2026-11-08
related: [practice/articles/sap-snowflake-seam-decision, work/sap-snowflake, G-03]
topics: [integration, data-platforms]
tech: [sap, snowflake]
---

## Problem

Data has to cross from one platform to another, an ERP into a warehouse for example, and the
estate picks one integration style for all of it: replicate everything, or federate everything.
Each object then pays the cost profile of a mode that was chosen with some other object in mind.

## Forces

- Replication is mostly fixed cost: the initial load, delta movement, storage at rest, and a
  pipeline someone operates. The copy is as fresh as its last successful run.
- Federation is mostly variable cost. The source answers every query, so the result is current,
  and the source carries the load each time, month-end close included.
- A zero-copy share removes most of the fixed cost and raises the marginal cost. Its freshness is
  the producer's promise.
- Some objects carry semantics (currency conversion, hierarchies, annotations) that are expensive
  to rebuild downstream.
- Residency, personal data and delta capability rule modes out before cost comes into it.

## Solution

Decide the crossing per object, from five modes:

| Mode | Fits when |
|---|---|
| Share | the source delivers a data product; semantics are rich; query frequency is moderate |
| Replicate | the object can deliver a delta, and is queried often enough for a copy to pay |
| Federate | queries are rare, must be current, and the source can take them at peak |
| Split | one object is two workloads: a dashboard on the aggregate, a rare line-item drill-down |
| Keep at source | residency or personal-data rules bind it there |

![Diagram: one object goes through the constraints (residency, personal data, delta capability), which rule some of the five modes out. Cost is compared only among the modes that survive, and the register records the mode, the rule that decided it, and what the rejected modes would have cost. Between replicate and federate the cost is two straight lines, replication mostly fixed and federation mostly variable, and below the crossover federating is cheaper; on the worked catalogue a large finance fact table crosses over at 61 queries a day and a small reference table at about 11,000.](/diagrams/per-object-crossing-mode.svg)

Run the constraints first ([G-03](/en/practice/guidelines/constraints-before-cost)), then compare
the surviving modes on cost. Between replication and federation that comparison is two straight
lines, and they meet:

```text
crossover (queries/day) = (F_replicate − F_federate) / ((v_federate − v_replicate) × 30)
```

Below the crossover, federate. Above it, the copy pays for itself. The result goes into a
register: each object, its mode, the rule that decided it, and what the rejected modes would have
cost.

## Consequences

- The argument shrinks to two numbers per object, what a query costs the source and what the
  pipeline costs per month, and a room can settle two numbers in an afternoon.
- Objects with different economics get different answers. On the worked catalogue a large finance
  fact table crossed over at 61 queries a day, where a small reference table needed about 11,000.
- More modes means more kinds of operation to run, monitor and explain.
- A share is a copy someone else operates. Plan around the producer's refresh cadence.

## When not to use it

- A handful of objects: decide them together in one ADR.
- The target has no federation or sharing path. One mode remains and the question is closed.
- Volumes where cost and freshness do not matter: pick the simplest mode and move on.
