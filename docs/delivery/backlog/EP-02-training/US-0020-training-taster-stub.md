---
title: "US-0020: Training 'book a taster' CTA stub"
persona: architect
status: draft
complexity: S
milestone: M0
last_updated: 2026-06-09
spec: docs/product/FS-0008-training-and-eu-ai-act.md
design: docs/design/decisions/0003-single-site-training-forward-positioning.md
---

## Story

As an L&D buyer browsing in M0,
I want a clear way to signal interest in training even before the full offer is published,
so that I can start a conversation while the section is still being built.

## Context

The M0 slice of FS-0008: a single "book a taster" stub page/section routing to Contact, reachable
from the home page's training CTA (US-0010). The full Training section is M1 (US-0022). Keeps the
brand un-split (ADR-0003) without waiting for the full offer to be ready.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL provide a "book a taster" training stub stating that training is offered and
  routing to Contact (FS-0007).
- THE stub SHALL be reachable from the home page training CTA.
- THE stub SHALL NOT present the full offer ladder, tiers, or EU AI Act content (deferred to M1).
- THE stub SHALL be available in English and Dutch.

## Out of scope

- Two tiers, the offer ladder, the why-me block, and the EU AI Act page — all M1 (US-0021…US-0023).

## Notes

Keep copy honest and minimal; this is a lead-capture placeholder, not the pitch.
