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

## The pattern behind it

![Diagram: 18–20 product teams onboard through one federated model — OAuth2/JWT security, Terraform self-service onboarding, Datadog observability — running on both AWS API Gateway and Azure APIM.](/diagrams/cloud-gateway-pattern.svg)

**Federate the model, not the runtime.** The obvious fix for 20+ fragmented gateways is one big central gateway with a central team in front of it — which recreates the ESB story: every team queues behind one backlog, and the platform becomes the bottleneck it was meant to remove. Here the standard was centralised and the runtime was not: AWS API Gateway and Azure APIM both stayed, behind one security model, one onboarding path, one observability plane.

Two decisions made that stick:

- **The product is the contract, not the gateway.** OAuth2/JWT (Okta/Auth0), Terraform onboarding modules and Datadog dashboards were the platform; which cloud terminated the call was an implementation detail. Teams kept their runtime and lost their snowflake auth.
- **Self-service as infrastructure-as-code.** Onboarding a new API is a reviewed Terraform change, not a ticket — that's what moved lead time from days to minutes, and it's also what made governance enforceable: the module is the policy.

The trade-off to know upfront: a federated model is a promise you have to keep twice. Every new capability has to land on both AWS and Azure or the "one platform" story quietly dies — you are signing up to design everything for two runtimes, forever. That's the price of not migrating 20 teams onto one vendor, and here it was the right price.

## Role & stack

Led the design and rollout — API standards, the security model, and governance.

**Stack:** AWS (API Gateway, IAM, VPC), Azure (APIM, Entra ID), Terraform, Node.js, React, OAuth2/OIDC (Okta/Auth0), Datadog.

→ See also [APIs & gateways](/en/expertise/apis-and-gateways) and [Integration architecture](/en/expertise/integration-architecture).
