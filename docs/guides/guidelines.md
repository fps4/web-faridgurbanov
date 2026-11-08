---
title: "Guide — adding and revising a guideline"
status: guide
last_updated: 2026-11-08
owners: [architect]
related:
  - docs/product/FS-0013-practice-and-guidelines.md
  - lib/guidelines.ts
  - content/en/practice/guidelines/architecture-documentation.md
---

# Adding and revising a guideline

A guideline is one markdown file per locale under `content/<locale>/practice/guidelines/`, named
by its slug (`architecture-documentation.md` → `/practice/guidelines/architecture-documentation`).
The Practice landing page, the previous/next links and the sitemap pick it up from the file; no
code changes.

## Frontmatter

```yaml
id: G-02                 # next free number; never reused, even after a guideline is retired
order: 2                 # reading order on the landing page; unique
title: "Data contracts at the source"
summary: "…"             # ≤ 140 characters: the landing card and the meta description
status: current          # current | revised | retired
revised: 2026-12-01      # date of the last substantive change, not of a typo fix
supersedes: G-01         # optional: the id this one replaces
related: [G-01, work/cloud-gateway]   # optional: guideline ids, or work/, expertise/, practice/articles/<slug>
```

The frontmatter parser takes flat `key: value` lines only; leave `supersedes` out rather than
writing `null`. `npm run test` (and the build) fails on a malformed field, a reused id or order,
or a `related` / `supersedes` entry that does not resolve.

## Body

The sections, in this order, as `##` headings: **The rule** (one or two sentences), **Why**,
**How I apply it**, **Trade-offs**, **When I'd bend it**, and optionally **Starter templates**
(fenced code blocks). In Dutch: *De regel*, *Waarom*, *Hoe ik het toepas*, *Afwegingen*,
*Wanneer ik ervan afwijk*, *Sjablonen om mee te beginnen*. The test checks the first five.

The Voice section of `AGENTS.md` applies; run `npm run voice -- --strict` on the file.

## Dutch

The Dutch file carries the same `id`, `order`, `status`, `revised`, `supersedes` and `related` as
the English one (the test checks). A machine draft starts with this line under the frontmatter, and
the PR lists the file for review:

```markdown
<!-- NEEDS HUMAN REVIEW: machine-drafted Dutch of the EN guideline (FS-0013). Remove this line once Farid has read it. -->
```

HTML comments are stripped before rendering, so the line never reaches the page. Without a Dutch
file, `/nl/practice/guidelines/<slug>` shows the English one with the "not yet translated" notice.

## Revising and retiring

A substantive change bumps `revised`; set `status: revised` if a returning reader should notice.
To replace a guideline, add a new one with `supersedes: <old id>` and set the old one to
`status: retired`. Keep the retired file: its URL stays live and says what replaced it.
