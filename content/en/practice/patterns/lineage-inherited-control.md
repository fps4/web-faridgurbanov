---
id: P-03
order: 3
title: "Lineage-inherited control"
summary: "A derived asset carries the strictest control of its inputs until a recorded declassification removes it."
status: current
revised: 2026-11-08
related: [practice/articles/export-control-who-sees-what, practice/articles/knowledge-layer-a-lawyer-can-act-on, P-02, P-04]
topics: [governance, data-platforms]
tech: [databricks]
---

## Problem

Controls get applied to tables: classify each one, tag it, grant by tag. That is right on the day
it is done. Controlled tables are inputs, though. They get joined, aggregated, turned into
features and trained on, and the results are new assets that nobody classified.

## Forces

- Derived assets outnumber sources, and the people who create them never saw the source's
  classification.
- A name says nothing about content. A view called `public_fleet_summary` can carry controlled
  parameters.
- Removing a control is sometimes legitimate (a proper aggregate, a regulator's assessment), and
  someone has to answer for it.
- Models, endpoints and agents are derived assets too.

## Solution

Make lineage the unit of control. Classification enters only at a source, and the loader refuses
a declared classification on anything derived. Every derived asset inherits every control of
every input, with the source it came from, and keeps it.

Only a ledger entry removes a control. The entry names the asset, what it removes, the grounds,
who decided, when it expires, and whether it covers what is derived downstream. Where the grounds
are a rule (at least twenty-five per group, no controlled parameter, no free text) the engine
checks the rule and refuses an entry that does not hold. Where they are an assessment or a named
person's judgement, the engine records the entry and shows when it lapses.

Tags on the platform are the output of this rule, never its input.

## Consequences

- Controls follow the data into features, models, serving endpoints and agents. In the
  export-control lab, lineage found four of twenty-four derived assets that were controlled by
  what they were made from and open by what they were called.
- The ledger is what a regulator asks for, and the only place a control can be removed.
- The same rule closes a retrieval leak: a note citing a walled matter inherits the wall
  ([P-04](/en/practice/patterns/authorise-before-retrieve)).
- Lineage has to be complete. A missed edge is a missed control, so lineage capture and citation
  recall become security properties.
- The default failure is over-control: an aggregate stays restricted until someone files the
  entry.

## When not to use it

- An estate with one sensitivity level throughout.
- Short-lived sandboxes with no path to production or to an export.
