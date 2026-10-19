---
title: A knowledge layer a lawyer can act on
summary: A language model can write a good legal answer. It cannot know what the firm did, for whom, what came of it, and who is allowed to be told. An architecture for a law firm's knowledge graph that an AI assistant can stand on, anchored to the systems of record, with one resolver that decides access before anything is retrieved. And a lab that measures where document-level filtering leaks.
date: 2026-10-19
order: 1
---

# A knowledge layer a lawyer can act on

A language model can write a good legal answer. It cannot know that the firm advised this client on this question in 2022, who did the work, and what the regulator did with it. That knowledge is spread across the matter system, the CRM, closing letters and the memory of the partners who were there. Most plans for a knowledge graph under a legal AI assistant start by reading the documents, and they miss the kind of knowledge partners value most.

This is the architecture I would put underneath a firm's assistant, and it rests on one rule: decide what a person may be told before retrieving anything for them. I built it at laptop scale as [`trusted-knowledge-graph`](https://github.com/fps4/trusted-knowledge-graph). An invented firm with 400 matters, 150 clients, 60 lawyers and 772 documents, the same standards and enforcement points a real build would use, and every number in this piece written by a `make` target. It runs without an API key.

## Four kinds of knowledge, kept in four places

| Kind of knowledge | Where it lives | How it reaches the graph |
|---|---|---|
| Expertise applied: who advised whom, on what, when | matter records, time entries, documents | the systems of record for who, when and for whom; extraction for the issue |
| Outcomes: the regulator accepted it, the claim settled | closing letters, decisions, partners' memory | extraction, plus a capture step when a matter closes |
| Client relationships | CRM, email, people's heads | the CRM as system of record; documents add roles and dates |
| Positions and precedents | memos, know-how notes | extraction, confirmed by the practice group |

Only the last row lives mostly in documents. The first three are rows in databases the firm already runs, and reading them back out of PDFs means guessing at something a table states exactly.

The consumer is changing as well. Assistants are turning into agents that plan several steps and compose the results, and no single query an agent makes sees the whole chain. An agent needs facts that hold still and can be checked, from one place where permission is decided.

## What a fact needs before anything stands on it

In this design a fact enters the graph only when five things are true of it.

- **It has a source**: a document, a system of record or a named partner, with PROV-O lineage back to it.
- **It carries a confidence**, and below the threshold it waits for a reviewer.
- **It has a review state**: extracted, unconfirmed, confirmed or rejected. A rejected fact stays on the record and is never asserted again.
- **It knows when it was true.** Expertise over time is a question about time, and a graph that only knows the present cannot answer it.
- **It inherits its restrictions** from every matter it was derived from or cites, so a second hop or a summary cannot launder it.

SHACL shapes check all five on every load, and a load that breaks one does not land. The same shapes keep document text out of the graph: no literal may be longer than 500 characters. The graph holds assertions and identifiers. The text belongs to the document system, under its own access control, and a second copy of it inside the graph would be the first finding of any security review.

Together the five let the system refuse. Where the graph has no supported fact, the answer says so.

## The shape

Read it left to right. The **sources** are practice management, the CRM, HR, the document system, the firm's own taxonomies, and the barrier rules. **Ingestion** maps the systems of record into the graph with their identifiers intact, runs a tiered pipeline that extracts facts from documents with a confidence on each, and keeps chunking and indexing the same documents for search. The **knowledge layer** holds an ontology and business glossary owned by knowledge management, the spine of matters, clients, people and practice areas, the extracted and asserted facts, an identity service, and provenance and access enforced in the graph. Then the **resolver**, and behind it the **consumers**: the assistant, enterprise search, a review workbench, an evaluation battery, and Risk.

Two choices in that picture carry most of the weight.

**The spine comes from the systems of record.** Matters, clients, people and the links from documents to matters are mapped with declarative R2RML over the live tables, through a database role that cannot write back. Extraction then attaches facts to entities that already exist and never has to decide whether two strings are the same client. Several of the questions the graph exists for are answerable before a single document is read. This is where the design parts company with Microsoft's reference GraphRAG, which builds its graph out of the text. Anchoring to the systems of record first and extending by extraction second is what makes provenance, barrier enforcement and a defensible refusal possible.

**The graph and the index are peers.** The graph answers which entities, which facts, and whether this person may know them. The index answers which passages say it. Neither sits in front of the other. One resolver sits between them, which gives one place to enforce a barrier and one place to measure that it held.

| Layer | Open standard | In the lab |
|---|---|---|
| Knowledge layer | RDF, SKOS, a small OWL profile, SHACL, PROV-O | Apache Jena Fuseki |
| Spine | R2RML over the systems of record | PostgreSQL standing in for practice management, CRM and HR |
| Retrieval | hybrid lexical and vector search, filtered inside the query | OpenSearch, BM25 and embeddings |
| Access decision | attribute-based, with decision and enforcement separate; policy as data | Open Policy Agent |
| Documents | the store enforces its own policy | MinIO, one user and policy per person |
| Extraction | measured against a reviewed gold set | Claude, through the Batches API |
| Serving | one resolver; MCP where a standard interface is wanted | one MCP server per person |
| Assurance | evaluation battery and leak suite as a deploy gate; a hash-chained decision record | `make gate` |

On a Microsoft estate the right-hand column changes its names (Azure AI Search, Entra with on-behalf-of tokens, Azure OpenAI), and the triple store is the only kind of component the estate does not already run.

## The order is the architecture

| Step | By | What happens |
|---|---|---|
| 1. Resolve the terms | glossary | a business word with several owners' readings is refused until the question picks one |
| 2. Find candidates | graph | the matters, clients, people and facts the question reaches, as identifiers only |
| 3. Decide | policy | per matter, and per derived fact by lineage: which of them this person may see |
| 4. Retrieve passages | index | with the permitted set inside the query |
| 5. Answer or refuse | resolver | cites nodes and documents; a refusal names the rule, its owner and the date it was set |
| 6. Record | resolver | one chained record per request, written once, answered or refused |

Step 3 comes before step 4. The query that produces evidence is bound to the permitted set, so it cannot name a denied matter, and nothing is filtered afterwards. Filtering after ranking is how a leak happens: the walled passage has already been chosen, ranked and placed in context, and the filter is trying to take it back.

The resolver is a policy enforcement point, and it differs from an API gateway because its decision depends on the answer. Which facts the traversal returned, which matters they touch, what each one inherited from the facts it came from: none of that is known until the graph has been walked, so the authorisation lives where the result set is assembled. A gateway still belongs in front of it for TLS, tokens and rate limits. The resolver is not an agent either. It plans nothing and runs the same six steps in the same order every time, and that determinism is what lets an evaluation serve as a deploy gate.

## Choices underneath

### Scope by competency questions

The first deliverable is about twenty questions, written with the practice groups and knowledge management, that the graph must answer and a search box cannot. They bound the ontology, they are the acceptance tests, and a relation no question needs is not extracted. A graph that asserts everything is a graph nobody can vouch for. The lab's battery asks 34 questions, each with an answer computed from the estate in Python and never from the graph being scored.

### Map the firm's vocabulary to SALI

SALI LMSS is the obvious base for a legal ontology. A firm's practice areas and matter types are how the firm is organised, though, and knowledge management has to be able to change them without waiting for a standard's next release. So each concept maps to SALI with a graded SKOS relation (exact, close, broader, narrower), and anything that reasons across the link knows how far to trust it. In the lab none of the eleven concepts was an exact match. A financial institutions group covers banks and insurers, which SALI splits. SALI files a regulatory investigation under non-dispute work, and a firm treats it as contentious. The namespace, read from the pinned release, is `http://lmss.sali.org/`, which is not the one anybody would guess.

### Measure extraction, and the gold set with it

Extraction runs in tiers: classification and metadata across everything, entities and relations on the subsets the questions need, deeper work on request. It is scored per relation against a gold set reviewed by knowledge lawyers and re-measured on every pipeline change, because a model upgrade can quietly change what "advised on" means. The relations a model may propose are fixed in its output schema, so it has no way to express a new one.

Expect the first runs to find errors in the gold set as well as in the model. In the lab the first three runs of the report all found the gold set wrong: templates that stated a fact the manifest did not credit, and one credited with a fact it never stated. Across 772 documents, precision is 0.96 and recall 0.98 at a confidence of 0.5, and every citation from a document to a matter is found. The documents are template-written, so read those as an upper bound.

### A merge is a decision

One canonical identifier per entity, matching with a confidence, and a merge that a person reviews. `owl:sameAs` is a claim, and an automatic merge that joins two clients is a conflict-check incident. Until someone resolves it, an unmatched name stays unlinked, where it shows up as lost recall. In the lab, 50 clients named the way the CRM spells them stay unlinked, because identity resolution was cut from scope.

### Words have owners

"Active client" means four things to four owners: a client with an open matter (the practice groups), one invoiced in the last year (Finance), one in the CRM with a relationship partner (business development), and anyone the firm ever acted for (Risk, because a conflict check needs former clients). Four numbers. A question that uses the term without choosing a reading is refused at step 1, with the readings listed back. Asked through Claude Code, the model does what the refusal tells it: it shows the four and asks which one. Each term has a named owner in knowledge management or a practice group, and changing one is a request with a reviewer.

## Where document-level filtering stops working

The usual control in a legal retrieval setup is the document system's own access list: retrieval returns passages only from documents the person may open. On a plain corpus that holds. In the lab, behind a document-level filter, no ordinary document leaked, because none of them mentioned another matter.

Firms also write knowledge notes. A precedent note filed on an open matter cites a walled matter's file number, client and outcome. The document system opens it, because it sits on an open matter, and any filter keyed to the matter a document is filed on lets it through. On 16 questions about precedent and named clients, retrieval with no filter put walled content in front of the model on all 16. With a document-level filter, also 16. With the graph's lineage filter, none.

The fix is lineage. A note's extracted facts are derived from every matter it cites, so the note and its facts are walled wherever any of those matters is. The index stores every matter a passage depends on, and the filter requires all of them to be permitted. That only works if extraction finds every citation, which is why the citation recall above matters more than any other number in the extraction report.

The document store keeps its own lock. Every citation carries a link to the PDF, signed with the asking lawyer's own credentials for five minutes, and a document id obtained some other way gets nothing: the store refuses it on its own policy, compiled from the same rule file as the graph's. The two do not agree everywhere. The store cannot know what a document cites, so on 15 notes it is weaker than the graph. The gate checks that the graph is never broader than the store across 3,860 pairs of person and document, and reports the 15 as a finding.

Across the full battery of 34 questions, the vector path behind a document-level filter was correct on 10, refused 2, was confidently wrong on 9 and leaked on 13. The graph path through the resolver was correct on all 34 and leaked on none. Those are competency questions, graph territory by construction, so the comparison favours the graph. Search keeps the long tail, exact wording ("how did we word the indemnity carve-out?"), similarity, and new topics before the ontology has a word for them. What the graph takes over is deciding what search may return.

Two settings come out of this, and they belong to the firm. The first is whether a screened lawyer is told that something was withheld, which is useful to them and is also a one-bit disclosure. Both modes are implemented, and the caller cannot choose between them. The second is whether a count over matters someone is walled from is refused, or computed over what they can see and labelled as such. Refusing is safe, and in the lab it made every firm-wide count unanswerable for everyone, because every lawyer is walled from something. In a firm with hundreds of need-to-know matters, every firm-wide metric would go the same way. That one is still an open decision.

## The record of a wall

Every request writes one record, once, at completion, chained by hash. The record of a barrier system is confidential in its own right: a line saying this lawyer was denied that matter tells its reader exactly what the barrier hides. So walled identifiers are salted hashes in every field, including the words the lawyer typed, and free text is not kept at all.

Only Risk may read the record, decided by the same policy engine, and Risk's own reads go into the same chain. Risk can answer the three questions that come up (who has ever been shown anything derived from this matter, what did this lawyer see, why was that request refused) and gets the grounds the lawyer was shown at the time, read back from the same record. The chain makes an edit or a deletion detectable. It cannot show that its tail was cut, so the head hash has to be kept somewhere else.

## What building it found

Two findings from the build are worth more than the numbers.

The barrier suite asks 250 questions: every rule, every persona, directly, at a second hop, by lineage and as an aggregate. An early version worked out who should be denied by reading the compiled policy, and it passed a tampered one, because it agreed with itself. It now computes the expectation from the rule file and the systems of record directly, bypassing both the compiler and the policy engine. Run by hand with one screen removed from the compiled policy only, it reported six leaks, two wrong refusals and fourteen identifiers in clear in the log.

The first Claude Code session against the lab found something the suite had never looked at. A persona's own description, returned by `whoami()`, named the matter she was screened from. The suite now checks everything a session is shown, including what it is told about itself.

## What the lab cannot tell you

It runs at laptop scale and says nothing about throughput, cost or latency. Identity is asserted: each persona's container holds a key and mints a short-lived assertion, where a firm would use an on-behalf-of flow against its identity provider, and that is the one place the lab is weaker than the design. The documents are written from templates, so their prose is more regular than a firm's. Two verdicts are a model's, the vector path's answers and their grades, and every leak is counted mechanically.

What transfers is the order. The systems of record first, the rules as data with owners, a decision before any retrieval, and a record that sits behind a wall of its own. The rule file, the glossary and the SALI mapping are YAML that a knowledge manager or a risk officer can read and own, and they will outlast whichever store ends up underneath them.
