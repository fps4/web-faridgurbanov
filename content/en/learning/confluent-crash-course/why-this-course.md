---
title: "Why this course: transcript"
---

## The situation

Hi, I'm Farid. I'm an integration and data architect. This is a short course on Confluent in a hybrid setup.

An organisation runs Kafka in its own two data centres and it's mission-critical.

Data and AI teams work in Azure.

For new business cases they need access to the same real-time data.

The ops team is rightly concerned opening public access to their clusters.

This course is about giving the cloud the data without putting the operational clusters at risk.

## Who it is for

The course is for integration and platform architects. People who design the landscape.

You don't need to be a Kafka developer. You should know what a topic, a partition and a consumer group are. And you should be comfortable with a shell and with Docker.

What you get here is the reasoning. Why we copy data with a cluster link. Why the data centre dials out to the cloud. Why a schema ID can break every consumer in Azure.

For each choice, three things. What it costs. What goes wrong in real estates. And which questions to ask the team that runs the platform.

## How a module works

Every module has two parts in the repository.

The notes. Concepts, diagrams, design advice, questions and answers, and the sources.

And a lab you run yourself. The labs follow one rhythm. First you build it with the command line, so you see every step. Then you build the same thing in Terraform, because that's how you would run it for real. Then you tear it down.

Most labs run on your laptop. Two small Kafka clusters in Docker stand in for the two data centres. Some parts need Confluent Cloud.

A new account comes with trial credit, and that covers them, as long as you destroy what you build on the same day.

These videos are the third part. They don't repeat the lab. They explain why the lab is built the way it is.

## The eight episodes

There are eight modules, and one video for each.

We start with the hardest question. How does data get out of the data centre at all? That's cluster linking and schema linking.

Then we widen out.

Copies, failover, and the way back.

Networking on Azure, and why Kafka doesn't fit through a load balancer.

Governance, so that teams who don't know each other can share streams.

Encrypting single fields.

Identity and access with Entra ID. Running all of it as a shared platform.

And at the end we go one layer down, into the Kafka internals that force these decisions.

You can watch them in any order. Each episode tells the whole story of its own topic.

## Facts that change

One last thing before we start.

Confluent moves fast: cluster types, networking models, prices change.

Make sure you check it for your designs.

Let's start.
