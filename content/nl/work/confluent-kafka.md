---
title: Confluent Kafka dataproductplatform
summary: Een Kafka-gebaseerd dataproductplatform dat 20+ datastreams productiseert over 30+ bronsystemen, met schema-governance en domeingeoriënteerd eigenaarschap.
hook: Streamingdata geproductiseerd over domeinen heen, met gegoverneerde schema's.
metric: 20+ dataproducten
order: 3
---

# Confluent Kafka dataproductplatform

*Een grote Britse telecomoperator. Klant geabstraheerd voor vertrouwelijkheid; technische scope zoals geleverd.*

## Context

De organisatie moest streamingdata over **30+ bronsystemen** omzetten in betrouwbare, herbruikbare dataproducten waarop analytics-teams konden vertrouwen — met duidelijk eigenaarschap en schema-evolutie die consumers downstream niet zou breken.

## Wat ik bouwde

Een **Confluent Kafka** dataproductplatform:

- **20+ geproductiseerde datastreams**, elk domeineigendom in plaats van centraal opgestopt.
- **Schema-governance** via Schema Registry, zodat producers en consumers onafhankelijk evolueren.
- **Hive LLAP en Spark 3** voor query-acceleratie over de gestreamde data.
- Een cross-team-eigenaarschapsmodel zodat domeinen, en niet een centrale queue, hun producten bezaten.

## Impact

- **20+ dataproducten** operationeel door de hele business heen.
- **30+ bronsystemen** geïntegreerd onder één gegoverneerd model.
- Domeingeoriënteerd eigenaarschap dat opschaalde zonder centrale poortwachter.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep) — ontwierp het platform en begeleidde grensoverschrijdende deliveryteams.

**Stack:** Apache Kafka (Confluent Cloud), Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ Zie ook [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Data & lakehouse](/nl/expertise/data-and-lakehouse).
