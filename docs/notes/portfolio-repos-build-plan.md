---
title: "Notes — Portfolio repos build plan"
status: notes
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/product/FS-0005-portfolio-repos.md
  - docs/design/decisions/0006-portfolio-restructure-data-architecture.md
  - lib/site.ts
---

# Portfolio repos — build plan

Working notes, not a spec. **A card is added to `repos[]` in `lib/site.ts` only once the repo is
real** — until then it lives here. Each item is self-contained so an agent can pick it up cold.

## Where the portfolio stands after ADR-0007

Three pillars, seven repos, named after what a client engages an architect to do:

| Pillar | Repos |
|---|---|
| **Data architecture & modelling** | `enterprise-data-model-lab` ✅ *(built 2026-08-20)* · `sap-bdc-snowflake-blueprint` |
| **Modernization & migration** | `legacy-dwh-migration` ✅ *(built 2026-08-20)* · `oracle-to-spring-strangler` |
| **Integration & platform services** | `event-integration-platform` · `identity-service` · `skills-coach` |

Removed from the public surface across ADR-0006 and ADR-0007: `sovereign-llm-gateway` and
`sovereign-copilot` (never cleared the ADR-0004 prerequisites), the two contrail demos, and
`retail-dynamic-pricing` + `marketplace-intel-platform` (good work, but applied data science invited
the wrong conversation for a data/integration architect). All still exist on GitHub; none are part
of the pitch.

## ⚠ R1 and R2 are built but not pushed

Both repositories exist locally under `~/Repositories/fps4/`, are committed, and pass
`make lint && make test && make demo`. They are listed in `lib/site.ts` with **`linkLive: false`**,
so their cards render without a link rather than with a dead one.

**To finish:** create `github.com/fps4/enterprise-data-model-lab` and
`github.com/fps4/legacy-dwh-migration`, push, then remove `linkLive: false` from both entries. That
is the only remaining step.

## The gap these two closed

The seven repos prove **pipelines, platforms and serving**. For a data-architect or lead-architect
conversation two things are still missing, and they are exactly what a client interviews for:

1. **Modelling craft.** Nothing on the surface shows conceptual → logical → physical modelling, a
   dimensional design, slowly-changing dimensions, or a business glossary. `sap-bdc-snowflake-blueprint`
   decides *what moves*; nothing shows *what the target looks like when it lands*.
2. **The shape of a transformation programme.** `oracle-to-spring-strangler` does this for
   applications — assessment, waves, parity gates, rollback. There is no data-side equivalent, and
   the data-side version is what a legacy-DWH migration client is actually buying.

**Both are now built** — what follows is the specification they were built to, kept as the design
record. R3 remains optional.

## Conventions for every repo

- **Runnable**: `docker compose up` or `make demo` brings it up locally. No paid cloud account
  required to see it work. Synthetic data with a known ground truth wherever a claim is measured.
- **Honest README**: what it is, who it is for, architecture at a glance, quickstart, and an
  explicit "what is real vs what is synthetic" line, plus where real data would go instead.
- **License**: MIT, `Copyright (c) 2026 Fusion Platform Services – 4 Dimensions of Success`.
- **Docs**: a `docs/` folder with at least a solution-design note; a `CHANGELOG.md`.
- **Naming**: lower-kebab, no client names.

## Definition of done (per repo — the follow-up PR in *this* repo)

1. Add one entry to `repos[]` in `lib/site.ts` with the right `pillar`, `maturity`, `license`,
   `url`, and `proves` copy in **both** `en` and `nl`.
2. Update the `honesty` string in `lib/dictionaries.ts` (both locales) so the repo count stays exact.
3. `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` — all green.
4. If the repo is not yet fit to link publicly, set `linkLive: false` on its card and flip
   `REPO_LINKS_ENABLED` to `false` rather than shipping a broken promise.

---

## R1 — `enterprise-data-model-lab` ✅ BUILT (pillar: data · maturity: working)

**The gap it closes:** modelling craft. This is the single most useful addition for a data-architect
pitch, because modelling is the one thing every data-architect interview probes and the current
portfolio is silent on it.

**The idea.** One retail domain (orders, customers, products, stores, promotions) taken through the
full modelling stack in one repository, so a reader can see the same business fact expressed four
ways and understand why each layer exists:

- **Business glossary** — terms, definitions, owners, and the metric definitions that follow from
  them. Machine-readable (YAML), rendered to a page. This is the artifact that makes "one version
  of the truth" concrete instead of a slogan.
- **Conceptual model** — entities and relationships, no keys, no types. The version a business
  stakeholder can correct.
- **Logical model** — normalised 3NF with keys, cardinalities and constraints, generated as ERDs.
- **Physical models — two, deliberately.** A **dimensional / Kimball** layer (conformed dimensions,
  fact grain stated explicitly, **SCD Type 2** on customer and product, a date dimension, a bridge
  for a many-to-many) and a **Data Vault 2.0** raw vault (hubs, links, satellites) with a business
  vault on top. Both fed from the same source, so the repo can show *when each is the right answer*
  and what each costs — which is the actual architectural decision, not the modelling technique.
- **The transformation code** — dbt (or SQLMesh) on **DuckDB** so it runs on a laptop in seconds,
  with tests: uniqueness, referential integrity, SCD2 correctness (no overlapping validity windows,
  exactly one current row), and grain assertions on every fact.
- **Lineage** — generated from the dbt graph, column-level where the tooling allows.

**What it proves:** that the architect can model, not just pipe. And the Kimball-vs-Data-Vault
comparison in one repo is a genuinely strong interview artifact — it turns a religious argument into
a costed one.

**Scope discipline:** one domain, done properly. The temptation is five domains done shallowly, and
that proves less.

---

## R2 — `legacy-dwh-migration` ✅ BUILT (pillar: modernization · maturity: working)

**The gap it closes:** the shape of a transformation programme, on the data side. Sibling to
`oracle-to-spring-strangler`, and deliberately the same narrative arc so the two read as one method
applied twice.

**The idea.** A legacy Oracle / SAP BW–style warehouse migrated to a lakehouse, wave by wave, with
the programme artifacts as first-class code rather than slideware:

- **As-is assessment, generated not written.** Crawl the legacy warehouse: object inventory, row
  counts, storage, job dependencies, and — the part people skip — **usage telemetry**, so the repo
  can show that 40% of the estate has not been queried in a year. Nothing changes a migration
  business case faster than that number.
- **A scored wave plan.** Each object scored on business value, query frequency, upstream
  dependency depth and migration effort, producing an ordered wave plan you can argue with. The
  scoring weights are config, so a client can change the weights and watch the plan change — which
  is what makes it a conversation instead of a recommendation.
- **A parity harness.** Old-versus-new reconciliation: row counts, control totals, measure-level
  comparison per grain, with a tolerance policy and a signed-off report per wave. This is the
  artifact that actually earns sign-off, and it is the data-side equivalent of the golden-master
  gate in `oracle-to-spring-strangler`.
- **A cutover and rollback runbook** per wave, with a routing layer so consumers move one report at
  a time and a rollback is a config change.
- **A decommission ledger.** What was retired, when, what it cost to run, what is now saved.
  Running total. Nobody ever builds this, and it is what makes a decommissioning programme
  defensible to a CFO two years in.
- **A business case model** — the legacy run cost, the migration cost, the target run cost, and the
  break-even month, as a transparent model rather than a spreadsheet screenshot.

**What it proves:** that the architect can run a transformation, not just design a target state.
Assessment → sequencing → parity → cutover → decommission → benefit realisation is the whole arc,
and most portfolios show none of it.

**Cross-link:** this is the repo to point at when a client asks "how would you approach our
migration?" — which is the first question in almost every data-architect interview.

---

## R3 — `data-contracts-and-governance` (pillar: platform · target: working) — optional

Only worth building after R1 and R2. Would close the governance gap: data contracts as versioned
code with compatibility rules, a quality gate in CI, ownership and stewardship metadata aligned to
DAMA-DMBOK, and a privacy/classification layer (PII tagging driving masking policies). It has
strong overlap with what `event-integration-platform` and `sap-bdc-snowflake-blueprint` already show,
so the marginal value is lower — but it is the direct evidence behind the "contracts at the seam"
claim that runs through the SAP→Snowflake case study and the stakeholder material.

---

## What was actually built, versus the spec

Both repos match the specification above with three deliberate simplifications, each recorded as an
ADR in the repo itself rather than left implicit:

| Spec said | Built | Why |
|---|---|---|
| dbt or SQLMesh | Numbered plain-SQL files run in order | A reader sees the modelling, not the tool — the SCD2 window logic and the point-in-time join are on screen rather than behind a macro (`edml` ADR-0002). Migration to dbt is mechanical. |
| Column-level lineage | Object-level, declared | Parsing PL/SQL or BW transformations is its own project, and object-level is enough to sequence waves (`ldm` ADR-0002). Named as the largest piece of missing work. |
| — | One parity defect injected on purpose | Not in the spec, added during the build: a gate that has never failed is not evidence that the gate works (`ldm` ADR-0003). |

**Assumptions taken, all defaulted as proposed and open to correction:** DuckDB local with Snowflake
as a documented path rather than the default; an Oracle-shaped legacy source in R2 with the README
noting SAP BW is the same method and different extractors; one domain in R1 with two subject areas
so conformed dimensions are visible without doubling the build.

## Next

1. **Push R1 and R2**, then drop `linkLive: false` from both cards.
2. **R3 `data-contracts-and-governance`** only if there is still appetite — the marginal value is
   lower now that R1 carries the glossary and R2 carries the parity policy.
