# infra/docker

The static site (ADR-0001) packaged for the **ds1 Docker host**.

| File | Purpose |
|---|---|
| `web.Dockerfile` | Multi-stage build: Next.js static export (`output: 'export'` → `out/`) served by a minimal nginx. |
| `nginx.conf` | Serves the export — clean URLs → `.html`, immutable caching for `/_next/static`, gzip. |
| `compose.yml` | One `web` service; built from the repo root context. |
| `.env.example` | Host config (`IMAGE_TAG`, `NEXT_PUBLIC_SITE_URL`, `WEB_BIND`, `WEB_PORT`). Copy to `.env` on ds1. |

## Published image

`.github/workflows/publish-images.yml` builds the same image on a GitHub-hosted runner after a green
`dod` on `main` and publishes it as `ghcr.io/fps4/faridgurbanov-web`, tagged `:<commit sha>` and
`:main`. It is scanned before the push (a fixable critical blocks it), carries a CycloneDX SBOM, and
has build provenance attested against its digest:

```sh
gh attestation verify oci://ghcr.io/fps4/faridgurbanov-web:main --repo fps4/web-faridgurbanov
```

It deploys nothing. A deploy that pulls this image by digest will replace the in-place build below;
until then, the build below is what runs the site.

## Deploy

On merge to `main`, the `dod` gate runs; on green, `.github/workflows/deploy-ds1.yml` runs on the
`[self-hosted, ds1]` runner and executes:

```sh
docker compose -f infra/docker/compose.yml up -d --build
```

A reverse proxy on ds1 terminates TLS and routes `faridgurbanov.com` to `WEB_PORT`, and parks
`faridgurbanov.nl` with a redirect to the training surface — `https://faridgurbanov.com/nl/training`
(ADR-0003). The redirect target is locale-specific: the site has no content at a bare `/training`,
only `/en/training` and `/nl/training`, and `.nl` serves the NL audience. Docker is only at the
serving edge — the app itself stays a pure static export.

> **US-0004 — what is in this repo vs. host ops.** The static-export image, the `dod` gate, and the
> chained `deploy-ds1` workflow are in the repo and run on merge to `main`. The DNS records, TLS
> certificates, and the `.nl → /nl/training` reverse-proxy redirect are **ds1 host configuration**,
> set once on the host — they are not built or tested by this repo.
