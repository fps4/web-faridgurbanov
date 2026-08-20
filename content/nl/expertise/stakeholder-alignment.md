---
title: Werken door de organisatie heen
summary: Het deel van het vak dat bepaalt of een architectuur er komt — teams die elders rapporteren, afdelingen die een getal moeten vertrouwen, en een leverancierscontract dat vier jaar geleden getekend is. Invloed zonder bevoegdheid, met de situaties uitgeschreven.
order: 7
group: practice
---

# Werken door de organisatie heen

Een architectuur waar niemand mee akkoord is, is een plaatje. Het lastige deel van het vak is zelden het ontwerp — het zijn de twintig teams die elk al iets hebben dat werkt, de finance-directeur die een getal moet vertrouwen voordat hij tekent, en het leverancierscontract dat iemand vier jaar geleden heeft afgesloten. Ik doe dit al bijna twintig jaar zonder ooit de bevoegdheid te hebben gehad om iemand iets op te dragen.

## Hoe ik dat doe

- **Maak de gebaande weg goedkoper dan het alternatief.** Teams bewegen wanneer bewegen de makkelijkere optie is — selfservice-onboarding, een beveiligingsmodel dat ze niet meer zelf hoeven te bouwen. Als je om een verplichting vraagt, krijg je meestal twintig uitzonderingen. Een betere weg levert wel adoptie op.
- **Ontwerp voor vertrouwen, niet alleen voor doorvoer.** Finance neemt geen warehouse in gebruik omdat de architectuur elegant is. Dat gebeurt wanneer de cijfers aansluiten op het grootboek dat ze al geloven. Daarom probeer ik vroeg te benoemen wie de uitkomst moet vertrouwen, en dan te bouwen wat dat vertrouwen verdient. Voor mij hoort dat bij het ontwerp, niet bij een fase erna.
- **Eerst beoordelen, dan voorschrijven.** Aankomen bij het platform van een ander team met een roadmap waar niet om gevraagd is, werkt niet. Ik lees het landschap eerst en schrijf op wat ik aantref, zodat de prioriteiten besproken kunnen worden. Een beoordeling waar een team het mee oneens kan zijn, is nuttiger dan een advies dat het kan negeren.
- **Leg de beslissing vast waar ze aangevochten kan worden.** Architecture decision records, C4-diagrammen, en de afweging in gewone taal, inclusief wat de keuze kost. Afspraken houden stand wanneer mensen kunnen zien wat is opgegeven en waarom. Ze vallen om wanneer de redenering in het hoofd van één architect blijft.
- **Zeg het onwelkome deel vroeg.** Als een ontwerp extra werk neerlegt bij een team dat dat niet had, of als mijn eigen ervaring ergens ophoudt, gaat dat gesprek beter aan het begin dan bij de review.
- **Neem de saaie helft zelf.** De snelste manier om een discussie over eigenaarschap te beëindigen is je melden voor het deel dat niemand wil — het dead-letter-gedrag, het aansluitingsrapport, het migratiedraaiboek. Daarna is het gesprek meestal weer technisch, en technische vragen kun je beantwoorden.

## Vijf situaties, en hoe ze verliepen

### Twintig teams, en geen bevoegdheid om er één te verplaatsen

Achttien à twintig productteams hadden elk een werkende API-gateway. Consolideren was de juiste architectuur en een onmogelijke verkoop: elk team zou iets inruilen dat het zelf beheerde voor een afhankelijkheid van een centraal team, en niemand kon die ruil opleggen.

Een verplichting had twintig uitzonderingen en één zeer trage backlog opgeleverd, dus ik heb er niet om gevraagd. In plaats daarvan moest het platform winnen op de kosten voor het team: Terraform-onboarding in minuten in plaats van dagen, één OAuth2/JWT-model dat ze niet meer zelf hoefden te bouwen en te laten certificeren, dashboards die ze niet zelf hoefden aan te sluiten. Security kreeg één authenticatiemodel om te beoordelen in plaats van twintig, waarmee een afdeling die dit had kunnen blokkeren de sterkste voorvechter van het ontwerp werd. Finance kreeg een uitfaseringsbedrag voor het bestaande contract dat het programma betaalde.

Nog iets hielp, en dat zou ik weer zo doen: ik koos de migratievolgorde op wie er het meeste baat bij had, niet op wie het makkelijkst te overtuigen was. De eerste twee teams op het platform waren die met de slechtste bestaande situatie. Zij werden de referentie waar andere teams naar vroegen, en hun mening woog zwaarder dan welke architectuurreview ik ook had kunnen organiseren.

→ [Cloud Gateway](/nl/work/cloud-gateway)

### Drie teams, drie definities van "klaar"

Een SAP-landschap, een legacy IBM-ESB-landschap en een AWS-native platform, bemenst door drie teams die geen tooling en geen vocabulaire delen. De taak van SAP hield op bij "de events staan op de broker". De taak van het cloudteam begon bij "wij consumeren wat op de broker staat". Alles wat er werkelijk toe doet — naamgeving, versionering, volgorde, wat er gebeurt bij een fout — zat in het gat tussen die twee zinnen, en geen van beide teams had ongelijk over zijn eigen scope.

Ik heb niet geprobeerd het eigenaarschap te arbitreren. Ik heb het envelop- en subscriptiecontract geschreven als document dat elk team kon becommentariëren, en de AWS-kant — consumer-runtime, provisioning en dead-letter-gedrag — op mijn eigen bord genomen. Zodra de naad een beoordeelbaar artefact was in plaats van een standpunt in een vergadering, werd de onenigheid technisch.

Het ESB-team had wat zorg nodig, want hun werd gevraagd mee te ontwerpen aan de vervanging van hun eigen landschap. Wat ik tegen ze zei was gewoon waar: zij weten welke koppelingen echt belasting dragen, en zonder die kennis is een uitfaseringsvolgorde niet veilig. Het was geen diplomatieke zin, en ik denk dat ze het gemerkt zouden hebben als dat wel zo was.

→ [SAP-event-backbone](/nl/work/sap-event-backbone)

### Een finance-organisatie die geen reden had mij te geloven

Een nieuw Snowflake-warehouse voor SAP Finance-grootboeken over ~30+ company codes. Finance had al een grootboek dat het vertrouwde, en mijn architectuur gaf ze een tweede bron van cijfers plus het verzoek die te geloven. Geen enkele uitleg over de pipeline zou dat veranderd hebben, en ik ben daar vrij snel mee gestopt.

Wat het wél veranderde, was een aansluiting die Finance zelf kon draaien: de geladen data afstemmen tegen het bronregister. Adoptie volgde op de controle, niet op de presentatie. Aan de SAP-kant was de route om de source-to-target-mapping *samen met* hun architecten te doen in plaats van ze een specificatie te overhandigen: de extractiestrategie moest de belasting van hun systeem ontzien, en hun randvoorwaarde heeft het ontwerp gevormd. Dat leverde ook op wat ik werkelijk van ze nodig had — een eigenaar achter het datacontract, bereid om zich te verantwoorden als het breekt.

→ [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake)

### De productiecode van een ander team beoordelen zonder dat team te bezitten

Een data-scienceteam vroeg om een review van hun productie-ML- en analytics-pipelines. Wat daar uitkomt is kritiek op werk waar mensen trots op zijn, geleverd door iemand zonder enige zeggenschap over hen en met alle ruimte om ernaast te zitten.

Twee dingen hielden het bruikbaar. Ten eerste was de bevindingenlijst geprioriteerd en van een kostenplaatje voorzien in plaats van uitputtend — een ongeordende lijst van veertig punten leest als een aanklacht, een geordende lijst van zes leest als een plan. Ten tweede waren de aanbevelingen geformuleerd tegen wat het team zelf al probeerde te bereiken (weg van notebook-only code, dev/prod-scheiding, compliance-tagging), niet tegen een platformideaal waar ze nooit voor getekend hadden. Een roadmap waar iemand maandag aan kan beginnen is meer waard dan een correcte beoordeling waar niemand eigenaar van is.

### Het onwelkome deel zeggen voordat het een incident wordt

Op een Kafka-data-productplatform betekent een stream productiseren dat het producerende domein afnemers accepteert waar het nooit om gevraagd heeft, plus een schemabelofte en een SLA. Meerdere domeinen lazen dat als werk dat op hun bord kwam om andermans probleem op te lossen — en daar hadden ze gelijk in.

De compenserende ruil was echt en die heb ik vooropgesteld: compatibiliteitsregels in de Schema Registry betekenden dat een producent een wijziging kon uitrollen zonder change board. Voor een producerend team was het verliezen van dat overleg meer waard dan de schemabelofte kostte. Waar een domein geen eigenaar wilde vrijmaken, heb ik dat opgeschreven in plaats van een stream op te leveren waar niemand achter stond. Dat zijn de streams die achterbleven. Het vooraf vastleggen is wat voorkwam dat het een jaar later een verrassing werd, en het is waarom de tekortkomingen van het platform toewijsbaar waren in plaats van mysterieus.

→ [Kafka-data-productplatform op Cloudera](/nl/work/cloudera-kafka)

## Parttime werken en toch de architectuur dragen

Een architect van twee of drie dagen per week is eerst een stakeholdervraagstuk en dan pas een technisch vraagstuk: beslissingen moeten doorgaan op de dagen dat ik er niet ben. Wat het laat werken is het vooraf afspreken van het werkmodel — een vaste tegenhanger aan klantzijde, een schriftelijk beslissingslogboek in plaats van beslissingen die in vergaderingen leven, en een expliciete grens tussen wat het team zonder mij beslist en wat wacht.

Zo ingericht is een parttime plek geen verdunde architect. Het is een architectuur die het team zelf kan dragen — en dat is toch de enige soort die het einde van een contract overleeft.

## Onderbouwd door

- [Cloud Gateway](/nl/work/cloud-gateway) — 18–20 productteams op één federatief model en een exit uit IBM API Connect, met onboarding van dagen naar minuten. Adoptie gekocht met developer experience in plaats van met bevoegdheid.
- [SAP-event-backbone](/nl/work/sap-event-backbone) — drie platformteams en drie landschappen op één event-contract, met de naad vastgelegd voordat een van beide kanten code schreef.
- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake) — aansluiting op het bronregister zodat Finance de cijfers zou vertrouwen, en source-to-target-mapping afgestemd met de SAP-architecten.
- [Kafka-data-productplatform op Cloudera](/nl/work/cloudera-kafka) — 20+ geproductiseerde streams over 30+ bronsystemen, wat betekende dat domeineigenaarschap onderhandeld moest worden met de teams die de data produceerden.

Achtergrond: TOGAF 9 Certified; Accenture Certified Technology Architect; architecture decision records en C4 als dagelijkse praktijk. Ik train ook architectuur- en productteams — dezelfde vaardigheid, met de inzet verplaatst.
