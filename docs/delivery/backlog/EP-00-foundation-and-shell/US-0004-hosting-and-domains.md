---
title: "US-0004: Hosting + domain wiring (.com live, .nl parked to /training)"
persona: architect
status: draft
complexity: S
milestone: M0
last_updated: 2026-06-09
spec: docs/product/FS-0001-site-shell-and-content-pipeline.md
design: docs/design/decisions/0003-single-site-training-forward-positioning.md
---

## Story

As the architect,
I want the static export built into an nginx image and deployed to the ds1 Docker host, with the
production domains wired,
so that the bilingual site is reachable at `faridgurbanov.com` and `faridgurbanov.nl` is parked
toward the training surface, satisfying the M0 "domain points at the deployed site" gate.

## Context

Closes the roadmap's cross-cutting setup and DoD item 5: build the `output: 'export'` site from
US-0001 into the nginx image (`infra/docker/web.Dockerfile`), deploy it to the ds1 Docker host via
the self-hosted runner (`.github/workflows/deploy-ds1.yml`), point the already-owned
`faridgurbanov.com` at the host's reverse proxy, and park the already-owned `faridgurbanov.nl`
redirecting to `/training` per ADR-0003. The static-export, no-application-backend constraint
follows ADR-0001. Depends on US-0001 (the static export must build first).

## Acceptance criteria (EARS)

- THE SYSTEM SHALL serve the static export from an nginx container on the ds1 Docker host with no
  application backend, built from the US-0001 `output: 'export'` pipeline.
- THE already-owned `faridgurbanov.com` domain SHALL resolve to the deployed site over HTTPS (TLS
  terminated by the ds1 reverse proxy).
- THE already-owned `faridgurbanov.nl` domain SHALL be parked, redirecting to the `/training`
  surface (ADR-0003).
- WHEN a commit is merged to `main`, THE SYSTEM SHALL rebuild the image and redeploy the container
  via the self-hosted runner with no manual server steps (after the `dod` gate is green).

## Out of scope

- The training-forward content the `.nl` redirect points at (EP-02, M1) — M0 only wires the
  redirect target.
- Per-page content and i18n wiring (US-0002/US-0003 and EP-01/EP-02).

## Notes

The `.nl` redirect target may be the M0 training stub (US-0020) until the full Training section
ships in M1. nginx serves static files only — Docker is at the serving edge, with no application
runtime (ADR-0001). The TLS/reverse-proxy and DNS records on ds1 are host config, set once.
