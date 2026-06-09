---
title: Hoe ik niet-technische PO's specs laat schrijven die agents kunnen uitvoeren
summary: Het verschil tussen een luie prompt en een spec die een agent aanstuurt — en waarom een product owner die het tweede kan schrijven een force multiplier is voor het hele team.
date: 2026-05-20
order: 1
---

# Hoe ik niet-technische PO's specs laat schrijven die agents kunnen uitvoeren

Je hebt een AI-feature uitgebracht. Korte vraag: was het AI-team eigenaar van de spec, of de product owner?

Voor de meeste teams is het eerlijke antwoord het AI-team — en dat is precies het probleem. Product owners worden omringd door AI, worden verwacht features te leveren die het gebruiken, en krijgen vrijwel nooit de ene vaardigheid aangeleerd die echt het verschil maakt: het **aansturen** ervan. Niet er losjes mee prompten. Het aansturen zoals een senior engineer een junior aanstuurt — met een spec die duidelijk genoeg is om tegen uit te voeren.

## Een luie prompt versus een spec

Hier is de demo die ik live uitvoer. Neem een echt backlog-item — bijvoorbeeld "laat gebruikers hun facturen exporteren." Geef een agent de luie versie:

> Voeg een factuurexport-feature toe.

Je krijgt *iets*. Een knop, misschien een CSV. Het mist de datumbereik-filter, negeert het multi-currency-geval, verzint een bestandsformaat, en slaat stilletjes de lege staat over. Geef het nu de spec-versie:

> **WANNEER** een ingelogde gebruiker Facturatie opent **MOET HET SYSTEEM** een "Facturen exporteren"-actie aanbieden.
> De export **MOET** een door de gebruiker gekozen datumbereik beslaan, standaard de laatste 12 maanden, en factuurnummer, datum, bedrag, valuta en status bevatten.
> **WAAR** er geen facturen in het bereik zijn, **MOET HET SYSTEEM** "Geen facturen voor deze periode" tonen en de download uitschakelen.
> Formaat: CSV, UTF-8, één rij per factuur. Buiten scope: PDF, geplande exports.

Dezelfde agent, hetzelfde model. De tweede output is dramatisch beter — niet omdat het model slimmer werd, maar omdat de spec het giswerk wegnam. De agent hoefde niet te *beslissen* wat "export" betekende; de PO had dat al gedaan.

Dat is de hele beweging. De intelligentie veranderde niet. De **aansturing** wel.

## De drie dingen die een PO echt nodig heeft

Zodra een PO dat ziet, volgt de rest. Ik leer drie superkrachten, en de eerste draagt het meeste gewicht:

1. **AI aansturen zoals een senior engineer dat zou doen.** Een spec schrijven die een agent kan uitvoeren: het werk opdelen, acceptatiecriteria in toetsbare vorm formuleren, expliciet benoemen wat buiten scope valt. Een prompt is een wens; een spec is een instructie.

2. **Evalueren wat er terugkomt.** Van "vibe check" naar iets systematisch — acceptatiecriteria voor AI-features, een paar held-out voorbeelden, zelfs een LLM-as-judge voor de vage gevallen. Als je niet kunt zeggen hoe "goed" eruitziet, kun je niet bepalen of de agent het heeft geleverd.

3. **Echte capaciteit van hype onderscheiden.** Een vendor-claim lezen en inschatten: is dit een weekend of een kwartaal? Een PO die dit kan, weerhoudt het team ervan demo's na te jagen die het contact met productie niet overleven.

## Waarom dit dezelfde discipline is waarmee ik bouw

Niets hiervan is een trainingstrucje. Het is precies hoe ik delivery met agents aanpak. In de `maestro`-referentiearchitectuur mergen agents niets — ze stellen voor, en een mens beslist, achter functionele en technische gates. De spec *is* het contract. De evals *zijn* de sign-off. Branch protection dwingt "mensen beslissen" af.

Een PO die specs schrijft die een agent kan uitvoeren, draait diezelfde loop op productniveau: heldere intentie erin, geëvalueerde output eruit, een mens die de gate beheert. Dat is geen junior-vaardigheid. Het is een force multiplier — één persoon wiens specs de agents van het hele team effectiever maken.

Dat is de wig die ik aanleer. Als jouw productorganisatie AI-features uitbrengt maar je PO's nooit hebben geleerd om ze aan te sturen of te evalueren, kost dat gat je meer dan je denkt — en het is een paar sessies om het te dichten.
