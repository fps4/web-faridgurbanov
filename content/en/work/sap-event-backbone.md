---
title: SAP event backbone — three estates, one contract
summary: An integration layer connecting an enterprise SAP event backbone (SAP Advanced Event Mesh / Solace) to an AWS-native integration platform — designed across three teams that share no tooling, no vocabulary and no backlog.
hook: Three platform teams, three estates, one event contract nobody owned before.
metric: 3 estates, 1 contract
order: 2
---

# SAP event backbone — three estates, one contract

*A major Dutch grocery retailer. Client abstracted; scope as delivered. Current initiative, 2026.*

## Context

The organisation runs its integration on three estates that grew separately and are staffed by three different teams: an **AWS-native, config-driven integration platform**, an **ageing IBM ESB** being decommissioned wave by wave, and **SAP** (S/4HANA and BTP). SAP adopted **SAP Advanced Event Mesh (Solace)** as its event backbone, to replace the point-to-point asynchronous CPI integrations that had accumulated over years.

That decision created a gap nobody owned. SAP could now publish business events. The cloud platform could now consume them. Between the two sat a boundary with no contract, no naming convention, no error semantics, and two teams whose definition of "done" stopped at their own estate's edge.

## What I designed

The integration layer that consumes SAP business events over **AMQP 1.0** into the AWS-native platform, and — more to the point — the agreement that makes it operable:

- **Broker connectivity and authentication** between the AWS consumer runtime and the Solace broker.
- **The subscription model** — topic hierarchies, and durable versus non-durable queues per consumer class, so a slow consumer cannot silently lose events and a transient one cannot silently retain them.
- **The event envelope and payload contract** — what the publishing side commits to, and what the consuming side may rely on.
- **Consumer configuration** — QoS and prefetch, retry and back-off, and the dead-letter strategy for events that cannot be processed.
- **Component and sequence diagrams as the implementation blueprint**, so three teams could build against one picture instead of three readings of a meeting.

## Impact

- Extends the event-driven decommissioning of the legacy IBM ESB estate into the SAP landscape: domain teams **subscribe to governed business events** instead of commissioning another point-to-point interface.
- Replaces "raise a ticket with the SAP team" with a published contract, which is what actually removes the bottleneck.
- Gives the AWS side a documented failure model — retry, back-off, dead-letter — instead of an ESB-era assumption that delivery is somebody else's problem.

## The pattern behind it

![Diagram: SAP S/4HANA and BTP publish business events into an SAP Advanced Event Mesh (Solace) broker; an event envelope and subscription contract sits at the estate boundary; the AWS-native integration platform consumes over AMQP 1.0 with retry, back-off and a dead-letter queue. The legacy IBM ESB estate is being decommissioned behind it.](/diagrams/sap-event-backbone-pattern.svg)

**Own the seam, not the estates.** The obvious shape is for one team to take the whole integration — either the SAP team builds cloud consumers, or the cloud team gets access into SAP. Both options fail for the same reason: they ask a team to become competent and accountable in an estate it does not run. The SAP side publishes from S/4HANA and BTP and has no cloud or IaC footprint at all, and the cloud side has no business context for an S/4HANA document flow.

Two decisions carry it:

- **The contract is the deliverable, not the connector.** Topic hierarchy, envelope, delivery guarantee, dead-letter behaviour — written down and agreed before either side wrote code. The connector itself is the easy half. What had to be negotiated is what happens when a consumer is down for four hours.
- **Durable by default, and argue the exception.** Choosing durable queues per consumer class brings forward the conversation about who is responsible for lost events. It is not a comfortable conversation during design, and it is a much worse one during an incident.

The trade-off to know in advance: an event contract turns the publishing side's schema into a promise. The SAP team got an obligation it did not have before, and no incentive came with it. No tool produces that agreement. The tooling only makes it enforceable once the organisation has made it.

## Who had to say yes

**Stakeholders:** the SAP team (S/4HANA and BTP) who would publish and now owed a schema promise; the IBM ESB team, whose estate this design makes smaller; the AWS platform team who would run the consumers; and the domain teams downstream, who wanted their data and did not much care how it arrived.

**The disagreement:** three teams with three definitions of the boundary. For the SAP side the job was "the events are on the broker". For the cloud side the job started at "we consume what is on the broker". Both positions were reasonable, and between them sat every question that actually matters — naming, versioning, ordering, and what happens on failure. The ESB team, meanwhile, was being asked to help design the replacement for its own estate.

**What resolved it:** writing the seam down, and taking the boring half. Instead of deciding who owned it, I wrote the envelope and subscription contract as a document that each team could comment on, and I took the AWS-side consumer runtime, its Terraform provisioning and the dead-letter behaviour myself. Once the contract was a document people could review, rather than a position in a meeting, the disagreement became technical and we could work through it. The ESB team needed some care, because of what they were being asked to do. What I said to them was simply true: they know which interfaces really carry load, and without that knowledge a decommissioning sequence is not safe.

**What it cost:** a schema obligation for a team that had none, and a slower start. Agreeing the contract took time that would have looked faster if spent on a connector instead. I think that time comes back at the first production incident, but it is a real cost at the beginning and it should be said.

## Role & stack

Leading the technical design and the cross-team agreement; owning the AWS-side consumer runtime and its provisioning.

**Stack:** SAP Advanced Event Mesh (Solace), AMQP 1.0, SAP S/4HANA and BTP business events, AWS (Lambda, SNS/SQS, DynamoDB), Terraform, Datadog.

→ See also [Integration architecture](/en/expertise/integration-architecture), [Event-driven & streaming](/en/expertise/event-driven-streaming) and [Stakeholder alignment](/en/expertise/stakeholder-alignment).
