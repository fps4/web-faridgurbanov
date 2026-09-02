---
title: Data & lakehouse
summary: Cloud-native dataplatformen voor analytics en AI — medallion-lakehouses, datacontracten op de bronnaad, en CDC-pipelines die betrouwbaar blijven.
evidence: [sap-snowflake, cloudera-kafka, portfolio]
order: 1
group: domain
---

# Data & lakehouse

Analytics en AI zijn alleen zo goed als het platform dat ze voedt. Ik bouw de cloud-native data-ruggengraat — raw naar bronze naar silver naar gold — met de contracten en kwaliteitscontroles die het betrouwbaar houden naarmate het groeit.

## Wat ik doe

- **Medallion-lakehouses.** Raw → bronze → silver → gold op Snowflake, Databricks/Delta en AWS (EMR, Glue, S3), met de modellering die elke laag zijn plaats laat verdienen — en waar het landschap Azure-native is, de vraag Fabric of Databricks beantwoord per workload in plaats van per feature.
- **Contracten op de bronnaad.** Datacontracten daar waar operationele systemen het lakehouse ontmoeten — bijvoorbeeld SAP Finance-grootboeken die in Snowflake landen — zodat wijzigingen bovenstrooms worden opgevangen en niet stilletjes worden geabsorbeerd.
- **Betrouwbare ingestie.** Change-data-capture en delta-pipelines afgestemd op bijna-realtime synchronisatie, met lineage en kwaliteitsmonitoring in plaats van hoop.

## Aangetoond door

- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake) — GL/AR/AP/CO/AA over ~30+ bedrijfscodes, een multi-terabyte backfill plus 10–30 GB dagelijkse delta, met contracten op de SAP↔lakehouse-naad.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka) — geproductiseerde streams met Hive LLAP en Spark 3 query-acceleratie.
- [Portfolio](/nl/portfolio) — `sap-bdc-snowflake-blueprint` neemt dezelfde naadvraag en beantwoordt hem per object: negen geordende regels wijzen elk van 24 objecten een modus toe — zero-copy delen, repliceren, federeren, splitsen, of in SAP houden — met een kostenmodel dat de omslagfrequentie geeft en een lokale simulatie erachter. `azure-lakehouse-decision` stelt de platformvraag op dezelfde manier: Fabric of Databricks voor een Synapse-landschap van 20 workloads, geprijsd tegen de vooruitbetaalde capaciteit van Fabric in plaats van een tarief per workload — waardoor de kosten van een workload afhangen van wat er verder op de capaciteit draait, en de twee batchjobs die F32 naar F64 zouden duwen gemeterd eindigen. En `ai-first-bi-platform` stelt de vraag die onder al deze ligt: wat betekent het getal. Drie verdedigbare definities van “actieve klant” — die van Operations, Analytics en Finance — geven 953, 900 en 881 op één landschap op één datum, en de operationele tabel kan er geen enkele beantwoorden: een `status`-kolom die ter plekke wordt overschreven geeft je het antwoord van vandaag onder een historisch label. Alleen de event-stream kan het wel, en dat maakt het ontsluiten van een event-sourced bron een architectuurbeslissing in plaats van een connectorkeuze.

Achtergrond: Databricks Certified Data Engineer Professional; Snowflake Core; Spark/PySpark, Delta Lake, PostgreSQL, Oracle.
