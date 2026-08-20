---
title: AI & automatisering
summary: AI in enterprisesystemen integreren zoals al het andere geïntegreerd wordt — achter een contract, met een evaluatiepoort vóór release, en met het model buiten de runtime zodat het vervangbaar blijft.
order: 5
group: domain
---

# AI & automatisering

Dit gebied staat bewust achteraan. Het is echt werk en ik doe het, maar het is niet wat ik verkoop, en een pagina die met AI opent betekent meestal dat er over de rest van het landschap niet is nagedacht. Mijn standpunt is tamelijk saai: een AI-capability wordt geïntegreerd zoals elk ander leverancierssysteem — achter een contract, met een poort vóór release, en met de leverancier vervangbaar.

## Wat ik doe

- **Zet het model achter een contract.** Een getypeerde capability waarmee de aanroeper praat, zodat het model, de prompt en de leverancier kunnen wijzigen zonder dat de aanroeper het merkt. AI-werk dat onbeheersbaar wordt, heeft bijna altijd deze stap overgeslagen.
- **Maak evaluatie een releasepoort, geen rapport.** Golden sets en gescoorde controles in CI, zodat een gedragsregressie een deploy blokkeert zoals een falende test dat doet. Dit is dezelfde beweging als compatibiliteitsregels in een schema registry: vertrouwen verhuist van een overleg naar het platform.
- **Houd het model buiten de runtime.** Generatie achter een geversioneerde API in plaats van een model-client die in het product zit, zodat de aanroeper vandaag een mens kan zijn en morgen een API.
- **Behandel agent-toegang als autorisatie.** Een agent die een beheervlak bedient, hoort hetzelfde geauditeerde contract te gebruiken als een mens, geen achterdeur.

## Aangetoond door

- [Portfolio](/nl/portfolio) — `skills-coach` bevat **helemaal geen model-client**: de runtime bezit de packs, de deterministische beoordeling, de spaced-repetition-poorten en een duurzaam model van wat een lerende blijft fout doen. Generatie en correctie zitten achter een geversioneerde API, dus de aanroeper kan vandaag een mens met een LLM-CLI zijn en later een model-API, zonder dat er verder iets verandert. Dat is het hele argument van deze pagina, in één repository.
- [Portfolio](/nl/portfolio) — `identity-service` biedt hetzelfde geauditeerde beheervlak aan over HTTP én over MCP, zodat een agent het onder precies hetzelfde contract bedient als een mens. Agent-toegang is een autorisatievraag, geen nieuwe softwarecategorie.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka) — compatibiliteitsregels voor schema's verplaatsten vertrouwen van een overleg naar het platform. Evaluatiepoorten doen hetzelfde voor modelgedrag, en ik grijp ernaar omdat ik dat patroon eerst bij schema's heb zien werken.

Achtergrond: DeepLearning.AI Agentic AI (2025); 20+ jaar bouwen aan data- en ML-systemen.
