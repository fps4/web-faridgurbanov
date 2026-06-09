---
title: Cloud Gateway — federatief cross-cloud API-platform
summary: 20+ gefragmenteerde API-gateways geconsolideerd tot één federatief, cross-cloud, selfservice-platform dat ~500M+ requests per maand verwerkt en ~€250–300k per jaar bespaart.
hook: 20+ gefragmenteerde gateways verenigd tot één selfservice-platform over AWS en Azure.
metric: ~500M+ req/maand
order: 1
---

# Cloud Gateway — federatief cross-cloud API-platform

*Een grote Nederlandse supermarktketen. Klant geabstraheerd; metrics zoals geleverd.*

## Context

De organisatie had 20+ API-gateways laten ontstaan verspreid over teams, met een verouderde IBM API Connect in het midden en geen uniform security- of governancemodel. Elk team loste authenticatie, onboarding en observability anders op. Een nieuwe API toevoegen betekende dagen coördinatie.

## Wat ik bouwde

Een federatief, cross-cloud, selfservice-API-platform over **AWS API Gateway en Azure APIM**, gedreven door Terraform-modules:

- Een uniform **OAuth2/JWT**-securitymodel (Okta/Auth0) dat per-team-authenticatie verving.
- **Geautomatiseerde, infrastructure-as-code-onboarding** zodat teams zelf een nieuwe API uitrollen.
- **Centrale observability** (Datadog) over al het verkeer.
- Interne React/Node.js-tooling voor developer experience.

Het verving IBM API Connect en consolideerde de 20+ gateways achter één model.

## Impact

- **~500M+ API-requests per maand** gefederaliseerd over het platform.
- **18–20 productteams** bediend op één selfservice-model.
- **~€250–300k per jaar** aan kostenbesparing.
- Onboarding-doorlooptijd teruggebracht van **dagen naar minuten**.

## Rol & stack

Leidde het ontwerp en de uitrol — API-standaarden, het securitymodel en governance.

**Stack:** AWS (API Gateway, IAM, VPC), Azure (APIM, Entra ID), Terraform, Node.js, React, OAuth2/OIDC (Okta/Auth0), Datadog.

→ Zie ook [API's & gateways](/nl/expertise/apis-and-gateways) en [Integratiearchitectuur](/nl/expertise/integration-architecture).
