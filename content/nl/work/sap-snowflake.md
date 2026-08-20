---
title: SAP S/4HANA Finance → Snowflake
summary: Een cloud-native pipeline die SAP Finance-grootboeken naar een Snowflake-lakehouse verplaatst, met datacontracten op de naad — multi-TB backfill plus 10–30 GB dagelijkse delta over ~30+ bedrijfscodes.
hook: Een legacy SAP Finance-landschap omgevormd tot een cloud-native analytics-ruggengraat.
metric: ~30+ bedrijfscodes
order: 3
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

## Het patroon erachter

![Diagram: SAP Finance-ledgers stromen door een datacontract-gate naar EMR, Glue en S3, daarna het Snowflake-lakehouse — een brekende upstream-wijziging faalt luid bij de gate, niet stil in een financieel dashboard.](/diagrams/sap-snowflake-pattern.svg)

**Een contract op de naad, geen tests aan het einde.** De standaardvorm voor SAP-naar-cloud-analytics is de tabellen 's nachts overzetten en downstream dashboards de drift laten ontdekken — schemawijzigingen duiken weken later op als verkeerde cijfers in een financieel rapport, met het vertrouwen al verspeeld. Hier was de naad zelf het ontwerpvlak: datacontracten zitten waar SAP overdraagt aan het lakehouse, zodat een upstream-ledgerwijziging luid faalt bij ingest in plaats van stil downstream.

Twee beslissingen die dat lieten beklijven:

- **Faal op de grens, waar de schade nog goedkoop is.** Een contractschending op de naad is een pipeline-incident met een benoembare upstream-oorzaak. Dezelfde schending ontdekt in een dashboard is een vertrouwensincident — en financiële data staat of valt met vertrouwen.
- **Eén regio als referentie, niet als pilot.** De DACH-MVP was geen wegwerpbewijs — Terraform-geprovisioneerd wás die het uitrolsjabloon. "Pilot" en "referentiearchitectuur" zien er in een demo identiek uit en gedragen zich in jaar twee compleet anders.

De trade-off om vooraf te kennen: contracten leggen frictie waar SAP-teams die niet hadden — iemand upstream moet het contract bezitten en verantwoording afleggen bij een breuk. Dat is een onderhandeling, geen tool-installatie; de tooling maakt de afspraak pas afdwingbaar nadat de organisatie haar heeft gemaakt.

## Wie ja moest zeggen

**Stakeholders:** de Finance-organisatie die haar rapportage op het nieuwe warehouse zou moeten baseren; de SAP-architecten die het bronsysteem en de belasting ervan bezaten; en de regioteams die achter de DACH-MVP wachtten op hun eigen uitrol.

**Het meningsverschil:** een contract op de naad verplaatst werk stroomopwaarts. Het SAP-team had vóór dit ontwerp geen verplichtingen richting analytics en zou nu een schemabelofte bezitten en aanspreekbaar zijn als die brak — een echt verzoek, geen formaliteit. Finance had op zijn beurt geen reden om een nieuwe getallenbron meer te vertrouwen dan het grootboek dat het al gebruikte.

**Wat het oploste:** een controle in plaats van een discussie. Het afstemmen van de geladen data tegen het bronboek gaf Finance iets dat ze zelf konden draaien, en dat leverde de adoptie op. Met de SAP-architecten was de route om de source-to-target-mapping samen te doen in plaats van hem over te dragen. De extractiestrategie moest de belasting van hun systeem ontzien, en hun randvoorwaarde vormde het ontwerp — wat mij ook de benoemde eigenaar achter het contract opleverde.

**Wat het kostte:** extra werk stroomopwaarts waar dat er niet was, en een benoemde eigenaar achter elk contract. Dat eigenaarschap moest afgesproken zijn voordat er ook maar iets in code afdwingbaar werd.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep) — leverde de MVP en de referentiearchitectuur.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ Zie ook [Data & lakehouse](/nl/expertise/data-and-lakehouse).
