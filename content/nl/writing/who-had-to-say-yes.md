---
title: Wie ja moest zeggen
summary: Elke architectuur heeft een lijst van mensen die er stilzwijgend nee tegen kunnen zeggen. Teams, afdelingen, budgethouders. De meeste ontwerpen schrijven die lijst nooit op, en ik denk dat dat is waarom zoveel correcte architecturen er nooit komen. Een werkwijze om adoptie te ontwerpen in plaats van erop te hopen.
date: 2026-08-20
order: 1
---

# Wie ja moest zeggen

Vraag een architect waarom een ontwerp is mislukt en je krijgt meestal een technisch antwoord: de verkeerde broker, de verkeerde grens, een prestatie-aanname die niet klopte. Vraag het de teams die het hadden moeten gebruiken en je krijgt een ander antwoord, en het is vrijwel altijd een variant van *niemand heeft het ons gevraagd, en we hadden al iets dat werkte*.

Ik ontwerp ongeveer twintig jaar platformen in organisaties waar ik niemand iets kon opdragen. In die tijd was het diagram bijna nooit de beperkende factor. Dat was de lijst van mensen die ja moesten zeggen.

## Elk ontwerp heeft zo'n lijst, of je hem nu opschrijft of niet

Voor elke architectuur die meer dan één team raakt, bestaat er een groep mensen die haar kan weigeren. Bijna niemand heeft een veto op papier. Ze weigeren door de migratie lager op hun backlog te zetten, door een uitzondering aan te vragen, door te blijven draaien wat ze al hebben, of door net nooit aan het ticket toe te komen. Twintig beleefde niet-weigeringen komen op dezelfde plek uit als één afwijzing, alleen veel later en nadat er meer geld is uitgegeven.

Die groep is meestal vooraf te kennen, en het zijn doorgaans vier soorten mensen:

- **De teams die moeten veranderen.** Ze hebben al iets dat werkt. Jouw ontwerp vraagt ze iets in te ruilen dat ze zelf beheren voor een afhankelijkheid van jou.
- **De afdeling die de uitkomst moet vertrouwen.** Finance, risk, security, de zorgprofessional: wie het resultaat gebruikt en de gevolgen draagt als het fout is.
- **Het team wiens scope krimpt.** Elke consolidatie verkleint iemands terrein, en vaak zijn dat juist de mensen die het landschap dat je vervangt het best kennen.
- **De budgethouder achter de bestaande leverancier.** Iemand heeft het contract getekend waar jij uit wilt, en die had daar redenen voor.

Die lijst tijdens het ontwerp opschrijven kost een uur. Hem niet opschrijven kost veel meer, want je ontdekt hem toch wel, weigering voor weigering, meestal in de duurste volgorde.

## Adoptie is een eigenschap van het ontwerp

Wanneer een ontwerp op weerstand stuit, is de reflex escaleren: een mandaat regelen, het op de architectuurboard krijgen, een directielid laten zeggen dat mensen moeten meewerken. In mijn ervaring levert dat betrouwbaar twee dingen op, beleid dat niemand leest en een lijst uitzonderingen die sneller groeit dan de migratie.

Het alternatief is adoptie behandelen als iets wat de architectuur zelf moet voortbrengen, en er net zo serieus voor te ontwerpen als voor doorvoer.

**Maak het platform goedkoper dan blijven zitten.** Toen ik bij een Nederlandse retailer achttien à twintig API-gateways samenbracht, had niemand de bevoegdheid om een migratie op te leggen. Wat teams in beweging bracht was rekenwerk: onboarding in minuten in plaats van dagen, één OAuth2/JWT-model dat ze niet meer zelf hoefden te bouwen en te laten certificeren, en dashboards die ze niet zelf hoefden aan te sluiten. Elk team rekende het uit en stapte over. Security kreeg één authenticatiemodel om te beoordelen in plaats van twintig, waarmee een mogelijke blokkade een van de grootste voorstanders van het ontwerp werd.

**Bouw wat vertrouwen verdient.** Een finance-organisatie die naar een nieuw warehouse gaat, neemt dat niet in gebruik omdat de architectuur elegant is. Dat gebeurt wanneer de cijfers aansluiten op het grootboek dat ze al geloven. Bij een SAP-naar-Snowflake-programma ben ik vrij snel gestopt met de pipeline uitleggen en heb ik in plaats daarvan de aansluitingscontrole gebouwd die Finance zelf kon draaien. De adoptie volgde op die controle. Die controle was onderdeel van de architectuur, en het was het onderdeel dat de uitkomst bepaalde.

**Neem het saaie deel zelf.** Discussies over eigenaarschap tussen teams zijn moeilijk op inhoud te beslechten, omdat beide partijen meestal gelijk hebben over hun eigen scope. Bij het koppelen van een SAP-event-backbone aan een cloudintegratieplatform hield het werk van het SAP-team op bij "de events staan op de broker" en begon dat van het cloudteam bij "wij verwerken wat op de broker staat", en elke vraag die ertoe deed zat daartussen. Ik heb niet geprobeerd het te beslissen. Ik heb de grens op papier gezet als document waar elk team commentaar op kon geven, en de consumerruntime, de uitrol en de dead-letterafhandeling zelf op me genomen. Je melden voor het deel dat niemand wil, maakt van een onderhandeling weer een technische discussie, en technische discussies kun je afronden.

**Migreer op baat.** De neiging is het makkelijkste team eerst te migreren, voor een snel succes. Ik denk dat het meestal beter is het team met de slechtste bestaande situatie eerst te doen, omdat dat de referentie wordt waar andere teams naar vragen, en het verhaal van een collega reikt verder dan welke architectuurreview je ook kunt organiseren.

## Zeg het onwelkome deel aan het begin

Vrijwel elk teamoverstijgend ontwerp legt ergens nieuw werk neer. Een datacontract op het punt waar een bron overdraagt, geeft het bovenstroomse team een schemabelofte die het nooit had, en er komt geen prikkel bij. Een datastream tot product maken betekent dat het producerende domein afnemers accepteert waar het niet om vroeg, plus een SLA. Dat zijn echte verzoeken, en doen alsof dat niet zo is, is doorzichtig voor de mensen aan wie je het vraagt.

Het moment bepaalt hoe ze landen. Aan het begin genoemd is een onwelkome afweging een randvoorwaarde die het andere team mee vormgeeft, en meestal maken ze hem beter. Bij de ontwerpreview genoemd is dezelfde afweging iets wat je ze hebt aangedaan, en nu moeten ze ook nog aan hun eigen manager uitleggen waarom ze ermee akkoord gingen. De inhoud is gelijk. De reactie niet.

Daarom probeer ik de kosten in het eerste gesprek op tafel te leggen, ook het deel dat mijn eigen ontwerp duurder laat lijken. Het is ongemakkelijk, en het is goedkoper dan het alternatief.

## Hoe dit er in een document uitziet

Ik schrijf inmiddels een kort blok in elk teamoverstijgend ontwerp, en in elke casus die ik publiceer, onder het kopje **Wie ja moest zeggen**. Vier alinea's, niet meer.

- **Stakeholders**: wie dit kon weigeren, concreet benoemd.
- **De onenigheid**: de echte, zo geformuleerd dat de andere kant hem eerlijk zou vinden. Kun je hun standpunt niet opschrijven in woorden die zij zouden accepteren, dan begrijp je het waarschijnlijk nog niet.
- **Wat het oploste**: het mechanisme. "We hebben afgestemd" is geen mechanisme. "Finance kon de aansluiting zelf draaien" wel.
- **Wat het kostte**: de wrijving die het ontwerp veroorzaakte, en wie die draagt. Een ontwerp dat gratis lijkt, is niet goed geanalyseerd.

Het kost ongeveer twintig minuten, en het verandert het gesprek, omdat het het lastigste deel van het werk uit het hoofd van één architect haalt en in een document zet waar anderen het mee oneens kunnen zijn.

→ De casussen op deze site dragen dat blok elk: [Cloud Gateway](/nl/work/cloud-gateway), [de SAP-event-backbone](/nl/work/sap-event-backbone), [SAP Finance → Snowflake](/nl/work/sap-snowflake) en [het Cloudera-dataproductplatform](/nl/work/cloudera-kafka). De werkwijze erachter staat uitgeschreven onder [werken door de organisatie heen](/nl/expertise/stakeholder-alignment).
