---
title: Bepalen waar een Synapse-landschap heen gaat
summary: Synapse heeft een einddatum, dus de vraag is niet meer óf je verhuist maar waar elke workload landt — Fabric, Databricks of Snowflake. Tien geordende regels, een kostenmodel dat een vooruitbetaalde capaciteit behandelt als de trapfunctie die het is, en de uitkomst die mij het meest verraste: het platform met de beste prijs werd uitgesloten van bijna elke workload waarop het die beste prijs had.
date: 2026-08-29
order: 1
---

# Bepalen waar een Synapse-landschap heen gaat

Microsoft heeft zijn roadmap verlegd naar Fabric, en elk Azure-landschap dat via Synapse Analytics is gegroeid heeft daarmee een einddatum gekregen. Dat verandert het gesprek. Het gaat niet meer over óf er gemigreerd wordt — het gaat over waar elke workload landt, en wat dat antwoord de komende jaren kost.

Drie plausibele bestemmingen, en de meeste landschappen eindigen met meer dan één: Microsoft Fabric, Databricks op Azure, Snowflake op Azure. Ik heb [`azure-lakehouse-decision`](https://github.com/fps4/azure-lakehouse-decision) gebouwd om die vraag workload voor workload te beantwoorden, in de openbaarheid — de platformkeuze expliciet gemaakt, geprijsd tegen het capaciteitsmodel van Fabric, en uitvoerbaar op een laptop.

## Waarom het gebruikelijke artefact niets beslist

Het gebruikelijke artefact is een capability matrix. Veertig regels, drie kolommen, vinkjes en kruisjes. Hij klopt grotendeels en hij beslist niets, om twee redenen.

De eerste is dat vier of vijf regels überhaupt iets elimineren. De rest is grondigheid als toneelstuk, en een derde kolom verdrievoudigt de ruis zonder een beslissing toe te voegen.

De tweede is erger, en gaat over de prijzen eronder. Voor Databricks en Snowflake is een prijstabel per workload eerlijk — beide zijn gemeterd, dus de kosten van een workload zijn een eigenschap van die workload en blijven op zichzelf waar. Fabric is niet gemeterd. Het is een **vooruitbetaalde capaciteit**: één F-SKU draagt het hele landschap, en een extra workload kost *niets* tot de capaciteit vol raakt, waarna hij de prijs van de volgende trede kost. Een trapfunctie, geen lijn.

Zet alle drie in één prijstabel en die tabel vergelijkt stilzwijgend twee verschillende soorten getal. Daar volgen drie dingen uit, en dat is waarom de repo bestaat:

- **Op welk platform een workload hoort, hangt af van wat er verder op dat platform staat.** Dezelfde notebook is gratis op Fabric mét ruimte en kost een hele trede zónder.
- **Ongebruikte ruimte is de goedkoopste rekenkracht in het landschap.** Een F32 op 50% is een F32 die volledig betaald wordt, en de enige manier om hem te benutten is er iets op te zetten.
- **De marginale workload die een trede forceert, betaalt voor die hele trede** — en daarom is *"zet het er gewoon bij op Fabric"* soms de duurste zin in een ontwerpreview.

## Constraints elimineren, kosten kiezen

Tien regels plaatsen elke workload, en de volgorde draagt het argument. R1 tot en met R5 geven redenen terug en zien nooit een getal. R7 is de eerste regel die naar een prijs mag kijken.

1. **Dataresidentie en clearance.** Waar data in rust mag staan, en welk platform het landschap daadwerkelijk heeft goedgekeurd voor een restricted-classificatie. Een toezichthouder accepteert geen goedkoper alternatief.
2. **T-SQL-oppervlak.** Stored procedures en multi-table-transacties uit een dedicated SQL pool tillen niet over naar een platform dat ze niet heeft. Dat is een herbouw, geen dialectverschil.
3. **Streamingsemantiek.** Een venster dat op event-time herzien moet worden als een late gebeurtenis binnenkomt, of een sink die exactly-once moet zijn. Een ingestion-time-engine is geen goedkopere event-time-engine.
4. **Sub-seconde telemetrie.** De spiegelconstraint, de andere kant op: telemetrie met hoge cardinaliteit die interactief beantwoord moet worden. "Kan wel, met genoeg warme compute" is een manier om te zeggen: verkeerde engine.
5. **ML-levenscyclus.** Tracking, een registry en een served endpoint. Een oordeel, en in de configuratie ook als zodanig gemarkeerd.
6. **Direct Lake-premie.** Een semantisch model dat Delta ter plaatse leest is een begrensde premie waard — geen import refresh die kan falen, geen DirectQuery-retour.
7. **Economie, capaciteitsbewust.** De goedkoopste overgebleven optie, geplaatst tegen een capaciteit die onder elke beslissing beweegt.
8. **Trederandtoets.** R7 vult gulzig en stopt. Is de trede waarop het uitkwam de trede die je wilt bezitten?
9. **Platformportfoliotoets.** Heeft elk platform dat we hebben geopend zijn eigen overhead terugverdiend?
10. **Lokaliteit.** Adviserend: maak een shortcut naar de opslag, kopieer hem niet.

Economie op plek zeven houden is hier de architecturale toezegging, en de code dwingt het af — een test controleert over het hele landschap dat geen enkele workload ooit is geplaatst op een platform dat zijn constraints hadden uitgesloten. Een goedkope optie kan zich niet langs een residentie-regel praten.

## Wat een tweede meter verandert

R9 is de regel die ik niet nodig had toen de vergelijking Fabric tegen Databricks was, en het is het interessantste dat een derde platform toevoegde.

Met één meter was de vaste kost van dat platform nooit een variabele — het landschap zou hem sowieso draaien. Met twee kan het landschap er één draaien, allebei, of geen van beide, en worden het contract, de landing zone, de identity-integratie, het netwerkpad en de mensen die het platform kennen ineens een keuze.

Die kost heeft dezelfde lastige eigenschap als een capaciteitstrede: **hij is niet deelbaar per workload.** Een meter die vijf workloads wint met elk €200/maand voordeel heeft €1.000/maand aan verbruik gewonnen en, als het opzetten van dat platform €1.200/maand kost, het landschap geld gekost. R7 plaatst één workload tegelijk en kan dit structureel niet zien — dezelfde blinde vlek als een prijstabel per workload, één niveau hoger.

Dus R7 blijft er bewust blind voor, en R9 stelt de vraag zodra de hele toewijzing bestaat: is voor elk platform dat puur op economische gronden is geopend het gemeterde bedrag plus de overhead hoger dan alles herplaatsen naar een platform dat toch al openstaat? Een platform waar R1–R5 een workload aan hebben vastgepind is uitgezonderd — als een workload nergens anders overleeft, is die overhead geen keuze. Constraints gaan boven economie, ook wanneer de economie over een platform gaat in plaats van over een workload.

## De interessantste regel is de lege

Op het uitgewerkte landschap — 20 workloads, verzonnen maar gevormd naar een middelgroot Azure-landschap dat tussen 2020 en 2024 via Synapse is gegroeid — komt het antwoord uit op 15 workloads op Fabric, 4 op Databricks, en één die nergens heen gaat. **Snowflake wint niets.**

Dat is geen schouderophalen, en het plan laat het niet als een lege kolom staan. Snowflake is de **goedkoopste meter op vijf van de twintig workloads** — allemaal in de dedicated SQL pool, waar de facturering per seconde en het automatisch pauzeren het alternatief echt verslaan. En R2 sluit het uit van vier van die vijf, omdat ze in T-SQL geschreven zijn. De vijfde wordt opgenomen door capaciteit waar het landschap toch al voor betaalt, en geen enkele meter kan onder €0 bieden.

**Het platform heeft precies daar de beste prijs waar het niet mee mag doen.**

Een capability matrix kan die conclusie niet bereiken, want hij heeft geen prijzen. Een prijstabel kan het evenmin, want hij heeft geen constraints. Je hebt beide in één zin nodig, en dat is het hele argument om een procedure te draaien in plaats van een vergelijking te lezen.

Het is bovendien een oordeel over *dit* landschap, niet over het product — het dure werk hier heeft de vorm van Spark, en het SQL-werk zit vast aan T-SQL. Verander een van beide feiten en het antwoord verschuift; daar is de engine voor.

## Wat er gebeurt als je het wél verandert

Zet één beleidsvlag om — *"we accepteren een herbouw van het finance-warehouse; prijs het, elimineer het niet"* — en draai opnieuw. Snowflake pakt nu het grootboekfeit op de meter: €647/maand tegen €796 voor Databricks.

En dan neemt R9 het meteen weer af. €647 aan verbruik plus €1.200/maand om een derde platform te beheren, tegen €796/maand om dezelfde workload te draaien op iets dat al openstaat. **Netto €1.051/maand om géén derde leverancier te hebben** — voor een workload die er daadwerkelijk goedkoper was.

Dat is de tweede helft van het argument, en de helft die een vergelijking per workload structureel niet kan maken. Workloads winnen en een landschap winnen zijn twee verschillende dingen.

## De workload zonder bestemming

Eén stream heeft helemaal geen bestemming. Hij heeft event-time-herziening nodig, wat Fabric en Snowflake uitsluit, en draagt een restricted-classificatie die alleen voor Fabric is goedgekeurd, wat Databricks uitsluit. Een derde kandidaat heeft hem niet gered — de derde faalt op dezelfde manier als de eerste.

Het is de nuttigste regel in het register, omdat hij benoemt welk enkele feit moet veranderen: keur een tweede platform goed voor die data, of accepteer een ingestion-time-benadering op een betalingsgrootboek. En nu Synapse eindigt, is "laat het staan waar het staat" geen stabiel antwoord meer. Het heeft nu een houdbaarheidsdatum, en dat is precies het soort dingen dat je wilt ontdekken zolang er nog tijd is om er iets aan te doen.

## Twee eliminaties uitgevoerd in plaats van beweerd

De regels die in een ontwerpreview het snelst worden weggeknikt gaan over semantiek, dus twee daarvan draaien echt in plaats van dat ze beweerd worden.

Dezelfde betaalstroom gaat door beide streamingvormen. De ingestion-time-engine komt **3,49% per venster verkeerd uit** en telt het totaal te hoog op met elke herlevering; de event-time-vorm herziet 245 vensters en komt exact op de waarheid uit. Los daarvan wordt een load afgebroken tussen zijn twee schrijfacties: mét een multi-table-transactie rolt hij schoon terug, en zónder laat hij **893 klanten** achter wiens aggregaat niet overeenkomt met de feitentabel eronder — zonder dat een van beide tabellen dat ergens meldt.

Dat zijn gedragingen van twee ontwerpen, geen benchmarks van drie producten, en het rapport is expliciet over dat verschil.

## Wat het artefact is, en niet is

Hier net zo helder gezegd als in de README. Er komt geen Azure-abonnement, geen Fabric-capaciteit, geen Databricks-workspace en geen Snowflake-account aan te pas — DuckDB neemt hun plaats in, en Fabric kan lokaal helemaal niet draaien, dus het is gemodelleerd in plaats van uitgevoerd. De eurobedragen zijn illustratieve placeholders in de vorm van lijstprijzen, in één YAML-bestand zodat een echte rate card er zo in kan. De conversiefactoren — hoeveel capaciteit een compute-uur verbrandt, hoe een CU zich verhoudt tot een DBU of een credit — zijn de zwakste getallen in de repo en verschuiven het antwoord het meest. Het landschap is synthetisch. Alle drie de platformen leveren continu nieuwe functionaliteit, dus elke capability-claim is gedateerd en moet opnieuw gecontroleerd worden voordat er een budget van afhangt.

Het duurzame artefact is de beslisprocedure, niet de euro's en zeker niet de capability matrix. Laad een echte rate card, draai opnieuw, en lees wat er beweegt: alles wat onder echte prijzen verschuift was een economische keuze en geen architecturale — en dat is nuttig om vroeg over je eigen landschap te weten.

## Waarom ik zo bouw

Eerst de intentie opschrijven, afwegingen vastleggen als decision records, en de claim aantonen in plaats van beweren. Het oneens zijn krijgt hier de vorm van een pull request tegen `config/policy.yaml` of `config/cost_model.yaml`, waarna het plan opnieuw rendert met de consequentie eraan vast.

Het is dezelfde werkwijze als bij [de SAP↔Snowflake-naad](/nl/writing/sap-snowflake-seam-decision), maar een laag hoger toegepast: daar was de vraag welke objecten een grens oversteken, hier welk platform een workload draagt. Beide leggen het ontwerpvlak daar waar de beslissing werkelijk zit, en maken die expliciet genoeg om over te discussiëren.

Een referentiearchitectuur wordt bruikbaar op het moment dat een team het er precies mee oneens kan zijn.

*De repo is openbaar en MIT-gelicenseerd: [github.com/fps4/azure-lakehouse-decision](https://github.com/fps4/azure-lakehouse-decision). Begin bij `docs/platform-decision.md` — dat is de pagina om op een scherm te zetten, en al het andere bestaat om die te onderbouwen.*
