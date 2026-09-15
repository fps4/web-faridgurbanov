---
title: Cloud Gateway — federatief cross-cloud API-platform
summary: 20+ versnipperde API-gateways samengebracht in één federatief, cross-cloud selfserviceplatform dat ~1,5 mld+ requests per maand verwerkt en ~€250–300k per jaar bespaart.
hook: 20+ versnipperde gateways samengebracht in één selfserviceplatform over AWS en Azure.
metric: ~1,5 mld+ req/maand
short: Cloud Gateway
client: Een grote Nederlandse supermarktketen
disagreement: Niemand wilde een gateway die hij zelf beheerde opgeven voor een afhankelijkheid van een centraal team, en niemand had de bevoegdheid om een migratie op te leggen.
role: Leidde ontwerp en uitrol; API-standaarden, het beveiligingsmodel en governance.
stack: [AWS API Gateway, Azure APIM, Terraform, OAuth2/OIDC, Datadog]
order: 1
---

# Cloud Gateway — federatief cross-cloud API-platform

*Een grote Nederlandse supermarktketen, vanaf 2021. Klant geabstraheerd; cijfers zoals geleverd.*

## Context

Toen ik binnenkwam had de organisatie ruim twintig API-gateways verzameld, ongeveer één per team, met een verouderde IBM API Connect in het midden en geen gedeeld beveiligings- of governancemodel. Elk team had authenticatie, onboarding en observability op zijn eigen manier opgelost. Een nieuwe API publiceren kostte dagen aan afstemming, en het grootste deel daarvan ging op aan uitzoeken bij wie je moest zijn.

## Wat ik bouwde

Een federatief, cross-cloud selfservice-API-platform op **AWS API Gateway en Azure APIM**, uitgerold via Terraform-modules:

- Eén **OAuth2/JWT**-beveiligingsmodel (Okta/Auth0) in plaats van authenticatie per team.
- Onboarding als **infrastructure-as-code**, zodat een team een nieuwe API publiceert door een pull request te openen.
- **Datadog**-observability over al het verkeer.
- Interne React/Node.js-tooling voor de developerkant.

IBM API Connect is uitgefaseerd en de twintig-en-nog-wat gateways zijn achter dat ene model gebracht.

## Impact

- **~1,5 mld+ API-requests per maand** over het platform (september 2026), met server-side fouten onder **0,03%** end-to-end.
- **18–20 productteams** op één selfservicemodel.
- **~€250–300k per jaar** bespaard, grotendeels door het uitgefaseerde contract.
- Doorlooptijd van onboarding terug van **dagen naar minuten**.

## Het patroon erachter

![Diagram: 18–20 productteams komen binnen via één federatief model (OAuth2/JWT-beveiliging, Terraform-selfservice-onboarding, Datadog-observability) dat op zowel AWS API Gateway als Azure APIM draait.](/diagrams/cloud-gateway-pattern.svg)

De voor de hand liggende oplossing voor twintig versnipperde gateways is één grote centrale gateway met een centraal team ervoor. Daarmee haal je het ESB-probleem terug: elk team staat in de rij achter één backlog, en het platform wordt precies de flessenhals die het moest wegnemen. Dus hebben we de standaard gecentraliseerd en de runtime met rust gelaten. AWS API Gateway en Azure APIM bleven allebei staan, met één beveiligingsmodel, één onboardingroute en één observabilitylaag over de twee heen.

Wat het bij elkaar hield was waar het platform gedefinieerd werd. Het OAuth2/JWT-model, de Terraform-onboardingmodules en de Datadog-dashboards waren het product; welke cloud de aanroep afhandelde was een implementatiedetail. Teams hielden hun runtime en leverden hun zelfgebouwde authenticatie in. En omdat onboarding een gereviewde Terraform-wijziging was, werd de module de policy. Governance werd afgedwongen door het ding dat teams toch al moesten gebruiken, en de doorlooptijd ging als bijeffect van dagen naar minuten.

De prijs van een federatief model is dat je elke belofte twee keer moet nakomen. Elke nieuwe functie landt op AWS én op Azure, anders klopt het verhaal van "één platform" niet meer. Je tekent ervoor om alles voor twee runtimes te ontwerpen, voor onbepaalde tijd. Dat was de prijs van twintig teams niet naar één leverancier dwingen, en in dit landschap was het de juiste prijs.

## Wie ja moest zeggen

**Stakeholders:** 18–20 productteams die elk al een werkende gateway hadden; de platformgroep die moest gaan beheren wat ervoor in de plaats kwam; de securityafdeling, die één authenticatiemodel over twee clouds moest accepteren; en de budgethouder achter het IBM API Connect-contract.

**De onenigheid:** niemand wilde een gateway die hij zelf beheerde inruilen voor een afhankelijkheid van een centraal team, en niemand had de bevoegdheid om die ruil op te leggen. Om een mandaat vragen had twintig uitzonderingen en één heel trage backlog opgeleverd.

**Wat het oploste:** het platform moest voor een team goedkoper zijn dan blijven zitten. Terraform-onboarding in minuten, een OAuth2/JWT-model dat ze niet meer zelf hoefden te bouwen en te hercertificeren, dashboards die ze niet zelf hoefden aan te sluiten. Security kreeg één model om te beoordelen in plaats van twintig. Finance kreeg een uitfaseringsbedrag dat het programma betaalde. De migratievolgorde deed er ook toe: de eerste teams die overgingen waren die met de slechtste bestaande situatie, en zij werden de referentie waar de anderen naar vroegen.

**Wat het kostte:** een blijvende verplichting om elke functie twee keer op te leveren, op AWS en op Azure. Ik vind nog steeds dat het het waard was, maar het is een permanente verplichting en die hoort in het grootboek.

## Rol & stack

Leidde ontwerp en uitrol: API-standaarden, het beveiligingsmodel en governance.

**Stack:** AWS (API Gateway, IAM, VPC), Azure (APIM, Entra ID), Terraform, Node.js, React, OAuth2/OIDC (Okta/Auth0), Datadog.

→ Zie ook [API's & gateways](/nl/expertise/apis-and-gateways) en [Integratiearchitectuur](/nl/expertise/integration-architecture).
