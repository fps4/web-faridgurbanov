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

## Role & stack

Data engineer and technology architect (Accenture CTA group) — delivered the MVP and the reference architecture.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ See also [Data & lakehouse](/en/expertise/data-and-lakehouse).
