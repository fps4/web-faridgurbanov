---
id: G-02
order: 2
title: "Adoptie als ontwerpeis"
summary: "Benoem wie het ontwerp kan weigeren, en maak ja zeggen goedkoper dan blijven zitten waar je zit."
status: current
revised: 2026-11-08
related: [practice/articles/who-had-to-say-yes, work/cloud-gateway, work/sap-snowflake, work/sap-event-backbone, expertise/stakeholder-alignment]
topics: [adoption, architecture]
tech: []
---

## De regel

Elk ontwerp dat over een teamgrens gaat, krijgt een korte sectie met de mensen die het kunnen
weigeren, wat zij verliezen en wat hen ja laat zeggen. Adoptie ontwerp ik vanaf het eerste gesprek
mee, net als doorvoer en beschikbaarheid.

## Waarom

Ontwerpen die meerdere teams raken, sneuvelen zelden in een review. Ze sneuvelen op backlogs: een
migratie die een kwartaal opschuift, een verzoek om een uitzondering, een team dat blijft draaien
wat al werkt. Bijna niemand heeft op papier een veto, en twintig beleefde vertragingen eindigen waar
één afwijzing ook was geëindigd, alleen later en duurder.

Wie kan weigeren, weet je meestal op de eerste dag al. Het gaat bijna altijd om vier groepen:

- de teams die moeten veranderen en al iets hebben dat werkt;
- de functie die de uitkomst moet vertrouwen (finance, risk, security) en de gevolgen draagt als die
  niet klopt;
- het team waarvan de scope kleiner wordt;
- de budgethouder achter het systeem dat wordt vervangen.

Schrijf je die lijst niet op, dan ontdek je hem toch, één weigering tegelijk, in de duurst mogelijke
volgorde.

## Hoe ik het toepas

**Schrijf het blok.** Vier korte alinea's in elk ontwerp dat meerdere teams raakt: wie dit kan
weigeren, bij naam; het echte meningsverschil, zo verwoord dat de andere kant het fair zou noemen;
het mechanisme dat het oploste; en wat het kostte, en wie die kosten draagt. Dat kost ongeveer
twintig minuten.

**Zeg het onwelkome deel eerst.** De meeste ontwerpen leggen ergens nieuw werk neer: een
schemabelofte voor een upstream team, een SLA voor een producerend domein. Breng je die kosten in
het eerste gesprek ter sprake, dan zijn ze een randvoorwaarde die het andere team mee vormgeeft.
Komen ze pas bij de ontwerpreview op tafel, dan wordt het team iets aangedaan.

**Maak het platform goedkoper dan blijven zitten.** Bij een retailer met achttien tot twintig
API-gateways, waar niemand een migratie kon opleggen, stapten teams over omdat onboarding minuten
kostte en ze hun eigen OAuth2-model niet meer hoefden te bouwen en opnieuw te certificeren. Elk team
maakte de rekensom zelf.

**Bouw de controle die de scepticus vertrouwt.** Finance nam een nieuw warehouse in gebruik zodra de
cijfers aansloten op het grootboek dat ze al vertrouwden. Dus bouwde ik de aansluiting die ze zelf
konden draaien. Die controle hoorde bij de architectuur.

**Neem de saaie helft.** Waar de scopes van twee teams elkaar net niet raken, schrijf ik de grens op
zodat beide er commentaar op kunnen geven, en neem ik het deel zonder eigenaar zelf: de
consumer-runtime, de provisioning, de afhandeling van dead letters. Een onderhandeling wordt dan
weer een technische discussie, en die kun je afronden.

**Begin bij wie het meest wint.** Laat het team met de slechtste huidige opzet als eerste
overstappen. Hun verhaal over de migratie reikt verder dan welke review board ook.

![Diagram: vier groepen kunnen een ontwerp dat meerdere teams raakt weigeren: de teams die moeten veranderen, de functie die de uitkomst moet vertrouwen, het team waarvan de scope kleiner wordt, en de budgethouder achter het systeem dat wordt vervangen. Elk van hen kan blijven waar ze zitten, met een migratie die een kwartaal opschuift, een verzoek om een uitzondering of door te blijven draaien wat werkt, of ja zeggen zodra dat minder kost dan blijven waar ze zitten. Vijf zetten in het ontwerp maken ja goedkoper: het onwelkome deel eerst zeggen, het platform goedkoper maken, de controle bouwen die de scepticus vertrouwt, de saaie helft nemen, en beginnen bij wie het meest wint.](/diagrams/adoption-by-design-nl.svg)

## Afwegingen

- **Het kost de architect tijd** die nooit op een diagram verschijnt: gesprekken, een aansluiting
  waar niemand om vroeg, een runtime waar iemand anders eigenaar van had kunnen zijn.
- **Een meningsverschil op papier kan verharden.** Schrijf het zo op dat de andere kant het zou
  ondertekenen, of houd het in het gesprek tot dat lukt.
- **Wie de saaie helft neemt, wordt eigenaar.** Regel wie het beheert als je vertrekt.
- **Wie de kosten vroeg laat zien, maakt een ontwerp een tijdlang duurder** dan een alternatief dat
  ze verstopt.

## Wanneer ik ervan afwijk

- **Er is een mandaat en de beslissing is genomen:** ik schrijf de lijst toch, en steek de moeite in
  het migratiepad.
- **Ontwerpen binnen één team:** het blok krimpt tot één regel.
- **Een toezichthouder bepaalt de datum:** dan gaat het gesprek over de volgorde, en ook dan komen
  de kosten als eerste op tafel.

## Sjablonen om mee te beginnen

```text
## Wie moest ja zeggen
Stakeholders:        wie dit kon weigeren, bij naam of rol
Het meningsverschil: hun standpunt, in woorden die zij zouden accepteren
Wat het oploste:     het mechanisme ("we hebben het afgestemd" is er geen)
Wat het kostte:      de frictie die dit oplevert, en wie die draagt
```
