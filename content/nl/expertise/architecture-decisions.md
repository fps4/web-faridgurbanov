---
title: Architectuurbeslissingen
summary: De keuze maken én vastleggen — een doelarchitectuur met een route ernaartoe, decision records die benoemen wat een keuze kost, en C4 op de hoogte die het publiek echt nodig heeft.
order: 8
group: practice
---

# Architectuurbeslissingen

Een diagram heeft een korte houdbaarheid. De redenering erachter zou een lange moeten hebben — maar meestal leeft die in het hoofd van één architect, en achttien maanden later heropent een team een beslechte vraag omdat niemand nog kan zeggen waaróm die beslecht was. Het grootste deel van mijn architectuurwerk is een keuze maken, benoemen wat die kost, en hem ergens neerleggen waar erover te discussiëren valt.

## Wat ik doe

- **Een doelarchitectuur met een route ernaartoe.** Een eindplaatje waar je vanaf hier niet kunt komen is erger dan geen doel. Het resultaat is de volgorde — wat als eerste beweegt, wat ongemoeid blijft draaien, en welke stap terug te draaien is als de eerste verkeerd blijkt.
- **Decision records die de prijs benoemen.** Context, de opties die echt zijn overwogen, de keuze, en de gevolgen — inclusief het deel dat pijn doet. Een beslissing die gratis lijkt is niet geanalyseerd; een beslissing waarvan de prijs is opgeschreven overleeft het moment dat iemand hem betaalt.
- **C4 op de juiste hoogte.** Een contextdiagram voor de stuurgroep, een containerdiagram voor de teams, een componentdiagram alleen waar het detail ertoe doet. Diagrammen op maat van hun publiek worden gebruikt; één enorm diagram voor iedereen wordt door iedereen genegeerd.
- **Bouwen, kopen of eruit stappen.** Leverancierskeuzes en uitfasering krijgen een kostenmodel, geen voorkeur — wat de bestaande situatie kost om te houden, wat de exit kost om te draaien, en waar het omslagpunt ligt.
- **Bewust een beslissing intrekken.** Een ADR expliciet vervangen, in plaats van hem stilletjes niet meer waar te laten zijn, is wat het logboek twee jaar later nog leesbaar houdt.

## Aangetoond door

- [De SAP ↔ Snowflake-naadbeslissing](/nl/writing/sap-snowflake-seam-decision) — een decision record in het openbaar: wat de naad oversteekt, wat blijft, en de regels die dat bepalen.
- [Cloud Gateway](/nl/work/cloud-gateway) — "federeer het model, niet de runtime": één standaard over twee clouds, met de blijvende prijs van die belofte vooraf benoemd.
- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake) — een contract op de naad in plaats van tests aan het eind, en één regio gebouwd als referentiearchitectuur in plaats van als pilot.
- [Portfolio](/nl/portfolio) — `sap-bdc-snowflake-blueprint` vertaalt diezelfde naadvraag naar negen geordende regels en een kostenmodel dat je kunt draaien.

Achtergrond: TOGAF 9 Certified; Accenture Certified Technology Architect; C4, architecture decision records en DAMA-DMBOK-governancevocabulaire als dagelijkse praktijk.
