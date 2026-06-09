---
title: Data & lakehouse
summary: Cloud-native dataplatformen voor analytics en AI — medallion-lakehouses, datacontracten op de bronnaad, en CDC-pipelines die betrouwbaar blijven.
order: 4
---

# Data & lakehouse

Analytics en AI zijn alleen zo goed als het platform dat ze voedt. Ik bouw de cloud-native data-ruggengraat — raw naar bronze naar silver naar gold — met de contracten en kwaliteitscontroles die het betrouwbaar houden naarmate het groeit.

## Wat ik doe

- **Medallion-lakehouses.** Raw → bronze → silver → gold op Snowflake, Databricks/Delta en AWS (EMR, Glue, S3), met de modellering die elke laag zijn plaats laat verdienen.
- **Contracten op de bronnaad.** Datacontracten daar waar operationele systemen het lakehouse ontmoeten — bijvoorbeeld SAP Finance-grootboeken die in Snowflake landen — zodat wijzigingen bovenstrooms worden opgevangen en niet stilletjes worden geabsorbeerd.
- **Betrouwbare ingestie.** Change-data-capture en delta-pipelines afgestemd op bijna-realtime synchronisatie, met lineage en kwaliteitsmonitoring in plaats van hoop.

## Aangetoond door

- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake) — GL/AR/AP/CO/AA over ~30+ bedrijfscodes, een multi-terabyte backfill plus 10–30 GB dagelijkse delta, met contracten op de SAP↔lakehouse-naad.
- [Confluent Kafka dataproductplatform](/nl/work/confluent-kafka) — geproductiseerde streams met Hive LLAP en Spark 3 query-acceleratie.

Achtergrond: Databricks Certified Data Engineer Professional; Snowflake Core; Spark/PySpark, Delta Lake, PostgreSQL, Oracle.
