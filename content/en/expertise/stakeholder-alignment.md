---
title: Working across an organisation
summary: The part of the job that decides whether an architecture ships. Teams that report elsewhere, functions that have to trust a number, and vendors somebody signed four years ago. Influence without authority, with the situations written out.
evidence: [cloud-gateway, integration-platform, sap-event-backbone, sap-snowflake, cloudera-kafka]
order: 7
group: practice
---

# Working across an organisation

An architecture nobody agreed to is a diagram. The hard part of my work is rarely the design. It is the twenty teams who each already have something that works, the finance director who has to trust a number before signing off on it, and the vendor contract somebody signed four years ago. Most of this I have done without the authority to tell anyone what to do.

## How I do it

- **Make the platform cheaper than the alternative.** Teams move when moving is the easier option: self-service onboarding, a security model they no longer have to build themselves. Ask for a mandate and you usually get twenty exceptions. A better road gets you adoption.
- **Design for the people who have to trust the output.** Finance does not adopt a warehouse because the architecture is elegant. They adopt it when the numbers match the ledger they already believe. So I try to name early who has to trust the result, and then build the check that earns it. I treat that as part of the design.
- **Assess before I prescribe.** Arriving at another team's platform with a roadmap they did not ask for does not work. I read the estate first and write down what I found, so the priorities can be discussed. An assessment a team can disagree with is more useful than a recommendation they can ignore.
- **Write the decision down where it can be challenged.** Architecture decision records, C4 diagrams, and the trade-off in plain language, including what the choice costs. Agreement holds when people can see what was given up and why. It falls apart when the reasoning stays in one architect's head.
- **Say the unwelcome part early.** If a design puts extra work on a team that had none, or if my own experience stops somewhere, that conversation goes better at the start than at the review.
- **Take the boring half myself.** The quickest way to end an argument about ownership is to volunteer for the part nobody wants: the dead-letter handling, the reconciliation report, the migration runbook. After that the discussion is usually technical again, and technical questions can be answered.

## Five situations, and how they went

### Twenty teams, and no authority to move any of them

Eighteen to twenty product teams each owned a working API gateway. Consolidating them was the right architecture and a hard sell, because every team would give up something they controlled in exchange for a dependency on a central team, and nobody could order that exchange.

Asking for a mandate would have produced twenty exceptions and one slow backlog, so I did not ask for one. Instead the platform had to be cheaper for a team than staying where it was: Terraform onboarding that took minutes, one OAuth2/JWT model they no longer had to build and re-certify themselves, dashboards they did not have to wire up. Security got one auth model to review instead of twenty, so a function that could have blocked the design became one of its main supporters. Finance got a decommissioning number for the old contract that paid for the programme.

One more thing helped, and I would do it again. I chose the migration order by who benefited most. The first two teams on the platform were the ones with the worst existing setup, and they became the reference other teams asked; their opinion carried further than any architecture review I could have organised.

→ [Cloud Gateway](/en/work/cloud-gateway)

### Three teams, three definitions of "done"

An SAP estate, a legacy IBM ESB estate and an AWS-native platform, run by three teams that share no tooling and no vocabulary. For the SAP side the job ended at "the events are on the broker". For the cloud side the job started at "we consume what is on the broker". Everything that mattered (naming, versioning, ordering, and what happens when something fails) sat in the gap between those two sentences, and neither team was wrong about its own scope.

I did not try to decide who owned it. I wrote the envelope and subscription contract as a document each team could comment on, and I took the AWS-side consumer runtime, the provisioning and the dead-letter behaviour myself. Once the boundary existed as a document, the disagreement became technical, and we could work through it.

The ESB team needed a bit of care, because they were being asked to help design the replacement for their own estate. What I said to them was simply true: they know which interfaces really carry load, and without that knowledge a decommissioning sequence is not safe. It was not a diplomatic line, and I think they would have noticed if it had been.

→ [SAP event backbone](/en/work/sap-event-backbone)

### A finance organisation that had no reason to believe me

A new Snowflake warehouse for SAP Finance ledgers across roughly thirty company codes. Finance already had a ledger they trusted, and my architecture offered them a second source of numbers plus a request to believe it. Explaining the pipeline was never going to change that, and I stopped trying fairly early.

What changed it was a reconciliation Finance could run themselves, comparing the loaded data against the source ledger. Adoption followed the check. On the SAP side, I did the source-to-target mapping together with their architects instead of handing them a specification. The extraction strategy had to protect the load on their system, and their constraint shaped the design. That also gave me the thing I needed most from them: a named owner behind the data contract, willing to answer for it when it breaks.

→ [SAP S/4HANA Finance → Snowflake](/en/work/sap-snowflake)

### Reviewing another team's production code without owning the team

A data-science team asked for a review of their production ML and analytics pipelines. The output of a review like that is criticism of work people are proud of, written by someone with no authority over them who can easily be wrong about their domain.

Two things kept it useful. The findings were ranked and costed rather than complete: a list of forty items reads like an accusation, a list of six in priority order reads like a plan. And the recommendations were written against what the team was already trying to do (move off notebook-only code, separate dev from prod, get compliance tagging in place), not against a platform ideal they never signed up for. A roadmap somebody can start on Monday is worth more than a correct assessment nobody owns.

### Saying the unwelcome part before it becomes an incident

On a Kafka data-product platform, productising a stream means the producing domain accepts consumers it never asked for, plus a schema promise and an SLA. Several domains read that as work moving onto their plate to solve somebody else's problem, and they had a point.

There was a real trade in return and I put it first: compatibility rules in the Schema Registry meant a producer could ship a change without going through a change board. For a producing team, losing that meeting was worth more than the schema promise cost them. Where a domain would not commit a named owner, I wrote that down instead of shipping a stream with nobody behind it. Those are the streams that lagged later. Having it written down from the start meant nobody was surprised a year on.

→ [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka)

## Working part-time and still owning the architecture

An architect who is there two or three days a week is a stakeholder question before it is a technical one, because decisions have to keep moving on the days I am not there. What makes it work is agreeing the way of working up front: a named counterpart on the client side, a written decision log so decisions do not only exist in meetings, and a clear line between what the team decides without me and what waits.

Set up that way, a part-time seat produces an architecture the team can carry themselves, which is the only kind that survives the end of a contract anyway.

## Evidenced by

- [Cloud Gateway](/en/work/cloud-gateway): 18–20 product teams onto one federated model and an IBM API Connect exit, with onboarding cut from days to minutes. Adoption bought with developer experience rather than authority.
- [Integration platform](/en/work/integration-platform): domain teams gave up integration code they controlled, and adopted the platform because it gave them more operational control than they had before.
- [SAP event backbone](/en/work/sap-event-backbone): three platform teams and three estates brought onto one event contract, with the boundary written down before either side wrote code.
- [SAP S/4HANA Finance → Snowflake](/en/work/sap-snowflake): reconciliation against the source ledger so Finance would trust the numbers, and source-to-target mapping agreed with the SAP-side architects.
- [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka): 20+ productised streams across 30+ source systems, which meant negotiating domain ownership with the teams that produced the data.

Background: TOGAF 9 Certified; Accenture Certified Technology Architect; architecture decision records and C4 as working practice. I also teach architecture and product teams the same skill, with the stakes moved.
