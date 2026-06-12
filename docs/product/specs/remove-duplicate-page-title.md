---
title: "Remove duplicate page title rendering on blog post pages"
status: draft
last_updated: 2025-01-31
owners: [architect]
related: []
maestro:
  feature: remove-duplicate-page-title
  kind: functional_spec
  task: run-805066cf
  summary: |
    Blog post pages on faridgurbanov.com currently display the post title twice
    in succession: once as a heading and once repeated immediately below it,
    before the date and body text. This makes posts look broken and is
    confusing to readers. The fix must ensure every blog post page shows the
    title exactly once, in the correct position, without affecting any other
    page types or the visual appearance of the title itself.
---

# Remove duplicate page title rendering on blog post pages

## Summary

Blog post pages render the post title twice — once as a top-level heading and again immediately below it, before the publication date and body content. This is a display defect introduced somewhere in the page rendering pipeline. The goal is to eliminate the second occurrence so every post page shows its title exactly once, in the expected position, while leaving the date, body text, and all other page layouts untouched.

## Scope

**In scope**
- Identify the rendering path that outputs the title a second time on blog post pages.
- Remove the duplicate output so the title appears exactly once per page.
- Verify the fix applies consistently across all existing published blog posts.

**Out of scope**
- Restyling or repositioning the title (typography, font size, spacing).
- Changes to any page type other than blog post pages (e.g. home page, about page, project pages).
- Adding or modifying post metadata fields (author, tags, categories).
- SEO `<title>` tag or Open Graph title changes — those are separate concerns.

## User stories

- As a reader visiting a blog post, I want to see the post title once at the top of the page, so that the page looks correct and is easy to read.
- As the site owner, I want all blog post pages to render without duplicate titles, so that the site presents a professional appearance.

## Acceptance criteria (EARS)

- **AC-1.** WHEN a visitor navigates to any blog post page THE SYSTEM SHALL render the post title exactly once in the page body.
  ↳ source: intent · rationale: The defect is a duplicate heading; exactly-once is the correct invariant.

- **AC-2.** WHEN a visitor navigates to any blog post page THE SYSTEM SHALL display the post title before the publication date and before the body text.
  ↳ rationale: Preserves the expected reading order; the fix must not displace the title, only deduplicate it.

- **AC-3.** WHEN a visitor navigates to a page that is not a blog post (e.g. home, about) THE SYSTEM SHALL render those pages without any change to their current title display behaviour.
  ↳ rationale: Ensures the fix is scoped and does not introduce regressions on other page types.

- **AC-4.** WHEN the site is built THE SYSTEM SHALL produce no build-time warnings or errors related to title rendering that were not present before this change.
  ↳ priority: should · verify: inspection · rationale: Guards against masking the problem rather than fixing it.

## Non-functional requirements

- **NFR-1.** WHILE the fix is applied THE SYSTEM SHALL not increase page load time measurably (i.e. no new synchronous rendering work added).
  ↳ category: performance · verify: inspection · rationale: The change is structural/template only; it must carry no performance cost.

## Assumptions and constraints

- The duplicate title originates in the page template or a content rendering pipeline, not in the markdown source of individual posts — if it is in the source of every post, that changes the fix approach and should be confirmed before implementation.
- All blog post pages share a single template or layout component; a fix to that one location is expected to resolve the issue site-wide.
- The site build process can be run locally to verify the fix before deployment.

## Notes

The reported example shows the sequence: title → date → title → body excerpt. The first title is likely emitted by the layout/template, and the second by the page content renderer also emitting the frontmatter `title` field. Identifying which of the two sources is the unintended one is the first step for the implementing agent.