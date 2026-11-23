---
title: Cloud gateway: één API-platform op twee clouds
summary: Een platformproduct waarmee teams zelf een API achter een gateway zetten. Een API-gateway is de voordeur waardoor het ene systeem het andere aanroept.
intro: Een platformproduct waarmee teams zelf een API achter een gateway zetten. Een API-gateway is de voordeur waardoor het ene systeem het andere aanroept.
small: Een grote Nederlandse supermarktketen, sinds oktober 2024. Klant niet genoemd. Twee minuten lezen.
facts: [Veel → één | gateways in één platform, Ongeveer 10 | teams gebruiken het nu, Meer dan een miljard | verzoeken per maand, Dagen → minuten | om een API te publiceren]
role: De eerste versie gebouwd. Tech lead van het team dat het nu uitbreidt.
client: Een grote Nederlandse supermarktketen
built_with: AWS API Gateway, Azure API Management, Terraform, OAuth 2 / OIDC, Okta, Auth0, GitHub, Datadog
order: 1
large: Veel gateways, één platform
listed: Een grote Nederlandse supermarktketen, sinds oktober 2024. Teams maken zelf een gateway aan, met self-service via pull requests, en OAuth 2 is de standaard in plaats van API-sleutels.
stands: ongeveer 10 teams gebruiken het. De oude IBM-gateway is er nog, en de vervanging loopt.
next: integration-adapter
next_label: Volgende: Integratie-adapter
---

## Waar het begon

Het idee kwam van de enterprise-architecten, en het lag er al een paar jaar: één plek om heel verschillende gebruikspatronen gelijk te trekken en de governance te versterken. Ik nam het als één van twee doelen.

Toen ik begon was er IBM API Connect, en een reeks AWS API-gateways die door teams zelf waren aangemaakt en beheerd. Elk team zorgde zelf voor de beveiliging van zijn gateway, meestal met API-sleutels.

## Wat ik deed

Eerst probeerde ik te begrijpen hoe de ervaring voor de ontwikkelaar zou zijn, en van daaruit werkte ik terug. Ik wilde dat het declaratief was en zo eenvoudig mogelijk om een gateway aan te maken, met alle complexiteit eronder afgedekt. Eén eis was OAuth 2 als standaard, en geen API-sleutels.

Ik begon met een prototype. Ik kreeg het werkend, eerst intern voor ons eigen team. Daarna rolden we het uit bij een paar eerste klanten. Nu maken teams het zelf aan, met volledige self-service via pull requests op een GitHub-repository.

## Wat erin zit

- AWS API Gateway en Azure API Management achter één manier van werken.
- OAuth 2 met Okta voor medewerkers en externen, ingericht via Terraform, en Auth0 voor klanten.

## Waar het staat

Ongeveer 10 teams gebruiken de gateway. De oude IBM-gateway is er nog, en de vervanging loopt.
