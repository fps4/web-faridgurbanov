---
title: "US-0014: Writing index + training-wedge post"
persona: visitor
status: draft
complexity: S
milestone: M0
last_updated: 2026-06-09
spec: docs/product/FS-0006-writing-blog.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As a recruiter or L&D buyer gauging the owner's thinking,
I want a short writing section with at least one evergreen post on the training wedge,
so that I can read a concrete point of view and see the training angle without a publishing
treadmill being implied.

## Context

Implements FS-0006 — a low-cadence writing section that does double duty as credibility and
training-lead content. M0 ships a writing index (newest-first) plus one evergreen post (e.g. "How I
get non-technical POs writing specs agents can execute"). Posts are markdown rendered via the
FS-0001 pipeline (US-0003); no comments, no schedule, no newsletter machinery. Depends on EP-00.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a writing index listing posts newest-first with title, date, and summary
  derived from frontmatter.
- THE M0 build SHALL include at least one published evergreen post on the training wedge, rendered
  via the FS-0001 content pipeline with prose typography.
- WHEN a new post with valid frontmatter is added under the writing section, THE SYSTEM SHALL list
  and render it with no code change.
- THE writing section SHALL NOT include a comment system and SHALL NOT require a publishing
  schedule.
- POSTS SHALL render in English, with Dutch provided or falling back per ADR-0002.

## Out of scope

- Comments, reactions, RSS subscriptions, tag taxonomies beyond a simple list, and any content
  calendar / scheduling system.

## Notes

The first post is deliberately a training-wedge topic so one piece of work serves both the
credibility and training legs. NL is optional/lagging (ADR-0002).
