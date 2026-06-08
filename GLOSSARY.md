# Glossary

Domain terms used across this repo where the in-code or in-content meaning diverges from plain
English, or where a name is shared between the UI, the content model, and the docs. Add an entry
whenever the rewrite introduces such a term.

| Term | Definition |
|------|------------|
| faridgurbanov.com | This product: a bilingual (EN/NL) personal site and single credibility surface for three buyer journeys — training, hiring/contract, and build-service — under one brand. |
| Static export | The site is built with Next 15's `output: 'export'` (ADR-0001): `next build` emits plain HTML/CSS/JS to `out/` with no application server and no database. Served by nginx. |
| ds1 | The owner's Docker host. The static `out/` is packaged into a thin nginx image (`infra/docker/`) and deployed there; a reverse proxy on ds1 terminates TLS and routes the domains. |
| Locale | One of the two enumerated languages, `en` or `nl`, surfaced as App-Router `[locale]` segments pre-rendered at build time (no runtime locale negotiation). |
| Content pipeline | The build-time path that turns filesystem markdown under `content/{en,nl}` (frontmatter + body) into styled static pages (FS-0001). Frontmatter drives nav, ordering, and draft state. |
| Training-forward | The *target* positioning: a home that leads with the training practice. The *first ship* (M0) leads with credibility instead and carries training as a CTA stub; training-forward lands in M1 (ADR-0003). |
| Functional spec (FS-NNNN) | The *what & why* for a slice of the site, under `docs/product/`. Carries the `maestro:` frontmatter block and EARS-format acceptance criteria. |
| EARS | Easy Approach to Requirements Syntax — "WHEN [condition] THE SYSTEM SHALL [behaviour]." Makes acceptance criteria unambiguous and testable. |
| ADR | Architecture Decision Record, under `docs/design/decisions/` — a numbered, immutable-once-accepted record of a locked technical decision. |
| Milestone (M0/M1) | A shippable band of work. M0 = credibility foundation; M1 = training-forward. Each story carries `milestone:` frontmatter resolving to one scoping doc under `docs/delivery/roadmap/`. |
| DoD gate | The Definition-of-Done CI workflow (`.github/workflows/dod.yml`) that must pass before merge — it asserts lint/test pass and that `out/` exists after `npm run build`. |
| Gated surface | A page whose publication is blocked on a prerequisite (e.g. portfolio repos pending a public-surface scrub, ADR-0004). |
