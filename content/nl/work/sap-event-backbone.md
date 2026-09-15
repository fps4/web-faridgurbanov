---
title: SAP-event-backbone — drie landschappen, één contract
summary: Een integratielaag die een enterprise SAP-event-backbone (SAP Advanced Event Mesh / Solace) verbindt met een AWS-native integratieplatform, ontworpen over drie teams heen die geen tooling, geen vocabulaire en geen backlog delen.
hook: Drie platformteams, drie landschappen, één event-contract waar eerder niemand eigenaar van was.
metric: 3 landschappen, 1 contract
short: SAP-event-backbone
client: Een grote Nederlandse supermarktketen · lopend, 2026
disagreement: Drie teams met drie definities van de grens, en elke vraag die ertoe deed zat in het gat ertussen.
role: Leidt het technisch ontwerp en de afspraak tussen de teams; eigenaar van de AWS-kant.
stack: [SAP Advanced Event Mesh, AMQP 1.0, S/4HANA, AWS Lambda, Terraform]
order: 2
---

# SAP-event-backbone — drie landschappen, één contract

*Een grote Nederlandse supermarktketen. Klant geabstraheerd; scope zoals geleverd. Lopend initiatief, 2026.*

## Context

De organisatie draait haar integratie op drie landschappen die los van elkaar zijn gegroeid en door drie verschillende teams worden bemenst: een **AWS-native, configuratiegedreven integratieplatform**, een **verouderde IBM ESB** die in golven wordt uitgefaseerd, en **SAP** (S/4HANA en BTP). SAP koos **SAP Advanced Event Mesh (Solace)** als event-backbone, ter vervanging van de punt-tot-punt asynchrone CPI-integraties die in de loop der jaren waren opgestapeld.

Die keuze opende een gat waar niemand eigenaar van was. SAP kon nu business events publiceren. Het cloudplatform kon ze nu verwerken. Daartussen zat een grens zonder contract, zonder naamgevingsconventie, zonder foutsemantiek, en met twee teams waarvan de definitie van "klaar" ophield bij de rand van het eigen landschap.

## Wat ik ontwierp

De integratielaag die SAP-business-events over **AMQP 1.0** binnenhaalt in het AWS-native platform, en de afspraak die maakt dat het te beheren is:

- **Brokerconnectiviteit en authenticatie** tussen de AWS-consumerruntime en de Solace-broker.
- **Het abonnementsmodel**: topic-hiërarchieën, en durable versus non-durable queues per consumerklasse, zodat een trage afnemer niet stilletjes events kan verliezen en een tijdelijke ze niet stilletjes kan opstapelen.
- **De event-envelop en het payloadcontract**: waar de publicerende kant zich aan verbindt, en waar de afnemende kant op mag rekenen.
- **Consumerconfiguratie**: QoS en prefetch, retry en back-off, en de dead-letterstrategie voor events die niet verwerkt kunnen worden.
- **Component- en sequentiediagrammen als implementatieblauwdruk**, zodat drie teams tegen één plaat bouwen in plaats van tegen drie herinneringen aan een vergadering.

## Impact

- Trekt de event-gedreven uitfasering van het IBM ESB-landschap door naar het SAP-landschap: domeinteams **abonneren zich op beheerde business events** waar ze eerst weer een punt-tot-punt-koppeling lieten bouwen.
- Vervangt "dien een ticket in bij het SAP-team" door een gepubliceerd contract, en dat is wat de flessenhals wegneemt.
- Geeft de AWS-kant een gedocumenteerd faalmodel (retry, back-off, dead-letter) waar in het ESB-tijdperk werd aangenomen dat aflevering andermans probleem was.

## Het patroon erachter

![Diagram: SAP S/4HANA en BTP publiceren business events naar een SAP Advanced Event Mesh (Solace)-broker; een event-envelop en abonnementscontract zit op de grens tussen de landschappen; het AWS-native integratieplatform verwerkt over AMQP 1.0 met retry, back-off en een dead-letter queue. Het legacy IBM ESB-landschap wordt erachter uitgefaseerd.](/diagrams/sap-event-backbone-pattern.svg)

De verleidelijke vorm is dat één team de hele integratie op zich neemt: óf het SAP-team bouwt cloudconsumers, óf het cloudteam krijgt toegang in SAP. Beide falen op dezelfde manier: ze vragen een team om bekwaam en verantwoordelijk te zijn in een landschap dat het niet beheert. De SAP-kant publiceert vanuit S/4HANA en BTP en heeft geen enkele cloud- of IaC-footprint; de cloudkant heeft geen businesscontext voor een S/4HANA-documentstroom. Dus is het ontwerp eigenaar van de grens ertussen en laat het elk landschap bij zijn eigen team.

Het op te leveren product was dus het contract. Topic-hiërarchie, envelop, afleveringsgarantie en dead-lettergedrag zijn opgeschreven en afgesproken voordat een van beide kanten code schreef. De connector was de makkelijke helft. Wat onderhandeld moest worden, was wat er gebeurt als een afnemer vier uur uit de lucht is, en dat is ook waarom queues standaard durable zijn per consumerklasse, met non-durable als beargumenteerde uitzondering. Kiezen voor durable haalt het gesprek naar voren over wie verantwoordelijk is voor verloren events. Het is geen prettig gesprek tijdens het ontwerp, en een veel slechter gesprek tijdens een incident.

Wat je vooraf moet weten: een event-contract maakt van het schema van de publicerende kant een belofte. Het SAP-team kreeg een verplichting die het eerder niet had, zonder dat er een prikkel bij zat. Geen enkele tool levert die afspraak. De tooling dwingt haar alleen af zodra de organisatie haar heeft gemaakt.

## Wie ja moest zeggen

**Stakeholders:** het SAP-team (S/4HANA en BTP), dat zou publiceren en nu een schemabelofte verschuldigd was; het IBM ESB-team, wiens landschap dit ontwerp kleiner maakt; het AWS-platformteam, dat de consumers zou gaan beheren; en de domeinteams verderop, die hun data wilden en het niet veel uitmaakte hoe die aankwam.

**De onenigheid:** drie teams met drie definities van de grens. Voor de SAP-kant was het werk "de events staan op de broker". Voor de cloudkant begon het werk bij "wij verwerken wat er op de broker staat". Beide standpunten waren redelijk, en daartussen zat elke vraag die ertoe doet: naamgeving, versionering, volgorde, en wat er gebeurt bij een fout. Het ESB-team werd intussen gevraagd mee te ontwerpen aan de vervanging van zijn eigen landschap.

**Wat het oploste:** de grens op papier zetten, en het ondankbare deel op me nemen. Ik heb niet geprobeerd te bepalen wie eigenaar was. Ik schreef het envelop- en abonnementscontract als een document waar elk team commentaar op kon geven, en ik nam de AWS-consumerruntime, de Terraform-uitrol en het dead-lettergedrag zelf op me. Zodra het contract een document was dat mensen konden beoordelen, werd de onenigheid technisch en konden we hem oplossen. Het ESB-team had wat aandacht nodig, gezien wat er van ze gevraagd werd. Wat ik tegen ze zei was simpelweg waar: zij weten welke koppelingen echt belasting dragen, en zonder die kennis is een uitfaseringsvolgorde niet veilig.

**Wat het kostte:** een schemaverplichting voor een team dat er geen had, en een tragere start. Het contract afspreken kostte tijd die sneller had geleken als hij aan een connector was besteed. Ik denk dat die tijd terugkomt bij het eerste productie-incident, maar het is een echte kostenpost aan het begin en dat mag gezegd worden.

## Rol & stack

Leidt het technisch ontwerp en de afspraak tussen de teams; eigenaar van de AWS-consumerruntime en de uitrol ervan.

**Stack:** SAP Advanced Event Mesh (Solace), AMQP 1.0, SAP S/4HANA- en BTP-business-events, AWS (Lambda, SNS/SQS, DynamoDB), Terraform, Datadog.

→ Het AWS-native platform waar dit naartoe publiceert heeft zijn eigen casus: [het integratieplatform](/nl/work/integration-platform), één runtime voor twaalf koppelingen, waar een koppeling een configuratiewijziging is. Zie ook [Integratiearchitectuur](/nl/expertise/integration-architecture), [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Werken door de organisatie heen](/nl/expertise/stakeholder-alignment).
