---
id: P-03
order: 3
title: "Controle via lineage"
summary: "Een afgeleid asset krijgt de strengste controle van zijn bronnen, tot een vastgelegde declassificatie die weghaalt."
status: current
revised: 2026-11-08
related: [practice/articles/export-control-who-sees-what, practice/articles/knowledge-layer-a-lawyer-can-act-on, P-02, P-04]
topics: [governance, data-platforms]
tech: [databricks]
---

## Probleem

Controles worden op tabellen gezet: classificeer elke tabel, tag haar en ken rechten toe per tag. Op
de dag dat het gebeurt, klopt dat. Maar gecontroleerde tabellen zijn invoer. Ze worden gejoind,
geaggregeerd, omgezet in features en gebruikt om modellen te trainen, en wat eruit komt zijn nieuwe
assets die niemand heeft geclassificeerd.

## Krachten

- Er zijn meer afgeleide assets dan bronnen, en wie ze maakt, heeft de classificatie van de bron
  nooit gezien.
- Een naam zegt niets over de inhoud. Een view die `public_fleet_summary` heet, kan gecontroleerde
  parameters bevatten.
- Een controle weghalen is soms terecht (een goed aggregaat, een beoordeling door een
  toezichthouder), en dan moet iemand ervoor instaan.
- Modellen, endpoints en agents zijn ook afgeleide assets.

## Oplossing

Maak lineage de eenheid van controle. Classificatie komt alleen binnen bij een bron, en de loader
weigert een gedeclareerde classificatie op alles wat afgeleid is. Elk afgeleid asset erft elke
controle van elke invoer, met de bron waar die vandaan komt, en houdt die.

Alleen een registerinvoer haalt een controle weg. De invoer noemt het asset, wat ze weghaalt, de
grond, wie besliste, wanneer ze verloopt, en of ze ook geldt voor wat stroomafwaarts wordt afgeleid.
Is de grond een regel (minstens vijfentwintig per groep, geen gecontroleerde parameter, geen vrije
tekst), dan controleert de engine de regel en weigert hij een invoer die er niet aan voldoet. Is de
grond een beoordeling of het oordeel van een persoon met naam, dan legt de engine de invoer vast en
toont hij wanneer die vervalt.

Tags op het platform zijn de uitkomst van deze regel, nooit de invoer.

## Gevolgen

- Controles volgen de data in features, modellen, serving endpoints en agents. In het lab voor
  exportcontrole vond lineage vier van de vierentwintig afgeleide assets die gecontroleerd waren
  door waaruit ze gemaakt zijn en open door hoe ze heten.
- Het register is wat een toezichthouder opvraagt, en de enige plek waar een controle kan worden
  weggehaald.
- Dezelfde regel dicht een lek bij het ophalen: een notitie die een afgeschermd dossier aanhaalt,
  erft de afscherming ([P-04](/nl/practice/patterns/authorise-before-retrieve)).
- Lineage moet volledig zijn. Een gemiste verbinding is een gemiste controle, dus het vastleggen van
  lineage en de recall van citaties worden beveiligingseigenschappen.
- Als het misgaat, is het standaard te veel controle: een aggregaat blijft afgeschermd tot iemand de
  invoer indient.

## Wanneer niet

- Een landschap met overal hetzelfde gevoeligheidsniveau.
- Kortlevende sandboxes zonder pad naar productie of naar een export.
