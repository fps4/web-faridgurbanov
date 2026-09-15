---
title: One policy, two compilers
summary: An export-control policy has to hold on Unity Catalog and on Fabric at the same time, and nobody keeps two admin consoles in sync by hand. So the policy is data, and two compilers turn it into what each platform can enforce. 22 ABAC policies and tags that carry their own provenance on one side, 20 static roles and four tenant settings on the other. The gap between the two only became visible because it was generated.
date: 2026-09-20
order: 1
---

# One policy, two compilers

In [the previous piece](/en/writing/export-control-who-sees-what) I argued six decisions for a lakehouse under export control. This one is about what happens after the decisions. The policy has to exist on Databricks Unity Catalog *and* on Microsoft Fabric, identically, for years, while both platforms ship every month. Nobody keeps two admin consoles in sync by hand. So in [`export-controlled-lakehouse`](https://github.com/fps4/export-controlled-lakehouse) the policy is data, an engine evaluates it, and **two compilers** emit what each platform can enforce and, in the same output, what it cannot.

The gap between the two platforms is the interesting part, and it only became visible because something generated both sides.

## The policy is six YAML files

Everything the engine reasons about is under `config/`. The taxonomy names four tiers and four regimes, each with its unit of control (the person and the key, the border, the country, the contract) and the declassification rule the engine is allowed to check on its own. The regions file names geographies, disaster-recovery pairs and the tenant's home region. The platforms file carries what each platform enforces and where it can put data down, every claim dated.

Then the estate: thirty-one assets, from raw plant telemetry through cleaned tables, features, KPIs, shares, a model, an endpoint, an export, an agent, each with its lineage. Only a source declares a control:

```yaml
- id: raw_telemetry_tw
  region: taiwannorth
  declared: ["US-EAR:3B001", "EU-DU:3B001", "CUST:fab-tw-01"]
  derivation: source

- id: features_uptime_tw
  region: taiwannorth
  inputs: [clean_telemetry_tw, fleet_calendar]
  derivation: aggregate
  carries_parameters: false
  min_group_size: 1
```

The loader refuses `declared` on a derived asset. Classification enters at a source and nowhere else.

The principals file is interesting for what it lacks. Six people, each with a home country and a list of groups (`xc-auth-US-EAR-3B001`, `xc-lic-EU-DU-3B001`, `cust-fab-de-01`), and no nationality field. The loader refuses one on the field's *name*, because the failure mode is an HR feed with one column too many.

And the ledger, the only thing in the repository that removes a control:

```yaml
- id: DCL-0005
  asset: kpi_availability_cn
  removes: ["CN-DSL:important"]
  grounds: outbound_assessment
  reference: "CAC outbound data security assessment, file 2026-XXXX (placeholder)"
  decided_by: export-control-officer
  expires_on: 2027-08-15
  covers_downstream: true
```

An entry citing a *rule* is checked against the asset (group size, whether a parameter survives, whether free text survives) and refused if it does not hold. An entry citing an assessment or a judgement is taken on its record. The engine can show that it exists and when it lapses. It cannot second-guess it.

## What the engine does before any compiler runs

Three things, in order. It **propagates**: every derived asset inherits every control of every input, with the source it came from, and a removal travels downstream only when the entry says so. It **validates the ledger**, and on the invented estate refuses one entry; `public_fleet_summary` was declassified on the aggregate rule, and it aggregates over five machines with the parameters still in it. And it **evaluates**: for a principal, a place, an asset and a purpose, four rules run in a fixed order (in-country boundary, authorisation, place of access, exit) and the first refusal decides.

The output of that last step is `explain`, the sentence a regulator asks for:

```
AGGREGATE_ONLY  P-ENG-NL-B · from NL · read · clean_telemetry_eu
  carries   EU-DU:3E001   from machine_master
            US-EAR:3B001  from raw_telemetry_eu
  because   X2 authorisation
            US-EAR:3B001: not authorised (needs group xc-auth-US-EAR-3B001)
  instead   kpi_availability_eu, share_kpi_eu, kpi_global_availability
```

Every control names the source it came from; every refusal names the group that was missing; every denial that has a declassified product from the same sources offers it. The compilers read the same propagated state, so both platforms answer the same question the same way, where they can.

## Compiler one: Unity Catalog

The first compiler writes SQL and JSON under `build/unity_catalog/`. Eight catalogs: one per geography for the logical tiers, one per geography for the export-controlled tier, and one in a *separate file* for the Chinese estate, because Azure China is a different account and metastore and nothing in the main file can reach it.

Then tags. 47 `ALTER TABLE` statements, one key per control, and the value is the source the control came from:

```sql
ALTER TABLE xc_t2_eu.estate.clean_telemetry_eu SET TAGS (
  'xc_tier' = 'T2',
  'xc_EU_DU_3E001' = 'machine_master',
  'xc_US_EAR_3B001' = 'raw_telemetry_eu', ...);
```

A tag that carries its own provenance is a small thing that changes a lot. The governance console now shows *why* a table is controlled, and a declassified product shows which entry removed what (`xc_removed_by = 'CN-DSL:important:DCL-0005'`).

Then 22 ABAC policies, scoped to the controls each catalog holds. One per regime-level control, keyed on the tag, tested against the caller's account groups every time a query runs:

```sql
CREATE OR REPLACE POLICY rf_xc_US_EAR_3B001
  ON CATALOG xc_t2_eu
  ROW FILTER xc_t2_eu.xc_security.require_xc_US_EAR_3B001
  TO `account users`
  FOR TABLES
  WHEN has_tag('xc_US_EAR_3B001');
```

And one for the customer regime, where the group name is derived from the row itself, `is_account_group_member(concat('cust-', customer_id))`, matched on a column tag. Grants go to the union of groups a physical catalog's assets need; bindings isolate a controlled catalog to the workspaces in its region; Delta Shares carry the four KPI products and nothing else.

Then a Markdown file of what SQL cannot say: keys per workspace, sharing enabled only where a share exists, the assistant off on controlled workspaces, the audit tables to keep. And one plain admission. This compiler cannot label a file that leaves a notebook, so the policy refuses the export and points at a share instead.

## Compiler two: Fabric

The second compiler writes JSON and Markdown under `build/fabric/`. Six capacities, one per boundary and geography, and none in China, because the F-SKU region table lists no China region. Six workspaces, each with its items and a note that OneLake security does not restrict Admins, Members or Contributors, so those roles belong to the platform team only.

Then 20 OneLake security roles, and here the shape changes. Unity Catalog got one *policy* per control. Fabric gets one *role* per regime-and-category with object-level security over the tables carrying it, and one role per customer with a **static** predicate:

```json
{ "role": "cust-fab-de-01",
  "row_level_security": { "predicate": "customer_id = 'fab-de-01'" },
  "evaluated": "role membership; the predicate is static" }
```

The documentation says OneLake RLS roles do not support dynamic queries, so there is no `current_user()` to derive a group from. "Who" on Fabric is membership of a role whose filter is fixed, and a change in authorisation is a change of role.

Then 26 sensitivity labels from the tier, three shortcuts allowed into the roll-up workspace and one refused, the four cross-geo Azure OpenAI tenant settings by their exact names with the expected value *Disabled* for the Taiwan capacities, a note quoting what Multi-Geo leaves in the home region, and `no_home.md`: four assets that rest in China and are emitted nowhere above.

## Where the two platforms meet, one row per decision

| | Unity Catalog emits | Fabric emits |
|---|---|---|
| **Who** | 22 policies, evaluated per query | 20 roles, static predicates |
| **Provenance** | tags naming the source and the removing entry | item labels from the tier; no row or column propagation |
| **Boundary** | catalogs bound to workspaces; a separate account for China | capacities per region; no China capacity |
| **Crossing** | four Delta Shares of products | three shortcuts; the Chinese one has no source |
| **Export** | refused; nothing travels with a notebook's file | allowed; the label travels |
| **Assistant** | a workspace setting | four tenant settings, named |

None of those rows is a verdict on either product. They are the same six decisions landing on two different enforcement models, and the point of generating both is that the differences end up in a file, where somebody other than the author can read them.

## Two things a compiler refuses

The estate contains a replica of the Chinese cleaned telemetry, materialised in West Europe "so the model can train on it". The policy flags it as a placement finding. Both compilers **refuse to emit it**: no catalog, no workspace, no label. A compiler that builds a home for a placement violation has made the violation permanent. This one names it in the manifest and stops.

And a share of anything above the base tier is refused before the compiler sees it. The four shares that exist are the four KPI products, and each carries the ledger entry that declassified it.

## What validate proves, and what would make it real

`infra/` holds two Terraform modules that read the compiled manifests (catalogs, bindings, shares, recipients; capacities, domains, workspaces) and CI runs `terraform validate` against the real provider schemas. That proves the compilers emit shapes the providers accept. It proves nothing about a real estate, and it stops there by design: no subscription, no account, no capacity stands behind this repository.

What would make it real is short and specific. A Databricks workspace to apply the SQL to; the ABAC grammar was checked against the current reference, but a grammar check is not a run. A Fabric trial capacity to create the roles on. And the measurements neither platform's documentation gives you: whether `MATCH COLUMNS` finds a column tag set by `ALTER COLUMN`, what a Fabric shortcut across a geography moves, and what the assistant sends as context. Each of those is an afternoon, and each one turns a dated claim in `config/platforms.yaml` into a number.

## Why compile at all

Because a policy that lives in two consoles is two policies. The moment it is data with two compilers behind it, disagreement becomes a pull request against `config/`. Change a regime's allowed geographies, a principal's groups, a ledger entry's expiry, and both platforms' artefacts re-render with the consequence attached, and CI refuses the commit if the committed artefacts no longer match the code.

That is the same loop as the [SAP↔Snowflake seam](/en/writing/sap-snowflake-seam-decision) and the [Synapse estate](/en/writing/synapse-platform-decision), one layer further in. There the decision was which platform or which mode. Here it is what the platform is told, in its own terms, and whether it can be told at all.

*The repo is public and MIT-licensed: [github.com/fps4/export-controlled-lakehouse](https://github.com/fps4/export-controlled-lakehouse). `make demo` writes everything quoted above in a few seconds; start with `build/unity_catalog/20_policies.sql` and `build/fabric/onelake_security_roles.json` side by side. That pair is where the two platforms meet.*
