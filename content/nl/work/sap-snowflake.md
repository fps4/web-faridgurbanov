---
title: SAP S/4HANA Finance → Snowflake
summary: Een cloud-native pipeline die SAP Finance-grootboeken naar een Snowflake-lakehouse brengt, met datacontracten op de overdracht. Multi-TB backfill plus 10–30 GB dagelijkse delta over ~30+ bedrijfscodes.
hook: Een legacy SAP Finance-landschap omgevormd tot een cloud-native analyticsfundament.
metric: ~30+ bedrijfscodes
short: SAP Finance → Snowflake
client: Een wereldwijde productieklant (DACH-regio)
disagreement: Finance had al een grootboek dat het vertrouwde, en het contract op de overdracht verplaatste werk naar een SAP-team dat eerder geen verplichtingen richting analytics had.
role: Data engineer en technology architect. Leverde de MVP en de referentiearchitectuur op.
stack: [AWS EMR, AWS Glue, PySpark, Snowflake, Terraform]
order: 4
---

# SAP S/4HANA Finance → Snowflake

*Een wereldwijde productieklant (DACH-regio), in mijn Accenture-jaren, 2018–2020. Klant geabstraheerd om vertrouwelijkheidsredenen; cijfers en scope zoals geleverd.*

## Context

Een groot SAP Finance-landschap, de GL-, AR-, AP-, CO- en AA-grootboeken over **~30+ bedrijfscodes**, had een analyticsplatform in de cloud nodig. Volume was een deel van het werk. Het moeilijkere deel was de financiële data betrouwbaar houden op weg van SAP naar een lakehouse, want Finance zou alleen cijfers gebruiken die het zelf kon controleren.

## Wat ik bouwde

Een **SAP-naar-Snowflake**-pipeline op AWS:

- Ingestie en transformatie op **AWS EMR, Glue/PySpark en S3**, uitgerold met Terraform.
- Een **Snowflake**-lakehouse als analyticscatalogus.
- **Datacontracten op het punt waar SAP overdraagt aan het lakehouse**, zodat een wijziging in een bovenliggend grootboek de load laat falen in plaats van weken later stilletjes een rapport te vervuilen.
- Een MVP afgebakend op de DACH-regio en gebouwd als sjabloon voor de andere regio's.

## Impact

- **~30+ bedrijfscodes** in scope over de belangrijkste finance-grootboeken.
- Een **historische backfill van meerdere terabytes** plus **10–30 GB dagelijkse delta**.
- Een referentiearchitectuur die de klant regio voor regio kon uitbreiden.

## Het patroon erachter

![Diagram: SAP Finance-grootboeken stromen door een datacontractpoort naar EMR, Glue en S3, en vervolgens naar het Snowflake-lakehouse. Een brekende wijziging bovenstrooms faalt hoorbaar bij de poort in plaats van stilletjes in een finance-dashboard.](/diagrams/sap-snowflake-pattern.svg)

Het meeste SAP-naar-cloud-analyticswerk tilt de tabellen 's nachts over en laat de dashboards de afwijkingen ontdekken. Een schemawijziging in SAP duikt weken later op als een verkeerd getal in een financieel rapport, en tegen die tijd is het vertrouwen al weg. Hier was de overdracht zelf het ding dat we ontwierpen. De datacontracten zitten op het punt waar SAP overdraagt aan het lakehouse, en een grootboekwijziging die er een breekt, faalt bij ingestie, als een pipeline-incident met een benoemde oorzaak bovenstrooms. Dezelfde wijziging ontdekt in een dashboard is een vertrouwensincident, en financiële data overleeft daar niet veel van.

De andere keuze die ertoe deed was waar de DACH-MVP voor was. Het is nooit een wegwerpbewijs geweest. Vanaf het begin met Terraform uitgerold, wás het het uitrolsjabloon, en de regio's erachter namen het over zoals het gebouwd was. Een pilot en een referentiearchitectuur zien er in een demo hetzelfde uit en gedragen zich in jaar twee heel anders.

Contracten hebben een prijs, en die valt bovenstrooms. Iemand aan de SAP-kant moet eigenaar worden van het contract en verantwoording afleggen als het breekt, waar die eerder geen enkele verplichting richting analytics had. Dat is eerst een onderhandeling en dan pas een tool. De tooling dwingt alleen een afspraak af die de organisatie al gemaakt heeft.

## Wie ja moest zeggen

**Stakeholders:** de Finance-organisatie die haar rapportage op het nieuwe warehouse zou gaan draaien; de SAP-architecten die eigenaar waren van het bronsysteem en de belasting ervan; en de regionale teams die achter de DACH-MVP wachtten op hun eigen uitrol.

**De onenigheid:** een contract op de overdracht verplaatst werk naar boven. Het SAP-team had voor dit ontwerp geen verplichtingen richting analytics en zou nu eigenaar worden van een schemabelofte. Finance had intussen een grootboek dat het al vertrouwde en geen reden om een tweede bron van cijfers te verkiezen.

**Wat het oploste:** een controle die Finance zelf kon draaien. De geladen data aansluiten op het brongrootboek gaf ze iets om te verifiëren, en de adoptie volgde op die controle. Met de SAP-architecten deden we de bron-naar-doel-mapping samen in plaats van hem over de schutting te gooien. Hun randvoorwaarde, de belasting op hun productiesysteem beschermen, bepaalde de extractiestrategie, en binnen die randvoorwaarde werken is ook wat mij een benoemde eigenaar achter het contract opleverde.

**Wat het kostte:** werk bovenstrooms waar er eerder geen was, en een benoemde eigenaar achter elk contract. Dat eigenaarschap moest afgesproken zijn voordat er iets van in code afgedwongen kon worden.

## Rol & stack

Data engineer en technology architect (Accenture CTA-groep). Leverde de MVP en de referentiearchitectuur op.

**Stack:** AWS (EMR, Glue, S3), PySpark, Snowflake, Terraform, Python.

→ Zie ook [Data & lakehouse](/nl/expertise/data-and-lakehouse).
