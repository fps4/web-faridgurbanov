---
title: "0009: References are curated markdown snapshots, not a LinkedIn feed"
status: accepted
last_updated: 2026-09-17
owners: [architect]
related:
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/design/decisions/0005-stakeholder-forward-positioning.md
  - docs/product/FS-0007-contact-and-privacy.md
  - docs/product/FS-0009-references.md
  - docs/guides/references.md
---

# ADR-0009 — References are curated markdown snapshots, not a LinkedIn feed

## Context

The owner wants references from people they have worked with on the site, each linked to the
person's public LinkedIn profile, with the person's photo and position "taken from LinkedIn". The
open question was whether that should be automated (an API, a badge, a periodic refresh) or
maintained by hand.

The site is a static export with no server, no runtime data fetching and no third-party scripts
(ADR-0001), and its privacy page says so (FS-0007). The repository is public. The voice rules
(AGENTS.md) require all copy to read as the owner's own prose; a reference is the one place where
the copy is, by definition, someone else's.

What LinkedIn allows, checked 2026-09-17:

| Route | Verdict | Why |
|---|---|---|
| Profile API for other members | No | The consumer API returns only the signed-in member's own name, photo and email (`openid`, `profile`, `email`). There is no endpoint for another member's profile. |
| Recommendations API | No | There is no public API for recommendations, given or received. |
| Profile badge script | Avoid | Works, but loads LinkedIn's JavaScript and cookies on the page; the privacy page promises no third-party scripts, and would become false. |
| Hotlinking the profile photo | Breaks | `media.licdn.com` URLs are signed and expire after weeks. |
| Scraping | No | Against LinkedIn's User Agreement, which they enforce. |
| A saved copy, with the person's consent | Yes | Their words, role and photo in the repository; their profile linked. |

## Decision

1. **A reference is a markdown file** under `content/references/<first-last>.md`: flat frontmatter
   for the person (`name`, `role`, `role_nl`, `years`, `linkedin`, `work`, `date`, `lang`,
   `translated_from`, `photo`, `featured`, `verified`, `reviewed`, `draft`) and the quote as the
   body, verbatim. One person per file. Locale-less: a quote is not translated, so there is no
   `content/{en,nl}` split; only the role line has a Dutch variant. An agent maintains these files
   the way it maintains the rest of `content/`; see `docs/guides/references.md`.
2. **Role and photo are a dated snapshot of the engagement**, never a live mirror. The role line is
   the role the person held during the work plus the years worked together ("Product owner, API
   platform · worked together 2021–2023"), which stays true however their career moves. The profile
   link carries whatever they do now. `reviewed:` records when the file was last checked with the
   person; one pass a year is the whole update process.
3. **The photo is a file in the repository** (`public/references/<slug>.jpg`, square, small),
   supplied by the person or taken from their LinkedIn profile with their OK. No hotlinking, no
   badge, no script from LinkedIn. A reference without a photo shows initials.
4. **Nothing is fetched from LinkedIn**, at build time or at request time. Verifiability comes from
   links instead: each reference links to the person's profile, and one marked `verified` also links
   to the owner's recommendations tab, where the same words can be read at the source.
5. **The build enforces the shape.** `lib/references.test.ts` validates every file: quote length
   (30–90 words; 35–75 when featured, the tile budget), the profile-URL shape, the photo's presence,
   and that `work` names an existing case study. At most two references are `featured`.
6. **The voice check skips the folder.** The words are the person's; measuring them against the
   owner's style would push toward editing them, which is the one thing a reference must not have.
7. **Consent is part of the ask, not a feature.** The person sees the exact card before it goes
   live and agrees to name, photo, role, words and profile link being published, in a public
   repository, and can have it taken down with one email. The privacy page says so.

## Consequences

- Adding a reference is a content change: one markdown file, optionally one image, no code.
  Removing one is deleting the file. Both are within what an agent may do under AGENTS.md.
- The repository is public, so a referee's photo and words enter git history. Removal takes them
  off the site on the next deploy; the history keeps them unless rewritten. The ask says this
  plainly rather than pretending otherwise; a private asset pipeline would have broken "buildable by
  an agent without bespoke infra".
- References can go stale in one way only: a person changes their mind. The role line cannot go
  stale, because it describes the past.
- Every surface ships dark. WHILE `content/references/` holds only the template, the site builds
  exactly as before, with `/references` a 404. The first real file turns everything on.
- `ContentArticle` gained a `beforeLastSection` slot and `lib/sections.ts` a splitter, so a page can
  put its own block between a body's last two H2s. Case studies use it; the markdown stays the
  owner's prose with no placeholder in it.
