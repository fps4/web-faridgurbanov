---
title: Cloud Gateway — federated cross-cloud API platform
summary: Consolidated 20+ fragmented API gateways into one federated, cross-cloud, self-service platform handling ~1.5B+ requests a month and saving ~€250–300k a year.
hook: 20+ fragmented gateways unified into one self-service platform across AWS and Azure.
metric: ~1.5B+ req/month
short: Cloud Gateway
client: A major Dutch grocery retailer
disagreement: Nobody wanted to give up a gateway they controlled for a dependency on a central team, and no one had the authority to order a migration.
role: Led the design and rollout: API standards, the security model, and governance.
stack: [AWS API Gateway, Azure APIM, Terraform, OAuth2/OIDC, Datadog]
order: 1
---

# Cloud Gateway — federated cross-cloud API platform

*A major Dutch grocery retailer, from 2021. Client abstracted; metrics as delivered.*

## Context

By the time I arrived the organisation had accumulated more than twenty API gateways, roughly one per team, with an ageing IBM API Connect in the middle and no shared security or governance model. Every team had solved authentication, onboarding and observability in its own way. Publishing a new API took days of coordination, and most of those days went on finding out who to ask.

## What I built

A federated, cross-cloud, self-service API platform on **AWS API Gateway and Azure APIM**, provisioned through Terraform modules:

- One **OAuth2/JWT** security model (Okta/Auth0) in place of per-team auth.
- Onboarding as **infrastructure-as-code**, so a team publishes a new API by opening a pull request.
- **Datadog** observability across all traffic.
- Internal React/Node.js tooling for the developer side of it.

IBM API Connect was retired and the twenty-odd gateways were brought behind the one model.

## Impact

- **~1.5B+ API requests a month** across the platform (September 2026), with server-side errors under **0.03%** end to end.
- **18–20 product teams** on one self-service model.
- **~€250–300k a year** saved, most of it from the decommissioned contract.
- Onboarding lead time down from **days to minutes**.

## The pattern behind it

![Diagram: 18–20 product teams onboard through one federated model (OAuth2/JWT security, Terraform self-service onboarding, Datadog observability) running on both AWS API Gateway and Azure APIM.](/diagrams/cloud-gateway-pattern.svg)

The tempting fix for twenty fragmented gateways is one big central gateway with a central team in front of it. That recreates the ESB problem: every team queues behind one backlog, and the platform becomes the bottleneck it was supposed to remove. So we centralised the standard and left the runtime alone. AWS API Gateway and Azure APIM both stayed, with one security model, one onboarding path and one observability plane across the two.

What held it together was where the platform was defined. The OAuth2/JWT model, the Terraform onboarding modules and the Datadog dashboards were the product; which cloud terminated the call was an implementation detail. Teams kept their runtime and gave up their home-grown auth. And because onboarding was a reviewed Terraform change, the module became the policy. Governance was enforced by the thing teams already had to use, and lead time dropped from days to minutes as a side effect.

The cost of a federated model is that every promise has to be kept twice. Each new capability lands on AWS and on Azure, or the "one platform" story stops being true. You are signing up to design everything for two runtimes, indefinitely. That was the price of not marching twenty teams onto one vendor, and in this estate it was the right price.

## Who had to say yes

**Stakeholders:** 18–20 product teams who each already owned a working gateway; the platform group that would have to run whatever replaced them; the security function, which had to accept one auth model across two clouds; and the budget owner behind the IBM API Connect contract.

**The disagreement:** nobody wanted to trade a gateway they controlled for a dependency on a central team, and nobody had the authority to order the trade. Asking for a mandate would have produced twenty exceptions and one very slow backlog.

**What resolved it:** the platform had to be cheaper for a team than staying put. Terraform onboarding in minutes, an OAuth2/JWT model they no longer had to build and re-certify, dashboards they did not have to wire up. Security got a single model to review in place of twenty. Finance got a decommissioning figure that paid for the programme. The migration order mattered as well: the first teams to move were the ones with the worst existing setup, and they became the reference the others asked.

**What it cost:** a standing commitment to ship every capability twice, on AWS and on Azure. I still think it was worth it, but it is a permanent obligation and it belongs in the ledger.

## Role & stack

Led the design and rollout: API standards, the security model, and governance.

**Stack:** AWS (API Gateway, IAM, VPC), Azure (APIM, Entra ID), Terraform, Node.js, React, OAuth2/OIDC (Okta/Auth0), Datadog.

→ See also [APIs & gateways](/en/expertise/apis-and-gateways) and [Integration architecture](/en/expertise/integration-architecture).
