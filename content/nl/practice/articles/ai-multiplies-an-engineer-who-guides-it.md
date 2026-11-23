---
title: AI versterkt een engineer die het stuurt
summary: Ik zie AI als gereedschap dat ons vermogen als engineers en architecten kan vermenigvuldigen.
date: 2026-11-22
order: 3
read: Drie minuten lezen
from: [Mijn dagelijks werk]
---

Ik zie AI als gereedschap dat ons vermogen als engineers en architecten kan vermenigvuldigen. Maar het is heel moeilijk, of onmogelijk, om het heel weinig context te geven en te verwachten dat het iets bouwt dat echt voor iedereen werkt.

Daarvoor moeten we AI echt strak begeleiden. We maken kaders en goede, zorgvuldig samengestelde context, zodat het eerst bouwt wat nodig is. Daarna is er nog een laag van governance en validatie, met menselijke poorten. Dat is eigenlijk wat ik doe.

Een voorbeeld van zorgvuldig samengestelde context is een skill voor een platformproduct, gepubliceerd in een catalogus die de hele organisatie gebruikt. Ik heb er een gemaakt, en teams vinden hem erg nuttig. Engineers die met AI code laten schrijven, kennen dan alle functies en bijzonderheden van het product. Ze zijn minder tijd kwijt en maken minder fouten.

In mijn dagelijks werk begin ik met brainstormen over verschillende mogelijke oplossingen. Ik werk scenario's uit in modellen, en ik zorg dat alle voor- en nadelen aan bod komen die voor mij belangrijk zijn als verantwoordelijke engineer of architect. Het programmeren zelf doet meestal AI, maar ik kijk het goed na voordat ik het vastleg.

Ik gebruik het ook regelmatig als review-agent. Als een team elke dag met AI werkt, worden pull requests behoorlijk lang en moeilijk te beoordelen. Met 50 verschillende bestanden is een review door alleen een mens niet meer effectief. Of je het ermee eens bent of niet, je hebt modern gereedschap nodig voor een goede review.

Het andere punt is oorzaakanalyse. Die werkt behoorlijk goed als je goede koppelingen hebt met je monitoring en logging. Je geeft AI de mogelijkheid om gebeurtenissen met elkaar in verband te brengen uit de repository, de pipeline, de logs en wijzigingen in de infrastructuur, bijvoorbeeld Terraform-plannen. Ik heb het zo gebruikt bij een fout die behoorlijk moeilijk te vinden was. Het hielp om de fout te vinden en vrij precies uit te leggen waar het probleem zat. Een team van alleen mensen had nog een paar uur nodig gehad, en in een grote onderneming kan dat miljoenen aan gemiste omzet betekenen.

Ik herinner me niet één keer dat AI gewoon fout zat, misschien omdat ik niet verwacht dat het 100% gelijk heeft. Wat ik wel heb gehad, is dat AI een oplossing gaf die niet paste bij het specifieke geval, om redenen die in het begin niet duidelijk waren gemaakt.

En in mijn oplossingen vertrouw ik op deterministische processen en tests, en niet op een LLM.
