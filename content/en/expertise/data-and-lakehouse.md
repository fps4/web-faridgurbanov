---
title: Data & lakehouse
summary: Cloud-native data platforms for analytics and AI. Medallion lakehouses, data contracts where the source hands off, and CDC pipelines that stay reliable.
evidence: [sap-snowflake, cloudera-kafka, portfolio]
order: 1
group: domain
---

# Data & lakehouse

Analytics and AI are only as good as the platform underneath them. I build that platform, raw to bronze to silver to gold, with the contracts and quality checks that keep it trustworthy as it grows.

## What I do

- **Medallion lakehouses.** Raw → bronze → silver → gold on Snowflake, Databricks/Delta and AWS (EMR, Glue, S3), with enough modelling that each tier earns its place. Where the estate is Azure-native, the Fabric-or-Databricks question gets answered per workload.
- **Contracts at the source handover.** Data contracts where operational systems meet the lakehouse (SAP Finance ledgers landing in Snowflake, for example), so an upstream change is caught at ingest instead of absorbed silently.
- **Reliable ingestion.** Change-data-capture and delta pipelines tuned for near-real-time sync, with lineage and quality monitoring behind them.

## Evidenced by

- [SAP S/4HANA Finance → Snowflake](/en/work/sap-snowflake): GL/AR/AP/CO/AA across ~30+ company codes, multi-terabyte backfill plus 10–30 GB daily delta, with contracts where SAP hands off to the lakehouse.
- [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka): productised streams with Hive LLAP and Spark 3 query acceleration.
- [Portfolio](/en/portfolio): three repositories that work the questions under this page. `sap-bdc-snowflake-blueprint` takes the handover question and answers it per object. Nine ordered rules assign each of 24 objects a mode (share zero-copy, replicate, federate, split, or keep it in SAP), with a cost model that gives the crossover frequency and a local simulation behind it. `azure-lakehouse-decision` asks the platform question the same way, Fabric or Databricks for a 20-workload Synapse estate, priced against Fabric's pre-paid capacity so that a workload's cost depends on what else is on the capacity; the two batch jobs that would have stepped F32 to F64 end up metered instead. And `ai-first-bi-platform` asks what the number means. Three defensible definitions of "active customer" (Operations', Analytics' and Finance's) return 953, 900 and 881 on one estate on one date, and the operational table cannot answer any of them, because a `status` column overwritten in place gives you today's answer under a historical label. Only the event stream can, which is what makes the ingestion design an architecture question.

Background: Databricks Certified Data Engineer Professional; Snowflake Core; Spark/PySpark, Delta Lake, PostgreSQL, Oracle.
