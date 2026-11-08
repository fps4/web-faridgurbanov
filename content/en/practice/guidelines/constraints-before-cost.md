---
id: G-03
order: 3
title: "Constraints before cost"
summary: "Placement rules run in a fixed order, and price is consulted only among the options the constraints left standing."
status: current
revised: 2026-11-08
related: [practice/articles/sap-snowflake-seam-decision, practice/articles/synapse-platform-decision, P-01]
topics: [architecture, cost]
tech: []
---

## The rule

When the same decision is made many times over (each object across a seam, each workload onto a
platform), I write it as ordered rules. Hard constraints come first and return reasons, never
numbers. Price enters after them and chooses among the options still standing.

## Why

Two artefacts usually stand in for this decision, and neither decides. A capability matrix has
forty rows, of which four or five eliminate anything. A price table has numbers and no
constraints, so the cheapest option looks like the answer even where a residency rule forbids it.
Once a cost figure is on the slide, the meeting argues about whether the constraint is real.

With the constraints first, a cheap option cannot talk its way past a residency rule: the rule has
removed it before anyone priced it.

## How I apply it

**Order the rules, and let the order carry the argument.** Across the SAP↔Snowflake seam it runs:
residency and personal data, delta capability, freshness, latency at peak, share availability,
semantics, and economics in seventh place. For a Synapse estate: residency and clearance, T-SQL
surface, streaming semantics, sub-second telemetry, ML lifecycle, and again economics seventh.

![Diagram: every option for one object passes the placement rules in their fixed order across the SAP↔Snowflake seam: residency and personal data, delta capability, freshness, latency at peak, share availability and semantics. Each rule that eliminates an option sends it to the register with the rule and its reason, and the excluded options are still priced. Economics, rule 7, compares price only among the options still standing, and a review of the whole allocation follows.](/diagrams/constraints-before-cost.svg)

**Constraints return reasons.** Each eliminating rule writes why an option fell, so the register
shows the rule that decided every row.

**Price the eliminated options anyway.** The register shows what the excluded options would have
cost, and a constraint reads as a priced choice someone can challenge on its merits.

**Enforce the order in code.** A test asserts across the estate that nothing was placed where a
constraint eliminated it.

**Review the whole after the parts.** Rules that place one item at a time cannot see a cost that
is not divisible by item: a capacity rung, or the overhead of opening a third platform. A later
rule looks at the full allocation and asks whether each platform pays for itself.

**Disagreement is a pull request.** Rules and cost model live in config. Change one, re-run, and
read what moves.

## Trade-offs

- **Judgement still enters.** Some constraints are calls (whether a workload needs a full ML
  lifecycle is one). Mark them as judgements in the config, so nobody mistakes them for physics.
- **The order is a claim.** Swapping two rules can change answers, so the order gets reviewed too.
- **It takes building.** A procedure and a register cost more up front than a matrix on a slide.
- **Illustrative prices get read as quotes.** Keep them in one file, so a real rate card drops in
  and the answers that move under it show up as economic calls.

## When I'd bend it

- **One decision, made once:** an ADR with options and consequences is enough. Ordered rules pay
  off when the question repeats per object.
- **No hard constraints in play:** then it is an economics question, and a cost model will do.
- **A constraint the business can buy off** (a rewrite it is willing to fund): price it as an
  option, flag it in the config, and say so in the register.
