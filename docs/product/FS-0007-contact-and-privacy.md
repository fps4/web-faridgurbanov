---
title: "FS-0007 — Contact & privacy/GDPR"
status: draft
last_updated: 2026-06-09
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
maestro:
  feature: contact-and-privacy
  kind: functional_spec
  summary: |
    The conversion endpoint and the legal floor. Contact gives every audience a low-friction way
    to start a conversation (email + links, and a contact/taster path) that works on a static
    site with no backend. Because the site captures training/contact leads, a short, honest
    GDPR/privacy page is needed — minimal, not boilerplate bloat.
---

# FS-0007 — Contact & privacy/GDPR

- **Status:** draft
- **Raised:** 2026-06-07
- **Owner:** @farid (architect)
- **Decision:** [ADR-0001](../design/decisions/0001-tech-stack-and-static-export.md)

## Why

Every CTA on the site leads here; it must work on a static export (no server) yet still let a
recruiter, L&D buyer, or client reach the owner with minimal friction — including a "book a
taster" path. Capturing any contact/lead data on an EU-facing site requires a short, honest
privacy/GDPR statement, which the earlier "cut privacy entirely" position got wrong for this use.

## Scope

1. **Contact page** — email (obfuscated against scraping), LinkedIn/GitHub links, location, and a
   clear "book a taster" entry for the training audience.
2. **Static-compatible submission** — any form uses a static-friendly mechanism (mailto, or a
   third-party form/booking endpoint such as Formspree/Cal.com); no self-hosted backend.
3. **Privacy/GDPR page** — minimal and honest: what (if anything) is collected, by which
   third-party processor, lawful basis, retention, and contact for data requests. Linked from the
   footer.
4. **Cookie/consent** — if no analytics or non-essential cookies are used, state that plainly; if
   any are added, a minimal consent affordance is required.
5. **Bilingual** — EN + NL (contact and privacy matter to the NL audience; ADR-0002).

## Out of scope

- A CRM, lead-scoring, or marketing-automation integration.
- Per-seat checkout / payments (training Phase 4, separate product).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL provide a contact page exposing an email address (protected against naive
  scraping), professional profile links, and a "book a taster" path, working without a
  server-side backend.
- WHERE a contact form is provided, IT SHALL submit via a static-export-compatible mechanism (no
  self-hosted backend) and SHALL confirm submission to the visitor.
- THE SYSTEM SHALL provide a privacy/GDPR page stating what data is collected, any third-party
  processor used, the lawful basis, retention, and how to make a data request, linked from the
  footer.
- IF the site sets non-essential cookies or runs analytics, THEN THE SYSTEM SHALL present a
  minimal consent affordance; OTHERWISE the privacy page SHALL state that no non-essential
  cookies are used.
- THE contact and privacy pages SHALL be available in both English and Dutch.

## Definition of done

- Contact page works end-to-end on the static export (a test message reaches the owner via the
  chosen mechanism).
- A minimal, accurate privacy/GDPR page is linked site-wide and reflects the actual data flow.
- Cookie/consent statement matches the site's actual behavior.
