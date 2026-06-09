---
title: How I get non-technical POs writing specs agents can execute
summary: The difference between a lazy prompt and a spec that directs an agent — and why a product owner who can write the second is a force multiplier for the whole team.
date: 2026-05-20
order: 1
---

# How I get non-technical POs writing specs agents can execute

You've shipped an AI feature. Quick question: did the AI team own the spec, or did the product owner?

For most teams the honest answer is the AI team — and that's the problem. Product owners are surrounded by AI, expected to ship features that use it, and almost never taught the one skill that actually moves the needle: **directing** it. Not prompting it casually. Directing it the way a senior engineer directs a junior — with a spec clear enough to execute against.

## A lazy prompt versus a spec

Here's the demo I run live. Take a real backlog item — say, "let users export their invoices." Hand an agent the lazy version:

> Add an invoice export feature.

You'll get *something*. A button, maybe a CSV. It'll miss the date-range filter, ignore the multi-currency case, invent a file format, and silently skip the empty-state. Now hand it the spec version:

> **WHEN** a signed-in user opens Billing **THE SYSTEM SHALL** offer an "Export invoices" action.
> The export **SHALL** cover a user-selected date range, default to the last 12 months, and include invoice number, date, amount, currency, and status.
> **WHERE** there are no invoices in range, **THE SYSTEM SHALL** show "No invoices for this period" and disable the download.
> Format: CSV, UTF-8, one row per invoice. Out of scope: PDF, scheduled exports.

Same agent, same model. The second output is dramatically better — not because the model got smarter, but because the spec removed the guesswork. The agent didn't have to *decide* what "export" meant; the PO already did.

That's the whole move. The intelligence didn't change. The **direction** did.

## The three things a PO actually needs

Once a PO sees that, the rest follows. I teach three superpowers, and the first carries most of the weight:

1. **Directing AI like a senior engineer would.** Writing a spec an agent can execute: decomposing the work, stating acceptance criteria in testable form, naming what's explicitly out of scope. A prompt is a wish; a spec is an instruction.

2. **Evaluating what comes back.** Moving from "vibe check" to something systematic — acceptance criteria for AI features, a few held-out examples, even an LLM-as-judge for the fuzzy cases. If you can't say what "good" looks like, you can't tell whether the agent delivered it.

3. **Telling real capability from hype.** Reading a vendor claim and sizing it: is this a weekend or a quarter? A PO who can do this stops the team from chasing demos that don't survive contact with production.

## Why this is the same discipline I build with

None of this is a training gimmick. It's exactly how I run delivery with agents. In the `maestro` reference architecture, agents don't merge anything — they propose, and a human disposes, behind functional and technical gates. The spec *is* the contract. The evals *are* the sign-off. Branch protection enforces "humans decide."

A PO who writes specs an agent can execute is operating that same loop at the product level: clear intent in, evaluated output out, a human in control of the gate. That's not a junior skill. It's a force multiplier — one person whose specs make the whole team's agents more effective.

That's the wedge I teach. If your product org is shipping AI features but your POs were never taught to direct or evaluate them, that gap is costing you more than you think — and it's a couple of sessions to close.
