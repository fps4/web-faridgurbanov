---
title: Integration adapter: an interface via configuration
summary: A platform product that teams use by themselves to connect two applications. The team writes configuration, and the platform runs the integration.
intro: A platform product that teams use by themselves to connect two applications. The team writes configuration, and the platform runs the integration.
small: A large Dutch grocery retailer, since October 2023. Client not named. Two-minute read.
facts: [Under a working day | for a new interface to be live, Half the time | to deploy an integration, 2–3 times lower | cost of an integration, 100+ a second | messages held in the load test]
role: Designed and built the initial version. Tech lead of the team that expands it now.
client: A large Dutch grocery retailer
built_with: AWS Lambda, SNS/SQS, S3, DynamoDB, JSONata, Terraform, Datadog
order: 2
listed: The same retailer. Teams provision an integration between applications via configuration, on a light serverless stack.
stands: the first adapters run in production and several teams use it. The migration of some hundreds of interfaces from the IBM middleware is ongoing.
next: cloud-gateway
next_label: Next: Cloud gateway
---

## Where it started

The IBM middleware used to have some hundreds of interfaces. The purpose was to migrate outdated vendor specific solutions to cloud native platform products.

## What I did

I designed and built the initial version of the adapter. It allows teams to provision integrations between applications via configuration, so it is a declarative self-service platform product.

It uses a light stack: cloud native, serverless, and based mostly on JSON data transformation. It supports REST, S3, event and SOAP interfaces.

With both products the purpose was the same. First, to simplify the underlying complexity. Second, to ensure sound security and standardization across the board.

## What it gave

Compared with infrastructure that teams deployed themselves, without a platform product behind it, the deployment time of an integration halved and the cost went down 2–3 times. The load test held more than 100 messages a second.

## Where it stands

The first adapters run in production. The migration of the interfaces is ongoing. The hardest part is to get teams to rely on the platform.
