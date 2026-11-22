---
title: When the security requirements do not exist yet
summary: With a UK telecom operator it was interesting, because the security requirements for such a platform were not formalized at that time.
date: 2026-11-22
order: 2
read: Three-minute read
from: [A security data lake for a UK telecom operator | /en/work#earlier-security-data-lake]
---

With a UK telecom operator it was interesting, because the security requirements for such a platform were not formalized at that time.

The previous platform was based on Cisco hardware, which was end of life and needed a replacement. I designed a Kafka-based solution as a replacement of their security log stream, and we did a proof of concept. For them it was a new initiative. They used to work with vendor equipment, and to rely on what other large organizations use. They also realized that the trend is moving towards Kafka-based solutions, and that it would improve their SOC. But this platform is at the core of their security, so they were not rushing into it. It needs to be well thought.

Quickly after I spoke with the head of security, there was a realization: the security requirements from their side need to be formalized first, so that we can address them from the Accenture side. That took a few weeks.

In parallel there was a stream with service management, to understand how the existing processes are going to change for the SOC and for the NOC. Those are internal teams of the operator. The operational support of the platform was expected to be with our offshore team, and engaging them early was also important, because the overall cost of the solution had to be kept as low as possible. The on-site team, including me, was there for steering, designing, prototyping, communicating and aligning. The actual engineering and ops stayed offshore.

After we received the security requirements, we went back to the solution and looked into every aspect of it, to see how we can bring assurance to the operator. One challenge was that Apache Kafka is based on a number of open source libraries, and those libraries are maintained by a community. That increases the risk of a supply chain attack, and it was quite a concern of the security team. There was no solution other than having a proper vendor backing the solution. That is where Cloudera came in, with their contract to support it.

It did end well. Security signed off. Then there was a process of operationalization, where I was not closely involved, but I was kept consulted. That took another year.

If I would start this project again, the first thing I would ask is to receive the formal requirements of all the stakeholders from the very beginning: security, service management, and maybe compliance and risk. Once we have them written, it is very easy to map them to the different solutions and designs that you have in mind.
