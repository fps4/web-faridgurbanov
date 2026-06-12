---
title: "Remove duplicate page titles across all content types"
status: draft
last_updated: 2025-01-30
owners: [architect]
related:
  - docs/product/specs/remove-duplicate-blog-title.md
maestro:
  feature: remove-duplicate-page-titles
  kind: functional_spec
  task: run-805066cf
  summary: |
    Blog posts and other pages on faridgurbanov.com display their title twice: once rendered by the page template and once embedded in the content body. This creates a poor reading experience and looks unprofessional. The fix must remove the duplicate title from every affected content type — blog posts, project pages, standalone pages, or any other page type that exhibits the same pattern — so each title appears exactly once per page.
---

# Remove duplicate page titles across all content types

## Summary

Blog posts on faridgurbanov.com currently show the page title twice: the template renders it as a heading, and the content itself repeats it. The architect has confirmed this issue is not limited to blog posts — other page types exhibit the same duplication. This spec defines the expected behaviour: every page renders its title exactly once, regardless of content type, without changing the visual design or content of any page.

## Scope

**In scope**
- Identifying every page type in the site where title duplication occurs (blog posts, project pages, standalone pages, etc.)
- Ensuring the title appears exactly once on each affected page
- Preserving the existing visual appearance and position of the title as rendered by the template

**Out of scope**
- Changing title text, typography, or styling
- Modifying the site's SEO `<title>` tag or metadata
- Adding new page types or content
- Changing how titles are authored in future content (that is a content authoring guide concern)

## User stories

- As a visitor, I want to see each page's title displayed once, so that the page looks polished and is easy to read.
- As the site owner, I want all existing pages to be free of duplicate titles, so that the site presents a professional appearance across every content type.

## Acceptance criteria (EARS)

- **AC-1.** WHEN a visitor loads any blog post page THE SYSTEM SHALL display the post title exactly once in the page body.
  ↳ source: intent · rationale: The double title on blog posts is the originally reported defect.
- **AC-2.** WHEN a visitor loads any project page THE SYSTEM SHALL display the project title exactly once in the page body.
  ↳ source: feedback_bundle · rationale: Architect confirmed the issue extends beyond blog posts to other page types.
- **AC-3.** WHEN a visitor loads any standalone or other non-blog, non-project page that has a title THE SYSTEM SHALL display that title exactly once in the page body.
  ↳ source: feedback_bundle · rationale: All content types must be covered to fully resolve the issue.
- **AC-4.** WHEN the duplicate title fix is applied THE SYSTEM SHALL preserve the visual position and appearance of the title as it was rendered by the page template before the fix.
  ↳ rationale: The fix must not alter the design; only the duplication is removed.
- **AC-5.** WHEN a visitor views the page source of any affected page THE SYSTEM SHALL contain the page title text in the heading position exactly once, with no additional occurrence of the same text as a heading or paragraph immediately following it.
  ↳ verify: inspection · rationale: Provides a machine-verifiable definition of "exactly once" that a test or audit script can check.

## Non-functional requirements

- **NFR-1.** WHILE the fix is deployed THE SYSTEM SHALL not introduce any visible layout regression on any page type.
  ↳ category: usability · verify: inspection · rationale: A structural change to templates risks unintended side-effects across page types; regression-free output is required.

## Assumptions and constraints

- The duplication originates from either the page template injecting the title as a heading and the content body also starting with the same heading, or vice versa — the design agent must determine which layer is authoritative and remove the duplicate from the other.
- All current page types in the site's content model must be enumerated before the fix is applied; no page type may be skipped.
- The fix applies to all published and draft pages present in the repository at the time of implementation.

## Notes

The original report cited blog posts specifically. The architect's feedback broadens scope to all pages. The design agent should audit every template and content-type layout to produce a definitive list of affected pages before making changes.
