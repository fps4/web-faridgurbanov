---
title: "0008: Selected work and Expertise indexes redesigned; WhatsApp scoped back to Contact"
status: accepted
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/design/decisions/0007-front-page-three-bands-and-portfolio-focus.md
  - docs/product/FS-0003-expertise.md
  - docs/product/FS-0004-selected-work-case-studies.md
  - docs/delivery/backlog/EP-01-content-pages/US-0016-whatsapp-deep-link.md
---

# ADR-0008 — Index redesign for Selected work and Expertise

## Context

After ADR-0007 both index pages were reviewed on the live site and both read poorly, for different
reasons.

**Selected work** had become a table of contents rather than a portfolio. Four rows of roughly 90px,
each two-thirds empty, with the headline metric — the strongest asset on the page — set small and
grey at the right edge, visually subordinate to the title. The same numbers are set large on the home
page and land hard. All four rows were visually identical, so nothing signalled that Cloud Gateway is
the canonical proof point. The page's own lede promised "clients are named where I may; abstracted
where confidentiality requires" and then showed no client or abstraction at all. And "Who had to say
yes" — the differentiator the whole ADR-0005 repositioning rests on — was invisible until a visitor
opened a case study.

**Expertise** carried a visible defect: five domain areas in a two-column card grid leave a stray
empty cell, which renders as a grey block. Beyond that, seven near-identical cards gave "Working
across an organisation" — the page's argument — the same weight as "APIs & gateways", so the
deliberate practice-before-domains ordering was carried by sequence alone, and readers do not
register sequence.

## Decision

1. **Selected work carries the studies rather than listing them.** Four client engagements is few
   enough for the index to be the page. Each row now shows the metric at display size, the abstracted
   client, the hook, **the disagreement**, and the stack. All from frontmatter (`short`, `client`,
   `disagreement`, `role`, `stack`), so a new study needs no code change.
2. **The disagreement appears at index level.** A visitor who never opens a case study should still
   see that these engagements were argued about — that is the claim the site exists to make.
3. **The Expertise index becomes deliberately asymmetric.** Practice renders as two large feature
   cards on a tinted ground; the five domain areas render as a compact one-line-per-area list. This
   makes hierarchy visible rather than implied, and removes the empty-cell defect by removing the
   card grid that caused it.
4. **Evidence surfaces on the index.** An `evidence: [work-slug | portfolio]` frontmatter list
   resolves against the work section, using each study's own `short` title. The chips therefore
   cannot claim a case study the page does not actually cite, and cannot drift when a title changes.
5. **The WhatsApp launcher is removed from every page.** US-0016 scoped a contact-page affordance;
   the site-wide launcher added under ADR-0007 was scope the story never asked for. A persistent
   launcher is a heavier ask of a visitor than a channel offered where they are already looking for
   one. The contact-page affordance is unchanged.
6. **The two new portfolio repositories are public**, so `linkLive: false` is removed from both cards
   and every card on the portfolio now links.

## Consequences

- Selected work grows from ~90px to ~180px per row, and the page fills the viewport instead of
  ending at 600px of 815px. That is the intent: it reads thin because it *was* thin.
- Case-study frontmatter gains five fields. `client` in particular now has to be maintained
  accurately, because it is a confidentiality statement rendered on a public index.
- Two expertise pages (`integration-architecture`, `event-driven-streaming`) gained a
  SAP-event-backbone bullet in their "Evidenced by" section. They genuinely evidence it and the
  frontmatter had to match the body, so the body was corrected rather than the frontmatter loosened.
- The frontmatter parser stays flat, as `lib/frontmatter.ts` requires — `evidence` is an inline array
  of slugs, and the labels are resolved at build time rather than duplicated in frontmatter.
