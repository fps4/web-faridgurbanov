---
title: Architectuurbeslissingen
summary: De keuze maken en vastleggen. Een doelarchitectuur met een route ernaartoe, decision records die benoemen wat een keuze kost, en C4 op de hoogte die het publiek nodig heeft.
evidence: [sap-snowflake, cloud-gateway, portfolio]
order: 8
group: practice
---

# Architectuurbeslissingen

Een diagram heeft een korte houdbaarheid. De redenering erachter zou een lange moeten hebben, maar die zit meestal in het hoofd van één architect, en achttien maanden later heropent een team een afgesloten vraag omdat niemand kan zeggen waarom hij was afgesloten. Het meeste architectuurwerk dat ik doe is een keuze maken, benoemen wat die kost, en hem ergens neerleggen waar hij aangevochten kan worden.

## Wat ik doe

- **Een doelarchitectuur met een route ernaartoe.** Een eindplaat waar je van hieruit niet kunt komen is erger dan geen doel. Het op te leveren product is de volgorde: wat als eerste verhuist, wat ongemoeid blijft draaien, en welke stap omkeerbaar is als de eerste verkeerd blijkt.
- **Decision records die de prijs benoemen.** Context, de overwogen opties, de keuze, en de gevolgen, inclusief het deel dat pijn doet. Een beslissing die gratis leest, is niet geanalyseerd. Een beslissing waarvan de prijs is opgeschreven, overleeft de eerste keer dat iemand hem betaalt.
- **C4 op de juiste hoogte.** Een contextdiagram voor de stuurgroep, een containerdiagram voor de teams, een componentdiagram alleen waar het detail gewicht draagt. Diagrammen op maat van hun publiek worden gebruikt; één enorm diagram voor iedereen wordt door iedereen genegeerd.
- **Bouwen, kopen of afscheid nemen.** Beslissingen over leveranciersconsolidatie en uitfasering komen met een kostenmodel: wat de huidige oplossing kost om te houden, wat de exit kost om te draaien, en waar het omslagpunt ligt.
- **Een beslissing expliciet intrekken.** Een ADR vervangen, in plaats van hem stilletjes te laten verlopen, is wat het archief twee jaar later nog de moeite van het lezen waard maakt.

## Aangetoond door

- [Bepalen wat er over de SAP↔Snowflake-grens gaat](/nl/writing/sap-snowflake-seam-decision): een decision record in het openbaar. Wat oversteekt, wat blijft, en de regels die dat bepalen.
- [Bepalen waar een Synapse-landschap heen gaat](/nl/writing/synapse-platform-decision): dezelfde discipline een laag hoger, met een einddatum eraan. Tien geordende regels over Fabric, Databricks en Snowflake, en een platform dat het best geprijsd was op de workloads die het niet mocht hebben.
- [Cloud Gateway](/nl/work/cloud-gateway): één standaard over twee clouds, met de blijvende prijs van die belofte vooraf benoemd.
- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake): een contract op het punt waar SAP overdraagt aan het lakehouse, en één regio gebouwd als referentiearchitectuur voor de rest.
- [Portfolio](/nl/portfolio): `sap-bdc-snowflake-blueprint` maakt van dezelfde overdrachtsvraag negen geordende regels en een kostenmodel dat je kunt draaien.

Achtergrond: TOGAF 9 Certified; Accenture Certified Technology Architect; C4, architecture decision records en het governancevocabulaire van DAMA-DMBOK als dagelijkse praktijk.
