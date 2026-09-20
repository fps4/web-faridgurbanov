---
title: Kafka data-product platform on Cloudera
summary: A Cloudera-based Kafka data-product platform productising 20+ data streams across 30+ source systems, with schema governance and domain-oriented ownership.
hook: Streaming data productised across domains, with governed schemas.
metric: 20+ data products
short: Kafka data products
client: A major UK telecom operator
disagreement: Productising a stream means the producing domain accepts consumers it never asked for, plus a schema promise and an SLA.
role: Data engineer and technology architect. Designed the platform and guided cross-border delivery teams.
stack: [Apache Kafka, Cloudera CDP, Schema Registry, Hive LLAP, Spark 3]
order: 5
---

# Kafka data-product platform on Cloudera

*A major UK telecom operator, during my Accenture years, 2018–2020. Client abstracted for confidentiality; technical scope as delivered.*

## Context

Streaming data from **30+ source systems** had to become something the analytics teams could build on: reusable data products with a clear owner, and a schema that could change without breaking whoever was reading it.

## What I built

A Kafka data-product platform on **Cloudera (CDP)**:

- **20+ productised data streams**, each owned by the domain that produces it.
- **Schema governance** through Schema Registry, so producers and consumers can move independently.
- **Hive LLAP and Spark 3** for query acceleration over the streamed data.
- A cross-team ownership model that put the products with the domains and left the central team running the platform.

## Impact

- **20+ data products** in operation across the business.
- **30+ source systems** integrated under one governed model.
- Domain ownership that scaled without a central gatekeeper in the path.

## The pattern behind it

![Diagram: 30+ source systems feed three domain-owned data products, each with a schema contract in the registry, flowing to analytics consumers. The platform team runs Cloudera, Schema Registry and the NiFi templates underneath; the data stays with the domains.](/diagrams/cloudera-kafka-pattern.svg)

A platform like this usually starts with a central ingestion team that owns every topic. That works at five streams and collapses at twenty, because the central team becomes the queue everyone waits in. Here each stream was productised: the producing domain owned its schema, its SLA and its consumers' migration path when the schema changed.

Two things carried that. Compatibility rules in the Schema Registry (backward-compatible by default) meant a producer could ship a change without a change board; the registry checked it, and the meeting went away. And the platform team owned the road but never the traffic. Cloudera, the registry, the NiFi ingestion templates and the ownership model were central; the data itself was not. That is what let 30+ source systems onboard without the platform team turning into the bottleneck it had replaced.

The thing to be clear-eyed about is that domain ownership is an organisational pattern in a technical costume. The registry can enforce compatibility. It cannot make a domain staff its product. The streams that did well had a named owner on the producing side; the ones that lagged were the ones treated as IT's problem.

## Who had to say yes

**Stakeholders:** the domain teams that produced the data and would now owe a schema and an SLA; the central ingestion team, whose role this design shrinks; the analytics consumers who wanted reliable streams and had no leverage to demand them; and the cross-border delivery teams building it.

**The disagreement:** productising a stream means the producing domain accepts consumers it never asked for. Several domains read that as work landing on their plate to solve somebody else's problem, and they were not wrong. The central team, for its part, was being asked to give up the gatekeeper role that justified its headcount.

**What resolved it:** being specific about what each side got. Domains got compatibility rules in the registry, and with them the right to ship a change without going through a change board. For a producing team, losing that meeting was worth more than the schema promise cost them. The central team was repositioned around the platform (Cloudera, the registry, the NiFi templates, the ownership model), which is a better job than being everyone's queue. Where a domain would not commit an owner, I wrote that down instead of shipping a stream with nobody behind it. Those are the streams that lagged later, and having it on record early is why nobody was surprised.

**What it cost:** a schema and support obligation on every producing domain, permanently. The registry enforces compatibility; staffing the product stays a management decision, taken domain by domain.

## Role & stack

Data engineer and technology architect (Accenture CTA group). Designed the platform and guided the cross-border delivery teams.

**Stack:** Apache Kafka on Cloudera (CDP), Cloudera Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ See also [Event-driven & streaming](/en/expertise/event-driven-streaming) and [Data & lakehouse](/en/expertise/data-and-lakehouse).
