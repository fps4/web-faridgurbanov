---
title: "Notes — Portfolio repos build plan"
status: notes
last_updated: 2026-06-16
owners: [architect]
related:
  - docs/product/FS-0005-portfolio-repos.md
  - docs/design/decisions/0004-public-surface-prerequisites.md
  - lib/site.ts
---

# Portfolio repos — build plan (remediation notes)

Working notes, not a spec. Captures four repos we intend to build so they can join the
[portfolio](../../lib/site.ts) (`repos[]`) as real, honestly-labelled build proof. **These are not
on the live site yet** — a card is added to `repos[]` *only once the repo is real* (see
"Definition of done" per item). Until then this file is the single source of truth for the work.

Each item is self-contained so an agent can pick it up cold. Pick one, read its section, build the
repo in its own repository under `github.com/fps4`, then do the small follow-up PR here (the DoD)
to surface it.

## Why these four

The portfolio is grouped into two pillars (`lib/site.ts` → `pillars`):

- **AI & automation** — currently `sovereign-llm-gateway` (working), `sovereign-copilot`
  (reference), `maestro` (reference). Gap: nothing yet *measures* the AI claims.
- **Integration, streaming & data** — currently `event-integration-platform` (working). Gap: Event Integration Platform produces
  governed streams but there is no downstream data home, no API edge, and the SAP→Snowflake case
  study (`content/*/work/sap-snowflake.md`) has no runnable proof behind it.

The four below close those gaps and cross-link into one story: **SAP → Event Integration Platform → lakehouse →
APIs**, with the eval harness proving the AI side.

## Conventions for every repo

Match the house style already set by `sovereign-llm-gateway` and `event-integration-platform`:

- **Runnable**: `docker compose up` brings the whole thing up locally. A `Makefile` with
  `make up` / `make demo` / `make down`. No paid cloud account required to see it work.
- **Honest README**: what it is, who it's for, architecture-at-a-glance, a quickstart, and an
  explicit "what's real vs reference" line.
- **License**: MIT, `Copyright (c) 2026 Fusion Platform Services – 4 Dimensions of Success`
  (matches Event Integration Platform's `LICENSE`).
- **Docs**: a `docs/` folder with at least a solution-design note; a `CHANGELOG.md`.
- **Naming**: lower-kebab, no client names, no "sovereign-*" unless it's an AI-pillar sibling.
- **ADR-0004 gate**: before the card's link can go live, the repo must satisfy the three
  public-surface prerequisites (one umbrella name, neutralized + licensed, honest framing). The
  global `REPO_LINKS_ENABLED` flag stays `false` until *all* linked repos clear this — so a new
  repo that isn't clean yet does not block others, but also must not flip the flag prematurely.

## Definition of done (per repo — the follow-up PR in *this* repo)

When the repo is real and runnable:

1. Add one entry to `repos[]` in `lib/site.ts` with the right `pillar`, `maturity`
   (`working` if it runs end-to-end, `reference` if it's a readable architecture only),
   `license`, `url`, and `proves` copy in **both** `en` and `nl`.
2. If the new card changes the "two run end-to-end" count, update the `honesty` string in
   `lib/dictionaries.ts` (both locales) to keep the count exact.
3. Run `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` — all green.
4. Leave `REPO_LINKS_ENABLED` as-is unless every linked repo has cleared ADR-0004.

---

## R1 — `llm-eval-harness`  (pillar: ai · target maturity: working)

**What it proves.** The measurement layer behind the "trustworthy" claim on the AI pillar. Lifts
the L1–L4 evaluation gates that `sovereign-copilot` describes out of slideware into a tool you can
run.

**Role line (for the card).** en: "Prove the models behave" · nl: "Bewijs dat de modellen zich
gedragen".

**Proposed stack.** Python (pytest-style runner) or TS; golden datasets as fixtures; an eval CLI;
OpenTelemetry tracing of agent call chains; a small report (HTML/markdown) of pass/fail per level.
Pluggable model backend via the `sovereign-llm-gateway` (so the two demo together).

**Scope — in.** L1 (unit/contract on tool calls), L2 (component), L3 (scenario/golden), L4
(end-to-end) gates; CI wiring (GitHub Actions) that fails the build on regression; a seeded golden
set; a `make demo` that runs all four levels and prints a report.

**Scope — out.** A hosted dashboard; human-labelling UI; vendor-specific eval SaaS.

**Acceptance / "runs end-to-end".** `docker compose up` + `make demo` produces a report showing
each level passing on the seed goldens, and a deliberately-broken golden makes the gate fail
loudly.

**Dependencies.** Reads cleanest if pointed at `sovereign-llm-gateway`; otherwise mock backend.

---

## R2 — `lakehouse-blueprint`  (pillar: platform · target maturity: working)

**What it proves.** The downstream home for Event Integration Platform streams — "land streams as governed data
products". Fills the only expertise pillar (`data-and-lakehouse`) with no proof behind it.

**Role line.** en: "Land streams as governed data products" · nl: "Land streams als beheerde
dataproducten".

**Proposed stack.** Apache Iceberg tables on MinIO (S3-compatible) object storage; Trino and/or
DuckDB query layer; dbt for medallion (bronze/silver/gold) modelling; a catalog — Nessie or
Polaris — for governance/branching. All local via compose.

**Scope — in.** Ingest a sample stream (ideally from Event Integration Platform's HTTP sink or a Kafka topic) into
bronze; dbt models to silver/gold; queryable via Trino/DuckDB; catalog showing schema + history;
a `make demo` that loads sample data and runs a query end-to-end.

**Scope — out.** Real cloud warehouse; petabyte-scale tuning; BI tool integration.

**Acceptance.** `docker compose up` + `make demo` ingests sample events, runs the dbt build, and a
sample query returns gold-layer rows; schema evolution is demonstrably governed by the catalog.

**Dependencies.** Pairs with **R4** (SAP→Snowflake) as the landing target; consumes from
**Event Integration Platform**. Build this before R4.

---

## R3 — `api-platform-blueprint`  (pillar: platform · target maturity: working or reference)

**What it proves.** The public edge in front of the platform — "expose products as governed APIs".
Backs the `apis-and-gateways` expertise.

**Role line.** en: "Expose products as governed APIs" · nl: "Ontsluit producten als beheerde APIs".

**Proposed stack.** Contract-first: OpenAPI specs as the source of truth → mock server (Prism) →
an Envoy or Kong gateway with OIDC auth (Keycloak local) and rate limiting; a small self-service
developer portal (could reuse the Event Integration Platform webapp patterns).

**Scope — in.** One example API defined OpenAPI-first; mock from the spec; gateway enforcing
auth + rate limits in front of a stub upstream; a dev-portal page listing the API with a "try it".

**Scope — out.** Full API monetization/billing; multi-region; production identity provider.

**Acceptance.** `docker compose up` brings up gateway + IdP + portal; an unauthenticated call is
rejected, an authenticated call passes, and rate limiting trips after N calls — shown in
`make demo`. If only the gateway+spec are wired (no live upstream), label the card `reference`.

**Dependencies.** Independent; can sit in front of Event Integration Platform's control-API as the example upstream
for a stronger story.

---

## R4 — `sap-snowflake-accelerator`  (pillar: platform · target maturity: reference, then working)

**What it proves.** Turns the existing SAP→Snowflake case study
(`content/*/work/sap-snowflake.md`) into runnable proof — "move SAP data to the warehouse,
governed". Bridges Event Integration Platform and the lakehouse blueprint.

**Role line.** en: "Move SAP data to the warehouse, governed" · nl: "Breng SAP-data gestuurd naar
het warehouse".

**Proposed stack.** CDC from an SAP-*like* source (no real SAP — use a Postgres/MySQL seeded to
mimic SAP table shapes, or a sample IDoc/OData feed) via Debezium → Kafka (reuse Event Integration Platform) →
schema-governed transforms → land in the **lakehouse-blueprint** (or a Snowflake target behind a
flag for those with an account).

**Scope — in.** Seeded SAP-shaped source; Debezium CDC → Kafka; a transform enforcing a target
schema; landing into Iceberg (default) with a Snowflake option documented; `make demo` showing a
row change at source flowing to the warehouse.

**Scope — out.** A real SAP connector / SAP licensing; production Snowflake setup as the default.

**Acceptance.** `make demo` mutates a source row and the change appears, governed, in the lakehouse
target. Mark `working` once the Iceberg path runs locally end-to-end; `reference` if it ships as
wiring + docs only.

**Dependencies.** Depends on **R2** (lakehouse) as the default sink and on **Event Integration Platform** for the
Kafka backbone. Build last of the four.

---

## Suggested build order

1. **R2 lakehouse-blueprint** — unlocks the data pillar and is R4's sink.
2. **R1 llm-eval-harness** — independent, strengthens the AI pillar; can run in parallel with R2.
3. **R4 sap-snowflake-accelerator** — needs R2; converts an existing case study to proof.
4. **R3 api-platform-blueprint** — independent; strongest once it can front Event Integration Platform/the platform.

## Open questions for the owner

- Snowflake in R4: keep it as a documented-but-optional target (no account needed to demo), or
  make a real Snowflake the default? Default assumption here: Iceberg-local is the demo path,
  Snowflake behind a flag.
- R3 maturity: is a gateway+spec+mock enough to call it `working`, or does "working" require a
  live upstream? Default assumption: needs a live upstream (Event Integration Platform control-API) to be `working`.
- Repo homes: confirm all four live under `github.com/fps4` with MIT + the FPS-4D copyright.
