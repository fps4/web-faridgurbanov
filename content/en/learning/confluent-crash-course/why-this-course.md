---
title: "Why this course: transcript"
---

## The situation

Hi, I'm Farid. I'm an integration and data architect, and this is a short course on Confluent Kafka in a hybrid setup.

Picture a mobile operator that runs Kafka in its own two data centres. Billing, the network operations centre and customer care all depend on it, so it's mission-critical.

Data and AI teams work in Azure, and for fraud detection and churn models they need the same real-time data.

The operations team is rightly concerned about opening their clusters to the cloud: about security, and about extra load on the brokers that run the business.

This course is about giving the cloud the data without putting the operational clusters at risk.

## Who it is for

This is an advanced course. It's for engineers and architects who already run Kafka, or something like it, in production, and now have to design it across their own data centres and a public cloud.

So I won't explain topics, partitions or consumer groups. I'll assume you know them, and that you're at home in a shell, with Docker and with Terraform.

What you get here is the reasoning: why we copy data with a cluster link, why the data centre dials out to the cloud, and why one schema ID can break every consumer in Azure.

And for each choice, three things: what it costs, what goes wrong in real estates, and which questions to ask the team that runs the platform.

## How a module works

Every module has the same number in three places: this video, and the notes and the lab in the repository.

The video gives you the reasoning and the diagrams. The notes go deeper: concepts, design advice, questions and answers, and the sources. And the lab follows the video step by step, so when I show a console page or a command's output, you then produce it yourself.

The labs share one rhythm. First you build it with the command line, so you see every step. Then the same thing in Terraform, because that's how you'd run it for real. Then you tear it down.

Most labs run on your laptop, with two small Kafka clusters in Docker standing in for the two data centres. Some parts need Confluent Cloud, and a new account comes with trial credit that covers them, as long as you destroy what you build on the same day.

## The eight episodes

There are eight modules, and one video for each.

We start with the hardest question: how does data get out of the data centre at all? That's cluster linking and schema linking.

Then we widen out: copies, failover and the way back; networking on Azure, and why Kafka doesn't fit through a load balancer; governance, so that teams who don't know each other can share streams; encrypting single fields; identity and access with Entra ID; and running all of it as a shared platform.

At the end we go one layer down, into the Kafka internals that force these decisions.

Each video stands on its own, but the labs build on each other, so do them in order.

## Facts that change

One last thing before we start.

Confluent moves fast: cluster types, networking models, prices change.

Make sure you check it for your designs.

Let's start.
