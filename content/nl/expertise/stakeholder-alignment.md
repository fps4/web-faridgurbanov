---
title: Stakeholderafstemming
summary: Een architectuur die daadwerkelijk wordt gedragen — invloed zonder formele bevoegdheid, beslissingen vastgelegd waar ze bevraagd kunnen worden, en platformen die teams kiezen in plaats van opgelegd krijgen.
order: 7
group: practice
---

# Stakeholderafstemming

Een architectuur waar niemand mee heeft ingestemd is een plaatje. Het lastige aan dit vak zit zelden in het ontwerp — het zit in de twintig teams die allemaal al iets hebben dat werkt, de finance director die een getal moet vertrouwen voordat hij tekent, en het leverancierscontract dat iemand vier jaar geleden heeft gesloten. Ik doe dit al twintig jaar, vrijwel altijd zonder de bevoegdheid om ook maar iemand iets op te dragen.

## Wat ik doe

- **Maak de gebaande weg goedkoper dan het alternatief.** Teams bewegen wanneer bewegen de weg van de minste weerstand is — selfservice-onboarding, een securitymodel dat ze niet langer zelf hoeven te bouwen. Een verplichting levert twintig uitzonderingen op; een betere weg levert adoptie op.
- **Ontwerp op vertrouwen, niet alleen op doorvoer.** Finance adopteert geen warehouse omdat de architectuur elegant is, maar omdat de cijfers aansluiten op het grootboek dat ze al geloven. Benoemen wie de uitkomst moet vertrouwen — en bouwen wat dat vertrouwen verdient — hoort bij het ontwerp, niet bij een fase erna.
- **Eerst onderzoeken, dan voorschrijven.** Bij een ander team aankomen met een roadmap waar niet om gevraagd is, loopt dood. Ik lees eerst het landschap en schrijf op wat ik aantref, zodat de prioriteiten bespreekbaar zijn: een analyse waar een team het mee oneens kan zijn is meer waard dan een advies dat genegeerd kan worden.
- **Leg de beslissing vast waar die bevraagd kan worden.** Architecture decision records, C4-diagrammen, en de afweging in gewone taal — inclusief wat de keuze kost. Afstemming houdt stand wanneer mensen kunnen zien wat is opgegeven en waarom; ze valt om zodra die redenering alleen in het hoofd van één architect zit.
- **Zeg het onwelkome deel vroeg.** Waar een ontwerp wrijving legt bij een team dat die niet had, of waar mijn eigen ervaring ophoudt, verloopt dat gesprek beter aan het begin dan bij de review. Geloofwaardigheid bouw je langzaam op en verlies je in één keer.

## Deeltijd werken en tóch de architectuur dragen

Een architect van twee of drie dagen per week is eerst een stakeholdervraagstuk en pas daarna een technisch vraagstuk: beslissingen moeten doorgaan op de dagen dat ik er niet ben. Wat het laat werken is het vooraf afspreken van het werkmodel — een benoemd aanspreekpunt aan klantzijde, een geschreven beslissingslogboek in plaats van beslissingen die in vergaderingen blijven hangen, en een expliciete grens tussen wat het team zonder mij beslist en wat wacht.

Zo ingericht is een deeltijdrol geen uitgeklede architect. Het is een architectuur die het team zelf kan dragen — en dat is toch de enige soort die het einde van een opdracht overleeft.

## Aangetoond door

- [Cloud Gateway](/nl/work/cloud-gateway) — 18–20 productteams op één federatief model en een exit uit IBM API Connect, met onboarding teruggebracht van dagen naar minuten. Adoptie gekocht met developer experience, niet met bevoegdheid.
- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake) — reconciliatie tegen het bronboek zodat Finance de cijfers vertrouwde, en source-to-target mapping afgestemd met de SAP-architecten.
- [Kafka data-productplatform op Cloudera](/nl/work/cloudera-kafka) — 20+ geproductiseerde streams over 30+ bronsystemen, wat neerkwam op het uitonderhandelen van domeineigenaarschap met de teams die de data produceren.

Achtergrond: TOGAF 9 Certified; Accenture Certified Technology Architect; architecture decision records en C4 als dagelijkse praktijk. Daarnaast train ik architectuur- en productteams — dezelfde vaardigheid, met de inzet verplaatst.
