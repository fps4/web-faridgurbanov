---
title: API's & gateways
summary: API-platformen die opschalen over tientallen teams — gatewaystrategie, security-governance, lifecycle, en de developer experience die ervoor zorgt dat ze worden geadopteerd.
order: 6
---

# API's & gateways

Een API-platform staat of valt met adoptie. Het lastige is niet het opzetten van een gateway — het is er een maken die twintig teams kiezen te gebruiken omdat onboarding minuten kost, het securitymodel consistent is, en niemand toestemming hoeft te vragen om te releasen.

## Wat ik doe

- **Gatewaystrategie.** Het kiezen en combineren van AWS API Gateway, Azure APIM, Kong en Apigee voor een hybride of multi-cloud opstelling — niet één product kiezen en maar hopen.
- **Security-governance.** OAuth2/OIDC-flows, mTLS, key rotation, en één authenticatiemodel (Okta, Auth0, Entra ID) in plaats van één per team.
- **Lifecycle en developer experience.** Versionering, deprecatie, discovery, rate-limiting en quota — met selfservice-onboarding gedreven door infrastructure-as-code, zodat het platform opschaalt zonder poortwachter.

## Aangetoond door

- [Cloud Gateway](/nl/work/cloud-gateway) — een federatief AWS + Azure API-platform dat 18–20 teams bedient, met Terraform-gedreven onboarding die de doorlooptijd terugbracht van dagen naar minuten en ~€250–300k per jaar bespaarde.

Achtergrond: hands-on over alle vier de grote gateways; AWS Security – Specialty.
