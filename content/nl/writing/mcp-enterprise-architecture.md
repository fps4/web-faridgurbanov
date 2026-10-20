---
title: Bepalen hoe MCP in een enterprise landt
summary: MCP wordt sneller ingevoerd dan het ontworpen wordt, en zes beslissingen worden nu bij verstek genomen in plaats van bewust. Wiens identiteit roept downstream aan, één gateway of veel servers, hoe grof een tool mag zijn — en de uitkomst die mij het meest verraste: de eerste storing is geen securitystoring. Het is dat méér systemen aansluiten de assistent meetbaar slechter maakt.
date: 2026-09-07
order: 1
---

# Bepalen hoe MCP in een enterprise landt

Het Model Context Protocol ging in ongeveer een jaar van een aankondiging naar een regel in enterprise AI-programma's. Ik lees inmiddels regelmatig opdrachtomschrijvingen waarin staat *activeer de MCP-laag*, alsof het een product met een installatiestap is.

Het is een protocol, en dat is het nuttige om vast te houden. **MCP is een integratieprotocol**, dus alles wat een organisatie al geleerd heeft over integratieplatformen is erop van toepassing, en de meeste faalvormen hebben namen die we al twintig jaar gebruiken. Er is precies één werkelijk nieuwe eigenschap: de client is een taalmodel, en een taalmodel kan een instructie niet betrouwbaar onderscheiden van een stuk data. Vrijwel elk probleem in dit artikel dat géén oud integratieprobleem is, komt voort uit die ene zin.

Zes beslissingen. Ze worden hoe dan ook genomen; de enige vraag is of er iemand bij was.

## 1. Wiens identiteit roept downstream aan?

Dit is de beslissing die het vaakst per ongeluk genomen wordt, omdat de eerste server die iemand schrijft een serviceaccount gebruikt, en dat werkt.

Een service-identiteit betekent dat de MCP-server één credential heeft en namens iedereen handelt. Het is snel te bouwen en het wist stilletjes je rechtenmodel uit. Elke toegangslijst in elk downstream systeem is geschreven over *gebruikers*, en je hebt zojuist een aanroeper geïntroduceerd die dat niet is. De assistent kan nu alles lezen wat het serviceaccount kan lezen, namens iedereen die bij de assistent kan.

Het alternatief is gedelegeerde identiteit: de identiteit van de aanroepende gebruiker bereikt het downstream systeem, en de bestaande toegangslijsten blijven gewoon hun werk doen. Dit is de waardevolste eigenschap die een enterprise MCP-omgeving kan hebben, en gratis is hij niet. De server moet een volwaardige OAuth resource server zijn, tokens moeten *uitgewisseld* worden in plaats van doorgegeven — de autorisatierichtlijn van het protocol zelf is er ondubbelzinnig over dat een server geen token hoort te accepteren dat niet voor hem is uitgegeven — en elk downstream systeem moet het resultaat accepteren. Waar een legacysysteem alleen serviceaccounts spreekt, eindig je met een mappinglaag, en **in die mappinglaag zit je rechtenmodel dan feitelijk.** Die verdient het om ontworpen te worden in plaats van ontdekt.

Eén toets beslist dit. *Als het antwoord op "mag deze persoon dit document zien?" verandert wanneer de vraag via de assistent loopt, dan klopt de architectuur niet.* Een AI-platform mag geen route naar meer rechten zijn, en bij verstek wordt het dat wel.

## 2. Eén gateway, of veel servers?

Dit is de discussie over de enterprise service bus, opnieuw gevoerd, met nieuwe zelfstandige naamwoorden.

Veel kleine servers — één per systeem, in eigendom van het team dat dat systeem beheert — geven je helder eigenaarschap, onafhankelijke deployment en een beperkte impact bij storingen. Ze geven je ook N verbindingen om te beheren, toolnamen die tussen servers botsen, geen enkel punt om beleid af te dwingen, en geen enkel auditlogboek.

Eén aggregerende gateway geeft je het omgekeerde: één verbinding, één punt waar beleid wordt beslist, één audittrail. Hij geeft je ook één team waar elke wijziging achter in de rij komt. Dat is de ESB. Ik help er op dit moment één buiten gebruik stellen, en de reden daarvoor is niet dat de techniek slecht verouderd is. Het is dat een centraal integratieteam het knelpunt werd voor de roadmap van elk domein.

Ik heb dezelfde discussie gevoerd over API-gateways: ruim twintig versnipperde gateways samengebracht in één gefedereerd platform, ongeveer 500 miljoen requests per maand, en wat het liet werken was dat het *gefedereerd* was en niet gecentraliseerd. Een dunne control plane bezat beleid, identiteit en observability. De domeinen bezaten hun eigen services en leverden zonder toestemming te vragen. Niemand kreeg de opdracht te migreren; het platform werd goedkoper om op te zitten dan om buiten te blijven.

Federeer MCP op dezelfde manier. Centraliseer identiteit, beleid en audit — die horen echt op één plek. Laat de servers bij de domeinen die de systemen erachter bezitten.

## 3. Capability, geen workflow

De granulariteit van tools bepaalt meer over de bruikbaarheid van een assistent dan de modelkeuze doet.

Te primitief en je hebt het model een `run_sql`-tool gegeven en het gevraagd om bij elke aanroep je bedrijfslogica te reconstrueren. Dat doet het met overtuiging, en af en toe fout op een manier die niemand opmerkt, want een plausibel getal ziet er niet uit als een fout.

Te grof en je hebt een `handle_incident`-tool die acht dingen doet. Je hebt de agent *in* de server gezet, en daarmee de samenstelbaarheid verloren die het protocol om te beginnen interessant maakte. Nu hebben twee teams net iets andere incidentafhandeling nodig en valt er niets samen te stellen, alleen een parameter toe te voegen.

Het juiste niveau is het niveau dat voor een API altijd al juist was: **een businesscapability met een contract.** Iets wat een mens kan omschrijven als iets dat hij doet, met invoer en uitvoer die iemand bezit.

De valkuil is dat het goedkoopst te bouwen ding een tool per bestaand REST-endpoint is. Doe dat en je tooloppervlak heeft de vorm van je systeemlandschap in plaats van van het werk. Niemands functie is "roep endpoint veertien aan".

## 4. Het contextbudget is een architectuurrandvoorwaarde

Dit is degene die ik onderschatte, en het is de storing die als eerste komt.

Elke tooldefinitie die je blootstelt is uitgegeven context. Sluit een stuk of twaalf servers aan met samen een paar honderd tools en het model leest eerst een catalogus voordat het iets doet — en kiest vervolgens vaker het verkeerde item dan toen er twaalf waren. De mogelijkheden nemen toe en de betrouwbaarheid neemt af, en die curve buigt eerder om dan iedereen verwacht.

De eerste echte storing bij een enterprise MCP-uitrol is dus meestal geen datalek. Het is dat de assistent slechter werd naarmate er meer systemen op werden aangesloten, wat precies het tegenovergestelde is van wat iedereen beloofd is, en waar in een stuurgroep bijzonder slecht tegenin te brengen valt.

De maatregelen zijn gewoon zodra je de randvoorwaarde accepteert: beperk het tooloppervlak tot de taak of de rol in plaats van alles aan iedereen te tonen, gebruik nadrukkelijk namespaces zodat botsingen zichtbaar worden, en overweeg een discovery-tool die een gefilterde selectie teruggeeft in plaats van de hele catalogus in elke sessie te laden.

Het punt eronder is het opschrijven waard. **Het tooloppervlak is een ontworpen artefact met een budget. Het is geen inventarislijst van alles wat je aangesloten kreeg.**

## 5. Lezen en schrijven zijn verschillende systemen

Nu de eigenschap die geen precedent heeft in integratiearchitectuur.

Het model leest inhoud die het niet zelf geschreven heeft — een ticketomschrijving, een document, een e-mail, een webpagina — en het kan instructies in die inhoud niet betrouwbaar onderscheiden van data in die inhoud. Als een sessie zowel een tool bevat die niet-vertrouwde inhoud leest als een tool die onomkeerbaar handelt, dan heeft die niet-vertrouwde inhoud een pad naar die handeling. Dat is het confused-deputy-probleem, en de deputy is in de war omdat behulpzaam zijn het hele ontwerp is.

In de praktijk: scheid het leesoppervlak van het schrijfoppervlak, en laat ze niet achteloos een sessie delen. Zet een menselijke beslissing of een expliciete beleidspoort voor alles met neveneffecten. Leestools mogen ruim zijn; schrijftools horen schaars, specifiek en gelogd te zijn.

En log het juiste. Een transcript van de berichten van het model is geen audittrail. Het vastlegging die een toezichthouder beantwoordt is **per aanroep**: welke tool draaide, onder welke gebruikersidentiteit, met welke argumenten, tegen welk downstream systeem, en wat er terugkwam. Dat is een klein, saai, gestructureerd record, en het is het hele verschil tussen een beheerst platform en een demo met productiedata erin.

## 6. Het protocol is het bezit. De orchestrator is vervangbaar.

Wat mij bij de zin brengt die ik steeds in opdrachtomschrijvingen tegenkom: *het MCP SaaS-platform.*

MCP is een protocol. Een product dat het spreekt is een orchestratielaag met de opvattingen van een leverancier eraan vast, en er een kopen is vaak de juiste keuze — het levert het governanceoppervlak in weken in plaats van kwartalen, en dat oppervlak is echt het moeilijke deel. Maar het zet ook een leverancier tussen je identityprovider en je data, en het hele punt van een protocol was dat de connectoren overdraagbaar zouden zijn.

Er is één ontwerpkeuze die de beslissing omkeerbaar houdt: **de servers zijn van jou.** Als je MCP-servers gewone protocolimplementaties zijn, in eigendom van de domeinen, uitgerold op je eigen infrastructuur, dan is de orchestrator gewoon een client en zijn clients uitwisselbaar. Als de servers alleen bestaan als configuratie in de console van een leverancier, heb je opnieuw een ESB gekocht — en deze keer zijn de connectoren niet eens exporteerbaar.

## De toets

Eén vraag beslist de meeste van deze ontwerpen sneller dan een workshop doet.

*Voor elk antwoord dat de assistent zojuist gaf: kun je zeggen wie het vroeg, onder wiens rechten het draaide, welke tools met welke argumenten zijn aangeroepen, en wat er terugkwam?*

Is het antwoord ja, dan heb je een platform, en zijn de zes beslissingen hierboven bewust genomen. Is het nee, dan heb je een prototype met productietoegang, en het gat daartussen is geen sprint.
