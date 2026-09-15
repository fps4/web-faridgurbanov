---
title: Event-driven & streaming
summary: Kafka en cloud-native streaming als basis van moderne data en integratie. Schema-evolutie, stream processing, en systemen waar teams op kunnen bouwen.
evidence: [integration-platform, sap-event-backbone, cloudera-kafka, cloud-gateway]
order: 3
group: domain
---

# Event-driven & streaming

Streaming is waar integratie en data-architectuur elkaar raken. Goed gedaan vervangt een Kafka-backbone kwetsbare nachtelijke batches door observeerbare, near-realtime stromen waar teams in de hele organisatie op kunnen bouwen zonder elke wijziging via een centrale wachtrij te laten lopen.

## Wat ik doe

- **Streamingbackbones op Kafka.** Apache Kafka op Cloudera (CDP), AWS MSK, Azure Event Hubs, met Schema Registry die de evolutie beheert zodat producenten en afnemers onafhankelijk kunnen bewegen.
- **Stream processing.** Kafka Streams, Spark Streaming en Kinesis voor de transformaties en aggregaties tussen ruwe events en bruikbare data.
- **Event-driven patronen die productie overleven.** Outbox, idempotentie, event sourcing, en de observability om te weten dat er iets mis is voordat een afnemer het merkt.

## Aangetoond door

- [Integratieplatform](/nl/work/integration-platform): event-topics aan de in- en uitgang op één runtime, met per stap de runstatus zodat een half afgemaakte stroom zichtbaar is, en een gemeten antwoord op de vraag of serverless het kon dragen.
- [SAP-event-backbone](/nl/work/sap-event-backbone): een broker-gebaseerde backbone (SAP Advanced Event Mesh over AMQP 1.0) waarvan het abonnementsmodel, de afleveringsgarantie en het dead-lettergedrag als contract zijn afgesproken voordat een van beide kanten code schreef.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka): 20+ datastreams als product over 30+ bronsystemen, met schema-governance en eigenaarschap bij de domeinen.
- [Cloud Gateway](/nl/work/cloud-gateway): event-driven integratieadapters (SNS/SQS, Lambda-transformaties) binnen een cross-cloud API-platform.

Achtergrond: Kafka in de diepte (Connect, Schema Registry, Streams), plus NiFi, Hive en Spark, over 20+ jaar datasystemen.
