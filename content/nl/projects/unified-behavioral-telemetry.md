---
title: Unified Behavioral Telemetry
subtitle: Gecentraliseerde streaming evenementverzameling, curatie en analyse voor web, mobiel en apparaten.
---

Status: Actieve ontwikkeling (MVP in uitvoering). Deze pagina weerspiegelt het huidige blauwdruk, MVP-bereik en doelen; sommige items zijn in uitvoering.

### Projectoverzicht
Unified Behavioral Telemetry (UBT) is een open, uitgesproken blauwdruk voor gedragsdatapijplijnen. Het verenigt inname, verrijking, opslag en visualisatie over web, mobiel en IoT—ontworpen om AI-klaar en kostenefficiënt te zijn vanaf dag één. Eén implementatie ondersteunt meerdere onafhankelijke "ruimtes" (bijv. clickstream, IoT, ML-feedback) met gedeelde infrastructuur maar geïsoleerde schema's, toegang en dashboards. Baseline stack: Node.js collectors en services, Kafka + Schema Registry (+ DLQ), ClickHouse voor realtime aggregaten en Grafana voor visualisatie. Doelinfrastructuurkosten zijn <$4 per 1M evenementen met een latency van minder dan 2 minuten van inname tot dashboard.

### Probleemcontext
Teams bouwen herhaaldelijk telemetrie voor apps en apparaten opnieuw op, wat resulteert in gefragmenteerde tools, inconsistente evenementcontracten, vendor lock-in en stijgende kosten. Nog erger is dat data vaak niet AI-klaar is—opgesloten in producten, onder-gemodelleerd of te traag/duur om te gebruiken voor samenvattingen en anomalie notities. UBT pakt dit aan met open componenten, consistente contracten, ruimte-isolatie en samengestelde modellen die gedragsdata klaar maken voor dashboards en AI-gebruikssituaties.

### Belangrijkste Technische Uitdagingen
- Consistente instrumentatie (JS/mobiel/firmware) met versiebeheer, gevalideerde schema's en CI-controles.
- Ruimte-isolatie en governance: namespaces, ACL's, retentie, quota's en dashboardafbakening.
- Kortdurende authenticatie (ES256/RS256 JWT) met sleutels per ruimte en eenvoudige edge-bescherming.
- Aggregaten van minder dan 2 minuten tegen voorspelbare kosten; replay- en DLQ-workflows die veilig te bedienen zijn.
- PII-minimalisatie/masking, herkomst en auditbaarheid zonder zware operationele overhead.
- Interoperabele tracks: DIY Docker en een AWS-native optie terwijl schema's en dashboards gedeeld blijven.

### Oplossingsarchitectuur
Gebeurtenisgestuurde pijplijn met uitgesproken standaarden (schema's, topicnaamgeving, materialized views, dashboards) en configuratiebestanden op ruimteniveau (`/config/<space>.space.json`). Collectors batchen evenementen naar een API achter een edge; de API valideert kortdurende tokens en publiceert naar Kafka-topics per ruimte met Schema Registry-handhaving en DLQ's. Een Runner-service voert verrijking uit (PII-masking, geo/apparaatkoppelingen), opslagschrijver (ClickHouse-inserts met partitionering/TTL) en de AI Narrator (wekelijkse samenvattingen/stemnotities). Grafana-dashboards zitten op samengestelde ClickHouse-weergaven; replay/export-eindpunten ondersteunen ad-hoc analyse en backfills.

```mermaid
---
title: Context Diagram
config:
  theme: forest
  look: handDrawn
---
flowchart TB

  subgraph CL[Clients]
    Web[Web SDK]
    Mobile[Mobile SDK]
    Device[Firmware/IoT Events]
  end

  subgraph UBT[Unified Behavioral Telemetry]
    API[API Service (inname, export/replay)]
    Broker[Kafka + Schema Registry + DLQ]
    Runner[Runner Jobs: Verrijk, Schrijver, Verteller]
    Store[ClickHouse (views + TTL)]
    Dash[Grafana Dashboards + Alerts]
    Config[Ruimte Config & Governance]
  end

  Web --> API
  Mobile --> API
  Device --> API
  API --> Broker
  Broker --> Runner
  Runner --> Store
  Store --> Dash
  Config -. contracten .- API
  Config -. contracten .- Runner
  Config -. budgetten/operaties .- Broker
  Config -. budgetten/operaties .- Dash
```

### Technologische Hoogtepunten (Gepland/Alpha)
- Instrumentatiekit: JS/mobiele richtlijnen + firmware evenementtemplate; schema contracten + validatie.
- API Service + collectors met batching, backpressure en kortdurende JWT-authenticatie (per ruimte).
- Kafka-backbone met Schema Registry, topicconventies, DLQ en replay-tools.
- Runner-jobs: verrijking (PII-masking, geo/apparaatkoppelingen), opslagschrijver (ClickHouse), AI Narrator.
- ClickHouse materialized views voor sessies, trechters, retentiecohorten en apparaatgezondheid.
- Grafana dashboardpakketten met alerts; samengestelde weergaven richten op <5s paneellatency.
- IaC-modules voor DIY (Docker/Terraform) en AWS-native tracks; gedeelde schema's/dashboards over beide.
- Governance: ruimte-isolatie, ACL's, retentie, auditlogs en schema-compatibiliteitsdrempels in CI.

### Doelstellingen
- Eerste bruikbare dashboards binnen twee weken na start (clickstream en IoT-ruimtes).
- Inname-tot-dashboard p50 < 2 minuten voor topaggregaten.
- Infrastructuurkostenniveau onder $4 per 1M evenementen (opslag + compute), met afstemmingsrichtlijnen.
- >95% schema-gevalideerde evenementen; duidelijke DLQ/replay-handleidingen en CI-compatibiliteitscontroles.
- Ruimte-isolatie standaard: namespaces, ACL's, retentie per ruimte en dashboards.
- AI Narrator "Exec Brief" wekelijks beschikbaar (tekst + optionele stemnotitie) per belanghebbende.

### MVP-bereik (Fase-1)
- Eén implementatie die meerdere ruimtes bedient (clickstream, IoT, ML-feedback).
- Kortdurende JWT-authenticatie per ruimte (ES256/RS256) + JWKS; edge-bescherming.
- Kafka + Schema Registry + DLQ; ClickHouse-opslag met partitionering/TTL; Grafana-dashboards.
- Uitgesproken standaarden: topicnaamgeving, schema's, materialized views, dashboards en alerttemplates.
- Export/replay-eindpunten; backfill-handleidingen; CI-controles voor schema-compatibiliteit.

### KPI's & Metingen
- Latency (inname → dashboard): p50/p95.
- Kosten per 1M evenementen (infra proxy); dalende vendoruitgaven.
- Schema validatie slagingspercentage; DLQ-percentage; replay-succes.
- Pijplijnbeschikbaarheid (inname + opslag) en query-prestaties.
- AI-gereedheid en gebruik: Narrator-adoptie en samenvattingsnauwkeurigheid.