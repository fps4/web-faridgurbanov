---
title: Bepalen wie wat mag zien, en van waar
summary: Exportcontrole doet iets met een lakehouse wat de AVG nooit deed. Dezelfde rij krijgt drie verschillende antwoorden, afhankelijk van wie vraagt, van waar, en waaruit hij is afgeleid. Zes beslissingen voor een dataplatform onder exportcontrole, één beleid gecompileerd naar zowel Unity Catalog als Fabric, en de twee bevindingen die het meest telden. De grens is niet de regio, en classificatie is geen eigenschap van een tabel.
date: 2026-09-13
order: 1
---

# Bepalen wie wat mag zien, en van waar

Dezelfde rij mag rechtmatig getoond worden aan de ene engineer in Veldhoven en niet aan de engineer aan het bureau ernaast. Aan die eerste engineer vanaf kantoor, en niet vanuit een hotel in een derde land. En aan niemand meer zodra hij aan de verkeerde tabel is gekoppeld. Datagovernance onder exportcontrole is de discipline om die drie antwoorden doelbewust te geven, op een platform dat ontworpen is om er één te geven.

De setting die ik voor ogen heb is een Europese fabrikant van exportgecontroleerde apparatuur met machines in de fabrieken van klanten in elke grote markt, die elk telemetrie naar huis sturen; defensie, luchtvaart en medische apparatuur hebben dezelfde vorm. Ik heb [`export-controlled-lakehouse`](https://github.com/fps4/export-controlled-lakehouse) gebouwd om het probleem in de openbaarheid uit te werken: één exportcontrolebeleid, geschreven als data, **gecompileerd naar Databricks Unity Catalog en naar Microsoft Fabric**, met de overgang tussen de twee zichtbaar gelaten. Het draait op een laptop, zonder abonnement erachter.

## Drie regimes, drie eenheden van controle

Dit is moeilijk omdat drie regimes op dezelfde tabel van toepassing zijn en elk zijn controle aan iets anders hangt. Dat de regels streng zijn, is het kleinere probleem.

| Regime | Waar het aan hangt | Eenheid van controle |
|---|---|---|
| Amerikaanse exportcontrole (EAR, ITAR) | de *technologie*, waar die ook staat | de persoon en de sleutel |
| EU dual-use (Verordening 2021/821) | het *passeren* van de Uniegrens | de grens, en *beschikbaarheid* voor iemand daarbuiten |
| De nationale datawet van de klant | de *data*, in het land waar ze zijn ontstaan | het land |

Gecontroleerde technologie vrijgeven aan een buitenlandse persoon is onder de Amerikaanse regels een export naar het land van die persoon, ook binnen Nederland. Technologie *in elektronische vorm beschikbaar stellen* aan iemand buiten het douanegebied is onder de EU-regels een export, en één nationale autoriteit leest "beschikbaar gesteld" als *had toegang kunnen krijgen*. Telemetrie uit een fabriek in China kan "belangrijke data" zijn die het land niet verlaat zonder beoordeling. De AVG ligt daar dwars overheen: een nationaliteitskolom op elke gebruiker is zelf een verwerkingsprobleem.

De vraag is dus nooit *welke regio*. De vraag is: voor deze rij, afgeleid uit deze bronnen, opgevraagd door deze identiteit vanaf deze plek, toestaan, weigeren, of alleen geaggregeerd, en waarom. Zes beslissingen beantwoorden haar, in volgorde.

## D1 — De eenheid van controle is lineage

Elke tabel classificeren, taggen, toegang op tag verlenen. Dat klopt op de dag dat het gebeurt, en vanaf dan begint het te verschuiven, omdat gecontroleerde tabellen *invoer* zijn. Ze worden gejoind, geaggregeerd, tot features verwerkt en er wordt op getraind, en de uitkomsten zijn nieuwe tabellen die niemand heeft geclassificeerd.

De eenheid van controle is daarom het asset **via zijn lineage**. Elk afgeleid asset erft de strengste controle van zijn bronnen, mét de bron waar die vandaan komt, en houdt die tot een **vastgelegde declassificatiebeslissing** haar weghaalt. Een tag is de uitkomst van die regel, nooit de invoer.

De beslissing is een record: welk asset, op welke gronden, wie haar nam, wanneer zij verloopt. Waar de grond een regel is (*minstens vijfentwintig machines per groep, geen gecontroleerde parameter, geen vrije tekst*) toetst de engine haar en weigert de invoer als zij niet standhoudt. Waar de grond een beoordeling van een toezichthouder of het oordeel van een genoemd persoon is, neemt de engine de invoer op haar record aan en kan zij er niet aan tornen.

Databricks bouwt de eerste helft hiervan; het doorgeven van governed tags via lineage ging in juni 2026 in private preview. De tweede helft levert niemand. Het register is wat een toezichthouder vraagt, en het leeft buiten beide platforms.

Op het verzonnen landschap vindt lineage **vier van de vierentwintig afgeleide assets** die exportgecontroleerd zijn door waaruit ze gemaakt zijn en open door hoe ze heten: een featureset, een serving endpoint, een data agent, en een view die iemand `public_fleet_summary` heeft genoemd. Het weigert één registerinvoer. Die samenvatting was gedeclassificeerd op de aggregatieregel, en ze aggregeert over vijf machines met de parameters er nog in.

## D2 — Autorisatiegroepen, nooit nationaliteit

De deemed-export-regel lokt een nationaliteitskolom uit. Dataminimalisatie vraagt waarom een dataplatform überhaupt nationaliteit bijhoudt, en "om een `WHERE` te draaien" is geen goed antwoord. En of iemand geautoriseerd is voor een categorie is geen kolom; het is een beslissing die de exportcontrolefunctie neemt, vastlegt en herziet.

Het platform slaat dus niets over herkomst op. De identiteit draagt **autorisatiegroepen** die de exportcontrolefunctie uitgeeft: één per regime en categorie, een tweede soort voor een vergunning om over een grens te ontvangen, een derde per klant. Het beleid toetst de gehouden groepen aan de gedragen controles; het ziet dát iemand geautoriseerd is en nooit waarom. De loader weigert een persoonsrecord met een veld dat naar nationaliteit ruikt, op de naam van het veld, omdat de faalwijze een HR-feed is met één kolom te veel.

## D3 — De grens is de sleutel

De regiokaart is het eerste wat iedereen tekent, en zij is nodig. Zij is niet genoeg, om drie redenen.

De eerste staat in de regelgeving. Onder 22 CFR §120.54 en 15 CFR §734.18 is het opslaan of verzenden van *ongerubriceerde* gecontroleerde technische data in het buitenland **geen export** wanneer ze end-to-end versleuteld zijn met FIPS-gevalideerde modules op minstens AES-128-sterkte, niet opzettelijk zijn opgeslagen in een verboden land, en "de middelen tot ontsleuteling niet aan een derde worden verstrekt". De bytes mogen in Dublin staan; het controlepunt is de sleutel en de geautoriseerde ontvanger. De uitzondering is smal (opslag en transport, niet vrijgave) en zwijgt over een platform dat een tabel ontsleutelt om een query te beantwoorden. Het ontwerp gaat uit van de strengste lezing, zodat dat zwijgen er voor het landschap niet toe doet.

De tweede staat op de pagina van de leverancier zelf. De Multi-Geo-documentatie van Fabric zet rekenkracht en opslag in de regio van de capaciteit, en zegt vervolgens dat rapportmetadata *inclusief tile-query's* en permissies in de thuisregio blijven, dat bepaalde functies "data in de thuisregio verwerken", en dat "data in transit heen en weer kan gaan tussen meerdere geografieën". Alleen-regio is geen residentiegarantie, zelfs niet voor de mensen die de regio verkopen.

De derde is de EU-toets: *beschikbaarheid* voor iemand buiten de Unie. Een landschap dat perfect per regio is ingericht en van overal bereikbaar is, zakt ervoor.

Er zijn dus drie grenzen, elk nodig. **Regio**: data in rust binnen een toegestane geografie, replicatie binnen dezelfde geografie, geen shortcuts over geografieën heen voor gecontroleerde niveaus. **Sleutelbeheer**: eigen sleutels per gecontroleerd niveau, met het toegangsbeleid van de sleutelkluis gespiegeld aan de autorisatiegroepen, zodat wie ontsleuteling kan veroorzaken en wie geautoriseerd is dezelfde lijst zijn. **Plaats van toegang**: geweigerd in de identiteitslaag, voordat de datalaag het verzoek ooit ziet.

## D4 — Fysiek waar een omweg een overtreding is, logisch daaronder

Rijfilters en beveiligingsrollen zijn goedkoop en fijnmazig, en ze hebben gedocumenteerde omwegen op beide platforms. OneLake security is een grant-model. Het kan niet weigeren, en het beperkt workspace-Admins, -Members en -Contributors helemaal niet. Eigenaren in Unity Catalog kunnen policies aanpassen. Wie een shortcut of een share mag aanmaken, kan data langs elk rijfilter verplaatsen.

Waar een omweg een ongemak is, volstaat logische controle; waar hij een overtreding van regelgeving is, niet. De grens wordt dus per niveau gekozen. Interne en vertrouwelijke data delen de logische container van een geografie. Exportgecontroleerde data krijgt een eigen catalog en eigen workspaces op Unity Catalog, een eigen capaciteit en workspace op Fabric, eigen sleutels. Data die het land van de fabriek niet mag verlaten, krijgt een apart landschap.

Op dat laatste niveau antwoorden de platforms verschillend, als feit en niet als mening. Azure Databricks is algemeen beschikbaar in Azure China, een fysiek gescheiden cloud met een eigen tenant, account en metastore: een tweede landschap, dat niets deelt met het eerste. De F-SKU's van Fabric staan alleen vermeld voor publieke cloudregio's; er is geen China-regio. De telemetrie van de Chinese fabriek heeft een Databricks-thuis als apart landschap en helemaal geen Fabric-thuis, en de engine rapporteert dat als uitkomst.

Een tweede asymmetrie landt hier. Unity Catalog evalueert een ABAC-policy per query tegen de groepen van de aanvrager, terwijl een OneLake-securityrol een statisch predicaat draagt, zodat hetzelfde beleid op het ene platform naar één policy compileert en op het andere naar één rol per regime-en-categorie.

## D5 — Aggregeer binnen; niets anders steekt over

Het wereldwijde dashboard heeft één getal per regio nodig uit data die geen van die regio's mogen verlaten. *Repliceren en op de bestemming filteren* zet de laatste verdedigingslinie aan de verkeerde kant van de grens. *Federeren over de grens* verplaatst de resultaatset en laat de plek van de rekenkracht in het ongewisse. Grensoverschrijdende afnemers krijgen dus *producten*: binnen de regio berekend en onder D1 gedeclassificeerd, via een beheerde share waarvan ontvanger en lineage zijn vastgelegd. Ruwe data en features steken nooit over.

De simulatie meet het verschil. Voor de wereldwijde beschikbaarheids-KPI zou repliceren-en-filteren **82.800** telemetrierijen naar West-Europa verplaatsen, waarvan 25.200 een overtreding zijn op het moment dat ze landen. Aggregeren-en-delen verplaatst er **vijftien**, en de KPI is exact tot op het laatste cijfer, omdat het product een teller en een noemer draagt in plaats van een percentage.

## D6 — Elke uitgang heeft een naam

Toegangsbeheer beschrijft de voordeur; exportcontrole vraagt naar elke deur. De uitgangen worden dus opgesomd (bestandsexports, notebook-uitvoer, shares en shortcuts, back-ups, leveranciersondersteuning, logs), elk onder een benoemde controle, en de onbeheersbare schriftelijk geaccepteerd. Drie ervan zijn nieuw.

Een model dat op gecontroleerde parameters is getraind belichaamt ze, dus het artefact is een asset met de trainingsdata als ouders, en het serving endpoint is het model. Op het landschap erft een model voor storingsvoorspelling **acht controles** via elf voorouders; de Amerikaanse analist die het endpoint aanroept heeft groepen voor drie, en twee van de ontbrekende kwamen binnen via de machinestamdata, drie stappen verwijderd van alles wat de auteur had genoemd.

Een assistent is een uitgang. Fabric heeft vier tenant-instellingen, standaard uit, die toestaan dat data die naar Azure OpenAI worden gestuurd buiten de regio van de capaciteit worden verwerkt of opgeslagen; ze gelden buiten de EU Data Boundary en de VS, wat op dit landschap Taiwan betekent. Dezelfde geautoriseerde datascientist die naar Taiwanese telemetrie vraagt krijgt, met de instellingen uit, geen assistent en er vertrekt niets; met de instellingen aan worden **36.000 rijen** promptcontext die buiten Taiwan wordt verwerkt. Het beleid weigert het. Het platform zou dat niet doen. En de pagina van Fabric zelf zegt dat een data agent die vanuit een andere dienst wordt gebruikt "of als MCP-server" antwoorden buiten de compliancegrens kan sturen, dus een agent over een gecontroleerd asset is een share, en shares dragen alleen producten.

De Excel-export is het helderste beeld van de overgang tussen de twee platforms. Dezelfde engineer, dezelfde 750 rijen parameterdrift: op Fabric verlaat het bestand het platform met het label *Export Controlled* en de bijbehorende bescherming; vanuit een Unity Catalog-notebook reist er niets met het bestand mee, dus het beleid weigert de export en wijst naar een share van een product. Eén beleid, twee antwoorden, beide juist.

Dit alles is alleen de moeite waard als het landschap later voor elke rij kan beantwoorden *wie hem zag, van waar, onder welke autorisatie, vanwege welke regel, onder welke beslissing*. Vijf delen op vier plekken, en `explain` in de repo voegt ze samen tot één zin. Als de vraag van een toezichthouder niet door `explain` beantwoord kan worden, is het ontwerp fout.

## Wat het artefact is, en niet is

Hier even onomwonden als in de README. Er is geen Azure-abonnement, Databricks-workspace of Fabric-capaciteit bij betrokken; DuckDB staat ervoor in, en de platformartefacten worden gegenereerd en gevalideerd, nooit toegepast. Rij-aantallen, wat oversteekt en de exactheid van een aggregaat worden gemeten; de handhaving van geen van beide platforms wordt gemeten. Het landschap is verzonnen. Niets hiervan is juridisch advies. De regelgeving is geciteerd en gedateerd, de grijze gebieden zijn als grijs benoemd, en de lezing van de exportcontrolefunctionaris wint. Elke capability-claim draagt de datum waarop hij is gecontroleerd. Het duurzame artefact is het beleid en zijn uitleg; de SQL wordt daaruit gegenereerd.

## Wie ja moest zeggen

De exportcontrolefunctionaris, die het register beheert en de groepen uitgeeft, en gevraagd werd een spreadsheet die hij beheerste in te ruilen voor een record dat anderen kunnen lezen. Juridische Zaken, die moest accepteren dat het platform nooit het veld zou bevatten waarop zij gewend waren te filteren. De klant van wie de telemetrie is, die moest zien dat er vijftien rijen per maand zijn land zouden verlaten, en precies welke. Het platformteam, dat Admin opgaf op elke gecontroleerde workspace omdat het beveiligingsmodel hen niet kan weigeren. En de datascientists, die een in goed vertrouwen gebouwde replica verloren en daarvoor een model terugkregen dat zijn eigen classificatie uitlegt.

Niemand van hen kon iets worden opgedragen. Ieder van hen kon de regel in `config/` worden getoond die het antwoord voortbracht, hem aanpassen, en zien wat er bewoog.

*De repo is openbaar en MIT-gelicenseerd: [github.com/fps4/export-controlled-lakehouse](https://github.com/fps4/export-controlled-lakehouse). Begin bij `docs/design-decisions.md`, de zes beslissingen beargumenteerd, en daarna `reports/simulation.md`, waar elk getal hierboven vandaan komt.*
