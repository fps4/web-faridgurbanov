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

It deploys nothing; the deploy pulls this image by digest.

## Deploy

This repository deploys nothing. On merge to `main`, `dod` runs. On green, `publish-images` (above)
publishes the image, and a private operations repository deploys it to the host by digest after
verifying its provenance. The local equivalent of what runs there is:

```sh
docker compose -f infra/docker/compose.yml up -d --build
```

A reverse proxy on the host terminates TLS and routes `faridgurbanov.com` to `WEB_PORT`, and parks
`faridgurbanov.nl` with a redirect to the training surface: `https://faridgurbanov.com/nl/training`
(ADR-0003). The redirect target is locale-specific. The site has no content at a bare `/training`,
only `/en/training` and `/nl/training`, and `.nl` serves the NL audience. Docker is only at the
serving edge; the app itself stays a pure static export.

> **US-0004: what is in this repo vs. host ops.** The static-export image, the `dod` gate and the
> `publish-images` workflow are in the repo and run on merge to `main`. The deploy, the DNS records,
> the TLS certificates and the `.nl → /nl/training` reverse-proxy redirect are **host
> configuration**, kept outside this repository. They are not built or tested by it.
