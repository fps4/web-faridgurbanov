---
title: Eerst eenvoudig: waarom ik de adapter niet op een groter integratieproduct heb gebouwd
summary: Ik ben voor eenvoud, en ik probeer extra complexiteit te vermijden als die niet nodig is.
date: 2026-11-22
order: 1
read: Drie minuten lezen
from: [Integratie-adapter | /en/work/integration-adapter, Cloud gateway | /en/work/cloud-gateway]
---

Ik ben voor eenvoud, en ik probeer extra complexiteit te vermijden als die niet nodig is.

Toen ik een integratie-adapter ontwierp, heb ik Boomi en Apache Camel bekeken. Het kan lijken dat die technologieën veel geavanceerder zijn, en ze hadden goed kunnen passen. Maar voor allebei hadden we mensen flink moeten omscholen voordat we ze konden invoeren. De stack die ik heb gebruikt was al eigen aan het bedrijf, en de kennis was er. Bij het API-platform ging het net zo: het bedrijf gebruikte IBM API Connect, en ik heb Kong bekeken als open-source gateway die ik had kunnen nemen.

Een oplossing slaagt meestal niet door technische briljantheid. Ze slaagt door de combinatie van wat de technologie kan, wat de organisatie nu draait, waar ze uiteindelijk naartoe wil, en wat de organisatie aankan met de mensen en processen die er zijn.

Deze keuze heeft een prijs. Teams die gewend zijn hun adapters zelf te programmeren, zullen de ontwerpkeuzes ter discussie stellen. Een mappingtaal als JSONata is niet genoeg voor de complexe logica die ze in hun eigen code hebben. Ze zullen ook zeggen dat het platform hun werk vertraagt en een externe afhankelijkheid maakt.

Volgens mij hoort die complexe logica bij het integratieontwerp, en niet bij één adapter. Mijn aanpak is om eenvoudigere, losgekoppelde adapters te hebben, die ook in de hele organisatie gedeeld kunnen worden.

Een voorbeeld: een fan-out naar twee partijen. Ik zou dat met drie adapters bouwen. Eén gaat van de bron naar een topic, in JSON dat voldoet aan de standaard van het bedrijf, en later met een catalogus en een beheerd schema. De twee andere gaan van het topic naar de specifieke bestemmingen. Met pub/sub bespaart dat in totaal werk, zodra er een duidelijke catalogus van event-topics is.

Het kost het team misschien wat meer tijd en moeite. Maar op de lange termijn is het goed voor de hele organisatie en ook voor het team zelf: ze gaan sneller en hebben minder plekken waar iets kapot kan gaan.

En ik laat een team het liever op zijn eigen manier doen als de vraag echt uniek is, of als het een tijdelijk probleem oplost in een overgangsperiode.
