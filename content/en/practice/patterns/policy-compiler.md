---
id: P-02
order: 2
title: "Policy compiler"
summary: "Write the access policy once as data; generate each platform's controls, and a list of what it cannot enforce."
status: current
revised: 2026-11-08
related: [practice/articles/one-policy-two-compilers, practice/articles/export-control-who-sees-what, P-03]
topics: [governance, data-platforms]
tech: [databricks, fabric]
---

## Problem

The same access policy has to hold on two or more platforms, identically, for years, while each
platform ships changes every month. Kept by hand in two admin consoles, it becomes two policies
that drift apart without anyone noticing.

## Forces

- Platforms enforce in different shapes: one evaluates a tag-based policy on every query, another
  assigns roles with static row filters.
- Some controls a platform cannot express at all, and the gap stays invisible while each console
  is configured on its own.
- An auditor asks why a person was refused, and expects a sentence.
- The people who own the policy rarely know each platform's grammar.

## Solution

Hold the policy as data in a repository: the taxonomy of controls, the regions, the principals
and their groups, and a ledger of the decisions that remove a control. An engine evaluates it
first, independent of any platform. It propagates controls, validates the ledger, and answers
"may this person, from here, do this to this asset", with the explanation attached.

Then one compiler per platform reads the evaluated state and emits that platform's own artefacts:
SQL policies and tags for one, role definitions and labels for another. Each compiler also
writes, in the same output, what its platform cannot enforce, as plain text for someone to act
on. A compiler refuses to emit anything that would make a violation permanent, such as a home for
data placed where it must not be.

CI regenerates the artefacts and fails the commit when the committed ones no longer match.

## Consequences

- A disagreement about policy becomes a pull request against config, and every platform's output
  re-renders with the consequence attached.
- The differences between platforms land in a file someone other than the author can read. In the
  export-control lab, the same six decisions became 22 tag-driven policies on Unity Catalog and 20
  static roles on Fabric.
- A control can carry its provenance into the platform, as a tag naming the source it came from.
- The compilers are code to maintain, and they trail new platform features.
- Generated output proves shapes the platform accepts. Applying it to a real tenant is a separate
  test, and needs one.

## When not to use it

- One platform, and a policy short enough to read on one screen: configure it directly and export
  it for review.
- Access that changes hourly through a request flow, where the platform's own policy service is
  the system of record.
