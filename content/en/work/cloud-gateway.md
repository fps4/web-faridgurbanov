---
title: Cloud gateway: one API platform on two clouds
summary: A platform product that teams use by themselves to put an API behind a gateway. An API gateway is the front door that one system uses to call another system.
intro: A platform product that teams use by themselves to put an API behind a gateway. An API gateway is the front door that one system uses to call another system.
small: A large Dutch grocery retailer, since October 2023. Client not named. Two-minute read.
facts: [Many → one | gateways into one platform, Around 10 | teams use it today, Over a billion | requests a month, Days → minutes | to publish an API]
role: Built the first version. Tech lead of the team that expands it now.
client: A large Dutch grocery retailer
built_with: AWS API Gateway, Azure API Management, Terraform, OAuth 2 / OIDC, Okta, Auth0, GitHub, Datadog
order: 1
next: integration-adapter
next_label: Next: Integration adapter
---

## Where it started

The idea came from the enterprise architects, and it was there for several years: one place to unify quite diverse usage patterns and to strengthen governance. I took it as one of two objectives.

When I started there was IBM API Connect, and a range of AWS API gateways provisioned and owned by teams. Each team took care of the security of its own gateway, mostly with API keys.

## What I did

At first I tried to understand how the developer experience would be, and played that back from there. I wanted it to be declarative and as simple as possible to provision a gateway, with all the underlying complexity covered. One requirement was OAuth 2 as the standard, and not API keys.

I started with a prototype. I made it working, first internally for us. Then we rolled it out with a few initial clients. Now teams provision it themselves, with full self-service via pull requests on a GitHub repository.

## What is in it

- AWS API Gateway and Azure API Management behind one way of working.
- OAuth 2 with Okta for employees and contractors, provisioned via Terraform, and Auth0 for customers.

## Where it stands

Around 10 teams use the gateway. The old IBM gateway is still there, and replacing it is in progress.
