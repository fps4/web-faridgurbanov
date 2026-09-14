---
title: Eén beleid, twee compilers
summary: Een exportcontrolebeleid moet tegelijk gelden op Unity Catalog en op Fabric, en niemand houdt twee beheerconsoles met de hand in sync. Dus is het beleid data, en zetten twee compilers het om in wat elk platform kan afdwingen — 22 ABAC-policies en tags die hun eigen herkomst dragen aan de ene kant, 20 statische rollen en vier tenant-instellingen aan de andere. De naad tussen de twee werd pas zichtbaar omdat ze gegenereerd is.
date: 2026-09-20
order: 1
---

# Eén beleid, twee compilers

In [het vorige stuk](/nl/writing/export-control-who-sees-what) beargumenteerde ik zes beslissingen voor een lakehouse onder exportcontrole. Dit stuk gaat over wat er ná de beslissingen gebeurt: het beleid moet bestaan op Databricks Unity Catalog *én* op Microsoft Fabric, identiek, jarenlang, terwijl beide platforms elke maand releasen. Niemand houdt twee beheerconsoles met de hand in sync. Dus in [`export-controlled-lakehouse`](https://github.com/fps4/export-controlled-lakehouse) is het beleid data, evalueert een engine het, en produceren **twee compilers** wat elk platform daadwerkelijk kan afdwingen — en, in dezelfde uitvoer, wat het niet kan.

De naad tussen de twee platforms is het interessante deel, en die werd pas zichtbaar omdat iets beide kanten genereerde.

## Het beleid is zes YAML-bestanden

Alles waarover de engine redeneert staat onder `config/`. De taxonomie benoemt vier niveaus en vier regimes, elk met zijn eenheid van controle — de persoon en de sleutel, de grens, het land, het contract — en de declassificatieregel die de engine zelfstandig mag toetsen. Het regiobestand benoemt geografieën, DR-paren en de thuisregio van de tenant. Het platformbestand bevat wat elk platform afdwingt en waar het data mag neerzetten, elke claim gedateerd.

Dan het landschap: eenendertig assets, van ruwe fabriekstelemetrie via opgeschoonde tabellen, features, KPI's, shares, een model, een endpoint, een export, een agent — elk met zijn lineage. Alleen een bron declareert een controle:

```yaml
- id: raw_telemetry_tw
  region: taiwannorth
  declared: ["US-EAR:3B001", "EU-DU:3B001", "CUST:fab-tw-01"]
  derivation: source

- id: features_uptime_tw
  region: taiwannorth
  inputs: [clean_telemetry_tw, fleet_calendar]
  derivation: aggregate
  carries_parameters: false
  min_group_size: 1
```

De loader weigert `declared` op een afgeleid asset. Classificatie komt binnen bij een bron en nergens anders.

Het bestand met personen is interessant om wat het mist. Zes mensen, elk met een thuisland en een lijst groepen — `xc-auth-US-EAR-3B001`, `xc-lic-EU-DU-3B001`, `cust-fab-de-01` — en geen nationaliteitsveld. De loader weigert er een op de *naam* van het veld, omdat de faalwijze een HR-feed is met één kolom te veel.

En het register: het enige in de repository dat een controle weghaalt.

```yaml
- id: DCL-0005
  asset: kpi_availability_cn
  removes: ["CN-DSL:important"]
  grounds: outbound_assessment
  reference: "CAC outbound data security assessment, file 2026-XXXX (placeholder)"
  decided_by: export-control-officer
  expires_on: 2027-08-15
  covers_downstream: true
```

Een invoer die een *regel* aanhaalt wordt getoetst aan het asset — groepsgrootte, of een parameter overleeft, of vrije tekst overleeft — en geweigerd als zij niet standhoudt. Een invoer die een beoordeling of een oordeel aanhaalt wordt op haar record aangenomen. De engine kan tonen dat zij bestaat en wanneer zij verloopt; tornen kan zij er niet aan.

## Wat de engine doet voordat een compiler draait

Drie dingen, in volgorde. Hij **propageert**: elk afgeleid asset erft elke controle van elke bron, met de bron waar die vandaan komt, en een verwijdering reist alleen stroomafwaarts mee als de invoer dat zegt. Hij **valideert het register**, en weigert op het verzonnen landschap één invoer — `public_fleet_summary` was gedeclassificeerd op de aggregatieregel, en aggregeert over vijf machines met de parameters er nog in. En hij **evalueert**: voor een persoon, een plek, een asset en een doel draaien vier regels in vaste volgorde — landsgrens, autorisatie, plaats van toegang, uitgang — en de eerste weigering beslist.

De uitkomst van die laatste stap is `explain`, de zin die een toezichthouder vraagt:

```
AGGREGATE_ONLY  P-ENG-NL-B · from NL · read · clean_telemetry_eu
  carries   EU-DU:3E001   from machine_master
            US-EAR:3B001  from raw_telemetry_eu
  because   X2 authorisation
            US-EAR:3B001: not authorised (needs group xc-auth-US-EAR-3B001)
  instead   kpi_availability_eu, share_kpi_eu, kpi_global_availability
```

Elke controle noemt de bron waar zij vandaan komt; elke weigering noemt de groep die ontbrak; elke afwijzing waarvoor een gedeclassificeerd product uit dezelfde bronnen bestaat, biedt dat aan. De compilers lezen dezelfde gepropageerde toestand, dus beide platforms beantwoorden dezelfde vraag op dezelfde manier — waar ze dat kunnen.

## Compiler één: Unity Catalog

De eerste compiler schrijft SQL en JSON onder `build/unity_catalog/`. Acht catalogs: één per geografie voor de logische niveaus, één per geografie voor het exportgecontroleerde niveau, en één in een *apart bestand* voor het Chinese landschap, omdat Azure China een ander account en een andere metastore is en niets in het hoofdbestand daarbij kan.

Dan tags — 47 `ALTER TABLE`-statements, één sleutel per controle, en de waarde is de bron waar de controle vandaan kwam:

```sql
ALTER TABLE xc_t2_eu.estate.clean_telemetry_eu SET TAGS (
  'xc_tier' = 'T2',
  'xc_EU_DU_3E001' = 'machine_master',
  'xc_US_EAR_3B001' = 'raw_telemetry_eu', ...);
```

Een tag die zijn eigen herkomst draagt is iets kleins dat veel verandert: de governanceconsole toont nu *waarom* een tabel gecontroleerd is, en een gedeclassificeerd product toont welke invoer wat heeft weggehaald (`xc_removed_by = 'CN-DSL:important:DCL-0005'`).

Dan 22 ABAC-policies, beperkt tot de controles die elke catalog werkelijk bevat. Eén per controle op regimeniveau, gekoppeld aan de tag, bij elke query getoetst aan de accountgroepen van de aanvrager:

```sql
CREATE OR REPLACE POLICY rf_xc_US_EAR_3B001
  ON CATALOG xc_t2_eu
  ROW FILTER xc_t2_eu.xc_security.require_xc_US_EAR_3B001
  TO `account users`
  FOR TABLES
  WHEN has_tag('xc_US_EAR_3B001');
```

En één voor het klantregime, waar de groepsnaam uit de rij zelf wordt afgeleid — `is_account_group_member(concat('cust-', customer_id))` — gekoppeld aan een kolomtag. Grants gaan naar de vereniging van groepen die de assets van een fysieke catalog nodig hebben; bindings isoleren een gecontroleerde catalog tot de workspaces in zijn regio; Delta Shares dragen de vier KPI-producten en niets anders.

Dan een Markdown-bestand met wat SQL niet kan zeggen: sleutels per workspace, sharing alleen aan waar een share bestaat, de assistent uit op gecontroleerde workspaces, de audittabellen om te bewaren. En één eerlijke regel: deze compiler kan een bestand dat een notebook verlaat niet labelen, dus het beleid weigert de export en wijst in plaats daarvan naar een share.

## Compiler twee: Fabric

De tweede compiler schrijft JSON en Markdown onder `build/fabric/`. Zes capaciteiten — één per grens en geografie, en geen in China, omdat de F-SKU-regiotabel geen China-regio vermeldt. Zes workspaces, elk met zijn items en een noot dat OneLake security Admins, Members en Contributors niet beperkt, zodat die rollen alleen aan het platformteam toekomen.

Dan 20 OneLake-securityrollen, en hier verandert de vorm. Unity Catalog kreeg één *policy* per controle; Fabric krijgt één *rol* per regime-en-categorie met objectbeveiliging over de tabellen die haar dragen, en één rol per klant met een **statisch** predicaat:

```json
{ "role": "cust-fab-de-01",
  "row_level_security": { "predicate": "customer_id = 'fab-de-01'" },
  "evaluated": "role membership; the predicate is static" }
```

De documentatie zegt dat OneLake-RLS-rollen geen dynamische query's ondersteunen, dus er is geen `current_user()` om een groep uit af te leiden. "Wie" is op Fabric lidmaatschap van een rol met een vast filter, en een wijziging in autorisatie is een wijziging van rol, niet van beleid.

Dan 26 sensitivity labels uit het niveau, drie toegestane shortcuts naar de roll-up-workspace en één geweigerde, de vier cross-geo Azure OpenAI-tenant-instellingen bij hun exacte naam met de verwachte waarde *Disabled* voor de Taiwanese capaciteiten, een noot die citeert wat Multi-Geo in de thuisregio achterlaat, en `no_home.md` — vier assets die in China rusten en nergens hierboven worden uitgestuurd.

## De naad, één regel per beslissing

| | Unity Catalog produceert | Fabric produceert |
|---|---|---|
| **Wie** | 22 policies, per query geëvalueerd | 20 rollen, statische predicaten |
| **Herkomst** | tags die de bron en de verwijderende invoer noemen | itemlabels uit het niveau; geen propagatie op rij- of kolomniveau |
| **Grens** | catalogs gebonden aan workspaces; een apart account voor China | capaciteiten per regio; geen China-capaciteit |
| **Oversteek** | vier Delta Shares van producten | drie shortcuts; de Chinese heeft geen bron |
| **Export** | geweigerd — niets reist mee met het bestand van een notebook | toegestaan — het label reist mee |
| **Assistent** | een workspace-instelling | vier tenant-instellingen, benoemd |

Geen van die regels is een oordeel over een van beide producten. Het zijn dezelfde zes beslissingen die op twee verschillende handhavingsmodellen landen, en het nut van beide genereren is dat de verschillen in een bestand staan in plaats van in iemands hoofd.

## Twee dingen die een compiler weigert

Het landschap bevat een replica van de Chinese opgeschoonde telemetrie, gematerialiseerd in West-Europa "zodat het model erop kan trainen". Het beleid markeert haar als plaatsingsbevinding. Beide compilers **weigeren haar uit te sturen** — geen catalog, geen workspace, geen label. Een compiler die een thuis bouwt voor een plaatsingsovertreding heeft de overtreding permanent gemaakt; deze benoemt haar in het manifest en stopt.

En een share van iets boven het basisniveau wordt geweigerd voordat de compiler hem ziet. De vier shares die bestaan zijn de vier KPI-producten, en elk draagt de registerinvoer die het declassificeerde.

## Wat validate bewijst, en wat het echt zou maken

`infra/` bevat twee Terraform-modules die de gecompileerde manifesten lezen — catalogs, bindings, shares, recipients; capaciteiten, domeinen, workspaces — en CI draait `terraform validate` tegen de echte providerschema's. Dat bewijst dat de compilers vormen produceren die de providers accepteren. Het bewijst niets over een echt landschap, en het is bewust daar begrensd: er staat geen abonnement, account of capaciteit achter deze repository.

Wat het echt zou maken is kort en concreet. Een Databricks-workspace om de SQL op toe te passen — de ABAC-grammatica is getoetst aan de huidige referentie, maar een grammaticacontrole is geen run. Een Fabric-proefcapaciteit om de rollen op aan te maken. En de metingen die de documentatie van geen van beide platforms geeft: of `MATCH COLUMNS` een kolomtag vindt die met `ALTER COLUMN` is gezet, wat een Fabric-shortcut over een geografie heen werkelijk verplaatst, en wat de assistent als context meestuurt. Dat zijn middagen, geen kwartalen, en elk ervan maakt van een gedateerde claim in `config/platforms.yaml` een getal.

## Waarom überhaupt compileren

Omdat een beleid dat in twee consoles leeft, twee beleidsregels is. Zodra het data is met twee compilers erachter, wordt onenigheid een pull request tegen `config/` — verander de toegestane geografieën van een regime, de groepen van een persoon, de vervaldatum van een registerinvoer — en de artefacten van beide platforms renderen opnieuw met het gevolg erbij, en CI weigert de commit als de vastgelegde artefacten niet meer overeenkomen met de code.

Dat is dezelfde lus als bij de [SAP↔Snowflake-naad](/nl/writing/sap-snowflake-seam-decision) en het [Synapse-landschap](/nl/writing/synapse-platform-decision), één laag verder: daar ging de beslissing over welk platform of welke modus; hier over wat het platform verteld wordt, in zijn eigen termen, en of het überhaupt verteld kan worden.

*De repo is openbaar en MIT-gelicenseerd: [github.com/fps4/export-controlled-lakehouse](https://github.com/fps4/export-controlled-lakehouse). `make demo` schrijft alles wat hierboven geciteerd is in een paar seconden; begin met `build/unity_catalog/20_policies.sql` en `build/fabric/onelake_security_roles.json` naast elkaar — dat paar is de naad.*
