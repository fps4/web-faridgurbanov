---
title: Confluent crash course
eyebrow: Hybrid and multicloud, eight modules with labs
summary: How Confluent works between your own data centres and Azure, for integration and platform architects. Cluster Linking, private networking, governance, encryption and access, each with a lab you run yourself.
---

## What this is

The course is built around one situation. An organisation runs mission-critical Kafka on Confluent
Platform in two data centres of its own. Data and AI teams in Azure want the same events, live and
with history, and the operations team wants nobody near its clusters. The course shows how to serve
the cloud from Confluent Cloud on Azure without touching the operational clusters: the links, the
networks, the schemas and the security between them.

Each module has a short video and, in the repository, notes and a lab. The video explains why the
lab is built the way it is. The notes cover the concepts, diagrams, design advice, questions and
answers, and the sources. The lab you run yourself: first with the command line, then the same end
state in Terraform, then teardown.

## Who it is for

Integration and platform architects who design the landscape and then have to defend it. You don't
need to be a Kafka developer. You should know what a topic, a partition and a consumer group are,
and be comfortable with a shell and Docker.

## What it costs to run the labs

Most labs run on your laptop: two small Kafka clusters in Docker stand in for the two data centres.
Some parts need Confluent Cloud, and one session needs an Azure subscription. A new Confluent Cloud
account comes with trial credit, which covers the paid parts if you destroy what you build on the
same day.

Everything was checked against the Confluent and Microsoft documentation in November 2026, on
Confluent Platform 8.4. Facts that depend on version, region or price are marked in the notes, so
you can check them before you repeat them.
