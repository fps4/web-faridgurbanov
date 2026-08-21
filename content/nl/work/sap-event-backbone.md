---
title: SAP-event-backbone — drie landschappen, één contract
summary: Een integratielaag die een enterprise SAP-event-backbone (SAP Advanced Event Mesh / Solace) verbindt met een AWS-native integratieplatform — ontworpen over drie teams heen die geen tooling, geen vocabulaire en geen backlog delen.
hook: Drie platformteams, drie landschappen, één event-contract dat niemand eerder bezat.
metric: 3 landschappen, 1 contract
short: SAP-event-backbone
client: Een grote Nederlandse supermarktketen · lopend, 2026
disagreement: Drie teams met drie definities van de grens — en elke vraag die er werkelijk toe doet zat in het gat ertussen.
role: Leidend in het technisch ontwerp en de afspraak tussen de teams; eigenaar van de AWS-kant.
stack: [SAP Advanced Event Mesh, AMQP 1.0, S/4HANA, AWS Lambda, Terraform]
order: 2
---

# SAP-event-backbone — drie landschappen, één contract

*Een grote Nederlandse supermarktketen. Klant geabstraheerd; scope zoals geleverd. Lopend initiatief, 2026.*

## Context

De organisatie draait haar integratie op drie landschappen die los van elkaar gegroeid zijn en door drie verschillende teams worden bemenst: een **AWS-native, configuratie-gedreven integratieplatform**, een **verouderde IBM ESB** die wave voor wave wordt uitgefaseerd, en **SAP** (S/4HANA en BTP). SAP koos **SAP Advanced Event Mesh (Solace)** als event-backbone, ter vervanging van de point-to-point asynchrone CPI-integraties die zich door de jaren heen hadden opgestapeld.

Die keuze creëerde een gat dat niemand bezat. SAP kon nu business-events publiceren. Het cloudplatform kon ze nu consumeren. Daartussen lag een grens zonder contract, zonder naamgevingsconventie, zonder foutsemantiek, en met twee teams wiens definitie van "klaar" ophield bij de rand van hun eigen landschap.

## Wat ik heb ontworpen

De integratielaag die SAP-business-events over **AMQP 1.0** consumeert in het AWS-native platform — en, belangrijker, de afspraak die het beheerbaar maakt:

- **Brokerconnectiviteit en authenticatie** tussen de AWS-consumer-runtime en de Solace-broker.
- **Het subscriptiemodel** — topic-hiërarchieën, en durable versus non-durable queues per consumerklasse, zodat een trage consumer niet stilzwijgend events verliest en een tijdelijke er niet stilzwijgend op blijft zitten.
- **Het event-envelop- en payloadcontract** — waar de publicerende kant zich aan committeert, en waar de consumerende kant op mag bouwen.
- **Consumerconfiguratie** — QoS en prefetch, retry en back-off, en de dead-letter-strategie voor events die niet verwerkt kunnen worden.
- **Component- en sequencediagrammen als implementatie-blueprint**, zodat drie teams tegen één plaat konden bouwen in plaats van tegen drie lezingen van een vergadering.

## Impact

- Trekt het event-gedreven uitfaseren van het legacy IBM-ESB-landschap door naar het SAP-landschap: domeinteams **abonneren zich op gecontroleerde business-events** in plaats van weer een point-to-point-koppeling te laten bouwen.
- Vervangt "zet een ticket uit bij het SAP-team" door een gepubliceerd contract — dat is wat de bottleneck daadwerkelijk weghaalt.
- Geeft de AWS-kant een gedocumenteerd faalmodel — retry, back-off, dead-letter — in plaats van de ESB-aanname dat aflevering het probleem van iemand anders is.

## Het patroon erachter

![Diagram: SAP S/4HANA en BTP publiceren business-events naar een SAP Advanced Event Mesh (Solace)-broker; een event-envelop- en subscriptiecontract ligt op de landschapsgrens; het AWS-native integratieplatform consumeert over AMQP 1.0 met retry, back-off en een dead-letter-queue. Het legacy IBM-ESB-landschap wordt erachter uitgefaseerd.](/diagrams/sap-event-backbone-pattern.svg)

**Bezit de naad, niet de landschappen.** De verleidelijke vorm is dat één team de integratie "pakt" — of het SAP-team bouwt cloudconsumers, of het cloudteam krijgt toegang tot SAP. Beide falen om dezelfde reden: ze vragen een team competent én aanspreekbaar te worden in een landschap dat het niet beheert. De SAP-kant publiceert vanuit S/4HANA en BTP en heeft helemaal geen cloud- of IaC-voetafdruk; de cloudkant heeft geen businesscontext bij een S/4HANA-documentstroom.

Twee beslissingen dragen het:

- **Het contract is het resultaat, niet de connector.** Topic-hiërarchie, envelop, afleveringsgarantie, dead-letter-gedrag — opgeschreven en afgesproken voordat een van beide kanten code schreef. De connector is de makkelijke helft; wat onderhandeld moest worden is wat er gebeurt als een consumer vier uur uit de lucht is.
- **Standaard durable, met de uitzondering beargumenteerd.** Durable queues per consumerklasse kiezen haalt het gesprek over wie verantwoordelijk is voor verloren events naar voren. Dat is een onaangenaam gesprek tijdens het ontwerp en een veel erger gesprek tijdens een incident.

De afweging die je vooraf moet kennen: een event-contract maakt het schema van de publicerende kant tot een belofte. Het SAP-team kreeg een verplichting die het niet had, en er kwam geen prikkel bij. Geen enkele tool produceert die afspraak — de tooling maakt haar alleen afdwingbaar nadat de organisatie haar heeft gemaakt.

## Wie ja moest zeggen

**Stakeholders:** het SAP-team (S/4HANA en BTP) dat zou publiceren en nu een schemabelofte schuldig was; het IBM-ESB-team, wiens landschap dit ontwerp verkleint; het AWS-platformteam dat de consumers zou draaien; en de domeinteams stroomafwaarts die hun data wilden zonder zich druk te maken over hoe.

**De onenigheid:** drie teams met drie definities van de grens. De SAP-kant zag haar taak als "de events staan op de broker". De cloudkant zag haar taak als "wij consumeren wat op de broker staat". Beide redelijk — en daartussen lag elke vraag die er werkelijk toe doet: naamgeving, versionering, volgorde, en wat er gebeurt bij een fout. Het ESB-team werd ondertussen gevraagd mee te ontwerpen aan de vervanging van zijn eigen landschap.

**Wat het oploste:** de naad opschrijven, en de saaie helft zelf nemen. In plaats van te bepalen wie het bezat, heb ik het envelop- en subscriptiecontract als document geschreven dat elk team kon becommentariëren, en heb ik de AWS-kant — consumer-runtime, Terraform-provisioning en dead-letter-gedrag — zelf gedaan. Zodra het contract een document was dat mensen konden nalezen, in plaats van een standpunt in een vergadering, werd de onenigheid technisch en konden we hem uitwerken. Het ESB-team had wat zorg nodig, gezien wat hun gevraagd werd. Wat ik tegen ze zei was gewoon waar: zij weten welke koppelingen echt belasting dragen, en zonder die kennis is een uitfaseringsvolgorde niet veilig.

**Wat het kostte:** een schemaverplichting voor een team dat er geen had, en een tragere start. Het contract afspreken kostte tijd die er sneller uit had gezien als je die aan een connector had besteed. Ik denk dat die tijd terugkomt bij het eerste productie-incident, maar het is aan het begin een echte kostenpost en dat hoort erbij gezegd.

## Rol & stack

Leidend in het technisch ontwerp en de afspraak tussen de teams; eigenaar van de AWS-kant van de consumer-runtime en de provisioning ervan.

**Stack:** SAP Advanced Event Mesh (Solace), AMQP 1.0, SAP S/4HANA- en BTP-business-events, AWS (Lambda, SNS/SQS, DynamoDB), Terraform, Datadog.

→ Het AWS-native platform waar dit naartoe publiceert is een eigen casus: [het integratieplatform](/nl/work/integration-platform) — één runtime die twaalf koppelingen bedient, waar een koppeling een configuratiewijziging is in plaats van een codebase. Zie ook [Integratiearchitectuur](/nl/expertise/integration-architecture), [Event-driven & streaming](/nl/expertise/event-driven-streaming) en [Werken door de organisatie heen](/nl/expertise/stakeholder-alignment).
