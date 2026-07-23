---
title: The AI trio — govern, build, deliver
summary: Three sibling repositories told as one story — govern the models, build a trustworthy agentic product, deliver software with agents. The proof that I build AI, not just advise on it.
hook: One govern→build→deliver story across three repositories.
metric: govern → build → deliver
order: 4
---

# The AI trio — govern, build, deliver

This is the proof behind the [AI & automation](/en/expertise/ai-and-automation) positioning: not slideware, but working code and reference architectures you can read. Three sibling repositories form one coherent stack.

## The story

- **Govern & route — `sovereign-llm-gateway`.** An LLM gateway with per-agent cost and budget enforcement, vendor abstraction, a local-model fallback for sovereignty, and Prometheus observability. **This one runs end-to-end** (`docker compose up`).
- **Build — `sovereign-copilot`.** A reference architecture for a trustworthy agentic product: deterministic tool contracts (MCP), retrieval grounded in your data, L1–L4 evaluation gates with goldens, and answers that trace to a recorded call chain.
- **Deliver — `maestro` (MIT).** A reference architecture for spec-driven delivery: agents propose, humans dispose, with functional and technical gates enforced through GitHub branch protection.

## The honest part

One of these runs end-to-end today; the other two are **reference architectures**. They are **not** three production systems, and I won't present them as such. That honesty is the point — it's the same discipline I bring to a client's AI programme.

## The pattern behind it

![Diagram: three stages — govern (sovereign-llm-gateway: budgets, vendor abstraction, sovereign fallback), build (sovereign-copilot: tool contracts, retrieval, eval gates L1–L4), deliver (maestro: agents propose, humans dispose). Trust lives in the platform, not in meetings.](/diagrams/ai-trio-pattern.svg)

**Separation of powers, applied to AI.** The default shape of an "AI platform" initiative is one project that mixes model access, product logic and delivery automation — which means nothing can be governed, evaluated or swapped independently. The trio splits it along the lines that actually move at different speeds: models churn monthly, products quarterly, delivery practice yearly.

Two decisions carry the pattern:

- **Govern at the choke point, not in a policy doc.** Budgets, vendor abstraction and the sovereignty fallback live in the gateway — the one place every model call passes. Governance you can `docker compose up` beats governance you circulate as a PDF.
- **Eval gates are the schema registry of AI.** L1–L4 gates with goldens do for agent behaviour what schema compatibility rules did for Kafka producers [in the Cloudera case study](/en/work/cloudera-kafka): they move trust from review meetings into the platform, so change can be fast *and* safe.

The honest part above still applies — one of the three runs end-to-end, two are reference architectures. The pattern is the claim; the labels say how much of it is proven.

## Why it matters

Together they map onto how I run AI delivery for real: govern the models, build a product you can trust on top of them, and deliver software with agents under human control.

→ See the repositories on the [portfolio](/en/portfolio) (links open once the public-surface prerequisites close).
