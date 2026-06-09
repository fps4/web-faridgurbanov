---
title: "US-0003: Markdown content pipeline"
persona: architect
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-09
spec: docs/product/FS-0001-site-shell-and-content-pipeline.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As the architect (content author),
I want pages rendered from markdown files under `/content/{en,nl}/`,
so that I can add or edit pages by writing markdown with frontmatter — no code changes.

## Context

Implements the content-pipeline half of FS-0001: `react-markdown` + `remark-gfm` +
`@tailwindcss/typography`, with frontmatter (title, summary, order, draft) driving titles,
ordering, and exclusion of drafts. Depends on US-0002.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL render page bodies from markdown under `/content/{en,nl}/<section>/...` using
  GFM with prose typography styling.
- THE SYSTEM SHALL derive each page's title, ordering, and draft status from frontmatter.
- THE SYSTEM SHALL exclude `draft: true` content from the production build.
- WHEN a new markdown file with valid frontmatter is added under a content section, THE SYSTEM
  SHALL render it as a styled page with correct navigation and language switching, with no code
  change.

## Out of scope

- Section-specific layouts beyond prose (case-study and portfolio card layouts live in their own
  stories under EP-01).

## Notes

This is the contract every EP-01/EP-02 page story depends on; keep frontmatter keys stable.
