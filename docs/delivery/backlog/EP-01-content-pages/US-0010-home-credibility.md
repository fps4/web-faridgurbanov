---
title: "US-0010: Home — credibility hero + taster CTA stub"
persona: architect
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0002-home.md
design: docs/design/decisions/0003-single-site-training-forward-positioning.md
---

## Story

As a recruiter, L&D buyer, or client landing cold,
I want a home page that says within seconds what the owner does and how to start a conversation,
so that I can decide to reach out or read deeper.

## Context

The M0 (credibility) slice of FS-0002. Leads with the integration-architect-who-builds-AI
positioning, an "available now" signal, a proof strip into case studies/portfolio, and a single
understated "book a taster" training CTA. Built so the M1 training-forward flip is a config/content
change (US-0021), not a rebuild (ADR-0003). Depends on EP-00.

## Acceptance criteria (EARS)

- THE home page SHALL lead with the credibility hero (integration-architect-who-builds-AI) and
  display an "Available now" block.
- THE home page SHALL present training as a single understated "Book a taster" CTA routing to the
  Training stub, and SHALL NOT foreground the offer ladder in M0.
- THE home page SHALL provide primary CTAs into Selected Work and Contact, and a proof strip
  linking at least two case studies and the portfolio.
- THE home page SHALL be fully available in English and Dutch.
- THE home page SHALL be structured so switching to the M1 training-forward emphasis is a
  configuration/content change, not a structural rebuild.

## Out of scope

- The training-forward variant content (US-0021) and case-study/portfolio detail (US-0011/US-0013).

## Notes

Highest-traffic page — author NL fully here rather than relying on fallback.
