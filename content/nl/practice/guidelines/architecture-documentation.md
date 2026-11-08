---
id: G-01
order: 1
title: "Documentatie in drie lagen"
summary: "Eén kaart (HLD), één logboek (ADR's), en code voor de rest."
status: current
revised: 2026-11-08
related: [expertise/architecture-decisions, G-03]
topics: [architecture]
tech: []
---

## De regel

Houd één dun, levend high-level design bij dat de vorm van het systeem laat
zien. Leg elke beslissing die duur is om terug te draaien vast in een ADR.
Schrijf alleen een low-level design waar de code niet voor zichzelf spreekt.

## Waarom

Architectuurdocumenten mislukken op twee voorspelbare manieren. Het grote
ontwerpdocument is binnen een kwartaal verouderd, omdat het het systeem
tegelijk wil beschrijven en verantwoorden. En teams die daarop reageren door
alleen nog beslissingen vast te leggen, hebben na een tijd tachtig records en
niemand die het systeem van begin tot eind kan uitleggen. Het eerste verliest
het *wat*. Het tweede verliest het *geheel*.

De taak opsplitsen lost beide op. De kaart beschrijft. Het logboek
verantwoordt. Geen van beide hoeft het werk van de ander te doen.

## Hoe ik het toepas

**De kaart: een high-level design (HLD).** Het beantwoordt de vraag *hoe ziet
het systeem er nu uit?* Ik beperk het tot de hoofdstukken die mensen lezen:

1. Doelen, scope en wat er expliciet buiten valt
2. Kwaliteitseisen en randvoorwaarden (beschikbaarheid, latency, beveiliging,
   compliance, kosten)
3. Context: het systeem als black box, met zijn gebruikers en buren
4. Bouwstenen: de belangrijkste containers, opslag en integratiepunten
5. De kritieke runtime-flows
6. Deployment en netwerkzones
7. Overkoepelende concepten: identiteit, beveiliging, observability,
   data-eigenaarschap
8. Risico's en open vragen
9. Links naar de beslissingen

Het verandert als de vorm verandert, een paar keer per jaar. Begint een alinea
met *"we kozen X omdat…"*, dan hoort die hier niet. Die hoort in een ADR, met
een link.

**Het logboek: architecture decision records (ADR's).** Eén beslissing per
record, een of twee pagina's, en er komt alleen iets bij. Een beslissing die
verandert wordt niet bewerkt: een nieuw record vervangt haar en verwijst terug.
Elk record bevat:

- Status: voorgesteld, geaccepteerd, vervallen, vervangen door …
- De context en de krachten die meespelen
- De overwogen opties, met de voor- en nadelen van elk
- De beslissing, in de bedrijvende vorm
- Gevolgen: wat makkelijker wordt, wat moeilijker, en welk vervolgwerk eruit
  voortkomt

De afgewezen opties zijn het belangrijkst. Die vergeten mensen het eerst, en
die stelt de volgende architect opnieuw voor.

Ik schrijf een ADR als een beslissing duur is om terug te draaien of later
waarschijnlijk ter discussie komt, op elk niveau: "events tussen domeinen,
geen synchrone calls" en "optimistic locking op de ordertabel" komen allebei
in aanmerking.

**Het detail: low-level design (LLD), grotendeels als code.** De binnenkant van
componenten, API-contracten, schema's en configuratie veranderen wekelijks. Een
apart document daarvoor loopt binnen een sprint achter. Dus het contract *is*
het ontwerp: OpenAPI- en AsyncAPI-specs, schemabestanden, infrastructure as
code, contracttests. Die kunnen niet afwijken van wat er draait.

Een LLD in proza schrijf ik nog wel waar de zakelijke betekenis buiten de code
ligt: mappings op veldniveau tussen bedrijfssystemen, rekenregels uit
regelgeving, en afspraken tussen teams die geen repository delen.

**Waar het staat.** In de repository, naast de code, beoordeeld via pull
requests, met diagrammen als code. Voor een systeem dat over veel repository's
loopt, staan het HLD en de overkoepelende ADR's in één architectuurrepository
waar iedereen naar linkt.

![Diagram: de kaart, een high-level design, beschrijft hoe het systeem er nu uitziet, verandert een paar keer per jaar en linkt naar de beslissingen. Het logboek van ADR's verantwoordt ze, met één record per beslissing die duur is om terug te draaien, over de vorm of over het detail, en er komt alleen iets bij. Het detail staat als code (OpenAPI- en AsyncAPI-specs, schemabestanden, infrastructure as code, contracttests) en verandert wekelijks, en alle drie staan in de repository naast de code.](/diagrams/architecture-documentation-nl.svg)

## Afwegingen

- **Repository's sluiten mensen buiten.** Risk, compliance en business owners
  openen er zelden een. Publiceer een gerenderde versie die ze kunnen lezen en
  van commentaar kunnen voorzien.
- **ADR-discipline ontspoort naar twee kanten.** Triviale beslissingen worden
  vastgelegd, en grote overgeslagen omdat ze toen vanzelfsprekend leken. Eén
  vraag bij de review helpt: *zou een nieuwe architect vragen waarom?*
- **Dunne documenten gaan uit van een lezer met context.** Een nieuwkomer heeft
  naast het HLD misschien een rondleiding nodig, als aanvulling en niet als
  vervanging.
- **Uitvoerbare specs tonen het contract, niet de bedoeling.** Een
  OpenAPI-bestand zegt hoe een veld heet, niet wat het bedrijf ermee bedoelt.

## Wanneer ik ervan afwijk

- **Gereguleerde omgevingen:** ik zet bij elke ADR wie hem goedkeurt en wat de
  impact op compliance is. Een auditor hecht meer aan een navolgbare redenering
  dan aan een gepolijst document.
- **Contractuele opleveringen:** als een klantcontract een formeel LLD eist,
  wordt het geschreven, waar mogelijk gegenereerd uit de specs, zodat het niet
  vanzelf gaat afwijken.
- **Heel kleine systemen:** één pagina HLD en een handvol ADR's is genoeg.
  Hoeveel ceremonie er nodig is, hangt af van wat een fout kost.

## Sjablonen om mee te beginnen

**ADR**

```text
# ADR-NNN: <beslissing in een paar woorden>
Status: Voorgesteld | Geaccepteerd | Vervangen door ADR-MMM
Datum: JJJJ-MM-DD   Besluitvormers: …   Goedkeurder: … (gereguleerde omgevingen)

## Context
## Beslisfactoren
## Overwogen opties
### Optie A: voor / tegen
### Optie B: voor / tegen
## Beslissing
## Gevolgen
## Impact op compliance (gereguleerde omgevingen)
```

**Opzet van een HLD**

```text
1. Doelen en scope   2. Kwaliteitseisen en randvoorwaarden
3. Context           4. Bouwstenen
5. Runtime-flows     6. Deployment
7. Overkoepelend     8. Risico's en open vragen
9. Beslissingen (links naar ADR's)
```
