---
title: Event-driven & streaming
summary: Kafka en cloud-native streaming als de ruggengraat van moderne data en integratie — schema-evolutie, stream processing, en systemen waar teams op kunnen vertrouwen.
evidence: [integration-platform, sap-event-backbone, cloudera-kafka, cloud-gateway]
order: 3
group: domain
---

# Event-driven & streaming

Streaming is waar integratie- en data-architectuur samenkomen. Goed gedaan verandert een Kafka-ruggengraat broze nachtelijke batches in betrouwbare, observeerbare, bijna-realtime stromen waarop teams door de hele organisatie heen kunnen bouwen, zonder elke wijziging via een centrale queue te hoeven coördineren.

## Wat ik doe

- **Streaming-ruggengraten op Kafka.** Apache Kafka op Cloudera (CDP), AWS MSK, Azure Event Hubs — met Schema Registry die de evolutie governt, zodat producers en consumers onafhankelijk van elkaar kunnen bewegen.
- **Stream processing.** Kafka Streams, Spark Streaming en Kinesis voor de transformaties en aggregaties die tussen ruwe events en bruikbare data in zitten.
- **Event-driven patronen die productie overleven.** Outbox, idempotentie en event sourcing — plus de observability om te weten dat er iets mis is voordat een consumer dat merkt.

## Aangetoond door

- [Integratieplatform](/nl/work/integration-platform) — event-topics als in- en uitgang op één runtime, met runstatus per stap zodat een half afgeronde stroom zichtbaar is in plaats van verdwenen, en een gemeten antwoord op de vraag of serverless het aankon.
- [SAP-event-backbone](/nl/work/sap-event-backbone) — een broker-gebaseerde backbone (SAP Advanced Event Mesh over AMQP 1.0) waarbij subscriptiemodel, afleveringsgarantie en dead-letter-gedrag als contract zijn afgesproken voordat een van beide kanten code schreef.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka) — 20+ geproductiseerde datastreams over 30+ bronsystemen, met schema-governance en domeineigenaarschap.
- [Cloud Gateway](/nl/work/cloud-gateway) — event-driven integratie-adapters (SNS/SQS, Lambda-transformaties) binnen een cross-cloud API-platform.

Achtergrond: diepgaande Kafka (Connect, Schema Registry, Streams), plus NiFi, Hive en Spark over 20+ jaar datasystemen.
