---
id: G-02
order: 2
title: "Adoption by design"
summary: "Name who can refuse the design, then make saying yes cheaper than staying put."
status: current
revised: 2026-11-08
related: [practice/articles/who-had-to-say-yes, work/cloud-gateway, work/sap-snowflake, work/sap-event-backbone, expertise/stakeholder-alignment]
topics: [adoption, architecture]
tech: []
---

## The rule

Every design that crosses a team boundary gets a short section naming the people who can
refuse it, what they lose, and what will make them say yes. Adoption is designed in from the
first conversation, alongside throughput and availability.

## Why

Cross-team designs rarely die in review. They die on backlogs: a migration that slips a quarter,
an exception request, a team that keeps running what already works. Almost nobody holds a veto
on paper, and twenty polite delays end where one rejection would have, later and at higher cost.

The people who can refuse are usually knowable on day one, and they tend to be four groups:

- the teams who have to change, and already have something that works;
- the function that has to trust the output (finance, risk, security) and carries the
  consequence when it is wrong;
- the team whose scope gets smaller;
- the budget holder behind the system being replaced.

Leave that list unwritten and you discover it anyway, one refusal at a time, in the most
expensive order.

## How I apply it

**Write the block.** Four short paragraphs in every cross-team design: who could refuse this,
named; the real disagreement, stated so the other side would call it fair; the mechanism that
resolved it; and what it cost, with who carries the cost. It takes about twenty minutes.

**Say the unwelcome part first.** Most designs put new work somewhere: a schema promise for an
upstream team, an SLA for a producing domain. Raised in the first conversation, that cost is a
constraint the other team helps shape. Raised at the design review, it is something done to them.

**Make the platform cheaper than staying put.** At a retailer with eighteen to twenty API
gateways and nobody able to order a migration, teams moved because onboarding took minutes and
they no longer had to build and re-certify their own OAuth2 model. Each team did the sum.

**Build the check the sceptic trusts.** Finance adopted a new warehouse once the numbers matched
the ledger they already believed, so I built the reconciliation they could run themselves. That
check was part of the architecture.

**Take the boring half.** Where two teams' scopes stop short of each other, I write the boundary
down for both to comment on and take the unowned part myself: the consumer runtime, the
provisioning, the dead-letter handling. A negotiation turns back into a technical discussion, and
those can be finished.

**Migrate by benefit.** Move the team with the worst current setup first. Their account of the
migration carries further than any review board.

## Trade-offs

- **It costs the architect time** that never shows on a diagram: conversations, a reconciliation
  nobody asked for, a runtime someone else could have owned.
- **A disagreement in writing can harden.** Write it so the other side would sign it, or keep it
  in conversation until you can.
- **Taking the boring half makes you an owner.** Plan who runs it after you leave.
- **Showing the cost early makes a design look more expensive** than a rival that hides it, for a
  while.

## When I'd bend it

- **A mandate exists and the decision is made:** I still write the list, and spend the effort on
  the migration path.
- **Single-team designs:** the block shrinks to one line.
- **A regulator sets the date:** the conversation is about sequence, and the cost still goes on
  the table first.

## Starter templates

```text
## Who had to say yes
Stakeholders:      who could refuse this, by name or role
The disagreement:  their position, in words they would accept
What resolved it:  the mechanism ("we aligned" is not one)
What it cost:      the friction this creates, and who carries it
```
