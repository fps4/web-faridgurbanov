---
title: Toegepaste ML & datawetenschap
summary: ML en datawetenschap die draait — vraagelasticiteit en geconditioneerde optimalisatie, beeldsegmentatie, beslispijplijnen — gebouwd om te draaien, getoetst aan grondwaarheid, en eerlijk over de grens tussen demo en productie.
order: 2
---

# Toegepaste ML & datawetenschap

Modellen verdienen hun plek wanneer ze tot een beslissing komen, niet tot een slide. Ik bouw de datawetenschap-kant van een systeem — schat het signaal, optimaliseer tegen bedrijfsregels, en knoop het in een pijplijn die draait — en ik houd het eerlijk over wat bewezen is en wat nog synthetisch is.

## Wat ik doe

- **Vraag- & beslismodellering.** Prijselasticiteitsschatting en geconditioneerde omzetoptimalisatie (maximaliseren onder kostprijsondergrenzen, margevloeren, prijsladders, MAP/RRP- en concurrentiebeperkingen), forecasting, en what-if-simulatie. Solver-agnostisch — standaard open-source, commercieel (Gurobi) wanneer het probleem dat vraagt.
- **Machine learning & computer vision.** Gradient-boosted en fixed/random-effects-vraagmodellen; deep-learning-beeldsegmentatie (zelfgeschreven PyTorch U-Net); feature-engineering die confounders constant houdt zodat een schatting betekent wat ze claimt.
- **Reproduceerbare, gevalideerde pijplijnen.** Synthetische maar plausibele data met een bekende grondwaarheid zodat modellen *toetsbaar* zijn, lakehouse-vormig (Parquet, Delta, MLflow), en in elke README expliciet over de demo-naar-productie-grens.

## Blijkt uit

- [Retail dynamic pricing](/nl/work/dynamic-pricing) — één elasticiteit-naar-optimalisatie-engine over twee retail-verticals (grocery, consumentenelektronica) op een Databricks-lakehouse; vraagmodellen getoetst aan grondwaarheid, een solver-agnostische optimalisator, en een agentische uitleg-laag.
- [Contrail-avoidance](/nl/work/contrail-coav) — een PyTorch U-Net die contrails in sky-camera-beelden segmenteert, plus een Polars/Pandas + Databricks-achtige pijplijn die bepaalt welke vluchten omgeleid worden op een afweging van klimaat versus brandstof.
- [AI-referentiearchitecturen](/nl/work/ai-trio) — de beheer → bouw → lever-trio, waar retrieval en evaluatiepoorten model-output geaard en herleidbaar houden.

Achtergrond: Databricks Certified Data Engineer Professional; Python, LightGBM/GPBoost, PyTorch, scikit-learn, SciPy/Gurobi-optimalisatie, MLflow, Polars/Pandas, Spark/PySpark.
