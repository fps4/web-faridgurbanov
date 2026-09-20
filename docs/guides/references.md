---
title: "Guide — adding and maintaining a reference"
status: guide
last_updated: 2026-09-20
owners: [architect]
related:
  - docs/product/FS-0009-references.md
  - docs/design/decisions/0009-references-as-curated-snapshots.md
  - content/references/_template.md
  - lib/references.ts
---

# Adding and maintaining a reference

A reference is one markdown file under `content/references/` and, optionally, one image under
`public/references/`. Nothing else changes: the case study, the home band, the references page,
the contact block and the footer link all switch on from the files. This guide is for whoever adds
or updates one, the owner or an agent.

## The ask

One message, one prompt. Ask for **one situation, what I did, and what happened**, in 40–70 words,
in whichever language they write in. That shape produces references that read like the rest of the
site (situations rather than adjectives) and fit the tile budget. In the same message ask for a
headshot, or their OK to use the one on their profile, and say what will be published: name, photo,
role at the time, their words, and a link to their profile, in a public repository, on
faridgurbanov.com, and that one email takes it down.

Before it goes live, send them the rendered card (a screenshot of the case-study block is enough).
Their yes to that is the consent.

## The file

Copy `content/references/_template.md` to `content/references/<first-last>.md`, fill it in and
remove `draft: true`. One person per file. The fields:

| Field | What goes in it |
|---|---|
| `name` | As they write it. |
| `role` | Their position as their LinkedIn headline shows it, first segment only (before the first "\|"), in English: "AI & Data Product Lead, Accenture". Refresh it whenever you bump `reviewed`. |
| `role_nl` | The same in Dutch. Optional; falls back to `role`. |
| `years` | The years worked together, as written: `2021–2023`. |
| `linkedin` | Their public profile: `https://www.linkedin.com/in/<handle>/`. The build rejects anything else. |
| `work` | The case-study slug (`cloud-gateway`, `sap-snowflake`, …). The build checks it exists. |
| `date` | When they wrote it, `YYYY-MM-DD`. Rendered as month and year. |
| `lang` | The language the quote is shown in: `en`, `nl`, `de`, … A quote in another language than the page's gets an "In English." note. |
| `translated_from` | Only when the quote shown is a translation they approved; the original's language. Renders "Translated from German, with their approval." |
| `photo` | `/references/<first-last>.jpg`, or leave it out to show initials. |
| `featured` | `true` puts it on the home page. At most two. Pick two voices from different sides (product and engineering, say). |
| `verified` | `true` when the same text is a recommendation on the owner's LinkedIn profile; adds an "Also on my LinkedIn" link to the recommendations tab. |
| `reviewed` | `YYYY-MM-DD`, the last time the role, photo and link were checked with the person. |

The body is the quote, **verbatim**, no quotation marks (the component adds them); blank lines
are kept as paragraphs. 30–120 words; 35–75 when featured. If it has to be shortened, mark the cut
with `[…]` and get their OK on the shortened version. An editorial fix (a missing word, a typo) goes
in square brackets too. Where a recommendation names a client the case study abstracts, cut the name
the same way, so the site does not undo its own confidentiality.

## The photo

Square, 320×320, JPEG or WebP, under 25 KB. On a Mac:

```sh
sips -c 800 800 -s format jpeg original.jpg --out /tmp/square.jpg   # crop to square first if needed
sips -Z 320 /tmp/square.jpg --out public/references/first-last.jpg
```

Never link to the LinkedIn image URL: those are signed and expire. Never load LinkedIn's badge
script; it puts their cookies on the page and falsifies the privacy page.

## What the build checks

`npm run test` fails on any of these, naming the file and the reason:

- quote outside 30–120 words (35–75 when featured);
- `linkedin` not a `linkedin.com/in/` URL;
- `photo` set but the file missing under `public/`;
- `work` naming no case study;
- more than two references `featured`;
- a missing `name`, `role`, `years`, `date` or `reviewed`.

`npm run voice` skips `content/references/`: the words are theirs.

## Keeping it up to date

Once a year, open each file, open the profile link, and check three things: the link still
resolves, `role` still matches their headline (update it if they moved), and the person is still
happy to be quoted. Bump `reviewed`. If they change their mind, delete the file (and the photo) and
deploy; that is the whole removal. Note in the PR that the removal was at their request.
