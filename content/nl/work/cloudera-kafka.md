---
title: Kafka-dataproductplatform op Cloudera
summary: Een Cloudera-gebaseerd Kafka-dataproductplatform dat 20+ datastreams productiseert over 30+ bronsystemen, met schema-governance en domeingeoriënteerd eigenaarschap.
hook: Streamingdata geproductiseerd over domeinen heen, met gegoverneerde schema's.
metric: 20+ dataproducten
short: Kafka-dataproducten
client: Een grote Britse telecomoperator
disagreement: Een stream productiseren betekent dat het producerende domein afnemers accepteert waar het nooit om vroeg, plus een schemabelofte en een SLA.
role: Data engineer en technology architect — platform ontworpen en cross-border teams begeleid.
stack: [Apache Kafka, Cloudera CDP, Schema Registry, Hive LLAP, Spark 3]
order: 4
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

![Diagram: 30+ bronsystemen voeden drie domein-eigen dataproducten, elk met een schemacontract in de registry, richting analytics-consumers — alles op een platform-verharde-weg van Cloudera, Schema Registry en NiFi-templates die de weg bezit, niet het verkeer.](/diagrams/cloudera-kafka-pattern.svg)

**Domeineigendom van dataproducten in plaats van een centraal pipelineteam.** De standaardvorm voor zo'n platform is een centraal ingestion-team dat elk topic bezit — dat werkt bij 5 streams en stort in bij 20. Hier werd elke stream geproductiseerd: het producerende domein bezat zijn schema, zijn SLA's en het migratiepad van zijn consumers.

Twee beslissingen die dat lieten beklijven:

- **Schema-evolutie als governancecontract, niet als serialisatiedetail.** Compatibiliteitsregels in de Schema Registry (standaard backward-compatible) betekenden dat een producer wijzigingen kon uitrollen zonder change board — de registry, niet een vergadering, was de poortwachter. Governance verschoof van proces naar platform.
- **Het platformteam bezit de verharde weg, niet het verkeer.** Cloudera, de registry, NiFi-ingestiontemplates en het eigenaarschapsmodel waren centraal; de data zelf nooit. Daardoor konden 30+ bronsystemen aansluiten zonder dat het platformteam de bottleneck werd die het verving.

De trade-off om vooraf te kennen: domeineigendom is een organisatiepatroon in een technisch jasje. De registry dwingt compatibiliteit af; ze kan een domein niet dwingen zijn product te bemensen. De streams die floreerden hadden een benoemde eigenaar aan de producerende kant — de streams die achterbleven waren degene die als "een IT-probleem" werden behandeld.

## Wie ja moest zeggen

**Stakeholders:** de domeinteams die de data produceerden en nu een schema en een SLA schuldig waren; een centraal ingestieteam wiens rol dit ontwerp bewust verkleint; de analytics-afnemers die betrouwbare streams wilden en geen middel hadden om die af te dwingen; en de cross-border deliveryteams die het bouwden.

**De onenigheid:** een stream productiseren betekent dat het producerende domein afnemers accepteert waar het niet om gevraagd heeft. Meerdere domeinen lazen dat als werk dat op hun bord kwam om andermans probleem op te lossen — en dat was niet onterecht. Het centrale team werd ondertussen gevraagd de poortwachtersrol op te geven die zijn bezetting rechtvaardigde.

**Wat het oploste:** duidelijk zijn over wat elke kant er werkelijk aan overhield. Domeinen kregen compatibiliteitsregels in de Schema Registry, waarmee ze een wijziging konden uitrollen zonder change board. Voor een producerend team was het niet meer hoeven bijwonen van dat overleg meer waard dan de schemabelofte hun kostte. Het centrale team werd geherpositioneerd rond de gebaande weg — Cloudera, de registry, NiFi-templates, het eigenaarschapsmodel — in plaats van rond het verkeer, en dat is een betere baan dan de wachtrij van iedereen zijn. Waar een domein geen eigenaar wilde vrijmaken, heb ik dat opgeschreven in plaats van een stream op te leveren waar niemand achter stond. Dat zijn de streams die later achterbleven, en het vroeg vastleggen is waarom dat een bekend risico was in plaats van een verrassing.

**Wat het kostte:** een blijvende schema- en supportverplichting voor elk producerend domein. Domeineigenaarschap is een organisatiepatroon in een technisch kostuum; de registry dwingt compatibiliteit af, maar kan een domein niet dwingen zijn product te bemensen.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep) — ontwierp het platform en begeleidde grensoverschrijdende deliveryteams.

**Stack:** Apache Kafka op Cloudera (CDP), Cloudera Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ Zie ook [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Data & lakehouse](/nl/expertise/data-and-lakehouse).
