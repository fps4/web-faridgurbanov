---
title: Integratiearchitectuur
summary: Het ontwerpen van de laag waarmee bedrijfssystemen met elkaar praten, van legacy-ESB's naar event-driven, API-led platformen in eigendom van de domeinen.
evidence: [integration-platform, sap-event-backbone, cloud-gateway, cloudera-kafka]
order: 2
group: domain
---

# Integratiearchitectuur

Twintig jaar lang is mijn werk geweest om systemen die nooit bedoeld waren om met elkaar te praten als één geheel te laten werken. Dat betekent de oude wereld (IBM Integration Bus, API Connect, punt-tot-punt-ETL) goed genoeg kennen om hem veilig uit te faseren, en de nieuwe (event-driven, API-led, domeingericht) goed genoeg om hem in productie te draaien.

## Wat ik doe

- **Moderniseringsroutes die de business laten doordraaien.** Van batch en punt-tot-punt-integratie naar streaming en API's, stapsgewijs, terwijl het legacy-landschap nog live is.
- **Standaarden die overeind blijven over teams heen.** REST-ontwerp, API-lifecycle en versionering, OpenAPI-contracten, en de governance om ze te laten standhouden als er twintig teams bij betrokken zijn.
- **Contracten op de grenzen.** Schema-governance en datacontracten waar domeinen elkaar raken, zodat een wijziging aan de ene kant de andere niet stilletjes breekt.

## Aangetoond door

- [Integratieplatform](/nl/work/integration-platform): één configuratiegedreven runtime voor twaalf koppelingen, waar er een toevoegen een mappingbestand en een Terraform-blok is.
- [SAP-event-backbone](/nl/work/sap-event-backbone): een SAP-landschap, een legacy IBM ESB en een AWS-native platform op één event-contract gebracht, zodat domeinteams zich abonneren op beheerde business events waar ze eerst weer een punt-tot-punt-koppeling lieten bouwen.
- [Cloud Gateway](/nl/work/cloud-gateway): ruim twintig versnipperde gateways samengebracht in één federatief, cross-cloud selfserviceplatform dat ~1,5 mld+ requests per maand verwerkt.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka): domeingerichte streaming over 30+ bronsystemen met beheerde schema's.

Achtergrond: 20+ jaar SOA, ESB-modernisering en API-management; Accenture Certified Technology Architect; TOGAF 9.
