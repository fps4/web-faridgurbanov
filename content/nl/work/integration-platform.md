---
title: Integratieplatform — één runtime, twaalf koppelingen
summary: Een configuratie-gedreven integratieplatform op AWS waar een nieuwe koppeling van bron naar bestemming een mappingbestand en een Terraform-blok is in plaats van een codebase — met selfservice-beheer, en een gemeten antwoord op de vraag of er een zwaardere runtime nodig was.
hook: Een nieuwe koppeling werd een configuratiewijziging in plaats van een codebase — en het platformteam was niet langer de wachtrij.
metric: 12 koppelingen, 1 runtime
short: Integratieplatform
client: Een grote Nederlandse supermarktketen
disagreement: Een gedeelde runtime vraagt domeinteams code op te geven die ze zelf beheren, en concentreert de impactradius bij een platformteam dat die eerder niet droeg.
role: Platform ontworpen en gebouwd — het runtimemodel, de mapping- en contractlaag, de beheer-API en het runtime-geschiktheidsonderzoek.
stack: [AWS Lambda, SNS/SQS, S3, DynamoDB, Terraform, JSONata, Datadog]
order: 3
---

# Integratieplatform — één runtime, twaalf koppelingen

*Een grote Nederlandse supermarktketen. Klant geabstraheerd; scope en metingen zoals geleverd.*

## Context

Het landschap had koppelingen verzameld zoals de meeste landschappen dat doen: één voor één, elk een klein maatwerkproject. Elke koppeling bouwde opnieuw authenticatie, retry en dead-letter-afhandeling, en elke had een eigen idee van hoe een fout eruitzag. Bij drie koppelingen is dat betaalbaar, bij dertig duur — niet omdat de code moeilijk is, maar omdat er niets gedeeld wordt, dus elke storing wordt vanaf nul onderzocht door wie hem gebouwd heeft.

De interessante randvoorwaarde was dat de teams die deze koppelingen bouwden niet één team waren. Ze zaten in verschillende domeinen, op verschillende backlogs, met verschillende definities van "klaar".

## Wat ik heb gebouwd

Een configuratie-gedreven integratieplatform op AWS, waarbij **een koppeling een configuratie-artefact is in plaats van een codebase**:

- **Eén runtime, veel koppelingen.** Eén set Lambda-functies bedient elke koppeling. Koppelingen verschillen alleen in Terraform-configuratie, een mappingbestand en een schema — geen runtimecode-wijziging om er één toe te voegen.
- **Een fetch → transform → publish-pijplijn**, waarbij elke stap wordt getriggerd doordat het resultaat van de vorige in S3 landt, met runstatus per stap vastgelegd zodat een half afgeronde run zichtbaar is in plaats van verdwenen.
- **Bronnen en bestemmingen als adapters**, niet als maatwerk: event-topics, REST-API's en file drops aan de ingang; REST, SOAP en event-topics aan de uitgang.
- **Declaratieve mappings** (JSONata), geversioneerd zodat achteraf te bepalen is welke mapping een bepaalde payload heeft geproduceerd.
- **Authenticatie in eigendom van het platform** — OAuth2 client-credential-flows, tokencaching en -rotatie — zodat een integratie-engineer nooit tokenlevenscycluscode schrijft.
- **Een beheer-API achter JWT-authenticatie**: een dead-letter-bericht opnieuw aanbieden, een koppeling pauzeren, een queue legen, de status van een run inzien. Bewust beschikbaar voor de teams die de koppelingen bezitten, niet alleen voor het platformteam.
- **Alerting op incidentprioriteit** in het kanaal waar de dienstdoende engineer al zit, met gestructureerde logs en traces erachter.

## Impact

- **Twaalf koppelingen in productie op één runtime**, over magazijn-, supply-chain-, stamgegevens- en CRM-stromen.
- **Doorlooptijd naar een nieuwe koppeling in productie: minder dan een werkdag**, vanaf het schrijven van de mapping — tegenover het maatwerkproject van meerdere weken dat het verving.
- Foutafhandeling, observability en replay komen mee met het platform in plaats van per koppeling opnieuw gebouwd te worden.
- Beheerders diagnosticeren en herstarten zonder consoletoegang of een ticket bij het platformteam.

## Het patroon erachter

![Diagram: één Lambda-runtime — fetch, transform, publish — geketend via S3-objectevents met runstatus in DynamoDB, die twaalf koppelingen bedient die alleen verschillen in een Terraform-blok, een mappingbestand en een schema. Elke koppeling is een aparte deployment, zodat een storing beperkt blijft tot één koppeling. Een beheer-API achter JWT geeft de eigenaarsteams replay, pauze en inzage zonder consoletoegang.](/diagrams/integration-platform-pattern.svg)

**Deel de code, isoleer de impactradius.** Het gebruikelijke bezwaar tegen een gedeelde integratieruntime is het terechte: zet alles op één platform en één slechte wijziging legt elke stroom tegelijk plat. Dus de code is gedeeld en de *deployment* niet — elke koppeling is een eigen stack met een eigen queue, eigen opslag en eigen alarmen, draaiend op identieke code. Een team dat het platform adopteert erft de gebaande weg zonder andermans incidenten te erven.

Twee beslissingen dragen het:

- **De koppeling is het productoppervlak, niet de runtime.** Een mappingbestand en een Terraform-blok, beoordeeld als elke andere wijziging. Dat is wat een nieuwe koppeling van een project van weken naar een dag brengt, en het is ook wat governance afdwingbaar maakt: de module ís het beleid.
- **Beheer is selfservice en API-first.** Replay, pauze en inzage zijn endpoints die het eigenaarsteam zelf kan aanroepen. Dit is het deel dat adoptie mogelijk maakte, en het deel dat het makkelijkst weg te laten was — een intern platform waarvan het beheer via het eigen team loopt, heeft de bottleneck alleen verplaatst.

**Een tweede beslissing die het benoemen waard is: we hebben gemeten voordat we naar een zwaardere runtime overstapten.** De aanname in de kamer was dat serverless het niet zou houden en dat er een containerruntime nodig was. In plaats van erover te discussiëren heb ik een geschiktheidsonderzoek gedaan — sweeps tegen tijdelijke stacks op een bewust zware synthetische workload, plus een langdurige soak. Serverless verwerkte **122 berichten per seconde aanhoudend** met ruimte over, bij **99,78% beschikbaarheid** over een soak van 30 minuten; echte productiekoppelingen zitten **onder 1 bericht per seconde**, en de hoogst geprojecteerde toekomstige rond 7 à 11. De beperkende factor bleek de verwerkingskost per bericht te zijn, niet de platformoverhead — waarmee de migratie die niemand had doorgerekend ook een migratie was die niemand nodig had.

De afweging die je vooraf moet kennen: de expressiviteit van een configuratie-gedreven platform is een hard plafond. Alles wat de mappingtaal niet kan uitdrukken wordt óf een custom transformer — een noodluik dat het model uitholt bij elk gebruik — óf een "nee". Dit platform is bewust geen algemeen ETL-gereedschap: het brengt één bronrecord naar één bestemmingsaanroep, en aggregatie, fan-out en batch vallen buiten de scope. Nee zeggen tegen het vierde speciale geval is wat de eerste drie goedkoop houdt.

## Wie ja moest zeggen

**Stakeholders:** de domeinteams die de bestaande maatwerkkoppelingen bezaten en zouden moeten migreren; het platformteam dat de runtime en de piketdienst zou dragen; de engineers die piket hebben bij integratiestoringen; en de securityafdeling, want het platform houdt nu de credentials van elk aangesloten systeem.

**De onenigheid:** een gedeelde runtime vraagt een domeinteam code op te geven die het zelf beheert, en te accepteren dat zijn koppeling nu afhangt van een platform dat iemand anders uitrolt. Dat is een echt verlies aan autonomie, en de zorg over de impactradius erachter is terecht en niet territoriaal. Vanuit het platformteam was de zorg het spiegelbeeld: zij kregen een piketverantwoordelijkheid voor stromen die ze niet hadden geschreven en waarvan ze de businessbetekenis niet kenden.

**Wat het oploste:** de teams *meer* operationele controle geven dan ze hadden, niet minder. De beheer-API betekent dat een domeinteam zijn eigen koppeling kan herstarten, pauzeren en inzien zonder AWS-consoletoegang en zonder ticket — een betere positie dan maatwerkcode bezitten die je om 2 uur 's nachts uit CloudWatch moet debuggen. Eén deployment per koppeling beantwoordde het impactradius-bezwaar structureel in plaats van met een geruststelling. En de piketscope van het platformteam is vastgelegd als de runtime, niet de mappings: als een transformatie een verkeerd document oplevert, is dat een defect van het eigenaarsteam, en de runregistraties maken het mogelijk die twee uit elkaar te houden.

**Wat het kostte:** het platformteam nam blijvend een runtime en een piketrooster op zich die het niet had. En elk domeinteam gaf de vrijheid op om een koppeling op te lossen zoals het wilde. Die vrijheid was iets waard — daarom zag het landschap eruit zoals het eruitzag — en de ruil is alleen de moeite waard zolang het platform werkelijk goedkoper te adopteren blijft dan het zelf bouwen. Dat is een blijvende verplichting, geen eenmalige winst.

## Rol & stack

Platform ontworpen en gebouwd: het runtimemodel, de mapping- en contractlaag, de beheer-API, het alerting-pad, en het geschiktheidsonderzoek achter de serverless-beslissing.

**Stack:** AWS (Lambda, SNS/SQS, S3, DynamoDB, API Gateway, Secrets Manager, EventBridge), Terraform, Node.js/TypeScript, JSONata, OAuth2/OIDC, Datadog.

→ Dit is het platform waar de [SAP-event-backbone](/nl/work/sap-event-backbone) naartoe publiceert: die casus is de naad waar een SAP-landschap business-events aan dit platform overdraagt. Zie ook [Integratiearchitectuur](/nl/expertise/integration-architecture) en [Werken door de organisatie heen](/nl/expertise/stakeholder-alignment).
