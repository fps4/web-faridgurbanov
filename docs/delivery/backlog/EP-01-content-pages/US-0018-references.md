---
title: "US-0018: References from people I worked with, linked to their LinkedIn profiles"
persona: visitor
status: done
complexity: M
milestone: M0
last_updated: 2026-09-20
spec: docs/product/FS-0009-references.md
design: docs/design/decisions/0009-references-as-curated-snapshots.md
---

## Story

As a visitor deciding whether to start a conversation,
I want to read what people who worked with the owner say about the work in the case studies, with
their name, face and a profile I can open,
so that the site's claims about adoption are confirmed by someone other than the owner, and the
site reads as a person others have worked with rather than a page the owner generated.

## Context

The site argues in one voice. The adoption band (FS-0002) and the "Who had to say yes" sections
(FS-0004) are the owner's account of the stakeholders. This story adds the stakeholders' own
account, on three surfaces: inside the case study each reference is about, on a references page
holding the full set, and (two of them) on the home page. The contact page offers the page and a
live introduction on request.

The owner asked for the person's photo and position to be "taken from LinkedIn". There is no route
for that on a static site that keeps its privacy promise (ADR-0009), so each reference is a
markdown file the owner or an agent maintains by hand, with the role copied from the profile
headline and refreshed on review, and the profile link there to check. Consent is part of the ask:
the person sees the rendered card before it goes live.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL read references from `content/references/*.md` (one person per file, flat
  frontmatter, the quote as the body) and SHALL skip drafts.
- EACH reference SHALL link to the person's public LinkedIn profile and SHALL state their position
  as the profile headline shows it and the years worked together.
- WHERE a published reference names a case study, THE case-study page SHALL render it in an "In
  their words" section between "Who had to say yes" and "Role & stack".
- WHERE a reference is `featured` (at most two), THE home page SHALL render it in a band between the
  adoption band and the technical band, linking to its case study and to the references page.
- WHILE at least one reference is published, THE SYSTEM SHALL emit `/references` grouped by case
  study, THE contact page SHALL offer the page and an introduction, and THE footer SHALL list it.
- WHILE none is published, THE surfaces above SHALL render nothing and `/references` SHALL be a
  404.
- THE SYSTEM SHALL fail `npm run test` on a malformed reference (quote length, profile-link shape,
  missing photo file, unknown case study, more than two featured).
- THE SYSTEM SHALL NOT fetch anything from LinkedIn at build or request time, and SHALL NOT load a
  LinkedIn script or image.
- THE chrome (headings, ledes, role line, language note, privacy paragraph) SHALL be EN + NL; the
  quote SHALL be shown in its own language on both, with a note when that differs.

## Out of scope

- Any LinkedIn API, badge, scraping or periodic refresh (ADR-0009).
- Training testimonials (FS-0008, M1).
- Ratings, logo walls, carousels, aggregate counts.

## Delivery (2026-09-17)

Delivered as scoped, shipping dark: `content/references/` holds only the draft template, so the
site builds as before until the first real file lands.

- `lib/references.ts` — loader, parser, validation, sorting; `lib/references.test.ts` validates
  every file in `content/references/` on `npm run test`.
- `lib/sections.ts` — splits a markdown body before its last H2; `ContentArticle` gained a
  `beforeLastSection` slot so the case-study page places the reference without a placeholder in
  the markdown.
- `components/reference-quote.tsx` — one component, three variants (`home`, `article`, `page`);
  photo from `public/references/` or initials; profile link; "Also on my LinkedIn" when `verified`;
  language note when the quote's language differs from the page's.
- `app/[locale]/references/page.tsx`; the home band; the contact block; the footer link — all
  gated on the reference count. The page returns `notFound()` while empty, because the `[locale]`
  layout's params emit the path regardless of the page's own `generateStaticParams`.
- `scripts/voice-check.mjs` skips `content/references/`.
- Privacy page (EN + NL) gained a "References" paragraph; `lastUpdated` bumped.
- `docs/guides/references.md` is the runbook for the ask, the file, the photo and the checks.
- 2026-09-20: `role` switched from "role during the engagement" to the LinkedIn headline, refreshed
  on review, at the owner's request; quotes may hold paragraphs and run to 120 words (featured ones
  stay at 35–75). First two references: Oliver J. Wickens (letter, 2019) and Muktar Bashir (LinkedIn
  recommendation, 2026), both on the Cloudera/Kafka study.
