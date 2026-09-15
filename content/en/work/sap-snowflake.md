---
title: SAP S/4HANA Finance → Snowflake
summary: A cloud-native pipeline moving SAP Finance ledgers into a Snowflake lakehouse, with data contracts at the handover: multi-TB backfill plus 10–30 GB daily delta across ~30+ company codes.
hook: A legacy SAP Finance estate turned into a cloud-native analytics backbone.
metric: ~30+ company codes
short: SAP Finance → Snowflake
client: A global manufacturing client (DACH region)
disagreement: Finance already had a ledger it trusted, and the contract at the handover moved work onto a SAP team that had no obligations toward analytics before.
role: Data engineer and technology architect. Delivered the MVP and the reference architecture.
stack: [AWS EMR, AWS Glue, PySpark, Snowflake, Terraform]
order: 4
---

# SAP S/4HANA Finance → Snowflake

*A global manufacturing client (DACH region), during my Accenture years, 2018–2020. Client abstracted for confidentiality; metrics and scope as delivered.*

## Context

A large SAP Finance estate, the GL, AR, AP, CO and AA ledgers across **~30+ company codes**, needed an analytics platform in the cloud. Volume was part of the job. The harder part was keeping finance data trustworthy on its way from SAP into a lakehouse, because Finance would only use numbers it could check.

## What I built

A **SAP-to-Snowflake** pipeline on AWS:

- Ingestion and transformation on **AWS EMR, Glue/PySpark and S3**, provisioned with Terraform.
- A **Snowflake** lakehouse as the analytics catalogue.
- **Data contracts where SAP hands off to the lakehouse**, so a change in an upstream ledger fails the load instead of quietly corrupting a report weeks later.
- An MVP scoped to the DACH region and built as the template for the other regions.

## Impact

- **~30+ company codes** in scope across the main finance ledgers.
- A **multi-terabyte historical backfill** plus **10–30 GB of daily delta**.
- A reference architecture the client could extend region by region.

## The pattern behind it

![Diagram: SAP Finance ledgers flow through a data-contract gate into EMR, Glue and S3, then the Snowflake lakehouse. A breaking upstream change fails loudly at the gate rather than silently in a finance dashboard.](/diagrams/sap-snowflake-pattern.svg)

Most SAP-to-cloud analytics work lifts the tables nightly and lets the dashboards discover the drift. A schema change in SAP shows up as a wrong number in a finance report some weeks later, by which point the trust has already gone. Here the handover itself was the thing we designed. The data contracts sit where SAP hands off to the lakehouse, and a ledger change that breaks one fails at ingest, as a pipeline incident with a named upstream cause. The same change discovered in a dashboard is a trust incident, and finance data does not survive many of those.

The other choice that mattered was what the DACH MVP was for. It was never a throwaway proof. Terraform-provisioned from the start, it was the rollout template, and the regions behind it inherited it as built. A pilot and a reference architecture look identical in a demo and behave very differently in year two.

Contracts have a cost, and it lands upstream. Somebody on the SAP side has to own the contract and answer for breaking it, where before they had no obligation towards analytics at all. That is a negotiation before it is a tool. The tooling only enforces an agreement the organisation has already made.

## Who had to say yes

**Stakeholders:** the Finance organisation that would run its reporting off the new warehouse; the SAP-side architects who owned the source system and its load; and the regional teams queued behind the DACH MVP for their own rollout.

**The disagreement:** a contract at the handover moves work upstream. The SAP team had no obligations towards analytics before this design and would now own a schema promise. Finance, meanwhile, had a ledger it already trusted and no reason to prefer a second source of numbers.

**What resolved it:** a check Finance could run themselves. Balancing the loaded data against the source ledger gave them something to verify, and adoption followed the check. With the SAP architects we did the source-to-target mapping together instead of handing it over. Their constraint, protecting the load on their production system, shaped the extraction strategy, and working inside that constraint is also what got me a named owner behind the contract.

**What it cost:** work upstream where there had been none, and a named owner behind every contract. That ownership had to be agreed before any of it could be enforced in code.

## Role & stack

Data engineer and technology architect (Accenture CTA group). Delivered the MVP and the reference architecture.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ See also [Data & lakehouse](/en/expertise/data-and-lakehouse).
