---
title: API's & gateways
summary: API-platformen die schalen over tientallen teams. Gatewaystrategie, security-governance, lifecycle, en de developer experience die maakt dat teams ze gaan gebruiken.
evidence: [integration-platform, cloud-gateway]
order: 4
group: domain
---

# API's & gateways

Een API-platform staat of valt met gebruik. Een gateway neerzetten is een week werk. Het moeilijke deel is er een maken waar twintig teams zelf voor kiezen, omdat onboarding minuten duurt, het beveiligingsmodel consistent is, en niemand toestemming hoeft te vragen om uit te rollen.

## Wat ik doe

- **Gatewaystrategie.** AWS API Gateway, Azure APIM, Kong en Apigee kiezen en combineren voor een hybride of multi-cloud-landschap, met de redenering op papier.
- **Security-governance.** OAuth2/OIDC-flows, mTLS, sleutelrotatie, en één authenticatiemodel (Okta, Auth0, Entra ID) over teams heen.
- **Lifecycle en developer experience.** Versionering, deprecatie, vindbaarheid, rate-limiting en quota, met selfservice-onboarding via infrastructure-as-code zodat het platform schaalt zonder poortwachter.

## Aangetoond door

- [Integratieplatform](/nl/work/integration-platform): een beheer-API achter JWT die de eigenaarsteams replay, pauzeren en inspecteren geeft zonder consoletoegang, en dat is wat een gedeelde runtime überhaupt bruikbaar maakte.
- [Cloud Gateway](/nl/work/cloud-gateway): een federatief AWS + Azure API-platform voor 18–20 teams, met Terraform-gedreven onboarding die de doorlooptijd van dagen naar minuten bracht en ~€250–300k per jaar bespaarde.

Achtergrond: hands-on met alle vier de grote gateways; AWS Security – Specialty.
