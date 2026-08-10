---
title: Bepalen wat de SAP↔Snowflake-naad oversteekt
summary: Voor elk object in een SAP-landschap bepaalt één vraag de kosten en de versheid van alles wat erop volgt: zero-copy delen, repliceren, federeren, splitsen, of in SAP houden. Dit is een referentiearchitectuur die die vraag per object beantwoordt — negen geordende regels, een kostenmodel met de omslagfrequentie, en een lokale simulatie die alle drie de modi draait.
date: 2026-08-10
order: 1
---

# Bepalen wat de SAP↔Snowflake-naad oversteekt

Wanneer een SAP-landschap richting Snowflake beweegt, keert voor elk object in scope dezelfde vraag terug: wordt het zero-copy gedeeld, gerepliceerd, gefedereerd, gesplitst over twee modi, of binnen SAP gemodelleerd? Elk antwoord legt een maandbedrag, een versheidsgarantie en een beheerlast vast die jarenlang meegaan.

Ik heb [`sap-bdc-snowflake-blueprint`](https://github.com/fps4/sap-bdc-snowflake-blueprint) gebouwd om die vraag object voor object te beantwoorden, in de openbaarheid: een SAP → Business Data Cloud / Datasphere → Snowflake-referentiearchitectuur van één pagina, met de beslissing eraan vast, geprijsd en uitvoerbaar.

## Vijf manieren om de naad over te steken

Alles links van de integratielaag hoort bij SAP; alles rechts ervan hoort bij Snowflake. De beslissingen die ertoe doen zitten in de naad ertussen, en er zijn vijf uitkomsten om uit te kiezen:

- **Delen (share)** — zero-copy via Delta Sharing. Snowflake leest SAP-dataproducten waar ze staan. Je betaalt consumer compute, en de versheid volgt de refresh-cadans van de producent.
- **Repliceren** — een Datasphere-replicatieflow zet een tweede kopie neer. Je betaalt de initiële load, de deltaverplaatsing, outbound integration, opslag in rust, en een pipeline die iemand beheert. De data is zo vers als de laatste geslaagde run.
- **Federeren** — een remote table met query pushdown. De bron beantwoordt elke query op het moment zelf, dus het resultaat is actueel, en de bron draagt elke keer de last.
- **Hybride** — repliceer het aggregaat, federeer de zeldzame drill-down. Een dashboard en een opzoeking op regelniveau zijn twee workloads, en één daarvan rechtvaardigt een kopie.
- **In SAP houden** — modelleren en rapporteren binnen SAP, met de resultaten naar SAP Analytics Cloud.

Het diagram loopt bovendien beide kanten op: Snowflake dient ook als bron voor Datasphere, als remote table of binnen een replicatieflow — zoals de meeste echte landschappen in de praktijk werken.

## Eerst de constraints, dan pas de kosten

Negen regels wijzen elk object een modus toe, en de volgorde draagt het argument. De eerste vijf bepalen wat mogelijk is; de zevende kiest uit wat overblijft.

1. **Dataresidentie en persoonsgegevens.** Waar een kopie in rust moet blijven, en wanneer een queryresultaat dat de grens oversteekt ook als export telt. Objecten die door beide gebonden zijn, blijven in SAP.
2. **Deltacapaciteit.** Replicatie past bij objecten die een delta kunnen leveren. Boven het omvangsplafond valt de modus af op een volledige herlaad per cyclus — de gebruikelijke uitkomst voor custom Z-tabellen.
3. **Versheids-SLO.** Een kopie is zo vers als de laatste run; een share is zo vers als de producent heeft gekozen. De SLO zegt welke van die twee volstaat.
4. **Latency-SLO bij piekconcurrency.** Federatie draait op het systeem dat óók de business draait, en wordt daarom gemeten bij de maandafsluiting in plaats van op een rustige middag.
5. **Beschikbaarheid van de share.** Zero-copy vraagt om een door SAP geleverd dataproduct, outbound. Bestaat dat, dan is delen een kwestie van configuratie; bestaat het niet, dan is het bouwen ervan een project.
6. **Semantiek.** Objecten die rijk zijn aan valutaomrekening, hiërarchieën en CDS-annotaties krijgen de voorkeur voor de share, binnen een expliciet benoemde kostenpremie — want die semantiek downstream opnieuw opbouwen kost geld dat nooit op de rekening van de pipeline verschijnt.
7. **Economie.** De goedkoopste overgebleven modus wint.
8. **Hybride.** Splits het object waar het werkelijk twee workloads is.
9. **Join-lokaliteit.** Adviserend: ontsluit de gemodelleerde view, zodat joins aan SAP-zijde draaien waar de data staat en alleen het resultaat oversteekt.

Economie op plek zeven houden is hier de architecturale toezegging, en de code dwingt het af: constraints elimineren voordat er ook maar één kostenpost berekend wordt, zodat een goedkope optie zich nooit langs een residentie-regel kan praten.

## De omslag, in één regel

Repliceren is grotendeels vaste kosten. Federeren is grotendeels variabele. Twee rechte lijnen, en ze snijden elkaar:

```
                                F_repliceren − F_federeren
  omslag (queries/dag)  =  ────────────────────────────────────
                           (v_federeren − v_repliceren) × 30
```

Onder de omslag is federeren goedkoper. Erboven verdient de kopie zichzelf terug.

Die formule verandert een gesprek over voorkeuren in een gesprek over twee getallen — wat een query de bron kost, en wat de pipeline per maand kost — en twee getallen kan een kamer in een middag beslechten. In de uitgewerkte catalogus slaat `ACDOCA` om bij 61 queries/dag en `T001` bij ruwweg 11.000: twee objecten met heel andere economie, die onder één default dezelfde behandeling zouden krijgen.

Delen verandert de vorm van de curve in plaats van de positie. Het haalt vrijwel alle vaste kosten weg — geen pipeline, geen tweede kopie, geen outbound-metering — en verhoogt de marginale kosten, omdat een gedeeld object minder efficiënt prunet dan een native tabel. Een share wint dus duidelijk bij gemiddelde queryfrequentie op semantisch rijke data, en een gewone kopie wint op de heetste feiten met de hoogste concurrency.

## Het draaien

Het oneens zijn krijgt hier de vorm van een pull request tegen `config/policy.yaml` of `config/cost_model.yaml`, waarna het register opnieuw rendert met de consequenties eraan vast.

`make demo` draait end-to-end in minder dan een minuut op een laptop. Het wijst een modus toe aan alle 24 objecten in een synthetisch gemengd SAP-landschap, schrijft een register waarin elke rij de regel draagt die hem besliste plus wat de afgevallen opties zouden hebben gekost, en voert alle drie de modi uit op lokale DuckDB. De besliste mix komt uit op €9.279/maand tegenover €27.557 voor alles repliceren — 66% vermeden, en zes pipelines minder om te beheren. Twee HR-objecten blijven op constraints in SAP, en het register prijst nog steeds wat repliceren ervan zou hebben gekost, zodat de constraint zichtbaar blijft als een geprijsde keuze.

De simulatie is zorgvuldig over wat ze aantoont. DuckDB speelt beide kanten van de naad, dus de querytijden liggen per constructie binnen milliseconden van elkaar; ze worden afgedrukt en als zodanig gelabeld, want de echte federatiepenalty is een netwerk-hop naar een druk productiesysteem. Wat de substitutie wél behoudt, is precies waarin de modi verschillen. Replicatie laat een tweede kopie in rust achter en een deltajob die op elke tick draait. Federatie en delen laten het warehouse vrijwel niets bewaren. En verandert er een rij in de bron, dan geeft federatie die bij de volgende query weer, geeft een share die weer zodra de producent opnieuw publiceert, en een kopie na de volgende deltarun.

Die laatste zin is het meenemen naar een design review waard: **een share is een kopie die iemand anders beheert, en de versheid ervan is hun belofte in plaats van jouw schema.** Kies er dus voor om de semantiek en de economie, en houd rekening met de cadans van de producent.

## Wat het artefact bevat

Hier net zo duidelijk gezegd als in de README: DuckDB staat aan beide kanten van de naad model. De kostencijfers zijn illustratieve placeholders in de vorm van listprijzen, ondergebracht in één YAML-bestand zodat een echte rate card er zo in past. De catalogus van 24 objecten is synthetisch, gevormd naar een DACH-maakbedrijf. Het integratielandschap van SAP beweegt snel, dus de genoemde mechanismen zijn het waard om tegen actuele documentatie te controleren voordat er een budget van afhangt.

Het duurzame artefact is de beslisprocedure. Laad een echte rate card, draai opnieuw, en lees wat er verschuift: elke beslissing die onder echte prijzen beweegt, was een economische keuze in plaats van een architecturale — nuttig om vroeg over je eigen landschap te weten.

## Waarom ik zo bouw

Dit is de loop die ik overal draai: intentie eerst opgeschreven, afwegingen vastgelegd als ADR's, en de claim gedemonstreerd in plaats van beweerd. Ik heb deze naad in het echt geleverd — zie de casestudy [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake), waar datacontracten precies daar zitten waar SAP overdraagt aan het lakehouse. Het patroon is op beide plekken hetzelfde: leg het ontwerpvlak op de grens, en maak de beslissing daar expliciet genoeg om te reviewen.

Een referentiearchitectuur wordt bruikbaar op het moment dat een team het er precies mee oneens kan zijn. De beslismotor eraan vastmaken is wat dat mogelijk maakt.

*De repo is publiek en MIT-gelicentieerd: [github.com/fps4/sap-bdc-snowflake-blueprint](https://github.com/fps4/sap-bdc-snowflake-blueprint). Begin bij `docs/reference-architecture.md` — dat is de pagina die op het scherm hoort, en al het andere bestaat om die te ondersteunen.*
