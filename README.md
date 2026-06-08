# faridgurbanov.com

*A bilingual (EN/NL) personal site and single credibility surface — the architect who builds AI and teaches teams to direct it.*

One URL for three buyer journeys — **training** (L&D / EA leads), **hiring/contract**
(recruiters, hiring managers), and **build-service** clients — under one brand. It is a
**static-exported** Next.js 15 site: no application server, no database; markdown content is
rendered to HTML at build time and served by nginx on the ds1 Docker host (ADR-0001).

The **target** home is training-forward; the **first ship (M0)** leads with credibility
(selected work + portfolio) and carries training as a CTA stub, with the training-forward home
and full Training section landing in **M1** (ADR-0003).

## Stack

- **Next.js 15** (App Router) with `output: 'export'` — static HTML/CSS/JS to `out/`
- **Tailwind CSS** + **shadcn/ui** (Radix primitives, `lucide-react`)
- **react-markdown** + **remark-gfm** for the filesystem markdown content pipeline
- **Vitest** + Testing Library for tests
- **nginx** in a thin Docker image for serving (`infra/docker/`)

## Quick start

```sh
npm install
npm run dev      # next dev on http://localhost:3040
npm run build    # static export to ./out
npm run lint     # next lint
npm run test     # vitest run
```

`npm run build` emits the full static site to `out/`; that directory is what nginx serves —
there is no runtime server.

## Deploy

On merge to `main`, the `dod` quality gate runs (`.github/workflows/dod.yml`); on green,
`deploy-ds1.yml` builds and serves the static export on the **ds1** Docker host. A reverse proxy
on ds1 terminates TLS and routes `faridgurbanov.com` (and the parked `faridgurbanov.nl` →
`/training`). See [`infra/docker/README.md`](infra/docker/README.md).

## Documentation

This site is **spec-driven**: product intent precedes design precedes code.

- [`docs/`](docs/README.md) — documentation index (Product · Design · Reference · Guides · Delivery)
- [`docs/overview.md`](docs/overview.md) — what the site is, in ≤ 6 sentences
- [`CODEBASE.md`](CODEBASE.md) — repo orientation map
- [`GLOSSARY.md`](GLOSSARY.md) — domain terms
- [`AGENTS.md`](AGENTS.md) — instructions for AI coding agents working on this repo

Docs follow the maestro [documentation standard](../maestro/docs/guides/documentation-standards.md).
