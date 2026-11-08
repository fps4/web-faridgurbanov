---
title: "Guide — adding guidelines, patterns and tags"
status: guide
last_updated: 2026-11-08
owners: [architect]
related:
  - docs/product/FS-0013-practice-and-guidelines.md
  - lib/practice-model.ts
  - lib/practice.ts
  - content/en/practice/guidelines/architecture-documentation.md
---

# Adding guidelines, patterns and tags

The Practice list holds three kinds. A **guideline** (`G-NN`) is a standing rule I bring to an
engagement. A **pattern** (`P-NN`) is a reusable solution to a problem that keeps coming back,
usually extracted from an article. An **article** is a dated piece. Guidelines and patterns are
"entries": one markdown file per locale, named by slug, under
`content/<locale>/practice/guidelines/` or `content/<locale>/practice/patterns/`
(`policy-compiler.md` → `/practice/patterns/policy-compiler`). The list, the filters, the
previous/next links and the sitemap pick a file up on their own; no code changes.

**Titles** are catalogue names. A guideline's title is its subject in two to four words
(*Constraints before cost*) and the summary states the rule. A pattern's title is what you would
call it in a design review (*Policy compiler*) and the summary goes from problem to solution.

## Frontmatter

```yaml
id: G-02                 # G- for a guideline, P- for a pattern; next free number, never reused
order: 2                 # reading order within the kind; unique per kind
title: "Data contracts at the source"
summary: "…"             # ≤ 140 characters: the landing card and the meta description
status: current          # current | revised | retired
revised: 2026-12-01      # date of the last substantive change, not of a typo fix
supersedes: G-01         # optional: the id this one replaces
related: [G-01, P-02, work/cloud-gateway, practice/articles/<slug>]   # optional
topics: [architecture, cost]   # one or more, from TOPICS in lib/practice-model.ts
tech: [sap, snowflake]         # zero or more, from TECH; [] when none
```

`related` takes entry ids or `work/`, `expertise/`, `practice/articles/<slug>`; it renders as
"Where I applied it". When an entry names an article there, the article's page links back to the
entry ("Extracted from this article"), so the source article itself is never edited.

## Tags

Every item, articles included, carries `topics` and `tech` in its frontmatter. The vocabularies
are fixed in `lib/practice-model.ts` (`TOPICS` with an EN and NL label each, `TECH` with one
label), and an unknown value fails the tests and the build. A technology earns a tag only when the
item works with it in substance; a passing mention does not. To add a tag, add it to the
vocabulary in the same PR as the first item that uses it; a chip appears only once an item uses
it.

The frontmatter parser takes flat `key: value` lines only; leave `supersedes` out rather than
writing `null`. `npm run test` (and the build) fails on a malformed field, a reused id or order,
or a `related` / `supersedes` entry that does not resolve.

## Body

A **guideline**, as `##` headings in this order: **The rule** (one or two sentences), **Why**,
**How I apply it**, **Trade-offs**, **When I'd bend it**, and optionally **Starter templates**
(fenced code blocks). In Dutch: *De regel*, *Waarom*, *Hoe ik het toepas*, *Afwegingen*,
*Wanneer ik ervan afwijk*, *Sjablonen om mee te beginnen*.

A **pattern**: **Problem**, **Forces**, **Solution**, **Consequences**, **When not to use it**. In
Dutch: *Probleem*, *Krachten*, *Oplossing*, *Gevolgen*, *Wanneer niet*. Where it was used goes in
`related`, not in the body.

Both run about 400 to 700 words: written to the template, not pasted from the source article, with
at most one number, where it proves the point. The test checks the required headings.

The Voice section of `AGENTS.md` applies; run `npm run voice -- --strict` on the file.

## Diagram

Every guideline, pattern and article carries at least one diagram of its central mechanism (a
flow, an order, a structure, a comparison). Draw it as a hand-written SVG in `public/diagrams/`,
named after the slug, matching the existing ones: `viewBox` 760 wide, `role="img"`, the system
sans font, monochrome greys (`#9a9aa3` lines, `#7b7b85` text and the one or two boxes that are the
point) on a transparent background, so the same file reads in light and dark mode. No scripts,
external references or embedded fonts. Every label comes from the page's own text.

Embed it on its own line, in a pattern's *Solution*, a guideline's *How I apply it*, or the
article section that introduces the mechanism:

```md
![Diagram: what it shows, in one to three sentences.](/diagrams/<slug>.svg)
```

The Dutch page points at a Dutch-labelled copy, `/diagrams/<slug>-nl.svg`, with Dutch alt text.
The test fails a page with no diagram, a missing file, or a Dutch page using the English one.

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
