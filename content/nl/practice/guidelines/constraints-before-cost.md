---
id: G-03
order: 3
title: "Randvoorwaarden vóór kosten"
summary: "Plaatsingsregels lopen in een vaste volgorde, en de prijs telt pas mee tussen de opties die de randvoorwaarden overlaten."
status: current
revised: 2026-11-08
related: [practice/articles/sap-snowflake-seam-decision, practice/articles/synapse-platform-decision, P-01]
topics: [architecture, cost]
tech: []
---

## De regel

Als dezelfde beslissing vaak terugkomt (elk object over een grens, elke workload naar een platform),
schrijf ik haar op als geordende regels. Harde randvoorwaarden komen eerst en geven redenen terug,
nooit getallen. De prijs komt daarna en kiest tussen de opties die dan nog over zijn.

## Waarom

Meestal staan er twee artefacten voor deze beslissing, en geen van beide beslist. Een
capability-matrix heeft veertig rijen, waarvan er vier of vijf iets uitsluiten. Een prijstabel heeft
getallen en geen randvoorwaarden, dus de goedkoopste optie lijkt het antwoord, ook waar een
residency-regel haar verbiedt. Staat er eenmaal een kostenbedrag op de slide, dan gaat de
vergadering over de vraag of de randvoorwaarde wel echt is.

Met de randvoorwaarden vooraan kan een goedkope optie zich niet langs een residency-regel praten: de
regel heeft haar al geschrapt voordat iemand er een prijs op zette.

## Hoe ik het toepas

**Orden de regels, en laat de volgorde het argument maken.** Op de grens tussen SAP en Snowflake is
de volgorde: residency en persoonsgegevens, delta-ondersteuning, versheid, latency op piekmomenten,
beschikbaarheid van een share, semantiek, en economie op de zevende plaats. Voor een
Synapse-landschap: residency en clearance, T-SQL-oppervlak, streamingsemantiek, telemetrie onder de
seconde, ML-levenscyclus, en ook daar economie als zevende.

**Randvoorwaarden geven redenen terug.** Elke regel die een optie schrapt, schrijft op waarom die
afviel. Zo laat het register bij elke rij de regel zien die besliste.

**Prijs de geschrapte opties toch.** Het register toont wat de uitgesloten opties gekost zouden
hebben. Een randvoorwaarde leest dan als een keuze met een prijskaartje, die iemand op inhoud kan
aanvechten.

**Dwing de volgorde af in code.** Een test controleert voor het hele landschap dat niets is
geplaatst waar een randvoorwaarde het had geschrapt.

**Beoordeel het geheel na de delen.** Regels die één item tegelijk plaatsen, zien geen kosten die
niet per item deelbaar zijn: een capaciteitstrede, of de overhead van een derde platform in gebruik
nemen. Een latere regel bekijkt de volledige verdeling en vraagt of elk platform zichzelf
terugverdient.

**Een meningsverschil is een pull request.** Regels en kostenmodel staan in config. Verander er één,
draai opnieuw, en lees wat er verschuift.

## Afwegingen

- **Er komt nog steeds oordeel bij kijken.** Sommige randvoorwaarden zijn inschattingen (of een
  workload een volledige ML-levenscyclus nodig heeft, is er zo een). Markeer ze in de config als
  oordeel, zodat niemand ze voor natuurwetten aanziet.
- **De volgorde is een bewering.** Twee regels omwisselen kan antwoorden veranderen, dus ook de
  volgorde gaat door de review.
- **Het moet gebouwd worden.** Een procedure en een register kosten vooraf meer dan een matrix op
  een slide.
- **Illustratieve prijzen worden gelezen als offertes.** Houd ze in één bestand. Dan past er later
  een echte tariefkaart in, en worden de antwoorden die daardoor verschuiven zichtbaar als
  economische keuzes.

## Wanneer ik ervan afwijk

- **Eén beslissing, één keer genomen:** een ADR met opties en gevolgen is genoeg. Geordende regels
  lonen als de vraag per object terugkomt.
- **Geen harde randvoorwaarden in het spel:** dan is het een economische vraag, en volstaat een
  kostenmodel.
- **Een randvoorwaarde die het bedrijf kan afkopen** (een herbouw die het wil financieren): prijs
  die als optie, markeer haar in de config, en zeg het in het register.
