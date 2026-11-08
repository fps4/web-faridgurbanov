---
id: G-01
order: 1
title: "Documentation in three layers"
summary: "One map (HLD), one logbook (ADRs), and code for the rest."
status: current
revised: 2026-11-08
related: [expertise/architecture-decisions, G-03]
topics: [architecture]
tech: []
---

## The rule

Keep one thin, living high-level design that shows the shape of the system.
Record every decision that is expensive to reverse as an ADR. Write a
low-level design only where the code cannot speak for itself.

## Why

Architecture documents fail in two predictable ways. The big design document
goes stale within a quarter, because it tries to describe the system and
justify it at the same time. And the teams that react by recording only
decisions end up with eighty records and nobody who can explain the system
end to end. The first loses the *what*. The second loses the *whole*.

Splitting the job fixes both. The map describes. The logbook justifies.
Neither has to do the other's work.

## How I apply it

**The map: a high-level design (HLD).** It answers *what does the system look
like now?* I keep it to the sections people read:

1. Goals, scope and what is explicitly out of scope
2. Quality attributes and constraints (availability, latency, security,
   compliance, cost)
3. Context: the system as a black box with its users and neighbours
4. Building blocks: the major containers, stores and integration points
5. The critical runtime flows
6. Deployment and network zones
7. Cross-cutting concepts: identity, security, observability, data ownership
8. Risks and open questions
9. Links to the decisions

It changes when the shape changes, which is a few times a year. If a paragraph
starts with *"we chose X because…"*, it does not belong here. It belongs in an
ADR, with a link.

**The logbook: architecture decision records (ADRs).** One decision per
record, one or two pages, append-only. A decision that changes is not edited;
it is superseded by a new record that points back. Each record holds:

- Status: proposed, accepted, deprecated, superseded by …
- Context and the forces at play
- The options considered, with pros and cons for each
- The decision, in active voice
- Consequences: what gets easier, what gets harder, what follow-up it creates

The rejected options matter most. They are what people forget first, and what
the next architect will propose again.

I write an ADR when a decision is costly to reverse or likely to be
questioned later, at any level: "events, not synchronous calls, between
domains" and "optimistic locking on the order table" both qualify.

**The detail: low-level design (LLD), mostly as code.** Component internals,
API contracts, schemas and configuration change weekly. A separate document
for them drifts within a sprint. So the contract *is* the design: OpenAPI and
AsyncAPI specs, schema files, infrastructure as code, contract tests. These
cannot drift from what runs.

I still write a prose LLD where business meaning lives outside the code:
field-level mappings between enterprise systems, regulatory calculation
rules, and contracts between teams that do not share a repository.

**Where it lives.** In the repository, next to the code, reviewed through pull
requests, with diagrams as code. For a system that spans many repositories,
the HLD and the cross-cutting ADRs live in one architecture repository that
everyone links to.

## Trade-offs

- **Repositories exclude people.** Risk, compliance and business owners rarely
  open one. Publish a rendered view they can read and comment on.
- **ADR discipline drifts both ways.** Trivial decisions get recorded, and big
  ones get skipped because they felt obvious at the time. A short review
  question helps: *would a new architect ask why?*
- **Thin documents assume a reader with context.** A newcomer may need a guided
  walkthrough on top of the HLD, not instead of it.
- **Executable specs show the contract, not the intent.** An OpenAPI file says
  what a field is called, not what the business means by it.

## When I'd bend it

- **Regulated delivery:** I add approver and compliance impact to every ADR.
  An auditor cares more about traceable reasoning than a polished document.
- **Contractual deliverables:** when a client contract requires a formal LLD,
  it gets written, generated from the specs where possible so it cannot
  drift on its own.
- **Very small systems:** one page of HLD and a handful of ADRs is enough.
  Ceremony should scale with the cost of being wrong.

## Starter templates

**ADR**

```text
# ADR-NNN: <decision in a few words>
Status: Proposed | Accepted | Superseded by ADR-MMM
Date: YYYY-MM-DD   Deciders: …   Approver: … (regulated contexts)

## Context
## Decision drivers
## Options considered
### Option A: pros / cons
### Option B: pros / cons
## Decision
## Consequences
## Compliance impact (regulated contexts)
```

**HLD outline**

```text
1. Goals and scope   2. Quality attributes and constraints
3. Context           4. Building blocks
5. Runtime flows     6. Deployment
7. Cross-cutting     8. Risks and open questions
9. Decisions (links to ADRs)
```
