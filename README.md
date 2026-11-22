# faridgurbanov.com

*A bilingual (EN/NL) personal site with one job: a visitor who can hire or recommend the owner decides to get in touch. He is a Platform and Integration Architect.*

The site serves three readers (hiring manager, peer, recruiter) and has no courses, no labs and
no portfolio section ([ADR-0010](docs/design/decisions/0010-the-site-has-one-job.md)). It is a
**static-exported** Next.js 15 site: no application server, no database; markdown content is
rendered to HTML at build time and served by nginx on the ds1 Docker host (ADR-0001).

The code still holds pages from the earlier, training-forward positioning (ADR-0003, superseded).
Later stories cut them, each when its copy is approved. The repository is public: read
[`AGENTS.md`](AGENTS.md) before changing any text.

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
`publish-images.yml` builds the site image and publishes it to GHCR. This repository deploys
nothing: a private operations repository deploys the published image by digest. A reverse proxy
on the host terminates TLS and routes `faridgurbanov.com` (and the parked `faridgurbanov.nl` →
`/training`). See [`infra/docker/README.md`](infra/docker/README.md).

## Documentation

This site is **spec-driven**: product intent precedes design precedes code.

- [`docs/`](docs/README.md) — documentation index (Product · Design · Reference · Guides · Delivery)
- [`docs/overview.md`](docs/overview.md) — what the site is, in ≤ 6 sentences
- [`CODEBASE.md`](CODEBASE.md) — repo orientation map
- [`GLOSSARY.md`](GLOSSARY.md) — domain terms
- [`AGENTS.md`](AGENTS.md) — instructions for AI coding agents working on this repo

Docs follow the maestro [documentation standard](../maestro/docs/guides/documentation-standards.md).
