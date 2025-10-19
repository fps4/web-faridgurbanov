---
title: Vereinheitlichte Verhaltens-Telemetrie
subtitle: Zentralisierte Sammlung, Kuratierung und Analyse von Streaming-Ereignissen über Web, Mobilgeräte und Geräte.
---

Status: Aktive Entwicklung (MVP in Arbeit). Diese Seite spiegelt den aktuellen Entwurf, den MVP-Umfang und die Ziele wider; einige Punkte sind in Bearbeitung.

### Projektüberblick
Vereinheitlichte Verhaltens-Telemetrie (UBT) ist ein offener, meinungsstarker Entwurf für Verhaltensdaten-Pipelines. Es vereinheitlicht die Erfassung, Anreicherung, Speicherung und Visualisierung über Web, Mobilgeräte und IoT – von Anfang an KI-bereit und kosteneffizient. Eine Bereitstellung unterstützt mehrere unabhängige „Spaces“ (z.B. Clickstream, IoT, ML-Feedback) mit gemeinsamer Infrastruktur, aber isolierten Schemata, Zugängen und Dashboards. Basis-Stack: Node.js-Sammler und -Dienste, Kafka + Schema-Registry (+ DLQ), ClickHouse für Echtzeit-Aggregate und Grafana für die Visualisierung. Ziel-Infrastrukturkosten sind <4 $ pro 1M Ereignisse mit einer Latenz von weniger als 2 Minuten von der Erfassung bis zum Dashboard.

### Problemkontext
Teams bauen wiederholt Telemetrie für Apps und Geräte auf und enden mit fragmentierten Tools, inkonsistenten Ereignisverträgen, Anbieterbindung und steigenden Kosten. Noch schlimmer ist, dass Daten oft nicht KI-bereit sind – in Produkten eingeschlossen, untermodelliert oder zu langsam/teuer für Zusammenfassungen und Anomaliehinweise. UBT adressiert dies mit offenen Komponenten, konsistenten Verträgen, Space-Isolierung und kuratierten Modellen, die Verhaltensdaten für Dashboards und KI-Anwendungsfälle bereit machen.

### Wichtige technische Herausforderungen
- Konsistente Instrumentierung (JS/Mobil/Firmware) mit versionierten, validierten Schemata und CI-Checks.
- Space-Isolierung und Governance: Namespaces, ACLs, Aufbewahrung, Quoten und Dashboard-Umfang.
- Kurzlebige Authentifizierung (ES256/RS256 JWT) mit schlüsselbasiertem Zugriff pro Space und einfachen Edge-Schutzmaßnahmen.
- Sub-2-Minuten-Aggregate zu vorhersehbaren Kosten; sichere Wiederholungs- und DLQ-Workflows.
- PII-Minimierung/Maskierung, Herkunft und Prüfbarkeit ohne hohen operativen Aufwand.
- Interoperable Tracks: DIY Docker und eine AWS-native Option bei gemeinsamen Schemata und Dashboards.

### Lösungsarchitektur
Ereignisgesteuerte Pipeline mit meinungsstarken Standards (Schemata, Themenbenennung, materialisierte Ansichten, Dashboards) und Space-Level-Konfigurationsdateien (`/config/<space>.space.json`). Sammler bündeln Ereignisse zu einer API hinter einem Edge; die API validiert kurzlebige Token und veröffentlicht in Kafka-Themen pro Space mit Schema-Registry-Durchsetzung und DLQs. Ein Runner-Dienst führt Anreicherungen (PII-Maskierung, Geo-/Geräte-Joins), Speicher-Schreiber (ClickHouse-Einfügungen mit Partitionierung/TTL) und den KI-Erzähler (wöchentliche Zusammenfassungen/Sprachbriefe) aus. Grafana-Dashboards basieren auf kuratierten ClickHouse-Ansichten; Wiederholungs-/Exportendpunkte unterstützen Ad-hoc-Analysen und Backfills.

```mermaid
---
title: Kontextdiagramm
config:
  theme: forest
  look: handDrawn
---
flowchart TB

  subgraph CL[Kunden]
    Web[Web SDK]
    Mobile[Mobile SDK]
    Device[Firmware/IoT-Ereignisse]
  end

  subgraph UBT[Vereinheitlichte Verhaltens-Telemetrie]
    API[API-Dienst (Erfassung, Export/Wiederholung)]
    Broker[Kafka + Schema-Registry + DLQ]
    Runner[Runner-Jobs: Anreicherung, Schreiber, Erzähler]
    Store[ClickHouse (Ansichten + TTL)]
    Dash[Grafana-Dashboards + Warnungen]
    Config[Space-Konfiguration & Governance]
  end

  Web --> API
  Mobile --> API
  Device --> API
  API --> Broker
  Broker --> Runner
  Runner --> Store
  Store --> Dash
  Config -. Verträge .- API
  Config -. Verträge .- Runner
  Config -. Budgets/Operationen .- Broker
  Config -. Budgets/Operationen .- Dash
```

### Technologische Highlights (Geplant/Alpha)
- Instrumentierungskit: JS/Mobil-Leitfaden + Firmware-Ereignisvorlage; Schema-Verträge + Validierung.
- API-Dienst + Sammler mit Bündelung, Rückstau und kurzlebiger JWT-Authentifizierung (pro Space).
- Kafka-Rückgrat mit Schema-Registry, Themenkonventionen, DLQ und Wiederholungswerkzeugen.
- Runner-Jobs: Anreicherung (PII-Maskierung, Geo-/Geräte-Joins), Speicher-Schreiber (ClickHouse), KI-Erzähler.
- ClickHouse materialisierte Ansichten für Sitzungen, Trichter, Aufbewahrungs-Kohorten und Gerätegesundheit.
- Grafana-Dashboard-Pakete mit Warnungen; kuratierte Ansichten zielen auf <5s Panel-Latenz.
- IaC-Module für DIY (Docker/Terraform) und AWS-native Tracks; gemeinsame Schemata/Dashboards über beide.
- Governance: Space-Isolierung, ACLs, Aufbewahrung, Prüfprotokolle und Schema-Kompatibilitäts-Gates in CI.

### Zielergebnisse
- Erste nützliche Dashboards innerhalb von zwei Wochen nach dem Start (Clickstream- und IoT-Spaces).
- Erfassung-zu-Dashboard p50 < 2 Minuten für Top-Aggregate.
- Infrastrukturkosten-Basis unter 4 $ pro 1M Ereignisse (Speicherung + Berechnung), mit Abstimmungshinweisen.
- >95% schema-validierte Ereignisse; klare DLQ/Wiederholungs-Playbooks und CI-Kompatibilitätschecks.
- Space-Isolierung standardmäßig: Namespaces, ACLs, pro Space Aufbewahrung und Dashboards.
- KI-Erzähler „Executive Brief“ wöchentlich verfügbar (Text + optionaler Sprachhinweis) pro Stakeholder.

### MVP-Umfang (Phase-1)
- Eine Bereitstellung, die mehrere Spaces bedient (Clickstream, IoT, ML-Feedback).
- Kurzlebige JWT-Authentifizierung pro Space (ES256/RS256) + JWKS; Edge-Schutzmaßnahmen.
- Kafka + Schema-Registry + DLQ; ClickHouse-Speicherung mit Partitionierung/TTL; Grafana-Dashboards.
- Meinungsstarke Standards: Themenbenennung, Schemata, materialisierte Ansichten, Dashboards und Alarmvorlagen.
- Export-/Wiederholungsendpunkte; Backfill-Runbooks; CI-Checks für Schema-Kompatibilität.

### KPIs & Messung
- Latenz (Erfassung → Dashboard): p50/p95.
- Kosten pro 1M Ereignisse (Infrastruktur-Proxys); Anteil der Anbieterausgaben sinkt.
- Schema-Validierungsrate; DLQ-Rate; Wiederholungserfolg.
- Pipeline-Verfügbarkeit (Erfassung + Speicherung) und Abfrageleistung.
- KI-Bereitschaft und Nutzung: Erzähler-Adoption und Zusammenfassungsgenauigkeit.