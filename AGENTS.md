# Agent instructions

Instructions for AI coding agents working on the faridgurbanov.com repo. Read
[`CODEBASE.md`](CODEBASE.md) first for orientation, then the relevant spec under `docs/product/`
and the ADRs it cites.

## Allowed

- Read any file in the repository.
- Create and edit application code (`app/`, `components/`, `lib/`), content (`content/`), styles,
  config, and docs (`docs/`).
- Propose changes as branches and pull requests.

## Not allowed

- **Break the static export.** No application server, API routes, runtime data fetching,
  middleware, or anything that needs a server at request time — the site ships as `output: 'export'`
  to `out/` (ADR-0001). If `next build` can't emit `out/`, the change is wrong.
- **Edit accepted ADRs** under `docs/design/decisions/` — they are immutable once `accepted`.
  Propose a new ADR that supersedes instead (and set the old one's status to `superseded by NNNN`).
- **Add a shelf-folder README.** `docs/product/`, `docs/design/`, `docs/reference/`, and
  `docs/guides/` carry no README (only epic indexes and the roadmap/issues area indexes do) — see
  the [documentation standard](../maestro/docs/guides/documentation-standards.md).
- **Publish a gated surface** before its prerequisite clears (e.g. portfolio repos pending the
  public-surface scrub, ADR-0004).

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

## Tile copy

Anything that renders as a **card in a grid** — the portfolio `proves` bodies in `lib/site.ts`
above all, but the same applies to any tile added later — is written to a length budget, in every
locale:

- **40-70 words** (~250-450 characters) per card. `lib/site.test.ts` fails the build outside
  35-75 words, and fails again if the longest card is more than twice the shortest.
- **Three sentences at most:** what it is, the single strongest concrete finding (one measured
  number, not an inventory of them), then the run command.
- Cards sit **side by side**. Length is relative: an essay in one tile makes its neighbours look
  thin and gets none of them read. Match the neighbours, don't outdo them.
- Detail that does not fit goes in the linked repo's README or the case study. The card is the
  hook, not the summary — the reader is deciding whether to click, not being briefed.

## Pre-submit checks

Before opening a PR, all must pass (the `dod` workflow enforces them on `main`):

1. `npm run lint`
2. `npm run test`
3. `npm run build` succeeds and produces `out/`.

## Docs as Definition of Done

Docs change in the **same PR** as the code. Update the relevant spec/story and bump
`last_updated`. Acceptance criteria are written in **EARS** form ("WHEN … THE SYSTEM SHALL …").
The repo is spec-driven: product intent precedes design precedes code.
