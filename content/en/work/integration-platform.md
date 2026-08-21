---
title: Integration platform — one runtime, twelve interfaces
summary: A configuration-driven integration platform on AWS where a new source-to-destination interface is a mapping file and a Terraform block rather than a codebase — with self-service operations, and a measured answer to whether it needed a heavier runtime.
hook: A new interface became a config change, not a codebase — and the platform team stopped being the queue.
metric: 12 interfaces, 1 runtime
short: Integration platform
client: A major Dutch grocery retailer
disagreement: A shared runtime asks domain teams to give up code they control, and concentrates the blast radius on a platform team that did not previously carry it.
role: Designed and built the platform — the runtime model, the mapping and contract layer, the operations API, and the runtime-fitness study.
stack: [AWS Lambda, SNS/SQS, S3, DynamoDB, Terraform, JSONata, Datadog]
order: 3
---

# Integration platform — one runtime, twelve interfaces

*A major Dutch grocery retailer. Client abstracted; scope and measurements as delivered.*

## Context

The estate had accumulated integrations the way most estates do: one at a time, each a small bespoke project. Every one re-implemented authentication, retry and dead-letter handling, and each had its own idea of what an error looked like. That is affordable at three integrations and expensive at thirty — not because the code is hard, but because nothing is shared, so every failure is investigated from scratch by whoever built it.

The interesting constraint was that the teams building these integrations were not one team. They sat in different domains, on different backlogs, with different definitions of done.

## What I built

A configuration-driven integration platform on AWS, where **an interface is a configuration artifact rather than a codebase**:

- **One runtime, many interfaces.** A single set of Lambda functions serves every interface. Interfaces differ only in Terraform configuration, a mapping file and a schema — no runtime code changes to add one.
- **A fetch → transform → publish pipeline**, each stage triggered by the previous stage's object landing in S3, with per-step run state recorded so a half-finished run is visible rather than lost.
- **Sources and destinations as adapters**, not as bespoke code: event topics, REST APIs and file drops on the way in; REST, SOAP and event topics on the way out.
- **Declarative mappings** (JSONata), versioned so the mapping that produced a given payload is identifiable after the fact.
- **Authentication owned by the platform** — OAuth2 client-credential flows, token caching and rotation — so an integration engineer never writes token-lifecycle code.
- **An operations API behind JWT auth**: replay a dead-letter message, pause an interface, purge a queue, inspect the state of a run. Deliberately available to the teams who own the interfaces, not only to the platform team.
- **Alerting by incident priority** into the channel the on-call engineer is already in, with structured logs and traces behind it.

## Impact

- **Twelve interfaces in production on one runtime**, spanning warehouse, supply-chain, master-data and CRM flows.
- **Time to a new interface in production: under a working day**, from authoring the mapping — against the multi-week bespoke project it replaced.
- Failure handling, observability and replay arrive with the platform rather than being rebuilt per integration.
- Operators diagnose and replay without console access or a ticket to the platform team.

## The pattern behind it

![Diagram: a single Lambda runtime — fetch, transform, publish — chained by S3 object events with run state in DynamoDB, serving twelve interfaces that differ only in a Terraform block, a mapping file and a schema. Each interface is a separate deployment, so a failure is contained to one interface. An operations API behind JWT gives the owning teams replay, pause and inspect without console access.](/diagrams/integration-platform-pattern.svg)

**Share the code, isolate the blast radius.** The usual objection to a shared integration runtime is the accurate one: put everything on one platform and one bad change takes down every flow at once. So the code is shared and the *deployment* is not — each interface is its own stack with its own queue, its own storage and its own alarms, running identical code. A team adopting the platform inherits the paved road without inheriting anybody else's incidents.

Two decisions carry it:

- **The interface is the product surface, not the runtime.** A mapping file and a Terraform block, reviewed like any other change. That is what moves a new integration from a multi-week project to a day, and it is also what makes governance enforceable: the module is the policy.
- **Operations are self-service and API-first.** Replay, pause and inspect are endpoints the owning team can call. This is the part that made adoption possible, and it is the part that would have been easiest to leave out — an internal platform whose operations run through its own team has simply relocated the bottleneck.

**A second decision worth naming: we measured before graduating to a heavier runtime.** The assumption in the room was that serverless would not hold and the platform would need a container runtime. Rather than argue it, I ran a fitness study — sweeps against ephemeral stacks on a deliberately heavy synthetic workload, plus a sustained soak. Serverless absorbed **122 messages/second sustained** with headroom, at **99.78% availability** over a 30-minute soak; real production interfaces sit **below 1 message/second**, and the highest projected future one at roughly 7–11. The binding constraint turned out to be per-message processing cost, not platform overhead — which meant the migration nobody had costed was also a migration nobody needed.

The trade-off to know upfront: a configuration-driven platform's expressiveness is a hard ceiling. Everything the mapping language cannot express becomes either a custom transformer — an escape hatch that erodes the model every time it is used — or a "no". This platform is deliberately not a general ETL tool: it moves one source record to one destination call, and aggregation, fan-out and batch are out of scope. Saying no to the fourth special case is what keeps the first three cheap.

## Who had to say yes

**Stakeholders:** the domain teams who owned the existing bespoke integrations and would have to migrate; the platform team who would carry the runtime and its on-call; the engineers on call for integration failures; and the security function, since the platform now holds the credentials for every connected system.

**The disagreement:** a shared runtime asks a domain team to give up code it controls, and to accept that its integration now depends on a platform someone else releases. That is a real loss of autonomy, and the blast-radius worry behind it is legitimate rather than territorial. From the platform team's side the concern was the mirror image: they were being handed an on-call surface for flows they did not write and whose business meaning they did not know.

**What resolved it:** giving the teams *more* operational control than they had before, not less. The operations API means a domain team can replay, pause and inspect its own interface without AWS console access and without raising a ticket — which is a better position than owning bespoke code they have to debug from CloudWatch at 2am. One deployment per interface answered the blast-radius objection structurally rather than by reassurance. And the platform team's on-call scope was written down as the runtime, not the mappings: if a transformation produces a wrong document, that is the owning team's defect, and the run records make it possible to tell the two apart.

**What it cost:** the platform team took on a runtime and an on-call rota it did not have before, permanently. And every domain team gave up the freedom to solve an integration however it liked. That freedom was worth something — it is why the estate looked the way it did — and the trade is only worth it while the platform stays genuinely cheaper to adopt than writing it yourself. That is a standing obligation, not a one-off win.

## Role & stack

Designed and built the platform: the runtime model, the mapping and contract layer, the operations API, the alerting path, and the runtime-fitness study behind the serverless decision.

**Stack:** AWS (Lambda, SNS/SQS, S3, DynamoDB, API Gateway, Secrets Manager, EventBridge), Terraform, Node.js/TypeScript, JSONata, OAuth2/OIDC, Datadog.

→ This is the platform the [SAP event backbone](/en/work/sap-event-backbone) publishes into: that case study is the seam where an SAP estate hands business events over to it. See also [Integration architecture](/en/expertise/integration-architecture) and [Working across an organisation](/en/expertise/stakeholder-alignment).
