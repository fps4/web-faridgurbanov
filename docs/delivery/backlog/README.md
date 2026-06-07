---
title: Backlog — epics & user stories
status: draft
last_updated: 2026-06-07
owners: [architect]
related:
  - docs/overview.md
  - docs/delivery/roadmap/README.md
---

# Backlog

Epics and user stories. Stories live under `EP-NN-slug/US-NNNN-*.md` (the story number tracks
the epic) and flow `draft -> accepted -> done`. A user story is the join: it links its task
(delivery) to its spec and design (docs). Epics are capability buckets that persist across
milestones; milestone slicing happens via each story's `milestone:` frontmatter.

| Epic | Capability | Specs |
|---|---|---|
| [EP-00 — Foundation & shell](EP-00-foundation-and-shell/README.md) | Scaffold, bilingual shell, content pipeline, static export, hosting | FS-0001 |
| [EP-01 — Content pages](EP-01-content-pages/README.md) | Home, expertise, case studies, portfolio, writing, contact/privacy | FS-0002…FS-0007 |
| [EP-02 — Training & EU AI Act](EP-02-training/README.md) | Training CTA stub (M0) → full Training section + EU AI Act page (M1) | FS-0008 |

> **M0 fully drafted.** All M0 stories are drafted in full (EP-00 US-0001…US-0004, EP-01
> US-0010…US-0015, EP-02 US-0020). M1 stories (US-0021…US-0023) remain stubs for a spec/design
> agent to expand from FS-0002 (M1) and FS-0008 (M1).
