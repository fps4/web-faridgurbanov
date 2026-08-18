---
title: Applied ML & data science
summary: ML and data science that ships — demand elasticity and constrained optimization, image segmentation, decision pipelines — built to run, validated against ground truth, and honest about the line between demo and production.
order: 2
group: domain
---

# Applied ML & data science

Models earn their keep when they reach a decision, not a slide. I build the data-science end of a system — estimate the signal, optimize against business rules, and wire it into a pipeline that runs — and I keep it honest about what's evidenced and what's still synthetic.

## What I do

- **Demand & decision modelling.** Price elasticity estimation and constrained revenue optimization (maximize under cost floors, margin floors, price ladders, MAP/RRP and competitor constraints), forecasting, and what-if simulation. Solver-agnostic — open-source by default, commercial (Gurobi) when the problem needs it.
- **Machine learning & computer vision.** Gradient-boosted and fixed/random-effects demand models; deep-learning image segmentation (hand-written PyTorch U-Net); feature engineering that holds confounders constant so an estimate means what it claims.
- **Reproducible, validated pipelines.** Synthetic-but-plausible data with a known ground truth so models are *checkable*, lakehouse-shaped (Parquet, Delta, MLflow), and explicit about the demo-to-production boundary in every README.

## Evidenced by

- [Retail dynamic pricing](/en/work/dynamic-pricing) — one elasticity-to-optimization engine across two retail verticals (grocery, consumer electronics) on a Databricks lakehouse; demand models checked against ground truth, a solver-agnostic optimizer, and an agentic explain layer.
- [Contrail avoidance](/en/work/contrail-coav) — a PyTorch U-Net that segments contrails in sky-camera imagery, plus a Polars/Pandas + Databricks-style pipeline that decides which flights to reroute on a climate-versus-fuel tradeoff.
- [AI reference architectures](/en/work/ai-trio) — the govern → build → deliver trio, where retrieval and evaluation gates keep model outputs grounded and traceable.

Background: Databricks Certified Data Engineer Professional; Python, LightGBM/GPBoost, PyTorch, scikit-learn, SciPy/Gurobi optimization, MLflow, Polars/Pandas, Spark/PySpark.
