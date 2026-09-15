---
title: Data & lakehouse
summary: Cloud-native dataplatformen voor analytics en AI. Medallion-lakehouses, datacontracten op het punt waar de bron overdraagt, en CDC-pipelines die betrouwbaar blijven.
evidence: [sap-snowflake, cloudera-kafka, portfolio]
order: 1
group: domain
---

# Data & lakehouse

Analytics en AI zijn maar zo goed als het platform eronder. Dat platform bouw ik, van raw naar bronze naar silver naar gold, met de contracten en kwaliteitscontroles die het betrouwbaar houden terwijl het groeit.

## Wat ik doe

- **Medallion-lakehouses.** Raw → bronze → silver → gold op Snowflake, Databricks/Delta en AWS (EMR, Glue, S3), met genoeg modellering dat elke laag zijn plek verdient. Waar het landschap Azure-native is, wordt de Fabric-of-Databricks-vraag per workload beantwoord.
- **Contracten op de overdracht vanuit de bron.** Datacontracten waar operationele systemen het lakehouse raken (SAP Finance-grootboeken die in Snowflake landen, bijvoorbeeld), zodat een wijziging bovenstrooms bij ingestie wordt gevangen in plaats van stilletjes opgenomen.
- **Betrouwbare ingestie.** Change-data-capture en deltapipelines afgestemd op near-realtime synchronisatie, met lineage en kwaliteitsmonitoring erachter.

## Aangetoond door

- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake): GL/AR/AP/CO/AA over ~30+ bedrijfscodes, backfill van meerdere terabytes plus 10–30 GB dagelijkse delta, met contracten op het punt waar SAP overdraagt aan het lakehouse.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka): streams als product, met Hive LLAP en Spark 3 voor snellere queries.
- [Portfolio](/nl/portfolio): drie repositories die de vragen onder deze pagina uitwerken. `sap-bdc-snowflake-blueprint` neemt de overdrachtsvraag en beantwoordt die per object. Negen geordende regels wijzen elk van 24 objecten een modus toe (zero-copy delen, repliceren, federeren, splitsen, of in SAP houden), met een kostenmodel dat de omslagfrequentie geeft en een lokale simulatie erachter. `azure-lakehouse-decision` stelt de platformvraag op dezelfde manier, Fabric of Databricks voor een Synapse-landschap van 20 workloads, geprijsd tegen de vooruitbetaalde capaciteit van Fabric zodat de kosten van een workload afhangen van wat er verder op de capaciteit staat; de twee batchjobs die F32 naar F64 zouden hebben getild, worden uiteindelijk gemeterd. En `ai-first-bi-platform` vraagt wat het getal betekent. Drie verdedigbare definities van "actieve klant" (die van Operations, Analytics en Finance) geven 953, 900 en 881 op één landschap op één datum, en de operationele tabel kan er geen van beantwoorden, omdat een `status`-kolom die ter plekke wordt overschreven je het antwoord van vandaag geeft onder een historisch label. Alleen de eventstream kan het wel, en dat maakt het ingestieontwerp een architectuurvraag.

Achtergrond: Databricks Certified Data Engineer Professional; Snowflake Core; Spark/PySpark, Delta Lake, PostgreSQL, Oracle.
