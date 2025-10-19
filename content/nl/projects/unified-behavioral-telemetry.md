---
title: Unified Behavioral Telemetry
subtitle: Gecentraliseerde streaming eventverzameling, curatie en analyse over web, mobiel en apparaten.
---

Status: Actieve ontwikkeling (MVP in uitvoering). Deze pagina weerspiegelt de huidige blauwdruk, MVP-omvang en doelen; sommige items zijn in uitvoering.

### Projectoverzicht
Unified Behavioral Telemetry (UBT) is een open, uitgesproken blauwdruk voor gedragsdatapijplijnen. Het verenigt inname, verrijking, opslag en visualisatie over web, mobiel en IoT—ontworpen om AI-klaar en kostenefficiënt te zijn vanaf dag één. Eén implementatie ondersteunt meerdere onafhankelijke "ruimtes" (bijv. clickstream, IoT, ML-feedback) met gedeelde infrastructuur maar geïsoleerde schema's, toegang en dashboards. Baseline stack: Node.js collectors en services, Kafka + Schema Registry (+ DLQ), ClickHouse voor real-time aggregaten, en Grafana voor visualisatie. Doelinfrastructuurkosten zijn <$4 per 1M events met een latentie van <2 minuten van inname tot dashboard.

### Probleemcontext
Teams bouwen herhaaldelijk telemetrie voor apps en apparaten, resulterend in gefragmenteerde tools, inconsistente eventcontracten, vendor lock-in en stijgende kosten. Nog erger, data is vaak niet AI-klaar—opgesloten in producten, ondergemodelleerd of te traag/duur om te gebruiken voor samenvattingen en anomalienotities. UBT pakt dit aan met open componenten, consistente contracten, ruimte-isolatie en gecureerde modellen die gedragsdata klaar maken voor dashboards en AI-gebruiksscenario's.

### Belangrijke Technische Uitdagingen
- Consistente instrumentatie (JS/mobiel/firmware) met versiegebonden, gevalideerde schema's en CI-controles.
- Ruimte-isolatie en governance: namespaces, ACL's, retentie, quota's en dashboardafbakening.
- Kortdurende authenticatie (ES256/RS256 JWT) met per-ruimte sleutels en eenvoudige edge-bescherming.
- Sub-2-minuten aggregaten tegen voorspelbare kosten; replay- en DLQ-workflows die veilig te bedienen zijn.
- PII-minimalisatie/masking, herkomst en auditability zonder zware operationele overhead.
- Interoperabele tracks: DIY Docker en een AWS-native optie terwijl schema's en dashboards gedeeld blijven.

### Oplossingsarchitectuur
Event-gedreven pijplijn met uitgesproken standaarden (schema's, topicbenaming, gematerialiseerde weergaven, dashboards) en configuratiebestanden op ruimteniveau (`/config/<space>.space.json`). Collectors batchen events naar een API achter een edge; de API valideert kortdurende tokens en publiceert naar Kafka-topics per ruimte met Schema Registry afdwinging en DLQ's. Een Runner-service voert verrijking uit (PII-masking, geo/apparaat-koppelingen), opslagschrijver (ClickHouse-invoegingen met partitionering/TTL) en de AI Narrator (wekelijkse samenvattingen/voice briefs). Grafana-dashboards zitten op gecureerde ClickHouse-weergaven; replay/export-eindpunten ondersteunen ad-hoc analyse en backfills.

![Systeemcontextdiagram](/structurizr/structurizr-3-SystemContext-001.png)

### Technologie Hoogtepunten (Gepland/Alpha)
- Instrumentatiekit: JS/mobiele richtlijnen + firmware eventtemplate; schema-contracten + validatie.
- API-service + collectors met batching, backpressure en kortdurende JWT-authenticatie (per ruimte).
- Kafka-ruggegraat met Schema Registry, topicconventies, DLQ en replaytools.
- Runner-taken: verrijking (PII-masking, geo/apparaat-koppelingen), opslagschrijver (ClickHouse), AI Narrator.
- ClickHouse gematerialiseerde weergaven voor sessies, trechters, retentiecohorten en apparaatgezondheid.
- Grafana-dashboardpakketten met waarschuwingen; gecureerde weergaven richten op <5s paneellatentie.
- IaC-modules voor DIY (Docker/Terraform) en AWS-native tracks; gedeelde schema's/dashboards over beide.
- Governance: ruimte-isolatie, ACL's, retentie, auditlogs en schema-compatibiliteitscontroles in CI.

### Doelresultaten
- Eerste bruikbare dashboards binnen twee weken na start (clickstream en IoT-ruimtes).
- Inname-tot-dashboard p50 < 2 minuten voor topaggregaten.
- Infrastructuurkostenbasis onder $4 per 1M events (opslag + compute), met tuningrichtlijnen.
- >95% schema-gevalideerde events; duidelijke DLQ/replay-playbooks en CI-compatibiliteitscontroles.
- Ruimte-isolatie standaard: namespaces, ACL's, per-ruimte retentie en dashboards.
- AI Narrator “Exec Brief” wekelijks beschikbaar (tekst + optionele voice note) per belanghebbende.

### MVP-omvang (Fase-1)
- Eén implementatie die meerdere ruimtes bedient (clickstream, IoT, ML-feedback).
- Kortdurende JWT-authenticatie per ruimte (ES256/RS256) + JWKS; edge-bescherming.
- Kafka + Schema Registry + DLQ; ClickHouse-opslag met partitionering/TTL; Grafana-dashboards.
- Uitgesproken standaarden: topicbenaming, schema's, gematerialiseerde weergaven, dashboards en waarschuwingssjablonen.
- Export/replay-eindpunten; backfill-runbooks; CI-controles voor schema-compatibiliteit.

### KPI's & Meting
- Latentie (inname → dashboard): p50/p95.
- Kosten per 1M events (infrastructuurproxy); dalende trend in leveranciersuitgaven.
- Schema-validatie slagingspercentage; DLQ-percentage; replay-succes.
- Pijplijnbeschikbaarheid (inname + opslag) en queryprestaties.
- AI-gereedheid en gebruik: Narrator-adoptie en samenvattingsnauwkeurigheid.