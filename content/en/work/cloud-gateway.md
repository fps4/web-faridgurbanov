---
title: Cloud Gateway — federated cross-cloud API platform
summary: Consolidated 20+ fragmented API gateways into one federated, cross-cloud, self-service platform handling ~500M+ requests a month and saving ~€250–300k a year.
hook: 20+ fragmented gateways unified into one self-service platform across AWS and Azure.
metric: ~500M+ req/month
order: 1
---

# Cloud Gateway — federated cross-cloud API platform

*A major Dutch grocery retailer. Client abstracted; metrics as delivered.*

## Context

The organisation had grown 20+ API gateways across teams, with an ageing IBM API Connect at the centre and no unified security or governance model. Every team solved authentication, onboarding and observability differently. Adding a new API meant days of coordination.

## What I built

A federated, cross-cloud, self-service API platform spanning **AWS API Gateway and Azure APIM**, driven by Terraform modules:

- A unified **OAuth2/JWT** security model (Okta/Auth0) replacing per-team auth.
- **Automated, infrastructure-as-code onboarding** so teams self-serve a new API.
- **Centralised observability** (Datadog) across all traffic.
- Internal React/Node.js tooling for developer experience.

It replaced IBM API Connect and consolidated the 20+ gateways behind one model.

## Impact

- **~500M+ API requests per month** federated across the platform.
- **18–20 product teams** served on one self-service model.
- **~€250–300k per year** in cost savings.
- Onboarding lead time cut from **days to minutes**.

## Role & stack

Led the design and rollout — API standards, the security model, and governance.

**Stack:** AWS (API Gateway, IAM, VPC), Azure (APIM, Entra ID), Terraform, Node.js, React, OAuth2/OIDC (Okta/Auth0), Datadog.

→ See also [APIs & gateways](/en/expertise/apis-and-gateways) and [Integration architecture](/en/expertise/integration-architecture).
