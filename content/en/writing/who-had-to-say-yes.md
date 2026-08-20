---
title: Who had to say yes
summary: Every architecture has a list of people who can quietly refuse it — the teams, the functions, the budget holders. Most designs never write that list down, and I think that is why so many correct architectures never ship. A way of designing for adoption instead of hoping for it.
date: 2026-08-20
order: 1
---

# Who had to say yes

Ask an architect why a design failed and you usually get a technical answer: the wrong broker, the wrong boundary, a performance assumption that did not hold. Ask the teams who were supposed to use it and the answer is different, and it is almost always a version of *nobody asked us, and we already had something that worked*.

I have spent about twenty years designing platforms in organisations where I could not tell anyone what to do. In that time the limiting factor has almost never been the diagram. It has been the list of people who had to agree.

## Every design has that list, whether you write it down or not

For any architecture that crosses more than one team, there is a group of people who can refuse it. Not formally — almost nobody has a veto on paper. They refuse it by putting the migration lower on their backlog, by asking for an exception, by continuing to run what they already have, or by never quite getting to the ticket. Twenty polite non-refusals end up in the same place as one rejection, only much later and after more money has been spent.

That group is usually knowable in advance, and it tends to be four kinds of people:

- **The teams who have to change.** They already have something that works. Your design asks them to give up something they control in exchange for a dependency on you.
- **The function that has to trust the output.** Finance, risk, security, clinical — whoever uses the result and carries the consequence when it is wrong.
- **The team whose scope gets smaller.** Every consolidation reduces somebody's remit, and it is often the people who know the estate you are replacing better than anyone.
- **The budget holder behind the incumbent.** Somebody signed the contract you want to exit, and they had reasons for signing it.

Writing that list down during design costs an hour. Not writing it down costs much more, because you will discover the list anyway — one refusal at a time, usually in the most expensive order.

## Adoption is a property of the design, not a phase after it

When a design meets resistance, the reflex is to escalate: get a mandate, take it to the architecture board, ask an executive to tell people to comply. In my experience that reliably produces two things — a policy nobody reads, and a list of exceptions that grows faster than the migration.

The alternative is to treat adoption as something the architecture itself has to produce, and to design for it as seriously as you design for throughput.

**Make the paved road cheaper than staying put.** When I consolidated eighteen to twenty API gateways at a Dutch retailer, nobody had the authority to order a migration. What moved teams was arithmetic: onboarding in minutes instead of days, one OAuth2/JWT model they no longer had to build and re-certify, and dashboards they did not have to wire up themselves. Each team did the sum and moved. The security function got one auth model to review instead of twenty, which turned a possible blocker into one of the design's main supporters.

**Build the thing that earns trust, not the thing that argues for it.** A finance organisation moving onto a new warehouse does not adopt it because the architecture is elegant. They adopt it when the numbers match the ledger they already believe. On a SAP-to-Snowflake programme I stopped explaining the pipeline fairly early and built the reconciliation that Finance could run themselves instead. Adoption followed the check, not the presentation. That reconciliation was not a change-management activity added at the end. It was part of the architecture, and it was the part that decided the outcome.

**Take the boring half yourself.** Arguments about ownership between teams are hard to settle on the merits, because usually both sides are right about their own scope. Connecting a SAP event backbone to a cloud integration platform, the SAP team's job ended at "the events are on the broker" and the cloud team's job started at "we consume what is on the broker" — and every question that actually matters lived in between. I did not try to decide it. I wrote the seam down as a document each team could comment on, and I took the consumer runtime, the provisioning and the dead-letter handling myself. Volunteering for the part nobody wants turns a negotiation back into a technical discussion, and technical discussions can be finished.

**Migrate by benefit, not by ease.** The instinct is to move the easiest team first, to get an early win. I think it is usually better to move the team with the worst existing setup, because they become the reference other teams ask, and a colleague's account of the migration carries further than any architecture review you can organise.

## Say the unwelcome part at the start

Almost every cross-team design puts new work somewhere. A data contract at a source seam gives the upstream team a schema promise they never had, and no incentive arrives with it. Productising a data stream means the producing domain accepts consumers it did not ask for, plus an SLA. These are real requests, and pretending otherwise is obvious to the people you are asking.

Timing is what decides how they land. Raised at the start, an unwelcome trade-off is a constraint the other team helps shape, and they usually improve it. Raised at the design review, the same trade-off is something you did to them, and now they also have to explain to their own manager why they agreed to it. The content is identical. The reaction is not.

So I try to put the cost on the table in the first conversation, including the part that makes my own design look more expensive. It is uncomfortable, and it is cheaper than the alternative.

## What this looks like in a document

I now write a short block into every cross-team design, and into every case study I publish, under a heading that is not clever: **Who had to say yes.** Four paragraphs, no more.

- **Stakeholders** — who could refuse this, named specifically.
- **The disagreement** — the real one, written so that the other side would find it fair. If you cannot state their position in words they would accept, you probably do not understand it yet.
- **What resolved it** — the mechanism, not the feeling. "We aligned" is not a mechanism. "Finance could run the reconciliation themselves" is one.
- **What it cost** — the friction the design created, and who carries it. A design that looks free was not analysed properly.

It takes about twenty minutes, and it changes the conversation, because it moves the hardest part of the work out of one architect's head and into a document that other people can argue with. Which is most of the job. An architecture that nobody agreed to is only a diagram.

→ The case studies on this site each carry that block — [Cloud Gateway](/en/work/cloud-gateway), [the SAP event backbone](/en/work/sap-event-backbone), [SAP Finance → Snowflake](/en/work/sap-snowflake) and [the Cloudera data-product platform](/en/work/cloudera-kafka). The way of working behind them is written up under [working across an organisation](/en/expertise/stakeholder-alignment).
