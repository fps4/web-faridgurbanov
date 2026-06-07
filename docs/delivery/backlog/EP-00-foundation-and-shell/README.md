---
title: "EP-00 — Foundation & shell"
status: open
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/delivery/backlog/README.md
  - docs/product/FS-0001-site-shell-and-content-pipeline.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/design/decisions/0002-bilingual-en-nl-i18n.md
---

# EP-00 — Foundation & shell

Everything every page sits on: scaffolding the Next 15 app from the maestro/web base, the
bilingual (EN/NL) shell and navigation, the markdown content pipeline, static export, and
hosting. Implements FS-0001 under ADR-0001/0002.

## Stories

| Story | Title | Milestone |
|---|---|---|
| [US-0001](US-0001-scaffold-app-and-static-export.md) | Scaffold app from maestro/web base with static export | M0 |
| [US-0002](US-0002-bilingual-shell-and-nav.md) | Bilingual shell, navigation & language switcher | M0 |
| [US-0003](US-0003-markdown-content-pipeline.md) | Markdown content pipeline | M0 |
| [US-0004](US-0004-hosting-and-domains.md) | Hosting + domain wiring (.com live, .nl parked to /training) | M0 |
