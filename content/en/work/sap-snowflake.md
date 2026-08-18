---
title: SAP S/4HANA Finance → Snowflake
summary: A cloud-native pipeline moving SAP Finance ledgers into a Snowflake lakehouse, with data contracts at the seam — multi-TB backfill plus 10–30 GB daily delta across ~30+ company codes.
hook: A legacy SAP Finance estate turned into a cloud-native analytics backbone.
metric: ~30+ company codes
order: 2
---

# SAP S/4HANA Finance → Snowflake

*A global manufacturing client (DACH region). Client abstracted for confidentiality; metrics and scope as delivered.*

## Context

A large SAP Finance estate — GL, AR, AP, CO and AA ledgers across **~30+ company codes** — needed a cloud-native analytics backbone. The challenge wasn't only volume; it was keeping the finance data trustworthy as it crossed from SAP into a lakehouse, so analytics could rely on it.

## What I built

A cloud-native **SAP-to-Snowflake** pipeline on AWS:

- Ingestion and transformation with **AWS EMR, Glue/PySpark and S3**, provisioned via Terraform.
- A **Snowflake** lakehouse as the analytics catalog.
- **Data contracts at the SAP↔lakehouse seam**, so a change in an upstream ledger is caught rather than silently corrupting downstream analytics.
- An MVP scoped to the DACH region as the reference for wider rollout.

## Impact

- **~30+ company codes** in scope across the main finance ledgers.
- A **multi-terabyte historical backfill** plus **10–30 GB of daily delta** ingest.
- A reference architecture the client could extend region by region.

## The pattern behind it

![Diagram: SAP Finance ledgers flow through a data-contract gate into EMR, Glue and S3, then the Snowflake lakehouse — a breaking upstream change fails loudly at the gate, not silently in a finance dashboard.](/diagrams/sap-snowflake-pattern.svg)

**A contract at the seam, not tests at the end.** The default shape for SAP-to-cloud analytics is to lift the tables nightly and let downstream dashboards discover the drift — schema changes surface as wrong numbers in a finance report, weeks later, with trust already spent. Here the seam itself was the design surface: data contracts sit where SAP hands off to the lakehouse, so an upstream ledger change fails loudly at ingest instead of silently downstream.

Two decisions made that stick:

- **Fail at the boundary, where the damage is still cheap.** A contract violation at the seam is a pipeline incident with a named upstream cause. The same violation discovered in a dashboard is a trust incident — and finance data lives or dies on trust.
- **One region as the reference, not a pilot.** The DACH MVP wasn't a throwaway proof — Terraform-provisioned, it *was* the rollout template. "Pilot" and "reference architecture" look identical in a demo and behave completely differently in year two.

The trade-off to know upfront: contracts put friction where SAP teams had none — someone upstream has to own the contract and answer for breaking it. That's a negotiation, not a tool install; the tooling only makes the agreement enforceable after the organisation has made it.

## Who had to say yes

**Stakeholders:** the Finance organisation that would have to run its reporting off the new warehouse; the SAP-side architects who owned the source system and its load; and the regional teams waiting behind the DACH MVP for their own rollout.

**The disagreement:** a contract at the seam moves work upstream. The SAP team had no obligations toward analytics before this design and would now own a schema promise and answer for breaking it — a genuine ask, not a formality. Finance, meanwhile, had no reason to trust a new number source over the ledger it already used.

**What resolved it:** reconciliation, not persuasion. Balancing the loaded data against the source ledger gave Finance a check it could run itself, which is what actually earned adoption. With the SAP architects the route was source-to-target mapping done together rather than handed over — the extraction strategy had to protect their system's load, and it was their constraint that shaped it.

**What it cost:** friction upstream where there had been none, and a named owner behind every contract. That ownership had to be agreed before any of it could be enforced in code.

## Role & stack

Data engineer and technology architect (Accenture CTA group) — delivered the MVP and the reference architecture.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ See also [Data & lakehouse](/en/expertise/data-and-lakehouse).
