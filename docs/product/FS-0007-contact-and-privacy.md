---
title: "FS-0007 — Contact & privacy/GDPR"
status: draft
last_updated: 2026-11-23
owners: [architect]
related:
  - docs/product/00-product-intent.md
  - docs/product/FS-0009-references.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
maestro:
  feature: contact-and-privacy
  kind: functional_spec
  summary: |
    The conversion endpoint and the legal floor. Contact gives every audience a low-friction way
    to start a conversation (email + links, and a contact/taster path) that works on a static
    site with no backend. Because the site captures training/contact leads, a short, honest
    GDPR/privacy page is needed — minimal, not boilerplate bloat. Since maestro story
    `art-r903t1r2tp` Contact is the last part of the home page, not a page of its own.
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
6. **References (FS-0009)** — WHILE references are published, the privacy page states what a
   reference publishes about a person and how they have it removed. *(Added 2026-09-17; since
   2026-11-23 it names the home page, the name, the role and the link to LinkedIn, maestro story
   `art-2ya5at7k1q`.)*

## Changed by maestro story `art-r903t1r2tp` (2026-11-22)

Follows [ADR-0010](../design/decisions/0010-the-site-has-one-job.md) §5 and §8, which supersede the
Contact page and the taster path above where they differ.

- **Contact is the last part of the home page** (`id="contact"`), not a page. It shows the Contact
  text of the approved site copy, three rows (How I contract, Based, Languages) and three buttons:
  Send an email, WhatsApp, LinkedIn. Every text is verbatim from the approved copy
  (`lib/dictionaries.ts`, `contact`). The Available and Résumé rows come with the résumé story and
  are not shown before it: no row without a value. No rate is shown, and English and Dutch are the
  only languages named.
- **Email and WhatsApp.** The address and the WhatsApp number are put together in the browser; the
  exported HTML holds neither as one string. WhatsApp opens the business number `lib/site.ts`
  holds. The page has no message box, no form and sends nothing.
- **One click.** The header's and the footer's Contact, and every "Start a conversation" button,
  lead to `/<locale>#contact`.
- **The old page.** `/en/contact` and `/nl/contact` (bare, trailing slash, `.html`) answer 301 to
  `/<locale>#contact` (`infra/docker/nginx.conf`, checked by `lib/redirects.test.ts`); the page, its
  route and its sitemap entry are gone.
- **Footer.** The privacy link reads "Privacy · Nothing about you is collected", as approved, and
  leads to the privacy page.

## Out of scope

- A CRM, lead-scoring, or marketing-automation integration.
- Per-seat checkout / payments (training Phase 4, separate product).

## Acceptance criteria (EARS)

- THE home page SHALL end with a Contact part exposing the approved text, the rows How I contract,
  Based and Languages, and the buttons Send an email (address protected against naive scraping),
  WhatsApp and LinkedIn, working without a server-side backend. *(Replaces the contact page and the
  "book a taster" path, 2026-11-22.)*
- WHEN a visitor clicks Contact in the header or the footer, THE SYSTEM SHALL open the Contact part
  of the home page in the same locale; WHEN a visitor opens `/contact` in either locale, THE SYSTEM
  SHALL answer 301 to it.
- THE footer SHALL read "Privacy · Nothing about you is collected", the link leading to the privacy
  page.
- UNTIL the résumé story brings their text, THE Contact part SHALL show no Available row, no Résumé
  row and no row without a value.
- WHERE a contact form is provided, IT SHALL submit via a static-export-compatible mechanism (no
  self-hosted backend) and SHALL confirm submission to the visitor.
- THE SYSTEM SHALL provide a privacy/GDPR page stating what data is collected, any third-party
  processor used, the lawful basis, retention, and how to make a data request, linked from the
  footer.
- IF the site sets non-essential cookies or runs analytics, THEN THE SYSTEM SHALL present a
  minimal consent affordance; OTHERWISE the privacy page SHALL state that no non-essential
  cookies are used.
- WHILE at least one reference is published (FS-0009), THE privacy page SHALL state that the home page
  quotes people with their name, role and a link to LinkedIn, that the same words are
  recommendations on the owner's LinkedIn profile, that each agreed before it went live, and how
  they have it removed. THE privacy page text and its date SHALL be as in the approved copy
  ("Privacy page", 2026-11-23).
- THE contact and privacy pages SHALL be available in both English and Dutch.

## Definition of done

- The Contact part of the home page works end-to-end on the static export (a test message reaches
  the owner via the chosen mechanism).
- A minimal, accurate privacy/GDPR page is linked site-wide and reflects the actual data flow.
- Cookie/consent statement matches the site's actual behavior.
