---
title: Kafka-dataproductplatform op Cloudera
summary: Een Cloudera-gebaseerd Kafka-dataproductplatform dat 20+ datastreams productiseert over 30+ bronsystemen, met schema-governance en domeingeoriënteerd eigenaarschap.
hook: Streamingdata geproductiseerd over domeinen heen, met gegoverneerde schema's.
metric: 20+ dataproducten
order: 3
---

# Kafka-dataproductplatform op Cloudera

*Een grote Britse telecomoperator. Klant geabstraheerd voor vertrouwelijkheid; technische scope zoals geleverd.*

## Context

De organisatie moest streamingdata over **30+ bronsystemen** omzetten in betrouwbare, herbruikbare dataproducten waarop analytics-teams konden vertrouwen — met duidelijk eigenaarschap en schema-evolutie die consumers downstream niet zou breken.

## Wat ik bouwde

Een Kafka-dataproductplatform op **Cloudera (CDP)**:

- **20+ geproductiseerde datastreams**, elk domeineigendom in plaats van centraal opgestopt.
- **Schema-governance** via Schema Registry, zodat producers en consumers onafhankelijk evolueren.
- **Hive LLAP en Spark 3** voor query-acceleratie over de gestreamde data.
- Een cross-team-eigenaarschapsmodel zodat domeinen, en niet een centrale queue, hun producten bezaten.

## Impact

- **20+ dataproducten** operationeel door de hele business heen.
- **30+ bronsystemen** geïntegreerd onder één gegoverneerd model.
- Domeingeoriënteerd eigenaarschap dat opschaalde zonder centrale poortwachter.

## Het patroon erachter

**Domeineigendom van dataproducten in plaats van een centraal pipelineteam.** De standaardvorm voor zo'n platform is een centraal ingestion-team dat elk topic bezit — dat werkt bij 5 streams en stort in bij 20. Hier werd elke stream geproductiseerd: het producerende domein bezat zijn schema, zijn SLA's en het migratiepad van zijn consumers.

Twee beslissingen die dat lieten beklijven:

- **Schema-evolutie als governancecontract, niet als serialisatiedetail.** Compatibiliteitsregels in de Schema Registry (standaard backward-compatible) betekenden dat een producer wijzigingen kon uitrollen zonder change board — de registry, niet een vergadering, was de poortwachter. Governance verschoof van proces naar platform.
- **Het platformteam bezit de verharde weg, niet het verkeer.** Cloudera, de registry, NiFi-ingestiontemplates en het eigenaarschapsmodel waren centraal; de data zelf nooit. Daardoor konden 30+ bronsystemen aansluiten zonder dat het platformteam de bottleneck werd die het verving.

De trade-off om vooraf te kennen: domeineigendom is een organisatiepatroon in een technisch jasje. De registry dwingt compatibiliteit af; ze kan een domein niet dwingen zijn product te bemensen. De streams die floreerden hadden een benoemde eigenaar aan de producerende kant — de streams die achterbleven waren degene die als "een IT-probleem" werden behandeld.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep) — ontwierp het platform en begeleidde grensoverschrijdende deliveryteams.

**Stack:** Apache Kafka op Cloudera (CDP), Cloudera Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ Zie ook [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Data & lakehouse](/nl/expertise/data-and-lakehouse).
