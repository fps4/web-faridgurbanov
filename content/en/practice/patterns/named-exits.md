---
id: P-05
order: 5
title: "Named exits"
summary: "List every way data leaves, models, assistants and agents included, each with a control and an owner."
status: current
revised: 2026-11-08
related: [practice/articles/export-control-who-sees-what, P-03]
topics: [governance, ai]
tech: [fabric]
---

## Problem

Access control describes the front door: who may read a table. Data also leaves through doors
nobody listed, such as a file export, notebook output, a share, a backup, vendor support or the
logs. With AI in the estate there are new doors, and they are easy to miss.

## Forces

- Platforms add exits with new features, often switched on by tenant settings far from the data
  team.
- A model trained on controlled data embodies it, and its serving endpoint is an exit.
- An assistant sends data to a model as prompt context, possibly processed in another region.
- An agent published as a tool or an MCP server answers people outside the boundary.
- Some exits cannot be controlled at all, and someone has to accept them.

## Solution

Enumerate the exits per platform, and give each one a name, a control and an owner:

- file exports and notebook output;
- shares, shortcuts and replicas;
- backups and disaster-recovery copies;
- vendor support access, and logs;
- models, recorded as assets whose parents are their training data, and their endpoints;
- assistants, with the tenant settings that decide where prompts are processed;
- agents, treated as shares, which carry only declassified products.

The exits nobody can control go into the register with a named person accepting each. Every
request is evaluated against the exit as well as the asset, so the same person, data and purpose
can be allowed to read and refused an export.

## Consequences

- One policy can give different answers per platform, both correct. Where a file keeps its label
  on export, the export is allowed. Where it would leave unlabelled, the policy refuses it and
  points at a share.
- In the export-control lab, switching on one platform's cross-region assistant settings would
  have sent 36,000 rows of controlled telemetry out of the region as prompt context. The policy
  denies it, and the platform would have allowed it.
- The list needs a review whenever a platform ships a feature that moves data.
- Accepted exits stay visible, so an audit finds a decision with a name on it.

## When not to use it

- Public or synthetic data, with no restriction on where it goes.
- An early prototype on non-production data, as long as the list exists before real data arrives.
