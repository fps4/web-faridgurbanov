---
title: Kafka-dataproductplatform op Cloudera
summary: Een Kafka-dataproductplatform op Cloudera dat 20+ datastreams tot producten maakt over 30+ bronsystemen, met schema-governance en eigenaarschap bij de domeinen.
hook: Streamingdata tot producten gemaakt over domeinen heen, met beheerde schema's.
metric: 20+ dataproducten
short: Kafka-dataproducten
client: Een grote Britse telecomoperator
disagreement: Een stream tot product maken betekent dat het producerende domein afnemers accepteert waar het nooit om vroeg, plus een schemabelofte en een SLA.
role: Data engineer en technology architect. Ontwierp het platform en begeleidde de teams over de landsgrenzen heen.
stack: [Apache Kafka, Cloudera CDP, Schema Registry, Hive LLAP, Spark 3]
order: 5
---

# Kafka-dataproductplatform op Cloudera

*Een grote Britse telecomoperator, in mijn Accenture-jaren, 2018–2020. Klant geabstraheerd om vertrouwelijkheidsredenen; technische scope zoals geleverd.*

## Context

Streamingdata uit **30+ bronsystemen** moest iets worden waar de analyticsteams op konden bouwen: herbruikbare dataproducten met een duidelijke eigenaar, en een schema dat kon veranderen zonder dat het brak bij wie het las.

## Wat ik bouwde

Een Kafka-dataproductplatform op **Cloudera (CDP)**:

- **20+ datastreams als product**, elk in eigendom van het domein dat ze produceert.
- **Schema-governance** via Schema Registry, zodat producenten en afnemers onafhankelijk van elkaar kunnen bewegen.
- **Hive LLAP en Spark 3** voor snellere queries over de gestreamde data.
- Een eigenaarschapsmodel over teams heen dat de producten bij de domeinen legde en het centrale team het platform liet beheren.

## Impact

- **20+ dataproducten** in gebruik door de hele organisatie.
- **30+ bronsystemen** aangesloten onder één beheerd model.
- Eigenaarschap bij de domeinen dat schaalde zonder centrale poortwachter in de keten.

## Het patroon erachter

![Diagram: 30+ bronsystemen voeden drie dataproducten in eigendom van domeinen, elk met een schemacontract in de registry, richting analytics-afnemers. Het platformteam beheert Cloudera, Schema Registry en de NiFi-templates eronder; de data blijft bij de domeinen.](/diagrams/cloudera-kafka-pattern.svg)

Een platform als dit begint meestal met een centraal ingestieteam dat eigenaar is van elk topic. Dat werkt bij vijf streams en stort in bij twintig, omdat het centrale team de wachtrij wordt waar iedereen in staat. Hier werd elke stream een product: het producerende domein was eigenaar van zijn schema, zijn SLA en het migratiepad van zijn afnemers als het schema veranderde.

Twee dingen droegen dat. Compatibiliteitsregels in de Schema Registry (standaard backward-compatible) betekenden dat een producent een wijziging kon uitrollen zonder change board; de registry controleerde het, en de vergadering verdween. En het platformteam was eigenaar van de weg, maar nooit van het verkeer. Cloudera, de registry, de NiFi-ingestietemplates en het eigenaarschapsmodel waren centraal; de data zelf niet. Daardoor konden 30+ bronsystemen aansluiten zonder dat het platformteam de flessenhals werd die het had vervangen.

Waar je nuchter over moet zijn: eigenaarschap bij de domeinen is een organisatorisch patroon in een technisch jasje. De registry kan compatibiliteit afdwingen. Ze kan een domein niet dwingen zijn product te bemensen. De streams die goed liepen hadden een benoemde eigenaar aan de producerende kant; de streams die achterbleven werden behandeld als een probleem van IT.

## Wie ja moest zeggen

**Stakeholders:** de domeinteams die de data produceerden en nu een schema en een SLA verschuldigd zouden zijn; het centrale ingestieteam, waarvan dit ontwerp de rol kleiner maakt; de analytics-afnemers die betrouwbare streams wilden en geen middel hadden om die af te dwingen; en de teams over de landsgrenzen heen die het bouwden.

**De onenigheid:** een stream tot product maken betekent dat het producerende domein afnemers accepteert waar het nooit om vroeg. Verschillende domeinen lazen dat als werk dat op hun bord belandde om andermans probleem op te lossen, en dat was niet onterecht. Het centrale team werd van zijn kant gevraagd de poortwachtersrol op te geven die zijn bezetting rechtvaardigde.

**Wat het oploste:** precies benoemen wat elke kant kreeg. Domeinen kregen compatibiliteitsregels in de registry, en daarmee het recht om een wijziging uit te rollen zonder langs een change board te gaan. Voor een producerend team was die vergadering kwijtraken meer waard dan wat de schemabelofte ze kostte. Het centrale team werd opnieuw gepositioneerd rond het platform (Cloudera, de registry, de NiFi-templates, het eigenaarschapsmodel), en dat is een betere baan dan ieders wachtrij zijn. Waar een domein geen eigenaar wilde toezeggen, schreef ik dat op in plaats van een stream uit te rollen met niemand erachter. Dat zijn de streams die later achterbleven, en omdat het vroeg was vastgelegd, was niemand verrast.

**Wat het kostte:** een schema- en supportverplichting voor elk producerend domein, permanent. De registry dwingt compatibiliteit af; het product bemensen blijft een managementbeslissing, per domein.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep). Ontwierp het platform en begeleidde de teams over de landsgrenzen heen.

**Stack:** Apache Kafka op Cloudera (CDP), Cloudera Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ Zie ook [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Data & lakehouse](/nl/expertise/data-and-lakehouse).
