---
title: "US-0040: Learning section, with the Confluent crash course first"
persona: visitor
status: draft
complexity: M
milestone: M1
last_updated: 2026-11-10
spec: docs/product/FS-0012-learning-section.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As an integration or platform architect visiting the site,
I want free video courses with the reasoning behind each design choice, next to labs I can run,
so that I can learn how Confluent works between my own data centres and Azure, and judge how Farid
thinks before talking to him.

As Farid,
I want to switch episodes on one at a time as I record them,
so that the first course can go live before the AI Product Design series is ready.

## Context

Implements FS-0012. Brings the Learning section's gate, nav item, release list and breadcrumbs over
from draft PR #99, without its decks and storyline, so the Confluent crash course can be published
first. The episode scripts are in the wiki (`publishing/confluent-crash-course/`); the notes and
labs are in the public repo `fps4/confluent-crash-course`. AI Product Design and AI Product Delivery
show as coming cards. Nothing is published at merge: `LEARNING_PUBLISHED` is false and no episode is
switched on.

## Acceptance criteria (EARS)

See FS-0012. In short:

- WHILE `LEARNING_PUBLISHED` is false, THE production build SHALL show nothing of the section.
- WHEN an episode's number is added to `RELEASED` with its video, THE episode page and its course
  SHALL appear with no other change.
- WHILE the site runs under `next dev`, every planned Confluent episode SHALL render as a marked
  preview.

## Tasks

- [x] `LEARNING_PUBLISHED` and `learningVisible()` in `lib/site.ts`; Learning first in the header.
- [x] `lib/learning.ts` (courses, release list, paths, copy) and `lib/courses/confluent-crash-course.ts`.
- [x] `/learning`, `/learning/[series]`, `/learning/[series]/[episode]`; YouTube video loaded on click.
- [x] Privacy paragraph on the YouTube player, shown once a video is live (EN and NL).
- [x] Sitemap entries once published; `lib/learning.test.ts`.
- [ ] Record the episodes over the decks in the wiki, upload to YouTube, add the ids and posters, switch them on.
- [ ] Bump the privacy page's *Last updated* when the first video goes live.
- [ ] Publish: set `LEARNING_PUBLISHED` once the first episodes are switched on.
