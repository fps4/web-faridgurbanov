---
id: P-04
order: 4
title: "Eerst autoriseren, dan ophalen"
summary: "Bepaal wat de vrager mag zien voordat de zoekopdracht draait, en neem die set op in de query."
status: current
revised: 2026-11-08
related: [practice/articles/knowledge-layer-a-lawyer-can-act-on, P-03]
topics: [ai, governance]
tech: [knowledge-graphs]
---

## Probleem

Een AI-assistent antwoordt op basis van opgehaalde passages. De gangbare controle filtert de
resultaten na het ophalen, of leunt op de toegangslijst van de documentopslag. Op dat moment is de
afgeschermde passage al gekozen, gerangschikt en in de context gezet, en probeert het filter haar
terug te nemen.

## Krachten

- Of iets mag, hangt af van het antwoord: welke feiten een query opleverde, welke dossiers ze raken,
  wat ze hebben geërfd. Niets daarvan is bekend voordat de query heeft gedraaid.
- Documenten citeren andere documenten. Een notitie die op een open dossier is gearchiveerd, kan een
  afgeschermd dossier citeren, en een filter dat kijkt waar een document is gearchiveerd, laat haar
  door.
- Agents stellen meerdere queries samen, en geen enkele query ziet de hele keten.
- Een weigering moet uit te leggen zijn, en het overzicht van weigeringen is zelf ook gevoelig.

## Oplossing

Zet één resolver tussen de afnemers en zowel de graph als de zoekindex, en laat die bij elk verzoek
dezelfde stappen in dezelfde volgorde doorlopen:

1. Los de termen in de vraag op, en weiger een term die dubbelzinnig is.
2. Zoek kandidaat-entiteiten, alleen als identifiers.
3. Bepaal per entiteit, en per afgeleid feit via lineage, wat deze persoon mag zien.
4. Haal passages op met de toegestane set in de query.
5. Antwoord met bronvermelding, of weiger en noem de regel, de eigenaar en de datum waarop die is
   vastgesteld.
6. Schrijf één record van het verzoek.

Stap 3 komt vóór stap 4. De zoekopdracht kan een geweigerd item niet noemen, dus achteraf hoeft er
niets gefilterd te worden. De index slaat elke entiteit op waarvan een passage afhangt, en het
filter eist dat ze allemaal zijn toegestaan. De documentopslag houdt zijn eigen slot als tweede
linie.

## Gevolgen

- Eén plek om toegang af te dwingen en één plek om te meten dat die standhield, zodat een
  evaluatiebatterij en een lektest als poort voor deployment kunnen dienen.
- In het lab zette een filter op documentniveau bij alle 16 vragen over precedenten en cliënten met
  naam afgeschermde inhoud voor het model. Het filter via lineage deed dat bij geen enkele.
- De resolver plant niets en draait deterministisch, en daardoor is hij testbaar. Agents roepen hem
  aan als tool.
- Hij hangt af van volledige lineage ([P-03](/nl/practice/patterns/lineage-inherited-control)): een
  citaat dat de extractie miste, is een lek.
- Tellingen over het hele kantoor worden lastig. Iedereen is van iets afgeschermd, dus aggregaten
  hebben een eigen, vastgelegd beleid nodig.

## Wanneer niet

- Een corpus met één publiek, waarin iedereen alles mag zien.
- Zoeken in openbare inhoud.
