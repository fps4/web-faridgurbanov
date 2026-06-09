---
title: SAP S/4HANA Finance → Snowflake
summary: Een cloud-native pipeline die SAP Finance-grootboeken naar een Snowflake-lakehouse verplaatst, met datacontracten op de naad — multi-TB backfill plus 10–30 GB dagelijkse delta over ~30+ bedrijfscodes.
hook: Een legacy SAP Finance-landschap omgevormd tot een cloud-native analytics-ruggengraat.
metric: ~30+ bedrijfscodes
order: 2
---

# SAP S/4HANA Finance → Snowflake

*Een wereldwijde productieklant (DACH-regio). Klant geabstraheerd voor vertrouwelijkheid; metrics en scope zoals geleverd.*

## Context

Een groot SAP Finance-landschap — GL-, AR-, AP-, CO- en AA-grootboeken over **~30+ bedrijfscodes** — had een cloud-native analytics-ruggengraat nodig. De uitdaging was niet alleen volume; het was de financiële data betrouwbaar houden terwijl die van SAP naar een lakehouse overging, zodat analytics erop kon vertrouwen.

## Wat ik bouwde

Een cloud-native **SAP-naar-Snowflake**-pipeline op AWS:

- Ingestie en transformatie met **AWS EMR, Glue/PySpark en S3**, geprovisioneerd via Terraform.
- Een **Snowflake**-lakehouse als de analytics-catalogus.
- **Datacontracten op de SAP↔lakehouse-naad**, zodat een wijziging in een bovenstrooms grootboek wordt opgevangen in plaats van stilletjes de downstream-analytics te corrumperen.
- Een MVP afgebakend op de DACH-regio als referentie voor bredere uitrol.

## Impact

- **~30+ bedrijfscodes** in scope over de belangrijkste financiële grootboeken.
- Een **multi-terabyte historische backfill** plus **10–30 GB dagelijkse delta**-ingestie.
- Een referentiearchitectuur die de klant regio voor regio kon uitbreiden.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep) — leverde de MVP en de referentiearchitectuur.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ Zie ook [Data & lakehouse](/nl/expertise/data-and-lakehouse).
