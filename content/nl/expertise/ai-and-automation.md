---
title: AI & automatisering
summary: AI in bedrijfssystemen integreren zoals al het andere geïntegreerd wordt. Achter een contract, met een evaluatiepoort vóór release, en met het model buiten de runtime zodat het vervangbaar blijft.
evidence: [portfolio, cloudera-kafka]
order: 5
group: domain
---

# AI & automatisering

AI is het laatste van de vijf gebieden, en het minste waarvoor ik word ingehuurd. Het is echt werk en ik doe het. Mijn standpunt erover is vrij saai: een AI-capaciteit wordt geïntegreerd als elk ander leverancierssysteem, achter een contract, met een poort vóór release, en met de leverancier vervangbaar.

## Wat ik doe

- **Het model achter een contract zetten.** Een getypeerde capaciteit waar de aanroeper mee praat, zodat het model, de prompt en de leverancier allemaal kunnen veranderen zonder dat de aanroeper het merkt. Het meeste AI-werk dat onbeheersbaar wordt, heeft deze stap overgeslagen.
- **Van evaluatie een releasepoort maken.** Golden sets en gescoorde controles in CI, zodat een gedragsregressie een deploy blokkeert zoals een falende test dat doet. Het is dezelfde zet als schema-compatibiliteitsregels in een registry: vertrouwen verhuist uit een reviewvergadering naar het platform.
- **Het model buiten de runtime houden.** Generatie achter een geversioneerde API, zodat de aanroeper vandaag een mens kan zijn en morgen een API, en het product nooit een model-client in zichzelf compileert.
- **Toegang van agents behandelen als autorisatie.** Een agent die een beheervlak bedient, gebruikt hetzelfde geauditeerde contract als een mens.
- **Het antwoord verankeren, en het laten weigeren.** Een model dat vragen beantwoordt over bedrijfsdata herleidt de vraag tot een gedefinieerde metriek of weigert; het stelt nooit zelf de query samen. Een weigering kost een rondje. Een plausibel getal, berekend onder een definitie die de vrager niet in gedachten had, kost maanden later een beslissing, genomen door iemand die er niet bij was.

## Aangetoond door

- [Portfolio](/nl/portfolio): `skills-coach` bevat **helemaal geen model-client**. De runtime beheert de packs, de deterministische beoordeling, de spaced-repetition-drempels en een blijvend beeld van wat een cursist steeds fout doet. Generatie en correctie zitten achter een geversioneerde API, zodat de aanroeper vandaag een mens met een LLM-CLI kan zijn en later een model-API, en er verder niets beweegt. Dat is het argument van deze pagina in één repository.
- [Portfolio](/nl/portfolio): `identity-service` biedt hetzelfde geauditeerde beheervlak aan over HTTP en over MCP, zodat een agent het onder precies hetzelfde contract bedient als een mens.
- [Portfolio](/nl/portfolio): `ai-first-bi-platform` is hetzelfde argument toegepast op analytics. Het model heeft geen route naar een ruwe tabel. Het herleidt een vraag tot een metriek in de registry of weigert, en elk antwoord draagt de definitie, de eigenaar en de tests die het hebben doorgelaten. Dezelfde 24 businessvragen, gesteld over het ruwe schema en over de registry, komen terug als 21 van 24 vol vertrouwen fout tegenover 0 van 24; de beheerde route beantwoordt er maar 14 van de 24, en dat is de prijs, gerapporteerd in dezelfde tabel. Die 21 zijn een eigenschap van het schema. Een beter model schrijft betere SQL tegen dezelfde tabellen en komt sneller bij dezelfde foute antwoorden uit.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka): schema-compatibiliteitsregels verplaatsten vertrouwen van een reviewvergadering naar het platform. Evaluatiepoorten doen hetzelfde voor modelgedrag, en ik grijp ernaar omdat ik het patroon eerst op schema's heb zien werken.

Achtergrond: DeepLearning.AI Agentic AI (2025); 20+ jaar data- en ML-systemen bouwen.
