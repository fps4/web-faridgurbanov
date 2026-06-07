---
title: "US-0015: Contact + minimal GDPR/privacy page"
persona: visitor
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0007-contact-and-privacy.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As any visitor ready to start a conversation,
I want a low-friction contact page (including a "book a taster" path) and a short, honest privacy
statement,
so that I can reach the owner on a static site and understand what happens to any data I share.

## Context

Implements FS-0007 — the conversion endpoint every CTA leads into (home US-0010, training stub
US-0020), built to work on a static export with no backend (ADR-0001). Contact exposes an
obfuscated email, profile links, location, and a taster path; any form uses a static-friendly
mechanism (mailto / Formspree / Cal.com). Because the site captures leads on an EU-facing surface,
a minimal honest GDPR/privacy page is linked site-wide. Depends on EP-00.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL provide a contact page exposing an email address (protected against naive
  scraping), professional profile links, and a "book a taster" path, working without a server-side
  backend.
- WHERE a contact form is provided, IT SHALL submit via a static-export-compatible mechanism (no
  self-hosted backend) and SHALL confirm submission to the visitor.
- THE SYSTEM SHALL provide a privacy/GDPR page stating what data is collected, any third-party
  processor used, the lawful basis, retention, and how to make a data request, linked from the
  footer.
- IF the site sets non-essential cookies or runs analytics, THEN THE SYSTEM SHALL present a minimal
  consent affordance; OTHERWISE the privacy page SHALL state that no non-essential cookies are
  used.
- THE contact and privacy pages SHALL be available in both English and Dutch.

## Out of scope

- A CRM, lead-scoring, or marketing-automation integration.
- Per-seat checkout / payments (training Phase 4, separate product).

## Notes

The privacy statement must reflect the actual data flow of the chosen submission mechanism — keep
it minimal and accurate, not boilerplate. Contact + privacy are authored fully bilingually (NL
matters for this audience).
