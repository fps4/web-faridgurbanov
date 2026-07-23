---
title: Retail dynamic pricing — one lakehouse, two pricing strategies
summary: A runnable demo of a retail dynamic-pricing platform on a Databricks lakehouse — one elasticity-to-optimization engine serving two verticals, grocery and consumer electronics, that differ in their pricing science but share the pipeline. End-to-end notebooks, synthetic data, +6.4% revenue at flat margin.
hook: One pricing engine, two retail verticals — grocery and electronics — on a Databricks lakehouse.
metric: 2 verticals · 1 lakehouse
order: 6
---

# Retail dynamic pricing — one lakehouse, two pricing strategies

This is applied pricing science for retail: a **dynamic-pricing platform** that
turns sales history into demand elasticities, optimizes shelf prices under real
business constraints, and explains every move. One engine, two verticals that
differ in *what* they optimize, not *how* it's plumbed — all of it runnable on a
laptop and built to lift to a **Databricks lakehouse** unchanged.

## The two verticals

The interesting part of retail pricing is that the science is genuinely
different by category — so I built one core and pointed it at two constraint
sets:

- **Grocery — *elasticity & markdown pricing*.** High SKU count, thin margins,
  perishability. The levers are demand **elasticity**, **KVI price-image** (the
  known-value items shoppers benchmark you on), the category **price ladder**
  (private label < A-brand < premium), and **expiry-driven markdown** to recover
  value before write-off.
- **Electronics — *competitive & lifecycle pricing*.** Lower SKU count, high
  ticket, ruthless online price transparency. The levers are **competitor
  price-matching**, **MAP compliance** (the manufacturer's Minimum Advertised
  Price is a hard floor), **product-lifecycle markdown** (hold at launch, clear
  at end-of-life), and **attach economics** (the accessory/warranty margin that
  makes the unit margin misleading).

## What I built

A shared, solver-agnostic engine — **generate → estimate elasticity → optimize →
markdown → explain** — with two end-to-end notebooks, one per vertical:

- A **demand model** that fits own-price elasticities per SKU (log-log with
  store-cluster / channel fixed effects in the demo; LightGBM/GPBoost with
  monotonicity constraints in production). The notebooks check the fitted
  elasticities against a *known ground truth* baked into the synthetic data.
- A **revenue optimizer** over a non-linear (price × demand) objective with the
  constraints a category manager actually enforces — cost floor, price ceiling,
  margin floor, price ladder, MAP floor, max-change. It's **solver-agnostic**:
  SciPy/SLSQP by default so anyone can run it, with a **Gurobi** MIQP backend
  for the full max-N-changes cardinality constraint, falling back gracefully.
- A **Databricks lakehouse** mapping: Delta Live Tables for bronze→silver→gold,
  MLflow for the elasticity model, a Workflow tying ingest → train → optimize →
  publish, and a Mosaic-AI agentic layer that turns natural-language pricing
  policy into constraints and renders a per-role rationale for every price.

## The honest part

It all runs on a laptop in seconds because it trains and optimizes on
**synthetic but plausible** data — a seeded data-generating process with a known
elasticity per SKU, so recovery is checkable and the whole thing is reproducible.
That's a deliberate choice, and the repo says so everywhere. The economics are
real in *direction and shape*: grocery clears **+6.4% revenue at flat margin**
with the milk price-ladder intact; electronics moves only **~+1%** because MAP
floors and tight ceilings genuinely leave little room — several SKUs want to drop
but are pinned at the MAP floor, which is itself the realistic compliance signal.
The Databricks pipelines are reference implementations; the laptop path is the
notebooks. Every file draws the line between demo and production.

## The pattern behind it

![Diagram: two constraint sets — grocery (KVI, price ladder, expiry markdown) and electronics (MAP floor, lifecycle, price matching) — configure one shared engine (estimate elasticity, optimize, explain) that emits prices plus rationale. Constraints as data, not forks.](/diagrams/dynamic-pricing-pattern.svg)

**One engine, constraints as data.** The default fate of a pricing platform serving two verticals is a fork — grocery and electronics each get "their" engine, and within a year they're two products sharing a logo. Here the vertical difference is expressed entirely as constraint sets over one solver-agnostic core: KVI price-image and expiry markdown for grocery, MAP floors and lifecycle curves for electronics. The engine doesn't know which retail it's pricing.

Two decisions carry the pattern:

- **The constraint set is the product surface.** A category manager's rules — cost floor, ladder, MAP, max-change — enter as declared constraints, not as code branches. That's also what the Mosaic-AI agentic layer builds on: natural-language policy compiles to constraints precisely because constraints are data.
- **Test the science, not just the code.** The synthetic data has a known elasticity per SKU baked in, so the notebooks can check that the model *recovers the truth* — a ground-truth harness most pricing stacks never have.

The trade-off to know upfront: generality is a discipline you keep paying for. The third vertical will arrive with "just one special case" that wants to live inside the engine — the moment it does, you're back to a fork with extra steps. Saying no is part of the architecture.

## Why it matters

It shows the full arc on one surface: the **data science** that turns price
history into a defensible elasticity, the **operations-research** that turns
elasticities and business rules into prices, and the **lakehouse + agentic
architecture** that would actually run it at a retailer — not just one slice.

→ See the [repository](https://github.com/fps4/retail-dynamic-pricing) — runnable
notebooks for both verticals.

→ See also [Data & lakehouse](/en/expertise/data-and-lakehouse) and
[AI & automation](/en/expertise/ai-and-automation).
