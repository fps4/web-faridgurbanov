---
title: Integration architecture
summary: Designing the backbone that lets enterprise systems talk, from legacy ESBs to event-driven, API-led, domain-oriented platforms.
evidence: [integration-platform, sap-event-backbone, cloud-gateway, cloudera-kafka]
order: 2
group: domain
---

# Integration architecture

For twenty years my job has been making systems that were never meant to talk to each other work as one. That means knowing the old world (IBM Integration Bus, API Connect, point-to-point ETL) well enough to retire it safely, and the new one (event-driven, API-led, domain-oriented) well enough to run it in production.

## What I do

- **Modernisation paths that keep the business running.** Moving from batch and point-to-point integration toward streaming and APIs, incrementally, with the legacy estate still live.
- **Standards that hold across teams.** REST design, API lifecycle and versioning, OpenAPI contracts, and the governance to make them stick when twenty teams are involved.
- **Contracts at the boundaries.** Schema governance and data contracts where domains meet, so a change on one side does not silently break the other.

## Evidenced by

- [Integration platform](/en/work/integration-platform): one configuration-driven runtime serving twelve interfaces, where adding one is a mapping file and a Terraform block.
- [SAP event backbone](/en/work/sap-event-backbone): an SAP estate, a legacy IBM ESB and an AWS-native platform brought onto one event contract, so domain teams subscribe to governed business events where they used to commission another point-to-point interface.
- [Cloud Gateway](/en/work/cloud-gateway): twenty-plus fragmented gateways consolidated into one federated, cross-cloud, self-service platform handling ~1.5B+ requests a month.
- [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka): domain-oriented streaming across 30+ source systems with governed schemas.

Background: 20+ years across SOA, ESB modernisation and API management; Accenture Certified Technology Architect; TOGAF 9.
