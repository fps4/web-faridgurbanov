---
title: "US-0011: Selected work — 3–4 case studies + index"
persona: architect
status: draft
complexity: L
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0004-selected-work-case-studies.md
design: docs/design/decisions/0004-public-surface-prerequisites.md
---

## Story

As a recruiter or client,
I want a few concrete, quantified case studies of what the owner has built,
so that I can judge credibility and decide to start a conversation.

## Context

Implements FS-0004 — the highest-converting section and the biggest gap. The set mirrors the proof
points used across the owner's applications: Cloud Gateway, SAP→Snowflake finance migration,
Confluent Kafka data-product platform, and the AI trio. Each follows a consistent structure and is
anonymized where confidentiality requires. Depends on EP-00; AI-trio links respect ADR-0004.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a case-study index linking to 3–4 detail pages, each with a one-line
  hook and a headline impact metric.
- EACH case study SHALL follow a consistent structure: context/problem, what was built, quantified
  impact, role + stack.
- THE set SHALL include the Cloud Gateway study with its scale (~500M+ req/month) and cost-saving
  (~€250–300k/yr) metrics.
- WHERE a study references the repositories, IT SHALL link to the portfolio and respect the honesty
  rule (runnable vs reference; ADR-0004) — no "three production systems" claim.
- WHERE client confidentiality requires, A study SHALL omit/abstract the client while keeping the
  metrics.
- THE case studies SHALL render in English, with Dutch provided or falling back per ADR-0002.

## Out of scope

- Repo card detail (US-0013) and workshop testimonials/`/cases` (M1).

## Notes

Source raw material from `wiki/job-search-and-upskilling/applications/` packages.
