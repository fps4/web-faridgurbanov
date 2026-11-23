# Agent instructions

Instructions for AI coding agents working on the faridgurbanov.com repo. Read
[`CODEBASE.md`](CODEBASE.md) first for orientation, then the relevant spec under `docs/product/`
and the ADRs it cites.

## Allowed

- Read any file in the repository.
- Create and edit application code (`app/`, `components/`, `lib/`), styles, config, and docs
  (`docs/`).
- Put approved text into `content/`, `lib/dictionaries.ts` and `lib/site.ts`, and only that (see
  [Where copy comes from](#where-copy-comes-from)).
- Propose changes as branches and pull requests.

## Not allowed

- **Break the static export.** No application server, API routes, runtime data fetching,
  middleware, or anything that needs a server at request time — the site ships as `output: 'export'`
  to `out/` (ADR-0001). If `next build` can't emit `out/`, the change is wrong.
- **Edit accepted ADRs** under `docs/design/decisions/` — they are immutable once `accepted`.
  Propose a new ADR that supersedes instead. On the old one only the status line changes (to
  `superseded by NNNN`), or a note naming the parts that are superseded; its body stays as written.
- **Add a shelf-folder README.** `docs/product/`, `docs/design/`, `docs/reference/`, and
  `docs/guides/` carry no README (only epic indexes and the roadmap/issues area indexes do) — see
  the [documentation standard](../maestro/docs/guides/documentation-standards.md).
- **Commit what the owner has not cleared for publishing**, or link a private repository. See
  [Public repository](#public-repository).
- **Publish a gated surface** before its prerequisite clears. A repository link goes on the site
  only once the prerequisites of
  [ADR-0004](docs/design/decisions/0004-public-surface-prerequisites.md) are met for it: licensed,
  neutral, and described as what it is (runnable or reference).
- **Add, rewrite or generalize site text.** See [Where copy comes from](#where-copy-comes-from).

## How to run

```sh
npm install
npm run dev      # next dev on http://localhost:3040
npm run build    # static export to ./out  (this is what the DoD gate checks)
npm run lint     # next lint
npm run test     # vitest run
```

## Code style

- TypeScript + React function components; App Router conventions.
- Tailwind for styling; reuse shadcn/ui primitives in `components/ui/` before adding new ones.
- Match the surrounding file's idiom, naming, and comment density. Keep `lib/` helpers
  framework-free and unit-tested.
- Content is filesystem markdown with frontmatter (title, summary, order, draft) under
  `content/{en,nl}`; never dump the frontmatter block into rendered prose (`lib/frontmatter.ts`).
- References live in `content/references/` (locale-less, one person per file, the quote as the
  body, verbatim). Add or update one by editing the file; see `docs/guides/references.md` for the
  fields and what the build checks. They are shown as a band of the home page; there is no
  References page. One budget holds for every quote, 30-120 words, and a quote is never changed to
  fit it. Never change a person's words (cuts and fixes go in square
  brackets); `role` mirrors their LinkedIn headline and is refreshed by hand on review; never fetch
  anything from LinkedIn at build or request time.

## Tile copy

Anything that renders as a **card in a grid** is written to a length budget, in every locale:

- **40-70 words** (~250-450 characters) per card, with the cards of one grid close in length.
  The reference cards on Home are the exception: they hold another person's words, which are never
  changed to fit, so their one budget is 30-120 words (`lib/references.test.ts`).
- Cards sit **side by side**. Length is relative: an essay in one tile makes its neighbours look
  thin and gets none of them read.
- The card is the hook, not the summary. Detail that does not fit goes behind the link.

The budget is about layout. It never gives a builder leave to shorten or reword approved text: if
an approved text does not fit its card, the PR says so and the owner decides.

## Where copy comes from

Every text on the site (`content/`, `lib/dictionaries.ts`, `lib/site.ts`) is taken **verbatim** from
the approved review document of the site copy, the version the story names. The owner is the
author (§12 of the decision, ADR-0010:
<https://maestro.fps4.nl/artifacts/art-896t5kxfka>).

- A builder **adds, rewrites or generalizes no text**. Not to fit a card, not to pass the voice
  check, not to make Dutch read better, not to fill a gap.
- A text that is **not yet approved** in that document is **not built**. Stop and say what is
  missing instead of writing it.
- The Dutch version is made from the approved English and approved the same way; it is not
  translated on the spot.
- A text that is not in the document and has to change goes back to the owner to be approved in
  it first, and then into the repository.

## Public repository

This repository is public. Anything committed here, in a file or in git history, is public.

- A text the owner has not cleared for publishing is **not committed**: an article that is waiting
  for its moment, a quote the person has not agreed to, a translation he has not approved.
- A **private repository is never linked**, in copy, config or docs. Only the owner's public
  repositories may be linked.
- Do not write into the repository the name of the owner's current or an earlier client, or his
  private projects.
- Exact internal figures of the owner's current work are not written on any page or in any
  document in the repository; and a builder adds no number to site text (§12.2 and §13.3 of the
  decision).

## Voice

The decision (ADR-0010, §7: <https://maestro.fps4.nl/artifacts/art-896t5kxfka>) sets how the site
reads. A builder keeps to it by using the approved
text as it stands:

- **First person, plain English.** Copy is in the first person, in the plain English the owner
  speaks. His wording and his order of words are kept; only errors are corrected, and only by the
  owner or in the review document.
- **No client is named**, the current one or an earlier one. A client is described by its kind
  (a large Dutch grocery retailer, a UK telecom operator).
- **Figures of the owner's current work** stand in the rounder words of the approved copy, never
  as an exact internal figure.
- **Two languages are named** for him: English and Dutch. No other.
- **Nothing that people at his current client would read as an account of their own teams**,
  incidents, policies or weak points. A disagreement that is still going on, and an idea he is
  proposing there, appear as a pattern seen in many organizations, as the approved copy has them.
- **Facts stay facts.** Years, team words ("we"), admissions and outcomes come from the owner's
  résumé or the approved copy, never added to give texture. Work that is not finished is told as
  in progress, and a proof of concept is called a proof of concept.
- Every page opens in words a reader who does not build can follow, and explains a term where it
  first uses it. Articles carry the date they were written.

Quotes in `content/references/` are other people's words, verbatim and only with the agreement of
the person quoted. The voice check skips that folder.

### The voice check

`npm run voice` measures five patterns per file (antithesis, mould phrases, em-dashes, sincerity
words, Dutch calques) against a budget (em-dashes ≤ 3.5 per 1,000 words of body text, antithesis
≤ 5 per 1,000, sincerity words / mould phrases / Dutch calques = 0) and prints one row per copy
surface. It still runs over **every** copy surface, and `npm run voice -- --strict` is still a
pre-submit check.

It is a signal and not a rule for the text. When a file holding **approved text, unchanged**,
gets flagged, the PR explains the flag in a sentence, naming the file and pointing to the
approved copy it comes from. **The text is not reworded to pass.** A flag on text a builder wrote
or changed without approval is a sign the text should not be there.

## Pre-submit checks

Before opening a PR, all must pass (the `dod` workflow enforces them on `main`):

1. `npm run lint`
2. `npm run test`
3. `npm run build` succeeds and produces `out/`.
4. `npm run voice -- --strict` exits 0, or the PR explains each file it flags by pointing to the
   approved copy (copy changes only; see [The voice check](#the-voice-check)).

## Docs as Definition of Done

- **The story lives in maestro**, not in this repository. A change is built from one story and its
  acceptance criteria.
- The **pull request description carries the line `Implements: art-…`** with the story's art id.
  One pull request implements one story.
- The **repository spec the change touches** (`docs/product/`, `docs/design/`) is updated in the
  **same PR**, with `last_updated` bumped. A decision is changed by a new ADR, never by editing an
  accepted one.
- The product intent, the three readers and the two goals are in
  [`docs/product/00-product-intent.md`](docs/product/00-product-intent.md); the decision behind
  them is [ADR-0010](docs/design/decisions/0010-the-site-has-one-job.md).
- Acceptance criteria in repository specs are written in **EARS** form ("WHEN … THE SYSTEM SHALL
  …"). The repo is spec-driven: product intent precedes design precedes code.
