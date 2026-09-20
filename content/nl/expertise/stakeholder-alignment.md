---
title: Werken door de organisatie heen
summary: Het deel van het vak dat bepaalt of een architectuur er komt. Teams die elders rapporteren, afdelingen die een getal moeten vertrouwen, en een leverancierscontract dat vier jaar geleden is getekend. Invloed zonder bevoegdheid, met de situaties uitgeschreven.
evidence: [cloud-gateway, integration-platform, sap-event-backbone, sap-snowflake, cloudera-kafka]
order: 7
group: practice
---

# Werken door de organisatie heen

Een architectuur waar niemand mee heeft ingestemd, is een diagram. Het moeilijke deel van mijn werk is zelden het ontwerp. Het zijn de twintig teams die elk al iets hebben dat werkt, de financieel directeur die een getal moet vertrouwen voordat hij ervoor tekent, en het leverancierscontract dat iemand vier jaar geleden heeft getekend. Het meeste hiervan heb ik gedaan zonder de bevoegdheid om iemand iets op te dragen.

## Hoe ik dat doe

- **Het platform goedkoper maken dan het alternatief.** Teams stappen over als overstappen de makkelijkste optie is: selfservice-onboarding, een beveiligingsmodel dat ze niet meer zelf hoeven te bouwen. Vraag om een mandaat en je krijgt meestal twintig uitzonderingen. Een betere weg levert gebruik op.
- **Ontwerpen voor de mensen die de uitkomst moeten vertrouwen.** Finance neemt een warehouse niet in gebruik omdat de architectuur elegant is. Ze nemen het in gebruik als de cijfers kloppen met het grootboek dat ze al geloven. Dus probeer ik vroeg te benoemen wie het resultaat moet vertrouwen, en bouw dan de controle die dat vertrouwen verdient. Dat beschouw ik als onderdeel van het ontwerp.
- **Eerst kijken, dan voorschrijven.** Bij het platform van een ander team aankomen met een roadmap waar ze niet om gevraagd hebben, werkt niet. Ik lees eerst het landschap en schrijf op wat ik vond, zodat de prioriteiten besproken kunnen worden. Een beoordeling waar een team het mee oneens kan zijn is nuttiger dan een aanbeveling die ze kunnen negeren.
- **De beslissing opschrijven waar ze aangevochten kan worden.** Architecture decision records, C4-diagrammen, en de afweging in gewone taal, inclusief wat de keuze kost. Instemming houdt stand als mensen kunnen zien wat er is opgegeven en waarom. Ze valt uit elkaar als de redenering in het hoofd van één architect blijft.
- **Het onwelkome deel vroeg zeggen.** Als een ontwerp extra werk legt bij een team dat er geen had, of als mijn eigen ervaring ergens ophoudt, gaat dat gesprek beter aan het begin dan bij de review.
- **Het saaie deel zelf doen.** De snelste manier om een discussie over eigenaarschap te beëindigen is je melden voor het deel dat niemand wil: de dead-letterafhandeling, het aansluitingsrapport, het migratiedraaiboek. Daarna is de discussie meestal weer technisch, en technische vragen kun je beantwoorden.

## Vijf situaties, en hoe ze verliepen

### Twintig teams, en geen bevoegdheid om er één te verplaatsen

Achttien tot twintig productteams hadden elk een werkende API-gateway. Ze samenbrengen was de juiste architectuur en moeilijk te verkopen, want elk team zou iets opgeven dat het zelf beheerde in ruil voor een afhankelijkheid van een centraal team, en niemand kon die ruil opleggen.

Om een mandaat vragen had twintig uitzonderingen en één trage backlog opgeleverd, dus dat heb ik niet gedaan. In plaats daarvan moest het platform voor een team goedkoper zijn dan blijven zitten: Terraform-onboarding die minuten kostte, één OAuth2/JWT-model dat ze niet meer zelf hoefden te bouwen en te hercertificeren, dashboards die ze niet zelf hoefden aan te sluiten. Security kreeg één authenticatiemodel om te beoordelen in plaats van twintig, dus een afdeling die het ontwerp had kunnen blokkeren werd een van de grootste voorstanders. Finance kreeg een uitfaseringsbedrag voor het oude contract dat het programma betaalde.

Eén ding hielp nog, en ik zou het weer zo doen. Ik koos de migratievolgorde op wie er het meest bij won. De eerste twee teams op het platform waren die met de slechtste bestaande situatie, en zij werden de referentie waar andere teams naar vroegen; hun mening reikte verder dan welke architectuurreview ik ook had kunnen organiseren.

→ [Cloud Gateway](/nl/work/cloud-gateway)

### Drie teams, drie definities van "klaar"

Een SAP-landschap, een legacy IBM ESB-landschap en een AWS-native platform, beheerd door drie teams die geen tooling en geen vocabulaire delen. Voor de SAP-kant hield het werk op bij "de events staan op de broker". Voor de cloudkant begon het werk bij "wij verwerken wat er op de broker staat". Alles wat ertoe deed (naamgeving, versionering, volgorde, en wat er gebeurt als iets faalt) zat in het gat tussen die twee zinnen, en geen van beide teams had ongelijk over zijn eigen scope.

Ik heb niet geprobeerd te bepalen wie eigenaar was. Ik schreef het envelop- en abonnementscontract als een document waar elk team commentaar op kon geven, en ik nam de AWS-consumerruntime, de uitrol en het dead-lettergedrag zelf op me. Zodra de grens als document bestond, werd de onenigheid technisch, en konden we hem oplossen.

Het ESB-team had wat aandacht nodig, omdat ze gevraagd werden mee te ontwerpen aan de vervanging van hun eigen landschap. Wat ik tegen ze zei was simpelweg waar: zij weten welke koppelingen echt belasting dragen, en zonder die kennis is een uitfaseringsvolgorde niet veilig. Het was geen diplomatieke zin, en ik denk dat ze het gemerkt hadden als het er wel een was geweest.

→ [SAP-event-backbone](/nl/work/sap-event-backbone)

### Een finance-organisatie die geen reden had mij te geloven

Een nieuw Snowflake-warehouse voor SAP Finance-grootboeken over ongeveer dertig bedrijfscodes. Finance had al een grootboek dat ze vertrouwden, en mijn architectuur bood ze een tweede bron van cijfers plus het verzoek om die te geloven. De pipeline uitleggen zou daar niets aan veranderen, en daar ben ik vrij snel mee gestopt.

Wat het veranderde was een aansluitingscontrole die Finance zelf kon draaien, waarbij de geladen data vergeleken werd met het brongrootboek. De adoptie volgde op die controle. Aan de SAP-kant deed ik de bron-naar-doel-mapping samen met hun architecten in plaats van ze een specificatie te overhandigen. De extractiestrategie moest de belasting op hun systeem beschermen, en hun randvoorwaarde bepaalde het ontwerp. Dat gaf me ook het ding dat ik het hardst van ze nodig had: een benoemde eigenaar achter het datacontract, bereid ervoor in te staan als het breekt.

→ [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake)

### De productiecode van een ander team beoordelen zonder dat team aan te sturen

Een data-scienceteam vroeg om een review van hun ML- en analyticspipelines in productie. De uitkomst van zo'n review is kritiek op werk waar mensen trots op zijn, geschreven door iemand zonder gezag over hen die het makkelijk mis kan hebben over hun domein.

Twee dingen hielden het nuttig. De bevindingen waren gerangschikt en geprijsd in plaats van volledig: een lijst van veertig punten leest als een aanklacht, een lijst van zes op volgorde van prioriteit leest als een plan. En de aanbevelingen waren geschreven tegen wat het team al probeerde te doen (weg van code die alleen in notebooks staat, dev en prod scheiden, compliance-tagging op orde krijgen), niet tegen een platformideaal waar ze nooit voor getekend hadden. Een roadmap waar iemand maandag mee kan beginnen is meer waard dan een correcte beoordeling waar niemand eigenaar van is.

### Het onwelkome deel zeggen voordat het een incident wordt

Op een Kafka-dataproductplatform betekent een stream tot product maken dat het producerende domein afnemers accepteert waar het nooit om vroeg, plus een schemabelofte en een SLA. Verschillende domeinen lazen dat als werk dat op hun bord kwam om andermans probleem op te lossen, en daar hadden ze een punt.

Er stond een echte ruil tegenover en die zette ik voorop: compatibiliteitsregels in de Schema Registry betekenden dat een producent een wijziging kon uitrollen zonder langs een change board te gaan. Voor een producerend team was die vergadering kwijtraken meer waard dan wat de schemabelofte ze kostte. Waar een domein geen benoemde eigenaar wilde toezeggen, schreef ik dat op in plaats van een stream uit te rollen met niemand erachter. Dat zijn de streams die later achterbleven. Omdat het vanaf het begin op papier stond, was een jaar later niemand verrast.

→ [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka)

## Parttime werken en toch de architectuur dragen

Een architect die er twee of drie dagen per week is, is eerder een stakeholdervraag dan een technische, omdat beslissingen door moeten gaan op de dagen dat ik er niet ben. Wat het laat werken is de werkwijze vooraf afspreken: een benoemde tegenhanger aan de klantkant, een geschreven beslislog zodat beslissingen niet alleen in vergaderingen bestaan, en een duidelijke lijn tussen wat het team zonder mij beslist en wat wacht.

Zo opgezet levert een parttime rol een architectuur op die het team zelf kan dragen, en dat is toch al de enige soort die het einde van een contract overleeft.

## Aangetoond door

- [Cloud Gateway](/nl/work/cloud-gateway): 18–20 productteams naar één federatief model en een exit uit IBM API Connect, met onboarding van dagen naar minuten. Gebruik gekocht met developer experience in plaats van gezag.
- [Integratieplatform](/nl/work/integration-platform): domeinteams gaven integratiecode op die ze zelf beheerden, en namen het platform in gebruik omdat het ze meer operationele controle gaf dan ze daarvoor hadden.
- [SAP-event-backbone](/nl/work/sap-event-backbone): drie platformteams en drie landschappen op één event-contract gebracht, met de grens op papier voordat een van beide kanten code schreef.
- [SAP S/4HANA Finance → Snowflake](/nl/work/sap-snowflake): aansluiting op het brongrootboek zodat Finance de cijfers zou vertrouwen, en bron-naar-doel-mapping afgesproken met de SAP-architecten.
- [Kafka-dataproductplatform op Cloudera](/nl/work/cloudera-kafka): 20+ streams als product over 30+ bronsystemen, wat betekende: eigenaarschap onderhandelen met de teams die de data produceerden.

Achtergrond: TOGAF 9 Certified; Accenture Certified Technology Architect; architecture decision records en C4 als dagelijkse praktijk. Ik train ook architectuur- en productteams in dezelfde vaardigheid, met de inzet verplaatst.
