---
title: Deciding how MCP lands in an enterprise
summary: MCP is being adopted faster than it is being designed, and six decisions are getting made by default rather than on purpose. Whose identity calls downstream, one gateway or many servers, how coarse a tool should be, and the one that surprised me most — the failure that arrives first is not a security failure. It is that connecting more systems makes the assistant measurably worse.
date: 2026-09-07
order: 1
---

# Deciding how MCP lands in an enterprise

The Model Context Protocol went from an announcement to a line item in enterprise AI programmes in about a year. I now regularly read statements of work that say *activate the MCP layer* as though it were a product with an install step.

It is a protocol, and that is the useful thing to hold on to. **MCP is an integration protocol**, so everything an enterprise already learned about integration platforms applies to it, and most of the failure modes have names we have been using for twenty years. There is exactly one genuinely new property: the client is a language model, and a language model cannot reliably tell an instruction from a piece of data. Almost every problem in this article that is *not* an old integration problem descends from that single sentence.

Six decisions. They get made either way; the only question is whether anyone was in the room.

## 1. Whose identity is calling downstream?

This is the decision most often made by accident, because the first server anyone writes uses a service account, and it works.

A service identity means the MCP server holds one credential and acts for everybody. It is fast to build and it quietly deletes your permission model. Every access control list in every downstream system was written about *users*, and you have just introduced a caller that is not one. The assistant can now read anything the service account can read, on behalf of anyone who can reach the assistant.

The alternative is delegated identity: the calling user's identity reaches the downstream system, and the existing ACLs keep doing their job. This is the single most valuable property an enterprise MCP deployment can have, and it is not free. The server has to be a proper OAuth resource server, tokens have to be *exchanged* rather than forwarded — the protocol's own authorization guidance is unambiguous that a server should not accept a token that was not issued for it — and every downstream system has to accept the result. Where a legacy system only speaks service accounts, you end up with a mapping layer, and **that mapping layer is where your permission model actually lives.** It deserves to be designed rather than discovered.

One test settles this. *If the answer to "can this person see this document?" changes when the question is asked through the assistant, the architecture is wrong.* An AI platform must not be a privilege escalation path, and it becomes one by default.

## 2. One gateway, or many servers?

This is the enterprise service bus argument, run again, with new nouns.

Many small servers — one per system, owned by the team that owns the system — give you clean ownership, independent deployment and a contained blast radius. They also give you N connections to manage, tool names that collide across servers, no single point to enforce policy, and no single audit log.

One aggregating gateway gives you the opposite: one connection, one policy decision point, one audit trail. It also gives you one team that every change queues behind. That is the ESB. I am currently helping decommission one, and the reason it is being decommissioned is not that the technology aged badly. It is that a central integration team became the bottleneck for every domain's roadmap.

I have run the same argument on API gateways: twenty-odd fragmented gateways consolidated into one federated platform, about 500 million requests a month, and the thing that made it work was that it was *federated*, not centralised. A thin control plane owned policy, identity and observability. The domains owned their own services and shipped them without asking. Nobody was ordered to migrate; the platform was made cheaper to be on than to stay off.

Federate MCP the same way. Centralise identity, policy and audit — those genuinely belong in one place. Leave the servers with the domains that own the systems behind them.

## 3. Capability, not workflow

Tool granularity decides more about whether an assistant is useful than the model choice does.

Too primitive and you have handed the model a `run_sql` tool and asked it to reconstruct your business logic on every call. It will do this confidently and it will occasionally be wrong in ways nobody catches, because a plausible number does not look like an error.

Too coarse and you have a `handle_incident` tool that does eight things. You have put the agent *inside* the server, and lost the composability that made the protocol interesting in the first place. Now two teams need slightly different incident handling and there is nothing to compose, only a parameter to add.

The right level is the one that has always been right for an API: **a business capability with a contract.** Something a person could describe as a thing they do, with inputs and outputs somebody owns.

The trap is that the cheapest thing to build is a tool per existing REST endpoint. Do that and your tool surface is shaped like your system landscape rather than like the work. Nobody's job is "call endpoint fourteen".

## 4. The context budget is an architecture constraint

This is the one I underestimated, and it is the failure that arrives first.

Every tool definition you expose is spent context. Connect a dozen servers with a couple of hundred tools between them and the model reads a catalogue before it does anything else — and then picks the wrong entry more often than it did when there were twelve. Capability goes up and reliability goes down, and the curve turns earlier than anyone expects it to.

So the first real failure in an enterprise MCP rollout is usually not a breach. It is that the assistant got worse as more systems were connected, which is precisely the opposite of what everyone was promised, and it is very hard to argue with in a steering committee.

The mitigations are ordinary once you accept the constraint: scope the tool surface to the task or the role rather than exposing everything to everyone, namespace aggressively so collisions are visible, and consider a discovery tool that returns a filtered subset rather than shipping the whole catalogue into every session.

The point underneath them is the part worth writing down. **The tool surface is a designed artifact with a budget. It is not an inventory of everything you managed to connect.**

## 5. Read and write are different systems

Now the property that has no precedent in integration architecture.

The model reads content it did not author — a ticket description, a document, an email, a web page — and it cannot reliably distinguish instructions in that content from data in that content. If a session holds both a tool that reads untrusted content and a tool that takes irreversible action, then the untrusted content has a path to the action. That is the confused deputy problem, and the deputy is confused because being helpful is the whole design.

Practically: separate the read surface from the write surface, and do not let them share a session casually. Put a human decision or an explicit policy gate in front of anything side-effecting. Read tools can be generous; write tools should be scarce, specific and logged.

And log the right thing. A transcript of the model's messages is not an audit trail. The record that answers a regulator is **per invocation**: which tool ran, under which user identity, with which arguments, against which downstream system, and what came back. That is a small, boring, structured record, and it is the entire difference between a governed platform and a demo with production data in it.

## 6. The protocol is the asset. The orchestrator is replaceable.

Which brings me to the phrase I keep seeing in statements of work: *the MCP SaaS platform.*

MCP is a protocol. A product that speaks it is an orchestration layer with a vendor's opinions attached, and buying one is often the right call — it buys the governance surface in weeks instead of quarters, and that surface is genuinely the hard part. But it also puts a vendor between your identity provider and your data, and the whole point of a protocol was that the connectors would be portable.

There is one design commitment that keeps the decision reversible: **the servers are yours.** If your MCP servers are plain protocol implementations, owned by the domains, deployed on your infrastructure, then the orchestrator is just a client and clients are swappable. If the servers exist only as configuration inside a vendor's console, you have bought an ESB again — and this time the connectors are not even exportable.

## The test

One question settles most of these designs faster than a workshop does.

*For any answer the assistant just gave: can you say who asked, under whose permissions it ran, which tools were called with which arguments, and what came back?*

If the answer is yes, you have a platform, and the six decisions above were made on purpose. If it is no, you have a prototype with production access, and the gap between those two is not a sprint.
