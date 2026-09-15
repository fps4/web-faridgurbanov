---
title: Deciding who may see what, and from where
summary: Export control does something to a lakehouse that GDPR never did. The same row gets three different answers depending on who asks, from where, and what it was derived from. Six decisions for a data platform under export control, one policy compiled to both Unity Catalog and Fabric, and the two findings that mattered most. The border is not the region, and classification is not a property of a table.
date: 2026-09-13
order: 1
---

# Deciding who may see what, and from where

The same row can lawfully be shown to one engineer in Veldhoven and not to the engineer at the next desk. To the first engineer from the office and not from a hotel in a third country. And to nobody at all once it has been joined to the wrong table. Data governance under export control is the discipline of giving those three answers by design, on a platform built to give one.

The setting I have in mind is a European maker of export-controlled equipment with machines in customers' plants in every major market, each sending telemetry home; defence, aerospace and medical devices have the same shape. I built [`export-controlled-lakehouse`](https://github.com/fps4/export-controlled-lakehouse) to work the problem in the open: one export-control policy, written as data, **compiled to Databricks Unity Catalog and to Microsoft Fabric**, with the join between them left visible. It runs on a laptop with no subscription behind it.

## Three regimes, three units of control

This is hard because three regimes apply to the same table and each attaches its control to a different thing. The strictness of the rules is the smaller problem.

| Regime | What it attaches to | Unit of control |
|---|---|---|
| US export control (EAR, ITAR) | the *technology*, wherever it sits | the person and the key |
| EU dual-use (Reg. 2021/821) | the *crossing* of the Union border | the border, and *availability* to a person outside it |
| The customer's national data law | the *data*, in the country it was produced | the country |

Releasing controlled technology to a foreign person is a US export to that person's country, even inside the Netherlands. *Making available in an electronic form* technology to a person outside the customs territory is an EU export, and one national authority reads "made available" as *could have accessed*. Telemetry from a plant in China may be "important data" that does not leave without an assessment. GDPR sits across all three: a nationality column on every user is itself a processing problem.

So the question is never *which region*. It is: for this row, derived from these inputs, requested by this identity from this place, allow, deny, or aggregate-only, and why. Six decisions answer it, in order.

## D1 — The unit of control is lineage

Classify each table, tag it, grant by tag. That is true on the day it is done, and it drifts from then on, because controlled tables are *inputs*. They get joined, aggregated, featurised and trained on, and the results are new tables nobody classified.

So the unit of control is the asset **through its lineage**. Every derived asset inherits the strictest control among its inputs, with the source it came from, and keeps it until a **recorded declassification decision** removes it. A tag is the output of that rule, never the input.

The decision is a record: which asset, on what grounds, who took it, when it expires. Where the grounds are a rule (*at least twenty-five machines per group, no controlled parameter, no free text*) the engine checks it and refuses the entry if it does not hold. Where they are a regulator's assessment or a named person's judgement, it takes the entry on its record and cannot second-guess it.

Databricks is building the first half of this; governed-tag propagation through lineage went into private preview in June 2026. Nobody ships the second half. The ledger is what a regulator asks for, and it lives outside both platforms.

On the invented estate, lineage finds **four of twenty-four derived assets** that are export-controlled by what they were made from and open by what they were called: a feature set, a serving endpoint, a data agent, and a view somebody named `public_fleet_summary`. It refuses one ledger entry. That summary was declassified on the aggregate rule, and it aggregates over five machines with the parameters still in it.

## D2 — Authorisation groups, never nationality

The deemed-export rule invites a nationality column. Data minimisation asks why a data platform holds citizenship at all, and "to run a `WHERE`" is not a good answer. And whether a person is authorised for a category is not a column; it is a decision the export-control function takes, records and revisits.

So the platform stores nothing about origin. Identity carries **authorisation groups** issued by the export-control function: one per regime and category, a second kind for a licence to receive across a border, a third per customer. The policy evaluates groups held against controls carried; it sees that a caller is authorised and never sees why. The loader refuses a principal record with a nationality-shaped field, on the field's name, because the failure mode is an HR feed with one column too many.

## D3 — The border is the key

The region map is the first thing everyone draws, and it is necessary. It is not sufficient, for three reasons.

The first is in the regulation. Under 22 CFR §120.54 and 15 CFR §734.18, storing or sending *unclassified* controlled technical data abroad is **not an export** when it is end-to-end encrypted with FIPS-validated modules at AES-128 strength or better, not intentionally stored in a proscribed country, and "the means of decryption are not provided to any third party". The bytes may sit in Dublin; the control point is the key and the authorised recipient. The carve-out is narrow (storage and transmission, not release) and silent on a platform decrypting a table to serve a query. The design assumes the stricter reading, so that silence does not matter to the estate.

The second is on the vendor's own page. Fabric's Multi-Geo documentation puts compute and storage in the capacity's region, then says report metadata *including tile queries* and permissions stay in the home region, certain features "process data in the home region", and "data in transit might go back and forth between multiple geographies". Region-only is not a residency guarantee even for the people who sell the region.

The third is the EU test: *availability* to a person outside the Union. A region-perfect estate reachable from anywhere fails it.

So there are three borders, each necessary. **Region**: data at rest inside an allowed geography, replication inside the same geography, no cross-geography shortcuts for controlled tiers. **Key custody**: customer-managed keys per controlled tier, the key vault's access policy mirroring the authorisation groups, so that who can cause decryption and who is authorised are the same list. **Place of access**: refused at the identity layer, before the data layer ever sees the request.

## D4 — Physical where a bypass is a breach, logical below

Row filters and security roles are cheap and fine-grained, and they have documented bypasses on both platforms. OneLake security is a grant model. It cannot deny, and it does not restrict workspace Admins, Members or Contributors at all. Unity Catalog owners can alter policies. Anyone who may create a shortcut or a share can move data past every row filter.

Where a bypass is an inconvenience, logical control is enough; where it is a regulatory breach, it is not. So the boundary is chosen per tier. Internal and confidential data share a geography's logical container. Export-controlled data gets its own catalog and workspaces on Unity Catalog, its own capacity and workspace on Fabric, its own keys. Data that may not leave the country of the plant gets a separate estate.

That last tier is where the platforms answer differently, as fact rather than opinion. Azure Databricks is generally available in Azure China, a physically separate cloud with its own tenant, account and metastore: a second estate, with nothing shared with the first. Fabric's F-SKUs are listed for public-cloud regions only; there is no China region. The Chinese plant's telemetry has a Databricks home as a separate estate and no Fabric home at all, and the engine reports that as a result.

A second asymmetry lands here. Unity Catalog evaluates an ABAC policy per query against the caller's groups, while a OneLake security role carries a static predicate, so the same policy compiles to one policy on one platform and one role per regime-and-category on the other.

## D5 — Aggregate out; nothing else crosses

The global dashboard needs one number per region from data that may not leave any of them. *Replicate then filter at the destination* puts the last line of defence on the wrong side of the border. *Federate across the border* moves the result set and leaves the compute location ambiguous. So cross-border consumers receive *products*, computed inside the region and declassified under D1, through a governed share whose recipient and lineage are recorded. Raw and feature-level data never cross.

The simulation measures the difference. For the global availability KPI, replicate-and-filter would move **82,800** telemetry rows into West Europe, 25,200 of them a violation the moment they land. Aggregate-out moves **fifteen**, and the KPI is exact to the last digit, because the product carries a numerator and a denominator rather than a percentage.

## D6 — Every exit has a name

Access control describes the front door; export control asks about every door. So the exits are enumerated (file exports, notebook output, shares and shortcuts, backups, vendor support, logs), each under a named control, the uncontrollable ones accepted in writing. Three of them are new.

A model trained on controlled parameters embodies them, so the artefact is an asset with the training data as parents, and the serving endpoint is the model. On the estate, a failure-prediction model inherits **eight controls** through eleven ancestors; the US analyst calling its endpoint holds groups for three, and two of the missing ones arrived through the machine master, three hops from anything the author named.

An assistant is an exit. Fabric has four tenant settings, off by default, that allow data sent to Azure OpenAI to be processed or stored outside the capacity's region; they apply outside the EU Data Boundary and the US, which on this estate means Taiwan. The same authorised data scientist asking about Taiwan telemetry gets, with the settings off, no assistant and nothing leaving; with them on, **36,000 rows** become prompt context processed outside Taiwan. The policy denies it. The platform would not. And Fabric's own page says a data agent consumed from another service "or as an MCP server" may send responses outside the compliance boundary, so an agent over a controlled asset is a share, and shares carry only products.

The Excel export is the cleanest picture of the join between the two platforms. The same engineer, the same 750 rows of parameter drift: on Fabric the file leaves with the *Export Controlled* label and its protection; from a Unity Catalog notebook nothing travels with the file, so the policy refuses the export and points at a share of a product. One policy, two answers, both correct.

All of this is only worth doing if the estate can later answer, for any row, *who saw it, from where, under which authorisation, because of which rule, under which decision*. Five parts in four places, and the repo's `explain` joins them into one sentence. If a regulator's question cannot be answered by `explain`, the design is wrong.

## What the artefact is, and is not

Stated as plainly here as in the README. No Azure subscription, Databricks workspace or Fabric capacity is involved; DuckDB stands in, and the platform artefacts are generated and validated, never applied. Row counts, what crosses and the exactness of an aggregate are measured; neither platform's enforcement is. The estate is invented. Nothing here is legal advice. The regulations are quoted and dated, the grey areas named as grey, and the export-control officer's reading wins. Every capability claim carries the date it was checked. The durable artefact is the policy and its explanation; the SQL is generated from them.

## Who had to say yes

The export-control officer, who owns the ledger and issues the groups, and was asked to trade a spreadsheet they controlled for a record other people can read. Legal, who had to accept that the platform would never hold the field they were used to filtering on. The customer whose telemetry it is, who had to see that fifteen rows a month would leave their country, and exactly which. The platform team, who gave up Admin on every controlled workspace because the security model cannot deny them. And the data scientists, who lost a replica built in good faith and got back a model that explains its own classification.

None of them could be ordered. Each of them could be shown the line in `config/` that produced the answer, change it, and see what moved.

*The repo is public and MIT-licensed: [github.com/fps4/export-controlled-lakehouse](https://github.com/fps4/export-controlled-lakehouse). Start with `docs/design-decisions.md`, the six decisions argued, then `reports/simulation.md`, where every number above comes from.*
