---
title: SAP event backbone — three estates, one contract
summary: An integration layer connecting an enterprise SAP event backbone (SAP Advanced Event Mesh / Solace) to an AWS-native integration platform, designed across three teams that share no tooling, no vocabulary and no backlog.
hook: Three platform teams, three estates, one event contract nobody owned before.
metric: 3 estates, 1 contract
short: SAP event backbone
client: A major Dutch grocery retailer · current, 2026
disagreement: Three teams with three definitions of the boundary, and every question that mattered sat in the gap between them.
role: Leading the technical design and the cross-team agreement; owning the AWS-side consumer runtime.
stack: [SAP Advanced Event Mesh, AMQP 1.0, S/4HANA, AWS Lambda, Terraform]
order: 2
---

# SAP event backbone — three estates, one contract

*A major Dutch grocery retailer. Client abstracted; scope as delivered. Current initiative, 2026.*

## Context

The organisation runs its integration on three estates that grew separately and are staffed by three different teams: an **AWS-native, config-driven integration platform**, an **ageing IBM ESB** being decommissioned wave by wave, and **SAP** (S/4HANA and BTP). SAP adopted **SAP Advanced Event Mesh (Solace)** as its event backbone, replacing the point-to-point asynchronous CPI integrations that had built up over the years.

That decision opened a gap nobody owned. SAP could now publish business events. The cloud platform could now consume them. In between sat a boundary with no contract, no naming convention, no error semantics, and two teams whose definition of "done" stopped at the edge of their own estate.

## What I designed

The integration layer that consumes SAP business events over **AMQP 1.0** into the AWS-native platform, and the agreement that makes it operable:

- **Broker connectivity and authentication** between the AWS consumer runtime and the Solace broker.
- **The subscription model**: topic hierarchies, and durable versus non-durable queues per consumer class, so a slow consumer cannot silently lose events and a transient one cannot silently pile them up.
- **The event envelope and payload contract**: what the publishing side commits to, and what the consuming side may rely on.
- **Consumer configuration**: QoS and prefetch, retry and back-off, and the dead-letter strategy for events that cannot be processed.
- **Component and sequence diagrams as the implementation blueprint**, so three teams build against one picture instead of three memories of a meeting.

## Impact

- Extends the event-driven decommissioning of the IBM ESB estate into the SAP landscape: domain teams **subscribe to governed business events** where they used to commission another point-to-point interface.
- Replaces "raise a ticket with the SAP team" with a published contract, which is what removes the bottleneck.
- Gives the AWS side a documented failure model (retry, back-off, dead-letter) where the ESB era assumed delivery was somebody else's problem.

## The pattern behind it

![Diagram: SAP S/4HANA and BTP publish business events into an SAP Advanced Event Mesh (Solace) broker; an event envelope and subscription contract sits at the estate boundary; the AWS-native integration platform consumes over AMQP 1.0 with retry, back-off and a dead-letter queue. The legacy IBM ESB estate is being decommissioned behind it.](/diagrams/sap-event-backbone-pattern.svg)

The tempting shape is for one team to take the whole integration: either the SAP team builds cloud consumers, or the cloud team gets access into SAP. Both fail the same way, by asking a team to be competent and accountable in an estate it does not run. The SAP side publishes from S/4HANA and BTP and has no cloud or IaC footprint at all; the cloud side has no business context for an S/4HANA document flow. So the design owns the boundary between them and leaves each estate to its own team.

The deliverable, then, was the contract. Topic hierarchy, envelope, delivery guarantee and dead-letter behaviour were written down and agreed before either side wrote code. The connector was the easy half. What had to be negotiated was what happens when a consumer is down for four hours, and that is also why queues are durable by default per consumer class, with non-durable as the argued exception. Choosing durability brings forward the conversation about who is responsible for lost events. It is not a comfortable conversation during design, and it is a much worse one during an incident.

The part to know in advance: an event contract turns the publishing side's schema into a promise. The SAP team took on an obligation it did not have before, with no incentive attached. No tool produces that agreement. The tooling only enforces it once the organisation has made it.

## Who had to say yes

**Stakeholders:** the SAP team (S/4HANA and BTP), who would publish and now owed a schema promise; the IBM ESB team, whose estate this design makes smaller; the AWS platform team, who would run the consumers; and the domain teams downstream, who wanted their data and did not much care how it arrived.

**The disagreement:** three teams with three definitions of the boundary. For the SAP side the job was "the events are on the broker". For the cloud side the job started at "we consume what is on the broker". Both were reasonable, and between them sat every question that matters: naming, versioning, ordering, and what happens on failure. The ESB team, meanwhile, was being asked to help design the replacement for its own estate.

**What resolved it:** writing the boundary down, and taking the unglamorous half. I did not try to settle who owned it. I wrote the envelope and subscription contract as a document each team could comment on, and I took the AWS-side consumer runtime, its Terraform provisioning and the dead-letter behaviour myself. Once the contract was a document people could review, the disagreement became technical and we could work through it. The ESB team needed some care, given what they were being asked to do. What I said to them was simply true: they know which interfaces really carry load, and without that knowledge a decommissioning sequence is not safe.

**What it cost:** a schema obligation for a team that had none, and a slower start. Agreeing the contract took time that would have looked faster spent on a connector. I think that time comes back at the first production incident, but it is a real cost at the beginning and it should be said.

## Role & stack

Leading the technical design and the cross-team agreement; owning the AWS-side consumer runtime and its provisioning.

**Stack:** SAP Advanced Event Mesh (Solace), AMQP 1.0, SAP S/4HANA and BTP business events, AWS (Lambda, SNS/SQS, DynamoDB), Terraform, Datadog.

→ The AWS-native platform this publishes into has its own case study: [the integration platform](/en/work/integration-platform), one runtime serving twelve interfaces, where an interface is a config change. See also [Integration architecture](/en/expertise/integration-architecture), [Event-driven & streaming](/en/expertise/event-driven-streaming) and [Working across an organisation](/en/expertise/stakeholder-alignment).
