---
title: Vereinheitlichte Verhaltens-Telemetrie
subtitle: Zentralisierte Erfassung, Aufbereitung und Analyse von Streaming-Ereignissen über Web, Mobilgeräte und Geräte hinweg.
---

Status: Aktive Entwicklung (MVP in Arbeit). Diese Seite spiegelt den aktuellen Entwurf, den MVP-Umfang und die Ziele wider; einige Punkte sind in Bearbeitung.

### Projektübersicht
Vereinheitlichte Verhaltens-Telemetrie (UBT) ist ein offenes, meinungsstarkes Konzept für Verhaltensdatenpipelines. Es vereinheitlicht die Erfassung, Anreicherung, Speicherung und Visualisierung über Web, Mobilgeräte und IoT hinweg – von Anfang an KI-fähig und kosteneffizient gestaltet. Eine Bereitstellung unterstützt mehrere unabhängige „Spaces“ (z.B. Clickstream, IoT, ML-Feedback) mit geteilter Infrastruktur, aber isolierten Schemata, Zugängen und Dashboards. Basis-Stack: Node.js-Sammler und -Dienste, Kafka + Schema-Registry (+ DLQ), ClickHouse für Echtzeit-Aggregate und Grafana zur Visualisierung. Ziel-Infrastrukturkosten liegen bei <4 $ pro 1M Ereignisse mit einer Latenz von unter 2 Minuten von der Erfassung bis zum Dashboard.

### Problemkontext
Teams bauen wiederholt Telemetrie für Apps und Geräte auf und enden mit fragmentierten Werkzeugen, inkonsistenten Ereignisverträgen, Anbieterabhängigkeit und steigenden Kosten. Noch schlimmer ist, dass Daten oft nicht KI-fähig sind – in Produkten eingeschlossen, unzureichend modelliert oder zu langsam/teuer für Zusammenfassungen und Anomalie-Hinweise. UBT adressiert dies mit offenen Komponenten, konsistenten Verträgen, Raumisolierung und kuratierten Modellen, die Verhaltensdaten bereit für Dashboards und KI-Anwendungsfälle machen.

### Wichtige technische Herausforderungen
- Konsistente Instrumentierung (JS/Mobil/Firmware) mit versionierten, validierten Schemata und CI-Prüfungen.
- Raumisolierung und Governance: Namensräume, ACLs, Aufbewahrung, Quoten und Dashboard-Abgrenzung.
- Kurzlebige Authentifizierung (ES256/RS256 JWT) mit schlüsselbasiertem Zugang pro Raum und einfachen Edge-Schutzmaßnahmen.
- Sub-2-Minuten-Aggregate zu vorhersehbaren Kosten; sichere Wiederholungs- und DLQ-Workflows.
- Minimierung/Maskierung von PII, Rückverfolgbarkeit und Auditierbarkeit ohne großen operativen Aufwand.
- Interoperable Tracks: DIY Docker und eine AWS-native Option, während Schemata und Dashboards geteilt werden.

### Lösungsarchitektur
Ereignisgesteuerte Pipeline mit meinungsstarken Standards (Schemata, Themenbenennung, materialisierte Ansichten, Dashboards) und raumbezogenen Konfigurationsdateien (`/config/<space>.space.json`). Sammler bündeln Ereignisse zu einer API hinter einem Edge; die API validiert kurzlebige Token und veröffentlicht sie auf Kafka-Themen pro Raum mit Schema-Registry-Durchsetzung und DLQs. Ein Runner-Dienst führt Anreicherungen (PII-Maskierung, Geo-/Geräteverknüpfungen), Speicher-Schreiber (ClickHouse-Einfügungen mit Partitionierung/TTL) und den KI-Erzähler (wöchentliche Zusammenfassungen/Sprachberichte) aus. Grafana-Dashboards basieren auf kuratierten ClickHouse-Ansichten; Wiederholungs-/Export-Endpunkte unterstützen Ad-hoc-Analysen und Backfills.

![Systemkontextdiagramm](/structurizr/structurizr-3-SystemContext-001.png)

### Technische Highlights (Geplant/Alpha)
- Instrumentierungskit: JS/Mobil-Leitfaden + Firmware-Ereignisvorlage; Schema-Verträge + Validierung.
- API-Dienst + Sammler mit Batch-Verarbeitung, Rückstaudruck und kurzlebiger JWT-Authentifizierung (pro Raum).
- Kafka-Rückgrat mit Schema-Registry, Themenkonventionen, DLQ und Wiederholungswerkzeugen.
- Runner-Jobs: Anreicherung (PII-Maskierung, Geo-/Geräteverknüpfungen), Speicher-Schreiber (ClickHouse), KI-Erzähler.
- ClickHouse-materialisierte Ansichten für Sitzungen, Trichter, Aufbewahrungskohorten und Gerätegesundheit.
- Grafana-Dashboard-Pakete mit Warnungen; kuratierte Ansichten zielen auf <5s Panel-Latenz.
- IaC-Module für DIY (Docker/Terraform) und AWS-native Tracks; geteilte Schemata/Dashboards über beide hinweg.
- Governance: Raumisolierung, ACLs, Aufbewahrung, Audit-Protokolle und Schema-Kompatibilitäts-Gates in CI.

### Zielergebnisse
- Erste nützliche Dashboards innerhalb von zwei Wochen nach Projektstart (Clickstream- und IoT-Räume).
- Erfassungs-zu-Dashboard p50 < 2 Minuten für Top-Aggregate.
- Infrastrukturkosten-Basis unter 4 $ pro 1M Ereignisse (Speicherung + Berechnung), mit Abstimmungshilfe.
- >95% schema-validierte Ereignisse; klare DLQ-/Wiederholungs-Playbooks und CI-Kompatibilitätsprüfungen.
- Raumisolierung standardmäßig: Namensräume, ACLs, raumbezogene Aufbewahrung und Dashboards.
- KI-Erzähler „Exec Brief“ wöchentlich verfügbar (Text + optionaler Sprachhinweis) pro Stakeholder.

### MVP-Umfang (Phase-1)
- Eine Bereitstellung, die mehrere Räume bedient (Clickstream, IoT, ML-Feedback).
- Kurzlebige JWT-Authentifizierung pro Raum (ES256/RS256) + JWKS; Edge-Schutzmaßnahmen.
- Kafka + Schema-Registry + DLQ; ClickHouse-Speicherung mit Partitionierung/TTL; Grafana-Dashboards.
- Meinungsstarke Standards: Themenbenennung, Schemata, materialisierte Ansichten, Dashboards und Alarmvorlagen.
- Export-/Wiederholungsendpunkte; Backfill-Handbücher; CI-Prüfungen für Schema-Kompatibilität.

### KPIs & Messung
- Latenz (Erfassung → Dashboard): p50/p95.
- Kosten pro 1M Ereignisse (Infrastruktur-Proxys); sinkender Anteil der Anbieterausgaben.
- Schema-Validierungsrate; DLQ-Rate; Wiederholungserfolg.
- Pipeline-Verfügbarkeit (Erfassung + Speicherung) und Abfrageleistung.
- KI-Bereitschaft und Nutzung: Erzähler-Adoption und Zusammenfassungsgenauigkeit.