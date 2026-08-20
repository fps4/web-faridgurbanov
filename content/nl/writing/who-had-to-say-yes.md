---
title: Wie ja moest zeggen
summary: Elke architectuur heeft een lijst van mensen die er stilzwijgend nee tegen kunnen zeggen — teams, afdelingen, budgethouders. De meeste ontwerpen schrijven die lijst nooit op, en dat is waarom zoveel correcte architecturen er nooit komen. Een werkwijze om adoptie te ontwerpen zoals je doorvoer ontwerpt.
date: 2026-08-20
order: 1
---

# Wie ja moest zeggen

Vraag een architect waarom een ontwerp is mislukt en je krijgt meestal een technisch antwoord: de verkeerde broker, de verkeerde grens, een prestatie-aanname die niet klopte. Vraag het de teams die het hadden moeten gebruiken en je krijgt een ander antwoord, en het is vrijwel altijd een variant van *niemand heeft het ons gevraagd, en we hadden al iets dat werkte*.

Ik ontwerp ongeveer twintig jaar platformen in organisaties waar ik niemand iets kon opdragen. In die tijd was het diagram bijna nooit de beperkende factor. Dat was de lijst van mensen die ja moesten zeggen.

## Elk ontwerp heeft zo'n lijst, of je hem nu opschrijft of niet

Voor elke architectuur die meer dan één team raakt, bestaat er een groep mensen die haar kan weigeren. Niet formeel — bijna niemand heeft een veto op papier. Ze weigeren door de migratie te depriotiseren, door een uitzondering aan te vragen, door te blijven draaien wat ze al hebben, door net nooit aan het ticket toe te komen. Twintig beleefde niet-weigeringen leveren precies dezelfde uitkomst op als één afwijzing, alleen veel later.

Die groep is vooraf te kennen. Het zijn meestal vier soorten mensen:

- **De teams die moeten veranderen.** Ze hebben al iets dat werkt. Jouw ontwerp vraagt ze iets in te ruilen dat ze zelf beheren voor een afhankelijkheid van jou.
- **De afdeling die de uitkomst moet vertrouwen.** Finance, risk, security, de zorgprofessional — wie het resultaat gebruikt en de gevolgen draagt als het fout is.
- **Het team wiens scope krimpt.** Elke consolidatie verkleint iemands terrein. Vaak juist de mensen met de diepste kennis van het landschap dat je vervangt.
- **De budgethouder achter de bestaande leverancier.** Iemand heeft het contract getekend waar jij uit wilt, en die had daar redenen voor.

Die lijst tijdens het ontwerp opschrijven kost een uur. Hem niet opschrijven kost een jaar, want je ontdekt hem toch wel — weigering voor weigering, in de duurste volgorde.

## Adoptie is een ontwerpeigenschap, geen change-managementfase

De reflex wanneer een ontwerp op weerstand stuit, is escaleren: een mandaat regelen, het op de architectuurboard krijgen, een directielid laten zeggen dat mensen moeten meewerken. Dat levert betrouwbaar twee dingen op — beleid dat niemand leest en een lijst uitzonderingen die sneller groeit dan de migratie.

Het alternatief is adoptie behandelen als iets wat de architectuur zelf moet voortbrengen, en er net zo serieus voor te ontwerpen als voor doorvoer.

**Maak de gebaande weg goedkoper dan blijven zitten.** Toen ik bij een Nederlandse retailer achttien à twintig API-gateways samenbracht, had niemand de bevoegdheid om een migratie op te leggen. Wat teams in beweging bracht was rekenwerk: onboarding in minuten in plaats van dagen, één OAuth2/JWT-model dat ze niet meer zelf hoefden te bouwen en te laten certificeren, dashboards die ze niet zelf hoefden aan te sluiten. Elk team rekende het zelf uit en bewoog. Security kreeg één authenticatiemodel om te beoordelen in plaats van twintig, waarmee een mogelijke blokkade de sterkste voorvechter van het ontwerp werd.

**Ontwerp wat vertrouwen verdient, niet wat erom vraagt.** Een finance-organisatie die naar een nieuw warehouse gaat, adopteert dat niet omdat de architectuur elegant is. Dat gebeurt wanneer de cijfers aansluiten op het grootboek dat ze al geloven. Bij een SAP-naar-Snowflake-programma ben ik vrij snel gestopt met de pipeline uitleggen en heb ik de aansluiting gebouwd die Finance zelf kon draaien. Adoptie volgde op de controle, niet op de presentatie. Die aansluiting was geen change-managementactiviteit die er aan het eind bij kwam; het was een onderdeel van de architectuur, en wel het onderdeel dat ertoe deed.

**Neem de saaie helft zelf.** Discussies over eigenaarschap tussen teams zijn zelden op inhoud op te lossen, omdat beide partijen meestal gelijk hebben over hun eigen scope. Bij het koppelen van een SAP-event-backbone aan een cloudintegratieplatform hield de taak van het SAP-team op bij "de events staan op de broker" en begon die van het cloudteam bij "wij consumeren wat op de broker staat" — en elke vraag die er werkelijk toe doet zat in het gat ertussen. Ik heb niet gearbitreerd. Ik heb de naad vastgelegd als document dat elk team kon becommentariëren, en de consumer-runtime, de provisioning en het dead-letter-gedrag op mijn eigen bord genomen. Je melden voor het deel dat niemand wil, maakt van een onderhandeling een technisch probleem, en dat is het oplosbare soort.

**Volg de volgorde van baat, niet van gemak.** De neiging is het makkelijkste team eerst te migreren, om een succes binnen te halen. Beter is het team met de slechtste bestaande situatie, want dat wordt de referentie waar andere teams naar vragen — en het verhaal van een collega weegt zwaarder dan welke architectuurreview je ook kunt houden.

## Zeg het onwelkome deel aan het begin

Vrijwel elk teamoverstijgend ontwerp legt ergens nieuw werk neer. Een datacontract op een bronnaad geeft het bovenstroomse team een schemabelofte die het nooit had, en er komt geen prikkel bij. Een datastream productiseren betekent dat het producerende domein afnemers accepteert waar het niet om vroeg, plus een SLA. Dat zijn echte verzoeken, en doen alsof dat niet zo is, is doorzichtig voor degene aan wie je het vraagt.

Het moment bepaalt hoe het landt. Aan het begin genoemd is een onwelkome afweging een randvoorwaarde die het andere team mee vormgeeft, en meestal maken ze hem beter. Bij de ontwerpreview genoemd is dezelfde afweging iets wat je ze hebt aangedaan, en moeten ze bovendien aan hun eigen manager uitleggen waarom ze ermee akkoord gingen. De inhoud is gelijk. De reactie niet.

Daarom probeer ik de kosten in het eerste gesprek op tafel te leggen, ook het deel dat mijn eigen ontwerp duurder laat lijken. Dat is ongemakkelijk, en het is goedkoper dan het alternatief.

## Hoe dit er in een document uitziet

Ik schrijf inmiddels een kort blok in elk teamoverstijgend ontwerp, en in elke casus die ik publiceer, onder een kopje dat ik van niemand in het bijzonder heb gestolen: **Wie ja moest zeggen.** Vier alinea's, niet meer.

- **Stakeholders** — wie dit kon weigeren, concreet benoemd.
- **De onenigheid** — de echte, geformuleerd zoals de andere kant hem eerlijk zou vinden. Kun je hun standpunt niet zo opschrijven dat zij de formulering onderschrijven, dan begrijp je het nog niet.
- **Wat het oploste** — het mechanisme, niet het sentiment. "We hebben afgestemd" is geen mechanisme. "Finance kon de aansluiting zelf draaien" wel.
- **Wat het kostte** — de wrijving die het ontwerp veroorzaakte en wie die draagt. Een ontwerp dat gratis lijkt, is niet geanalyseerd.

Het kost twintig minuten en het verandert het gesprek, omdat het het lastigste deel van het werk uit het hoofd van één architect haalt en in een document zet waar anderen het mee oneens kunnen zijn. En dat is eigenlijk het hele vak. Een architectuur waar niemand mee akkoord is, is een plaatje.

→ De casussen op deze site dragen dat blok elk — [Cloud Gateway](/nl/work/cloud-gateway), [de SAP-event-backbone](/nl/work/sap-event-backbone), [SAP Finance → Snowflake](/nl/work/sap-snowflake) en [het Cloudera-data-productplatform](/nl/work/cloudera-kafka). De werkwijze erachter staat uitgeschreven onder [werken door de organisatie heen](/nl/expertise/stakeholder-alignment).
