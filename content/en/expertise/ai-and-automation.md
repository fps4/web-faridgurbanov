---
title: AI & automation
summary: Integrating AI into enterprise systems the way anything else gets integrated — behind a contract, with an evaluation gate before release, and with the model kept outside the runtime so it can be replaced.
evidence: [portfolio, cloudera-kafka]
order: 5
group: domain
---

# AI & automation

This area is listed last on purpose. It is real work and I do it, but it is not what I am selling, and a page that leads with AI usually means the rest of the estate has not been thought about. My position is a fairly boring one: an AI capability is integrated like any other supplier system — behind a contract, with a gate before release, and with the vendor kept replaceable.

## What I do

- **Put the model behind a contract.** A typed capability the caller talks to, so the model, the prompt and the vendor can all change without the caller noticing. Most AI work that becomes unmaintainable skipped this step.
- **Make evaluation a release gate, not a report.** Golden sets and scored checks wired into CI, so a behaviour regression blocks a deploy the way a failing test does. This is the same move as schema-compatibility rules in a registry: trust moves out of a review meeting and into the platform.
- **Keep the model outside the runtime.** Generation behind a versioned API rather than a model client compiled into the product, so today's caller can be a person and tomorrow's can be an API.
- **Treat agent access as authorization.** An agent operating a management plane should use the same audited contract a person uses, not a side door.
- **Ground the answer, and let it refuse.** A model answering questions over business data resolves to a defined metric or it declines — it never composes the query itself. A refusal costs a round trip; a plausible number computed under a definition the asker did not have in mind costs a decision, months later, taken by someone who was not in the room.

## Evidenced by

- [Portfolio](/en/portfolio) — `skills-coach` ships **no model client at all**: the runtime owns the packs, the deterministic grading, the spaced-repetition gating and a durable model of what a learner keeps getting wrong. Generation and correction sit behind a versioned API, so the caller can be a person with an LLM CLI today and a model API later, and nothing else moves. That is the whole argument on this page, in one repository.
- [Portfolio](/en/portfolio) — `identity-service` exposes the same audited management plane over HTTP and over MCP, so an agent operates it under exactly the same contract as a person. Agent access is an authorization question, not a new category of software.
- [Portfolio](/en/portfolio) — `ai-first-bi-platform` is this page's argument applied to analytics. The model has no path to a raw table: it resolves a question to a metric in the registry or it declines, and every answer carries the definition, its owner and the tests that gated it. The same 24 business questions asked over the raw schema and over the registry come back 21 of 24 confidently wrong against 0 of 24 — and the governed path answers only 14 of the 24, which is the cost and is reported in the same table. The 21 are a property of the schema, not of the model asking: a better model writes better SQL against the same tables and reaches the same wrong answers sooner.
- [Kafka data-product platform on Cloudera](/en/work/cloudera-kafka) — schema compatibility rules moved trust from a review meeting into the platform. Evaluation gates do the same job for model behaviour, and the reason I reach for them is that I have watched the pattern work on schemas first.

Background: DeepLearning.AI Agentic AI (2025); 20+ years building data and ML systems.
