---
title: Simple first: why I did not build the adapter on a bigger integration product
summary: I advocate simplicity, and I try to avoid extra complexity if it is not needed.
date: 2026-11-22
order: 1
read: Three-minute read
from: [Integration adapter | /en/work/integration-adapter, Cloud gateway | /en/work/cloud-gateway]
---

I advocate simplicity, and I try to avoid extra complexity if it is not needed.

When I designed an integration adapter, I evaluated Boomi and Apache Camel. It might feel that those technologies are way more advanced, and they could potentially be a good fit. But both would require substantial re-training of people before we could introduce them. The stack that I used is native to the company, and the skills were there. It was similar with the API platform: the company was using IBM API Connect, and I evaluated Kong as an open source gateway that I could have adopted.

Usually the successful solution is not based on technical brilliance. It is based on the combination of what the technology can do, what the organization is currently running, where it is ultimately trying to be, and the organizational capacity in terms of people and processes that are in place.

This choice has a price. Teams that are used to code their adapters themselves will question the design decisions. A mapping language like JSONata is not sufficient for the complex logic they have in their own code. They will also say that the platform slows their work and creates an external dependency.

In my view the complex logic falls under integration design rather than under a specific adapter. My approach is to have simpler, decoupled adapters, which can also be shared across the organization.

For example, a fan-out to two parties. I would build it with three adapters. One goes from the source to a topic, in JSON that is conformant to the company standard, and later with a catalogue and a curated schema. The two others go from the topic to the specific destinations. With pub/sub it saves effort overall, once there is a clear catalogue of event topics.

It might take a bit more time and effort from the side of the team. But in the long run it is beneficial for the whole organization and for the team as well: they run faster and have less areas that can break.

And I would rather let a team do it their way if their ask is quite unique, or if it solves a temporary problem during a transition period.
