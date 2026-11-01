---
title: "US-0035: Learning section — series, modules and episodes, switched on one by one"
persona: architect
status: in-review
complexity: M
milestone: M1
last_updated: 2026-11-01
spec: docs/product/FS-0012-learning-section.md
design: docs/design/decisions/0010-storyline-english-first-and-decks-as-data.md
---

## Story

As the owner recording one episode at a time,
I want the series under one Learning section, and each episode to appear when I switch it on,
so that the site shows what is recorded and nothing else, without a page written per episode.

## Context

AI Product Design is the first series and AI Product Delivery the next. The series, their modules and
episodes are in `lib/learning.ts`; `RELEASED` there lists the episodes switched on (3.1 first). The
former storyline landing page becomes the AI Product Design series page. The section stays behind
`LEARNING_PUBLISHED` until the owner publishes it.

## Acceptance criteria (EARS)

- WHILE `LEARNING_PUBLISHED` is false, THE production build SHALL NOT show the Learning nav item AND
  SHALL render every page under `/learning` as a 404.
- WHILE the section renders, THE header SHALL list "Learning" first.
- WHEN the owner adds an episode's number to `RELEASED`, THE episode, its module and its series SHALL
  get their pages and links, and the rest of the plan SHALL stay marked as coming.
- THE tests SHALL fail WHEN `RELEASED` names an episode the plan does not have.
