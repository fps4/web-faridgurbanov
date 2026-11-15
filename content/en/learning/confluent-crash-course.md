---
title: Confluent crash course
eyebrow: Advanced · hybrid and multicloud, eight modules with labs
summary: How Confluent works between your own data centres and Azure, for experienced engineers and architects who already run Kafka in production. Cluster Linking, private networking, governance, encryption and access, each with a lab you run yourself.
---

## Who it is for

Experienced integration, platform and data engineers and architects: people who already run Kafka
or similar messaging in production and now have to design it across their own data centres and a
public cloud. This is an advanced course. Topics, partitions, consumer groups and offsets are
assumed knowledge, and the episodes start from there. You should also be at home in a shell, with
Docker and with Terraform.

## What this is

The course is built around one situation. A mobile operator runs billing, its network operations
centre and customer care on Confluent Platform in two data centres of its own. The data and AI
teams in Azure want the same call records and network events, live and with a year of history, for
fraud and churn models, and the operations team wants nobody putting load on its clusters. The
course shows how to serve the cloud from Confluent Cloud on Azure without touching the operational
clusters: the links, the networks, the schemas and the security between them.

Each module has a video and, in the repository, notes and a lab under the same number. The video
gives the reasoning: the diagrams, what each choice costs, what goes wrong in real estates, and what
to ask the team that runs the platform. The lab follows the video step by step, and where the video
shows a console page or a command's output, the lab is where you produce it yourself: first with the
command line, then the same end state in Terraform, then teardown.

## What it costs to run the labs

Most labs run on your laptop: two small Kafka clusters in Docker stand in for the two data centres.
Some parts need Confluent Cloud, and modules 3, 5 and 6 also need an Azure subscription. A new
Confluent Cloud account comes with trial credit, which covers the paid parts if you destroy what
you build on the same day.

The notes were checked against the Confluent and Microsoft documentation in November 2026, on
Confluent Platform 8.4. Facts that depend on version, region or price are marked, so you can check
them before you repeat them. The labs are being run end to end one module at a time, and each lab
says what has not been tested yet.
