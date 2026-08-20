---
title: "0007: Front page as three bands; portfolio narrowed to five repos in three areas"
status: accepted
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
  - docs/design/decisions/0006-portfolio-restructure-data-architecture.md
  - docs/product/FS-0002-home.md
  - docs/product/FS-0005-portfolio-repos.md
  - docs/product/FS-0007-contact-and-privacy.md
---

# ADR-0007 — Three bands on the front page; a narrower, regrouped portfolio

## Context

ADR-0006 cut the portfolio to seven repos in two pillars. In use it was still not focused enough for
the data-architect / lead-architect target. Two of the seven — `retail-dynamic-pricing` and
`marketplace-intel-platform` — are good work, but they are **applied data science**, and they invited
the wrong conversation: a client reading them asks about pricing science or ranking models, neither
of which is what the engagement is for. Removing them left the "AI & applied ML" pillar holding one
repository, so the grouping had to change too.

Separately, the front page had accumulated bands without a stated order. ADR-0005 added the adoption
band; the proof strip predates it; the technical depth was reachable only through the nav. The owner
asked for the page to be organised around three things — technical expertise, experience, and
stakeholder management — with AI no longer leading.

## Decision

1. **Remove `retail-dynamic-pricing` and `marketplace-intel-platform`** from the portfolio, and the
   `dynamic-pricing` case study with them. Both repos stay on GitHub. Selected work is now four case
   studies, **all of them client engagements**, which is a stronger set than five with one demo in it.
2. **Regroup the portfolio into three areas named after what a client engages an architect to do**,
   rather than after technology families:
   - **Data architecture & modelling** — decide what the target looks like and what crosses the seam.
   - **Modernization & migration** — move a live estate wave by wave, with parity gates.
   - **Integration & platform services** — the self-service spine the downstream teams operate.
   Each group carries a one-line lede in the buyer's words (`pillars[].lede` in `lib/site.ts`).
3. **Dissolve the AI pillar and merge the two AI/ML expertise pages into one.** The
   `applied-ml-data-science` page lost its evidence when the demos came off the surface, and keeping
   an unevidenced page on a site whose promise is "evidenced by" was not defensible.
   `ai-and-automation` is rewritten around three claims that the remaining repos actually support —
   model behind a contract, evaluation as a release gate, model outside the runtime — and is ordered
   **last** among the domain areas.
4. **Reorder the domain areas** so data and integration lead: Data & lakehouse, Integration
   architecture, Event-driven & streaming, APIs & gateways, AI & automation.
5. **The front page becomes three bands under the hero, in this order:**
   - **Track record** (experience) — the four metrics, each linking to its case study.
   - **How I get it adopted** (stakeholder management) — the three situations.
   - **What I build** (technical expertise) — the five areas plus a portfolio tile.
   The order is deliberate and follows ADR-0005: the technical half is the half nobody doubts, so it
   does not have to argue first.
6. **Add an optional self-hosted intro video** directly under the hero, feature-gated on
   `INTRO_VIDEO` so the page renders unchanged until a file exists. Self-hosted rather than embedded:
   a third-party player would place a processor and cookies on the highest-traffic page and falsify
   the privacy page (FS-0007).
7. **Ship the WhatsApp click-to-chat channel (US-0016) and extend it site-wide.** The story scoped a
   contact-page affordance; the owner asked for a launcher visitors can reach from any page. Both are
   plain `wa.me` links — no SDK, no iframe, nothing loaded from Meta until the visitor chooses the
   channel — so the extension does not change the privacy analysis, only its reach. The number is
   assembled in the browser, matching the obfuscated-email pattern.

## Consequences

- The portfolio is **seven repos in three groups**. `enterprise-data-model-lab` and
  `legacy-dwh-migration` were built the same day and both pass lint, tests and their full demo; they
  carry `linkLive: false` until they are pushed, so their cards render without a dead link.
- The `linkLive` override now works in both directions (`?? REPO_LINKS_ENABLED`), which is what makes
  "built but not yet public" a renderable state rather than a broken one.
- Applied data science is no longer represented anywhere on the site. If a role calls for it, both
  repos are still public and can be re-listed.
- The privacy page had to change: choosing WhatsApp makes Meta a processor, and the page now says so
  plainly while affirming the email path stays processor-free.
- The intro video is the first feature on this site that cannot be finished by the repo — it needs a
  recording. `docs/guides/intro-video.md` carries the brief so the gap is actionable rather than open.
- Publishing a WhatsApp number invites unsolicited contact, so the channel uses the **Rinkel business
  number** rather than the personal mobile (owner-confirmed 2026-08-20). The personal number stays on
  the CV and off the public surface. Setting `whatsapp` to `null` removes the channel everywhere.
- Verified on 2026-08-20: the link resolves to the WhatsApp Business profile "Fusion Platform
  Services". Worth keeping as a standing check, because `wa.me` renders a working-looking link for an
  unregistered number and then lands on an invalid-number page — a worse outcome than no button.
