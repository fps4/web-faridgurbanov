---
id: P-04
order: 4
title: "Authorise before retrieve"
summary: "Decide what the caller may see before the search runs, and bind that set into the query."
status: current
revised: 2026-11-08
related: [practice/articles/knowledge-layer-a-lawyer-can-act-on, P-03]
topics: [ai, governance]
tech: [knowledge-graphs]
---

## Problem

An AI assistant answers from retrieved passages. The usual control filters the results after
retrieval, or leans on the document store's access list. By then the restricted passage has been
chosen, ranked and placed in context, and the filter is trying to take it back.

## Forces

- Permission depends on the answer: which facts a query returned, which matters they touch, what
  they inherited. None of that is known until the query has run.
- Documents cite other documents. A note filed on an open matter can quote a walled one, and a
  filter keyed to where a document is filed lets it through.
- Agents compose several queries, and no single query sees the whole chain.
- A refusal has to be explainable, and the record of refusals is sensitive in its own right.

## Solution

Put one resolver between the consumers and both the graph and the search index, and have it run
the same steps in the same order on every request:

1. Resolve the terms in the question, and refuse an ambiguous one.
2. Find candidate entities, as identifiers only.
3. Decide, per entity and per derived fact by lineage, what this person may see.
4. Retrieve passages with the permitted set inside the query.
5. Answer with citations, or refuse and name the rule, its owner and the date it was set.
6. Write one record of the request.

![Diagram: the AI assistant and agents send each request to one resolver, which runs six steps in order: resolve the terms, find candidates in the graph as identifiers only, decide per entity and per derived fact by lineage what this person may see, retrieve passages from the search index with the permitted set inside the query, cite or refuse, and write one record of the request. Only the permitted set passes from step 3 into step 4, and denied items stop at step 3, so the index query never names them. Citations lead to the document store, which keeps its own lock as a second line.](/diagrams/authorise-before-retrieve.svg)

Step 3 comes before step 4. The search cannot name a denied item, so nothing needs filtering
afterwards. The index stores every entity a passage depends on, and the filter requires all of
them to be permitted. The document store keeps its own lock as a second line.

## Consequences

- One place to enforce access and one place to measure that it held, so an evaluation battery and
  a leak suite can act as a deploy gate.
- In the lab, a document-level filter put walled content in front of the model on all 16 questions
  about precedent and named clients. The lineage filter, on none.
- The resolver plans nothing and runs deterministically, which is what makes it testable. Agents
  call it as a tool.
- It depends on complete lineage ([P-03](/en/practice/patterns/lineage-inherited-control)): a
  citation that extraction missed is a leak.
- Firm-wide counts get hard. Everyone is walled from something, so aggregates need a stated
  policy of their own.

## When not to use it

- A corpus with a single audience, where everyone may see everything.
- Search over public content.
