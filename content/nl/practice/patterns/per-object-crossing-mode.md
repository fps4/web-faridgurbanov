---
id: P-01
order: 1
title: "Overgangsvorm per object"
summary: "Kies per object tussen delen, repliceren, federeren, splitsen of in de bron houden, met geordende regels en een omslagpunt."
status: current
revised: 2026-11-08
related: [practice/articles/sap-snowflake-seam-decision, work/sap-snowflake, G-03]
topics: [integration, data-platforms]
tech: [sap, snowflake]
---

<!-- NEEDS HUMAN REVIEW: machine-drafted Dutch of the EN entry (FS-0013). Remove this line once Farid has read it. -->

## Probleem

Data moet van het ene platform naar het andere, bijvoorbeeld van een ERP naar een warehouse, en het
landschap kiest één integratiestijl voor alles: alles repliceren, of alles federeren. Elk object
betaalt dan het kostenprofiel van een vorm die met een ander object in gedachten is gekozen.

## Krachten

- Repliceren is vooral vaste kosten: de initiële load, het verplaatsen van delta's, opslag, en een
  pipeline die iemand beheert. De kopie is zo vers als de laatste geslaagde run.
- Federeren is vooral variabele kosten. De bron beantwoordt elke query, dus het resultaat is
  actueel, en de bron draagt elke keer de belasting, ook tijdens de maandafsluiting.
- Een zero-copy share haalt de meeste vaste kosten weg en verhoogt de marginale kosten. Hoe vers hij
  is, hangt af van wat de producent belooft.
- Sommige objecten bevatten semantiek (valutaconversie, hiërarchieën, annotaties) die downstream
  duur is om na te bouwen.
- Residency, persoonsgegevens en delta-ondersteuning sluiten vormen uit voordat de kosten meetellen.

## Oplossing

Bepaal de overgang per object, uit vijf vormen:

| Vorm | Past als |
|---|---|
| Delen (share) | de bron levert een data product; de semantiek is rijk; de queryfrequentie is gemiddeld |
| Repliceren | het object kan een delta leveren en wordt vaak genoeg bevraagd om een kopie te laten lonen |
| Federeren | queries zijn zeldzaam, moeten actueel zijn, en de bron kan ze op piekmomenten aan |
| Splitsen | één object is twee workloads: een dashboard op het aggregaat, een zeldzame drill-down naar regelniveau |
| In de bron houden | residency- of privacyregels houden het daar vast |

Draai eerst de randvoorwaarden ([G-03](/nl/practice/guidelines/constraints-before-cost)), en
vergelijk daarna de overgebleven vormen op kosten. Tussen repliceren en federeren zijn dat twee
rechte lijnen, en die snijden elkaar:

```text
crossover (queries/day) = (F_replicate − F_federate) / ((v_federate − v_replicate) × 30)
```

Onder het omslagpunt federeer je. Daarboven verdient de kopie zichzelf terug. Het resultaat gaat in
een register: elk object, de vorm, de regel die besliste, en wat de afgewezen vormen gekost zouden
hebben.

## Gevolgen

- De discussie krimpt tot twee getallen per object: wat een query de bron kost en wat de pipeline
  per maand kost. Over twee getallen is een zaal in een middag uit.
- Objecten met een andere economie krijgen een ander antwoord. In de uitgewerkte catalogus lag het
  omslagpunt van een grote financiële feitentabel bij 61 queries per dag, terwijl een kleine
  referentietabel er ongeveer 11.000 nodig had.
- Meer vormen betekent meer soorten beheer: meer om te draaien, te monitoren en uit te leggen.
- Een share is een kopie die iemand anders beheert. Plan rond het verversingsritme van de producent.

## Wanneer niet

- Een handvol objecten: beslis ze samen in één ADR.
- Het doelplatform heeft geen pad voor federatie of sharing. Er blijft één vorm over en de vraag is
  beantwoord.
- Volumes waarbij kosten en versheid er niet toe doen: kies de eenvoudigste vorm en ga door.
