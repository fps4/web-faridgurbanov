---
title: Kafka data-product platform on Cloudera
summary: A Cloudera-based Kafka data-product platform productising 20+ data streams across 30+ source systems, with schema governance and domain-oriented ownership.
hook: Streaming data productised across domains, with governed schemas.
metric: 20+ data products
short: Kafka data products
client: A major UK telecom operator
disagreement: Productising a stream means the producing domain accepts consumers it never asked for, plus a schema promise and an SLA.
role: Data engineer and technology architect — designed the platform and guided cross-border delivery teams.
stack: [Apache Kafka, Cloudera CDP, Schema Registry, Hive LLAP, Spark 3]
order: 4
---

# Kafka data-product platform on Cloudera

*A major UK telecom operator. Client abstracted for confidentiality; technical scope as delivered.*

## Context

The organisation needed to turn streaming data across **30+ source systems** into reliable, reusable data products that analytics teams could depend on — with clear ownership and schema evolution that wouldn't break consumers downstream.

## What I built

A Kafka data-product platform on **Cloudera (CDP)**:

- **20+ productised data streams**, each domain-owned rather than centrally bottlenecked.
- **Schema governance** via Schema Registry, so producers and consumers evolve independently.
- **Hive LLAP and Spark 3** for query acceleration over the streamed data.
- A cross-team ownership model so domains, not a central queue, owned their products.

## Impact

- **20+ data products** in operation across the business.
- **30+ source systems** integrated under one governed model.
- Domain-oriented ownership that scaled without a central gatekeeper.

## The pattern behind it

![Diagram: 30+ source systems feed three domain-owned data products, each with a schema contract in the registry, flowing to analytics consumers — all on a platform paved road of Cloudera, Schema Registry and NiFi templates that owns the road, not the traffic.](/diagrams/cloudera-kafka-pattern.svg)

**Domain-owned data products instead of a central pipeline team.** The default shape for a platform like this is a central ingestion team that owns every topic — it works at 5 streams and collapses at 20. Here, each stream was productised: the producing domain owned its schema, its SLAs, and its consumers' migration path.

Two decisions made that stick:

- **Schema evolution as a governance contract, not a serialization detail.** Compatibility rules in the Schema Registry (backward-compatible by default) meant a producer could ship changes without a change board — the registry, not a meeting, was the gatekeeper. Governance moved from process into the platform.
- **The platform team owns the paved road, not the traffic.** Cloudera, the registry, NiFi ingestion templates and the ownership model were central; the data itself never was. That's what let 30+ source systems onboard without the platform team becoming the bottleneck it replaced.

The trade-off to know upfront: domain ownership is an organisational pattern wearing a technical costume. The registry enforces compatibility; it can't make a domain staff its product. The streams that thrived had a named owner on the producing side — the ones that lagged were the ones treated as "IT's problem".

## Who had to say yes

**Stakeholders:** the domain teams that produced the data and would now owe a schema and an SLA; a central ingestion team whose role this design deliberately shrinks; the analytics consumers who wanted reliable streams and had no leverage to demand them; and cross-border delivery teams building it.

**The disagreement:** productising a stream means the producing domain accepts consumers it did not ask for. Several domains read that as work moving onto their plate to solve somebody else's problem — and they were not wrong. The central team, meanwhile, was being asked to give up the gatekeeper role that justified its headcount.

**What resolved it:** being clear about what each side actually got. Domains got compatibility rules in the Schema Registry, which meant they could ship a change without going through a change board. For a producing team, not having that meeting any more was worth more than the schema promise cost them. The central team was repositioned around the paved road — Cloudera, the registry, NiFi templates, the ownership model — instead of the traffic, which is a better job than being everyone's queue. Where a domain would not commit an owner, I wrote that down instead of shipping a stream with nobody behind it. Those are the streams that lagged later, and recording it early is why that was a known risk rather than a surprise.

**What it cost:** a schema and support obligation on every producing domain, permanently. Domain ownership is an organisational pattern wearing a technical costume; the registry enforces compatibility, it cannot make a domain staff its product.

## Role & stack

Data engineer and technology architect (Accenture CTA group) — designed the platform and guided cross-border delivery teams.

**Stack:** Apache Kafka on Cloudera (CDP), Cloudera Schema Registry, Hive LLAP, Spark 3, NiFi, Hadoop, Elastic Stack.

→ See also [Event-driven & streaming](/en/expertise/event-driven-streaming) and [Data & lakehouse](/en/expertise/data-and-lakehouse).
