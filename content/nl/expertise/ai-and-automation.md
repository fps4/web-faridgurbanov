---
title: AI & automatisering
summary: Generatieve AI verantwoord integreren in enterprisesystemen — agentic systemen, RAG, evaluatie als sign-off-gate, en governance die je kunt auditen.
order: 1
group: domain
---

# AI & automatisering

Dit is een gelijkwaardige peer van de andere vier gebieden, geen bolt-on. Dezelfde discipline die een integratieplatform betrouwbaar maakt — contracten, observability, governance — is precies wat de meeste AI-projecten missen. Ik bouw agentic systemen zoals ik elk productiesysteem bouw: met kostenbeheersing, evaluatiegates en een audit trail.

## Wat ik doe

- **Agentic systemen met guardrails.** Model routing, kosten- en budgethandhaving per agent, vendor abstraction, en een local-model fallback voor soevereiniteit — met Prometheus-observability zodat uitgaven en gedrag zichtbaar zijn.
- **Retrieval die gegrond is.** RAG met goede embeddings en reranking, zodat antwoorden uit jouw data komen en niet uit de verbeelding van het model.
- **Evaluatie als gate.** L1–L4 testlagen, LLM-as-judge, en golden datasets zodat een regressie wordt opgevangen voordat die live gaat — het AI-equivalent van acceptatiecriteria.
- **Governance die je kunt auditen.** Deterministische tool-contracten (MCP), antwoorden die te herleiden zijn naar een vastgelegde call chain, en een model van "agents stellen voor, mensen beslissen" dat wordt afgedwongen in de delivery-pipeline.

## Het bewijs

Ik adviseer hier niet alleen over — ik bouw het. Het AI-werk in de [portfolio](/nl/portfolio) is drie verwante repositories verteld als één **govern → build → deliver**-verhaal. In het belang van eerlijkheid: één daarvan draait vandaag end-to-end; de andere twee zijn referentiearchitecturen. Het zijn geen drie productiesystemen, en de kaarten zeggen dat ronduit.

## Aangetoond door

- [De AI-trio](/nl/work/ai-trio) — de govern→build→deliver-casestudy achter dit gebied.
- [Contrail-avoidance](/nl/work/contrail-coav) — een PyTorch U-Net-beeldsegmentatie-app (React → Node BFF → FastAPI), het draaibare neuraal-netwerk-ML-bewijs.
- [Portfolio](/nl/portfolio) — de repositories zelf, met eerlijke volwassenheidslabels.

Achtergrond: DeepLearning.AI Agentic AI (2025); 20+ jaar bouwen aan data- en ML-systemen.
